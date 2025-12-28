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
            energy_decay,
            active_chance_limit_weekday,
            active_chance_limit_sunday
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

            this.active_chance_limit_weekday = numOr(active_chance_limit_weekday, 1.0);
            this.active_chance_limit_sunday = numOr(active_chance_limit_sunday, 1.0);

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
            this.is_active = true;

            this.total_berry_energy = 0;
            this.total_skill_energy = 0;
            this.total_skill_count = 0;
            this.total_active_seconds = 0;
        }

        activate() {
            if (this.is_active) return;
            this.is_active = true;
            this.inventory = 0;
            this.skill_stock = 0;
        }

        deactivate() {
            if (!this.is_active) return;
            this.is_active = false;
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
            if (!this.is_active) return 0.0;

            this.total_active_seconds += this.get_help_interval();
            this.health -= this.energy_decay * this.get_help_interval();
            this.health = Math.max(this.health, 0);
            
            if (this.inventory >= this.inventory_limit) {
                this.get_berries();
                return 0.0;
            }

            if (Math.random() < this.ingredient_probability) this.get_ingredients();
            else this.get_berries();

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

            this.avg = null; // ★結果はここに日別配列で入る
        }

        _makeArr7(v = 0) {
            return Array(7).fill(v);
        }
        _make2D(n, v = 0) {
            return Array.from({ length: n }, () => this._makeArr7(v));
        }

        // ★ 1回の試行（1週間）を「日別配列」で返す
        simulate_week(pokemons, recipe_energy) {
            const DAY = 24 * 3600;
            const FOUR = 4 * 3600;

            const dayIndexOf = (ts) => {
                // 4:00 区切りで 0..6 に落とす
                const idx = Math.floor((ts - FOUR) / DAY);
                return idx;
            };

            const n = pokemons.length;

            // 日別（チーム全体）
            const extraEnergyByDay = this._makeArr7(0);
            const baseEnergyByDay = this._makeArr7(0);
            const carryOverEnergyByDay = this._makeArr7(0);
            const successCountByDay = this._makeArr7(0);

            // 日別（ポケモン別）
            const cookingEnergyByPokemonByDay = this._make2D(n, 0); // 料理チャンス由来エナジー
            const berryEnergyByPokemonByDay = this._make2D(n, 0);   // きのみエナジー
            const skillCountByPokemonByDay = this._make2D(n, 0);    // スキル発動回数（=料理チャンス回数）
            const activeSecondsByPokemonByDay = this._make2D(n, 0); // 稼働時間

            // 料理チャンス蓄積
            let cooking_chance_probability = 0.0;
            let cooking_chance_probabilities = new Array(n).fill(0.0);
            let carry_over_cooking_chance = this.first_day_base_success_chance;

            let base_cooking_chance = 0.0;
            let base_cooking_energy = 0.0;

            const user_event_queue = [
                new UserEvent(PS.UserEventType.wake_up, this.wake_up_time),
                new UserEvent(PS.UserEventType.have_breakfast, this.breakfast_time),
                new UserEvent(PS.UserEventType.have_lunch, this.lunch_time),
                new UserEvent(PS.UserEventType.have_dinner, this.dinner_time),
                new UserEvent(PS.UserEventType.sleep, this.sleep_time),
            ];

            const pokemon_event_queue = [];
            for (let i = 0; i < n; i++) {
                const p = pokemons[i];
                p.resetStats();

                if (cooking_chance_probability + carry_over_cooking_chance >= p.active_chance_limit_weekday) p.deactivate();
                else p.activate();

                pokemon_event_queue.push(new PokemonEvent(i, p, p.get_next_helping_time(FOUR)));
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

                const d = dayIndexOf(user_event.timestamp);
                const is_sunday = (d === 6);

                // user_event.timestamp より前のポケモンイベントを処理
                while (true) {
                    const nextEvent = pickNextPokemonEventBefore(user_event.timestamp);
                    if (!nextEvent) break;

                    if (user_event.event !== PS.UserEventType.wake_up) {
                        pokemons.map((p) => {
                            const active_chance_limit = (is_sunday ? p.active_chance_limit_sunday : p.active_chance_limit_weekday);
                            if (cooking_chance_probability + carry_over_cooking_chance >= active_chance_limit) p.deactivate();
                            else p.activate();
                        });
                    }

                    const p = nextEvent.pokemon;
                    const d = dayIndexOf(nextEvent.timestamp);

                    // ★差分で日別配列へ積む（Pokemonクラスは触らない）
                    const beforeBerry = p.total_berry_energy;
                    const beforeSkillCount = p.total_skill_count;
                    const beforeActiveSeconds = p.total_active_seconds;

                    let ret = 0.0;
                    if (user_event.event !== PS.UserEventType.wake_up) ret = p.help_in_daytime();
                    else ret = p.help_in_sleeping();

                    const deltaBerry = p.total_berry_energy - beforeBerry;
                    if (deltaBerry) berryEnergyByPokemonByDay[nextEvent.idx][d] += deltaBerry;

                    const deltaSkillCount = p.total_skill_count - beforeSkillCount;
                    if (deltaSkillCount) skillCountByPokemonByDay[nextEvent.idx][d] += deltaSkillCount;

                    const deltaActiveSeconds = p.total_active_seconds - beforeActiveSeconds;
                    if (deltaActiveSeconds) activeSecondsByPokemonByDay[nextEvent.idx][d] += deltaActiveSeconds;

                    // 料理チャンス確率へ反映（従来通り）
                    ret = Math.min(ret, this.chance_limit - cooking_chance_probability - carry_over_cooking_chance);
                    cooking_chance_probability += ret;
                    cooking_chance_probabilities[nextEvent.idx] += ret;

                    pokemon_event_queue.push(nextEvent.next());
                }
                
                // 食事イベント：成功判定とエナジー配分
                if (user_event.event === PS.UserEventType.wake_up) {
                    base_cooking_chance = this.base_cooking_chance + (is_sunday ? this.sunday_chance_bonus : 0.0);

                    base_cooking_energy =
                        recipe_energy *
                        this.cooking_energy_event_multiplier *
                        (is_sunday ? this.sunday_success_energy_bonus : 1.0) *
                        this.field_energy_multiplier;
                }

                // 8日目に入ったら終了
                if (d === 8) break;
                if (user_event.event === PS.UserEventType.wake_up || user_event.event === PS.UserEventType.sleep) continue;

                const p = Math.random();
                if (p < base_cooking_chance + carry_over_cooking_chance + cooking_chance_probability) {
                    successCountByDay[d] += 1;
                    extraEnergyByDay[d] += base_cooking_energy;

                    if (p < base_cooking_chance) {
                        baseEnergyByDay[d] += base_cooking_energy;
                    } else if (p < base_cooking_chance + carry_over_cooking_chance) {
                        carryOverEnergyByDay[d] += base_cooking_energy;
                    } else {
                        let acc = base_cooking_chance + carry_over_cooking_chance;
                        for (let i = 0; i < n; i++) {
                            const segEnd = acc + cooking_chance_probabilities[i];
                            if (p < segEnd) {
                                cookingEnergyByPokemonByDay[i][d] += base_cooking_energy;
                                break;
                            }
                            acc = segEnd;
                        }
                    }

                    cooking_chance_probability = 0.0;
                    carry_over_cooking_chance = 0.0;
                    cooking_chance_probabilities = new Array(n).fill(0.0);
                }
            }

            return {
                extraEnergyByDay,
                baseEnergyByDay,
                carryOverEnergyByDay,
                successCountByDay,
                cookingEnergyByPokemonByDay,
                berryEnergyByPokemonByDay,
                skillCountByPokemonByDay,
                activeSecondsByPokemonByDay
            };
        }

        // ★ trials回の平均（=保存したい日別配列）だけ作る
        simulate(trials, pokemons, recipe_energy) {
            const n = pokemons.length;

            const acc = {
                extraEnergyByDay: this._makeArr7(0),
                baseEnergyByDay: this._makeArr7(0),
                carryOverEnergyByDay: this._makeArr7(0),
                successCountByDay: this._makeArr7(0),
                cookingEnergyByPokemonByDay: this._make2D(n, 0),
                berryEnergyByPokemonByDay: this._make2D(n, 0),
                skillCountByPokemonByDay: this._make2D(n, 0),
                activeSecondsByPokemonByDay: this._make2D(n, 0),
            };

            const addArr7 = (a, b) => { for (let i = 0; i < 7; i++) a[i] += b[i]; };
            const add2D = (a, b) => { for (let i = 0; i < a.length; i++) for (let d = 0; d < 7; d++) a[i][d] += b[i][d]; };

            for (let t = 0; t < trials; t++) {
                const r = this.simulate_week(pokemons, recipe_energy);
                addArr7(acc.extraEnergyByDay, r.extraEnergyByDay);
                addArr7(acc.baseEnergyByDay, r.baseEnergyByDay);
                addArr7(acc.carryOverEnergyByDay, r.carryOverEnergyByDay);
                addArr7(acc.successCountByDay, r.successCountByDay);
                add2D(acc.cookingEnergyByPokemonByDay, r.cookingEnergyByPokemonByDay);
                add2D(acc.berryEnergyByPokemonByDay, r.berryEnergyByPokemonByDay);
                add2D(acc.skillCountByPokemonByDay, r.skillCountByPokemonByDay);
                add2D(acc.activeSecondsByPokemonByDay, r.activeSecondsByPokemonByDay);
            }

            const divArr7 = (a) => { for (let i = 0; i < 7; i++) a[i] /= trials; };
            const div2D = (a) => { for (let i = 0; i < a.length; i++) for (let d = 0; d < 7; d++) a[i][d] /= trials; };

            divArr7(acc.extraEnergyByDay);
            divArr7(acc.baseEnergyByDay);
            divArr7(acc.carryOverEnergyByDay);
            divArr7(acc.successCountByDay);
            div2D(acc.cookingEnergyByPokemonByDay);
            div2D(acc.berryEnergyByPokemonByDay);
            div2D(acc.skillCountByPokemonByDay);
            div2D(acc.activeSecondsByPokemonByDay);

            this.avg = acc;
            return acc;
        }
    }

    PS.model = { Pokemon, Simulator, UserEvent, PokemonEvent };
})();
