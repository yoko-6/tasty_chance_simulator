(() => {
    const PS = window.PSleepSim;

    const numOr = (v, d) => (Number.isFinite(v) ? v : d);
    const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

    class UserEvent {
        constructor(event, timestampSeconds) {
            this.event = event;
            this.timestamp = timestampSeconds;
        }
        nextDay() {
            return new UserEvent(this.event, this.timestamp + 24 * 3600);
        }
    }

    class PokemonEvent {
        constructor(idx, pokemon, timestampSeconds) {
            this.idx = idx;
            this.pokemon = pokemon;
            this.timestamp = timestampSeconds;
        }
        next() {
            return new PokemonEvent(this.idx, this.pokemon, this.pokemon.get_next_helping_time(this.timestamp));
        }
    }

    class Pokemon {
        constructor(
            pokemon_data,
            name,
            level,
            sub_skills,
            team_sub_skills,
            nature,
            skill_level,
            berry_energy_multiplier,
            camp_ticket_helping_speed_multiplier,
            camp_ticket_inventory_limit_bonus,
            team_helping_speed_multiplier,
            team_ingredient_bonus,
            team_skill_multiplier,
            personal_helping_multiplier,
            personal_ingredient_bonus,
            personal_skill_multiplier,
            ex_helping_multiplier,
            ex_ingredient_bonus,
            ex_skill_multiplier,
            ex_effect_label,
            field_energy_multiplier,
            energy_decay
        ) {
            this.pokemon_data = pokemon_data;
            this.name = name;
            this.level = level;
            this.sub_skills = sub_skills;
            this.team_sub_skills = team_sub_skills;
            this.nature = nature;
            this.skill_level = skill_level;

            this.berry_energy_multiplier = numOr(berry_energy_multiplier, 1.0);
            this.camp_ticket_helping_speed_multiplier = numOr(camp_ticket_helping_speed_multiplier, 1.0);
            this.camp_ticket_inventory_limit_bonus = numOr(camp_ticket_inventory_limit_bonus, 1.0);

            this.team_helping_speed_multiplier = numOr(team_helping_speed_multiplier, 1.0);
            this.team_ingredient_bonus = numOr(team_ingredient_bonus, 0);
            this.team_skill_multiplier = numOr(team_skill_multiplier, 1.0);

            this.personal_helping_speed_multiplier = numOr(personal_helping_multiplier, 1.0);
            this.personal_ingredient_bonus = numOr(personal_ingredient_bonus, 0);
            this.personal_skill_multiplier = numOr(personal_skill_multiplier, 1.0);

            this.ex_helping_speed_multiplier = numOr(ex_helping_multiplier, 1.0);
            this.ex_ingredient_bonus = numOr(ex_ingredient_bonus, 0);
            this.ex_skill_multiplier = numOr(ex_skill_multiplier, 1.0);

            this.ex_extra_ingredient_if_specialty =
                this.ex_ingredient_bonus > 0 && this.pokemon_data.specialty === PS.Specialty.Ingredients;
            this.ex_effect_label = ex_effect_label || "なし";

            this.field_energy_multiplier = numOr(field_energy_multiplier, 1.0);
            this.energy_decay = numOr(energy_decay, 0.0);

            this.initStats();
        }

        initStats() {
            let helping_speed_coefficient = 1.0;
            let ingredient_probability_coefficient = 1.0;
            let skill_probability_coefficient = 1.0;
            let inventory_up = 0;
            let berry_finding = 0;

            for (const sub of [...this.sub_skills, ...this.team_sub_skills]) {
                helping_speed_coefficient -= sub.helping_speed;
                ingredient_probability_coefficient += sub.ingredient_probability;
                skill_probability_coefficient += sub.skill_probability;
                inventory_up += sub.inventory_up;
                berry_finding += sub.berry_finding;
            }

            helping_speed_coefficient = Math.max(helping_speed_coefficient, 0.65);
            const level_speed_coefficient = 1 - (this.level - 1) * 0.002;

            this.helping_speed = Math.floor(
                this.pokemon_data.helping_speed *
                level_speed_coefficient *
                this.nature.helping_speed_coefficient *
                helping_speed_coefficient
            );

            this.ingredient_probability =
                this.pokemon_data.ingredient_probability *
                ingredient_probability_coefficient *
                this.nature.ingredient_probability_coefficient;

            this.skill_probability =
                this.pokemon_data.skill_probability *
                skill_probability_coefficient *
                this.nature.skill_probability_coefficient;

            this.inventory_limit = Math.floor((this.pokemon_data.inventory_limit + inventory_up) * this.camp_ticket_inventory_limit_bonus);
            this.berry_num = this.pokemon_data.berry_num + berry_finding;
            this.ingredient_nums = this.pokemon_data.ingredient_nums.slice();
            this.skill_stock_limit = this.pokemon_data.skill_stock_limit;

            const idx = clamp(this.skill_level, 1, this.pokemon_data.main_skill.effects.length) - 1;
            this.skill_effect = this.pokemon_data.main_skill.effects[idx];

            this.resetStats();
        }

        resetStats() {
            this.inventory = 0;
            this.skill_stock = 0;
            this.health = 100;
            this.phase = "sleeping";

            this.total_berry_energy = 0;
            this.total_skill_energy = 0;
            this.total_skill_count = 0;
        }

        get_health_speed_bonus() {
            if (this.health >= 81) return 1.0 / 0.45;
            if (this.health >= 61) return 1.0 / 0.52;
            if (this.health >= 41) return 1.0 / 0.58;
            if (this.health >= 1) return 1.0 / 0.66;
            return 1.0;
        }

        get_berry_energy() {
            const base = this.pokemon_data.berry.energy;
            const lv = this.level - 1;
            return Math.round(Math.max(base + lv, base * Math.pow(1.025, lv)));
        }

        get_help_interval() {
            const bonus =
                this.get_health_speed_bonus() *
                this.camp_ticket_helping_speed_multiplier *
                this.team_helping_speed_multiplier *
                this.personal_helping_speed_multiplier *
                this.ex_helping_speed_multiplier;

            return Math.floor(this.helping_speed / bonus);
        }

        get_next_helping_time(nowSeconds) {
            return nowSeconds + this.get_help_interval();
        }

        refresh_health() {
            this.health = 100;
        }

        do_help() {
            if (this.inventory >= this.inventory_limit) {
                this.get_berries();
                return 0.0;
            }

            if (Math.random() < this.ingredient_probability) this.get_ingredients();
            else this.get_berries();

            this.health -= this.energy_decay * this.get_help_interval();
            this.health = Math.max(this.health, 0);

            return this.trigger_skill();
        }

        help_in_daytime() {
            const ret = this.do_help();
            this.inventory = 0;
            this.skill_stock = 0;

            if (this.phase === "sleeping") {
                this.phase = "daytime";
                this.refresh_health();
            }
            return ret;
        }

        help_in_sleeping() {
            this.phase = "sleeping";
            return this.do_help();
        }

        get_berries() {
            this.total_berry_energy +=
                this.get_berry_energy() * this.berry_num * this.berry_energy_multiplier * this.field_energy_multiplier;

            if (this.inventory < this.inventory_limit) this.inventory += this.berry_num;
        }

        get_ingredients() {
            let upper = 1;
            if (this.level >= 30) upper = 2;
            if (this.level >= 60) upper = 3;

            const idx = Math.floor(Math.random() * upper);
            let gain =
                this.ingredient_nums[idx] + this.team_ingredient_bonus + this.personal_ingredient_bonus + this.ex_ingredient_bonus;

            if (this.ex_extra_ingredient_if_specialty && Math.random() < 0.5) gain += 1;
            if (gain < 0) gain = 0;

            if (this.inventory < this.inventory_limit) this.inventory += gain;
        }

        trigger_skill() {
            if (this.skill_stock >= this.skill_stock_limit) return 0.0;

            const p =
                this.skill_probability *
                this.team_skill_multiplier *
                this.personal_skill_multiplier *
                this.ex_skill_multiplier;

            if (Math.random() < p) {
                this.skill_stock += 1;
                this.total_skill_count += 1;
                return this.skill_effect;
            }
            return 0.0;
        }
    }

    class Simulator {
        constructor() {
            const MAX = PS.MAX_SLOTS;
            const arr = (n, v) => Array.from({ length: n }, () => v);

            this.total_skill_count = 0;
            this.total_success_count = 0;
            this.total_extra_energy = 0;

            this.total_extra_energies_per_day = arr(7, 0);
            this.total_berry_energies = arr(MAX, 0);
            this.total_skill_energies = arr(MAX, 0);
            this.total_skill_counts = arr(MAX, 0);

            this.total_base_energies_per_day = arr(7, 0);
            this.total_carry_over_energies_per_day = arr(7, 0);
            this.total_cooking_energies_per_pokemon_per_day = Array.from({ length: MAX }, () => arr(7, 0));
            this.total_berry_energies_per_pokemon_per_day = Array.from({ length: MAX }, () => arr(7, 0));

            this.average_skill_count = 0;
            this.average_success_count = 0;
            this.average_extra_energy = 0;

            this.average_extra_energies_per_day = arr(7, 0);
            this.average_berry_energies = arr(MAX, 0);
            this.average_skill_energies = arr(MAX, 0);
            this.average_skill_counts = arr(MAX, 0);

            this.average_base_energies_per_day = arr(7, 0);
            this.average_carry_over_energies_per_day = arr(7, 0);

            this.average_cooking_energies_per_pokemon_per_day = [];
            this.average_berry_energies_per_pokemon_per_day = [];

            this.chance_limit = 0.7;
            this.base_cooking_chance = 0.1;
            this.first_day_base_success_chance = 0.0;
            this.sunday_chance_bonus = 0.2;
            this.sunday_success_energy_bonus = 1.5;
            this.cooking_energy_event_multiplier = 1.0;
            this.field_energy_multiplier = 1.0;

            this.wake_up_time = 7 * 3600;
            this.breakfast_time = 8 * 3600;
            this.lunch_time = 12 * 3600;
            this.dinner_time = 18 * 3600;
            this.sleep_time = 22.5 * 3600;
        }

        simulate_a_week(pokemons, recipe_energy) {
            const DAY = 24 * 3600;

            let extra_energy = 0;
            const extra_energies_per_day = Array(7).fill(0);
            const base_energies_per_day = Array(7).fill(0);
            const carry_over_energies_per_day = Array(7).fill(0);

            const cooking_energies_per_pokemon_per_day = Array.from({ length: pokemons.length }, () => Array(7).fill(0));
            const berry_energies_per_pokemon_per_day = Array.from({ length: pokemons.length }, () => Array(7).fill(0));

            let cooking_chance_probability = 0.0;
            let cooking_chance_probabilities = new Array(pokemons.length).fill(0.0);
            let skill_count = 0;
            let success_count = 0;

            let base_cooking_chance = 0.0;
            let carry_over_cooking_chance = this.first_day_base_success_chance;
            let base_cooking_energy = 0;

            const user_event_queue = [
                new UserEvent(PS.UserEventType.wake_up, this.wake_up_time),
                new UserEvent(PS.UserEventType.have_breakfast, this.breakfast_time),
                new UserEvent(PS.UserEventType.have_lunch, this.lunch_time),
                new UserEvent(PS.UserEventType.have_dinner, this.dinner_time),
                new UserEvent(PS.UserEventType.sleep, this.sleep_time),
            ];

            const pokemon_event_queue = [];
            for (let i = 0; i < pokemons.length; i++) {
                const p = pokemons[i];
                p.resetStats();
                pokemon_event_queue.push(new PokemonEvent(i, p, p.get_next_helping_time(this.wake_up_time)));
            }

            const pickNextPokemonEventBefore = (limitTs) => {
                let minTs = Infinity;
                let minIdxs = [];

                for (let i = 0; i < pokemon_event_queue.length; i++) {
                    const ts = pokemon_event_queue[i].timestamp;
                    if (ts >= limitTs) continue;

                    if (ts < minTs) {
                        minTs = ts;
                        minIdxs = [i];
                    } else if (ts === minTs) {
                        minIdxs.push(i);
                    }
                }

                if (!minIdxs.length) return null;
                const idx = minIdxs[Math.floor(Math.random() * minIdxs.length)];
                const ev = pokemon_event_queue[idx];
                pokemon_event_queue.splice(idx, 1);
                return ev;
            };

            while (user_event_queue.length > 0) {
                const user_event = user_event_queue.shift();
                user_event_queue.push(user_event.nextDay());

                // ポケモンイベント（user_event.timestamp より前を処理）
                while (true) {
                    const nextEvent = pickNextPokemonEventBefore(user_event.timestamp);
                    if (!nextEvent) break;

                    let ret = 0.0;
                    if (user_event.event !== PS.UserEventType.wake_up) ret = nextEvent.pokemon.help_in_daytime();
                    else ret = nextEvent.pokemon.help_in_sleeping();

                    if (ret > 0.0) skill_count += 1;

                    ret = Math.min(ret, this.chance_limit - cooking_chance_probability - carry_over_cooking_chance);
                    cooking_chance_probability += ret;
                    cooking_chance_probabilities[nextEvent.idx] += ret;

                    pokemon_event_queue.push(nextEvent.next());
                }

                const eventDay = Math.floor((user_event.timestamp - 4 * 3600) / DAY) + 1;
                const dayIndex = eventDay - 1;

                if (user_event.event === PS.UserEventType.wake_up) {
                    base_cooking_chance = this.base_cooking_chance + (eventDay === 7 ? this.sunday_chance_bonus : 0.0);

                    base_cooking_energy =
                        recipe_energy *
                        this.cooking_energy_event_multiplier *
                        (eventDay === 7 ? this.sunday_success_energy_bonus : 1.0) *
                        this.field_energy_multiplier;

                    if (eventDay === 2) {
                        for (let i = 0; i < pokemons.length; i++) {
                            berry_energies_per_pokemon_per_day[i][eventDay - 2] = pokemons[i].total_berry_energy;
                        }
                    } else if (eventDay > 2) {
                        for (let i = 0; i < pokemons.length; i++) {
                            berry_energies_per_pokemon_per_day[i][eventDay - 2] =
                                pokemons[i].total_berry_energy - berry_energies_per_pokemon_per_day[i][eventDay - 3];
                        }
                    }
                }

                if (eventDay === 8) break;
                if (user_event.event === PS.UserEventType.wake_up || user_event.event === PS.UserEventType.sleep) continue;

                const p = Math.random();
                if (p < base_cooking_chance + carry_over_cooking_chance + cooking_chance_probability) {
                    success_count += 1;
                    extra_energy += base_cooking_energy;
                    extra_energies_per_day[dayIndex] += base_cooking_energy;

                    if (p < base_cooking_chance) base_energies_per_day[dayIndex] += base_cooking_energy;
                    else if (p < base_cooking_chance + carry_over_cooking_chance) carry_over_energies_per_day[dayIndex] += base_cooking_energy;
                    else {
                        let acc = base_cooking_chance + carry_over_cooking_chance;
                        for (let i = 0; i < pokemons.length; i++) {
                            const segEnd = acc + cooking_chance_probabilities[i];
                            if (p < segEnd) {
                                pokemons[i].total_skill_energy += base_cooking_energy;
                                cooking_energies_per_pokemon_per_day[i][dayIndex] += base_cooking_energy;
                                break;
                            }
                            acc = segEnd;
                        }
                    }

                    cooking_chance_probability = 0.0;
                    carry_over_cooking_chance = 0.0;
                    cooking_chance_probabilities = new Array(pokemons.length).fill(0.0);
                }
            }

            this.total_skill_count += skill_count;
            this.total_success_count += success_count;
            this.total_extra_energy += extra_energy;

            for (let d = 0; d < 7; d++) {
                this.total_extra_energies_per_day[d] += extra_energies_per_day[d];
                this.total_base_energies_per_day[d] += base_energies_per_day[d];
                this.total_carry_over_energies_per_day[d] += carry_over_energies_per_day[d];
            }

            for (let i = 0; i < pokemons.length; i++) {
                this.total_berry_energies[i] += pokemons[i].total_berry_energy;
                this.total_skill_energies[i] += pokemons[i].total_skill_energy;
                this.total_skill_counts[i] += pokemons[i].total_skill_count;

                for (let d = 0; d < 7; d++) {
                    this.total_cooking_energies_per_pokemon_per_day[i][d] += cooking_energies_per_pokemon_per_day[i][d];
                    this.total_berry_energies_per_pokemon_per_day[i][d] += berry_energies_per_pokemon_per_day[i][d];
                }
            }
        }

        simulate(trial, pokemons, recipe_energy) {
            for (let i = 0; i < trial; i++) this.simulate_a_week(pokemons, recipe_energy);

            this.average_skill_count = this.total_skill_count / 7.0 / trial;
            this.average_success_count = this.total_success_count / 7.0 / trial;
            this.average_extra_energy = this.total_extra_energy / 7.0 / trial;

            for (let d = 0; d < 7; d++) {
                this.average_extra_energies_per_day[d] = this.total_extra_energies_per_day[d] / trial;
                this.average_base_energies_per_day[d] = this.total_base_energies_per_day[d] / trial;
                this.average_carry_over_energies_per_day[d] = this.total_carry_over_energies_per_day[d] / trial;
            }

            const n = pokemons.length;
            this.average_berry_energies = new Array(n).fill(0);
            this.average_skill_energies = new Array(n).fill(0);
            this.average_skill_counts = new Array(n).fill(0);

            this.average_cooking_energies_per_pokemon_per_day = Array.from({ length: n }, () => new Array(7).fill(0));
            this.average_berry_energies_per_pokemon_per_day = Array.from({ length: n }, () => new Array(7).fill(0));

            for (let i = 0; i < n; i++) {
                this.average_berry_energies[i] = this.total_berry_energies[i] / 7.0 / trial;
                this.average_skill_energies[i] = this.total_skill_energies[i] / 7.0 / trial;
                this.average_skill_counts[i] = this.total_skill_counts[i] / 7.0 / trial;

                for (let d = 0; d < 7; d++) {
                    this.average_cooking_energies_per_pokemon_per_day[i][d] = this.total_cooking_energies_per_pokemon_per_day[i][d] / trial;
                    this.average_berry_energies_per_pokemon_per_day[i][d] = this.total_berry_energies_per_pokemon_per_day[i][d] / trial;
                }
            }
        }
    }

    PS.model = { Pokemon, Simulator, UserEvent, PokemonEvent };
})();
