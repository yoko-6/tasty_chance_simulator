// ====== 基本データ定義 ======

const Type = {
  Normal: "ノーマル",
  Fire: "ほのお",
  Water: "みず",
  Electric: "でんき",
  Grass: "くさ",
  Ice: "こおり",
  Fighting: "かくとう",
  Poison: "どく",
  Ground: "じめん",
  Flying: "ひこう",
  Psychic: "エスパー",
  Bug: "むし",
  Rock: "いわ",
  Ghost: "ゴースト",
  Dragon: "ドラゴン",
  Dark: "あく",
  Steel: "はがね",
  Fairy: "フェアリー"
};

const Specialty = {
  Berries: "きのみとくい",
  Ingredients: "食材とくい",
  Skills: "スキルとくい"
};

class SubSkill {
  constructor(name, helping_speed, ingredient_probability, skill_probability, inventory_up, berry_finding) {
    this.name = name;
    this.helping_speed = helping_speed;
    this.ingredient_probability = ingredient_probability;
    this.skill_probability = skill_probability;
    this.inventory_up = inventory_up;
    this.berry_finding = berry_finding;
  }
}

const SubSkills = {
  SkillTriggerM: new SubSkill("スキル確率アップM", 0.0, 0.0, 0.36, 0, 0),
  SkillTriggerS: new SubSkill("スキル確率アップS", 0.0, 0.0, 0.18, 0, 0),
  HelpingSpeedM: new SubSkill("おてつだいスピードM", 0.14, 0.0, 0.0, 0, 0),
  HelpingSpeedS: new SubSkill("おてつだいスピードS", 0.07, 0.0, 0.0, 0, 0),
  HelpingBonus: new SubSkill("おてつだいボーナス", 0.14, 0.0, 0.0, 0, 0),
  BerryFindingS: new SubSkill("きのみの数S", 0.0, 0.0, 0.0, 0, 1),
  IngredientFinderM: new SubSkill("食材確率アップM", 0.0, 0.36, 0.0, 0, 0),
  IngredientFinderS: new SubSkill("食材確率アップS", 0.0, 0.18, 0.0, 0, 0),
  InventoryUpL: new SubSkill("最大確率アップL", 0.0, 0.0, 0.0, 18, 0),
  InventoryUpM: new SubSkill("最大確率アップM", 0.0, 0.0, 0.0, 12, 0),
  InventoryUpS: new SubSkill("最大確率アップS", 0.0, 0.0, 0.0, 6, 0),
};

class Nature {
  constructor(name, helping_speed_coefficient, ingredient_probability_coefficient, skill_probability_coefficient) {
    this.name = name;
    this.helping_speed_coefficient = helping_speed_coefficient;
    this.ingredient_probability_coefficient = ingredient_probability_coefficient;
    this.skill_probability_coefficient = skill_probability_coefficient;
  }
}

// ユーザー指定の性格一覧
const Natures = {
  Adamant: new Nature("いじっぱり", 0.9, 0.8, 1.0),
  Lonely: new Nature("さみしがり", 0.9, 1.0, 1.0),
  Naughty: new Nature("やんちゃ", 0.9, 1.0, 0.8),
  Brave: new Nature("ゆうかん", 0.9, 1.0, 1.0),

  Calm: new Nature("おだやか", 1.075, 1.0, 1.2),
  Gentle: new Nature("おとなしい", 1.0, 1.0, 1.2),
  Careful: new Nature("しんちょう", 1.0, 0.8, 1.2),
  Sassy: new Nature("なまいき", 1.0, 1.0, 1.2),

  Rash: new Nature("うっかりや", 1.0, 1.2, 0.8),
  Mild: new Nature("おっとり", 1.0, 1.2, 1.0),
  Modest: new Nature("ひかえめ", 1.075, 1.2, 1.0),
  Quiet: new Nature("れいせい", 1.0, 1.2, 1.0),

  Timid: new Nature("おくびょう", 1.075, 1.0, 1.0),
  Hasty: new Nature("せっかち", 1.0, 1.0, 1.0),
  Naive: new Nature("むじゃき", 1.0, 1.0, 0.8),
  Jolly: new Nature("ようき", 1.0, 0.8, 1.0),

  Bold: new Nature("ずぶとい", 1.075, 1.0, 1.0),
  Lax: new Nature("のうてんき", 1.0, 1.0, 0.8),
  Relaxed: new Nature("のんき", 1.0, 1.0, 1.0),
  Impish: new Nature("わんぱく", 1.0, 0.8, 1.0),

  Hardy: new Nature("がんばりや", 1.0, 1.0, 1.0),
  Quirky: new Nature("きまぐれ", 1.0, 1.0, 1.0),
  Docile: new Nature("すなお", 1.0, 1.0, 1.0),
  Bashful: new Nature("てれや", 1.0, 1.0, 1.0),
  Serious: new Nature("まじめ", 1.0, 1.0, 1.0)
};

// 上がる / 下がる項目のグループ
const NatureUpGroups = [
  { id: "help", label: "おてつだいスピード↑" },
  { id: "ing", label: "食材確率↑" },
  { id: "skill", label: "スキル確率↑" },
  { id: "exp", label: "EXP↑" },
  { id: "energy", label: "げんき回復↑" },
  { id: "none", label: "無補正" }
];

const NatureDownGroups = [
  { id: "help", label: "おてつだいスピード↓" },
  { id: "ing", label: "食材確率↓" },
  { id: "skill", label: "スキル確率↓" },
  { id: "exp", label: "EXP↓" },
  { id: "energy", label: "げんき回復↓" },
  { id: "none", label: "無補正" }
];

// 各性格がどの組み合わせか
const NatureMeta = {
  Adamant: { up: "help", down: "ing" },
  Lonely: { up: "help", down: "energy" },
  Naughty: { up: "help", down: "skill" },
  Brave: { up: "help", down: "exp" },

  Calm: { up: "skill", down: "help" },
  Gentle: { up: "skill", down: "energy" },
  Careful: { up: "skill", down: "ing" },
  Sassy: { up: "skill", down: "exp" },

  Rash: { up: "ing", down: "skill" },
  Mild: { up: "ing", down: "energy" },
  Modest: { up: "ing", down: "help" },
  Quiet: { up: "ing", down: "exp" },

  Timid: { up: "exp", down: "help" },
  Hasty: { up: "exp", down: "energy" },
  Naive: { up: "exp", down: "skill" },
  Jolly: { up: "exp", down: "ing" },

  Bold: { up: "energy", down: "help" },
  Lax: { up: "energy", down: "skill" },
  Relaxed: { up: "energy", down: "exp" },
  Impish: { up: "energy", down: "ing" },

  Hardy: { up: "none", down: "none" },
  Quirky: { up: "none", down: "none" },
  Docile: { up: "none", down: "none" },
  Bashful: { up: "none", down: "none" },
  Serious: { up: "none", down: "none" }
};

class MainSkill {
  constructor(name, effects) {
    this.name = name;
    this.effects = effects;
  }
}

const MainSkills = {
  TastyChanceS: new MainSkill("料理チャンスS", [0.04, 0.05, 0.06, 0.07, 0.08, 0.10])
};

class PokemonData {
  constructor(name, type, specialty, helping_speed, ingredient_probability, skill_probability, inventory_limit, main_skill) {
    this.name = name;
    this.type = type;
    this.specialty = specialty;
    this.helping_speed = helping_speed;
    this.ingredient_probability = ingredient_probability;
    this.skill_probability = skill_probability;
    this.inventory_limit = inventory_limit;
    this.main_skill = main_skill;

    this.berry_num = (specialty === Specialty.Berries) ? 2 : 1;
    this.ingredient_nums = (specialty === Specialty.Ingredients) ? [2, 5, 7] : [1, 2, 4];
    this.skill_stock_limit = (specialty === Specialty.Skills) ? 2 : 1;
  }
}

const PokemonList = {
  dedenne: new PokemonData("デデンネ", Type.Electric, Specialty.Skills, 2500, 0.177, 0.045, 19, MainSkills.TastyChanceS),
  uu: new PokemonData("ウッウ", Type.Flying, Specialty.Ingredients, 2700, 0.165, 0.039, 19, MainSkills.TastyChanceS),
  laglarge: new PokemonData("ラグラージ", Type.Water, Specialty.Berries, 2800, 0.146, 0.034, 30, MainSkills.TastyChanceS),
  manyula: new PokemonData("マニューラ", Type.Dark, Specialty.Berries, 2700, 0.251, 0.018, 26, MainSkills.TastyChanceS)
};

class Pokemon {
  constructor(pokemon_data, name, level, sub_skills, nature, skill_level, skill_event_multiplier) {
    this.pokemon_data = pokemon_data;
    this.name = name;
    this.level = level;
    this.sub_skills = sub_skills;
    this.nature = nature;
    this.skill_level = skill_level;

    // イベントによるスキル確率倍率（デフォルト 1.0）
    this.skill_event_multiplier = Number.isFinite(skill_event_multiplier)
      ? skill_event_multiplier
      : 1.0;

    this.initStats();
  }

  initStats() {
    let helping_speed_coefficient = 1.0;
    let ingredient_probability_coefficient = 1.0;
    let skill_probability_coefficient = 1.0;
    let inventory_up = 0;
    let berry_finding = 0;

    for (const sub of this.sub_skills) {
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
    ); // 秒

    this.ingredient_probability =
      this.pokemon_data.ingredient_probability *
      ingredient_probability_coefficient *
      this.nature.ingredient_probability_coefficient;

    this.skill_probability =
      this.pokemon_data.skill_probability *
      skill_probability_coefficient *
      this.nature.skill_probability_coefficient *
      this.skill_event_multiplier;

    this.inventory_limit = this.pokemon_data.inventory_limit + inventory_up;
    this.berry_num = this.pokemon_data.berry_num + berry_finding;
    this.ingredient_nums = this.pokemon_data.ingredient_nums.slice();
    this.skill_stock_limit = this.pokemon_data.skill_stock_limit;

    const idx =
      Math.max(1, Math.min(this.skill_level, this.pokemon_data.main_skill.effects.length)) - 1;
    this.skill_effect = this.pokemon_data.main_skill.effects[idx];

    this.inventory = 0;
    this.skill_stock = 0;
    this.health = 100;
    this.use_camp_ticket = false;
  }

  apply_camp_ticket() {
    this.use_camp_ticket = true;
  }

  get_health_speed_bonus() {
    if (this.health >= 81) {
      return 1.0 / 0.45;
    } else if (this.health >= 61) {
      return 1.0 / 0.52;
    } else if (this.health >= 41) {
      return 1.0 / 0.58;
    } else if (this.health >= 1) {
      return 1.0 / 0.66;
    } else {
      return 1.0;
    }
  }

  get_camp_ticket_speed_bonus() {
    return this.use_camp_ticket ? 1.2 : 1.0;
  }

  get_camp_ticket_inventory_limit_bonus() {
    return this.use_camp_ticket ? 1.2 : 1.0;
  }

  get_next_helping_time(nowSeconds, helping_speed_bonus) {
    const interval =
      this.helping_speed /
      (this.get_camp_ticket_speed_bonus() * this.get_health_speed_bonus() * helping_speed_bonus);
    return nowSeconds + Math.floor(interval);
  }

  help_in_daytime() {
    this.inventory = 0;
    this.skill_stock = 0;
    return Math.random() < this.skill_probability ? this.skill_effect : 0.0;
  }

  help_in_sleeping() {
    if (this.inventory >= Math.floor(this.inventory_limit * this.get_camp_ticket_inventory_limit_bonus())) {
      return 0.0;
    }
    if (Math.random() < this.ingredient_probability) {
      const idx = Math.floor(Math.random() * this.ingredient_nums.length);
      this.inventory += this.ingredient_nums[idx];
    } else {
      this.inventory += this.berry_num;
    }
    return Math.random() < this.skill_probability ? this.skill_effect : 0.0;
  }
}

const UserEventType = {
  wake_up: "wake_up",
  have_breakfast: "have_breakfast",
  have_lunch: "have_lunch",
  have_dinner: "have_dinner",
  sleep: "sleep"
};

class UserEvent {
  constructor(event, timestampSeconds) {
    this.event = event;
    this.timestamp = timestampSeconds;
  }

  get_next_day_event() {
    const DAY = 24 * 3600;
    return new UserEvent(this.event, this.timestamp + DAY);
  }
}

class PokemonEvent {
  constructor(pokemon, timestampSeconds) {
    this.pokemon = pokemon;
    this.timestamp = timestampSeconds;
  }

  get_next_event(helping_speed_bonus) {
    const next = this.pokemon.get_next_helping_time(this.timestamp, helping_speed_bonus);
    return new PokemonEvent(this.pokemon, next);
  }
}

class Simulator {
  constructor() {
    this.total_skill_count = 0;
    this.total_success_count = 0;
    this.total_extra_energy = 0;
    this.total_extra_energies_per_day = new Array(7).fill(0);

    this.average_skill_count = 0.0;
    this.average_success_count = 0.0;
    this.average_extra_energy = 0.0;
    this.average_extra_energies_per_day = new Array(7).fill(0.0);

    this.chance_limit = 0.7;
    this.base_cooking_chance = 0.1;
    this.first_day_base_success_chance = 0.0;
    this.sunday_chance_bonus = 0.2;
    this.sunday_success_energy_bonus = 1.5;
    this.cooking_energy_event_multiplier = 1.0;

    // デフォルト値（UI から上書きされる）
    this.wake_up_time = 7 * 3600;
    this.breakfast_time = 8 * 3600;
    this.lunch_time = 12 * 3600;
    this.dinner_time = 18 * 3600;
    this.sleep_time = 22.5 * 3600;
  }

  get_helping_bonus() {
    return 1.0;
  }

  simulate_a_week(pokemons, recipe_energy, use_camp_ticket) {
    const DAY = 24 * 3600;

    let extra_energy = 0;
    const extra_energies_per_day = new Array(7).fill(0);
    let cooking_chance_probability = 0.0;
    let skill_count = 0;
    let success_count = 0;

    let day = 1;
    let base_cooking_chance = 0.0;
    let base_cooking_energy = 0;

    const user_event_queue = [];
    user_event_queue.push(new UserEvent(UserEventType.wake_up, this.wake_up_time));
    // ▼ 朝食イベントは breakfast_time を使う
    user_event_queue.push(new UserEvent(UserEventType.have_breakfast, this.breakfast_time));
    user_event_queue.push(new UserEvent(UserEventType.have_lunch, this.lunch_time));
    user_event_queue.push(new UserEvent(UserEventType.have_dinner, this.dinner_time));
    user_event_queue.push(new UserEvent(UserEventType.sleep, this.sleep_time));

    const pokemon_event_queue = [];

    for (const pokemon of pokemons) {
      if (use_camp_ticket) {
        pokemon.apply_camp_ticket();
      }
      const next_help = pokemon.get_next_helping_time(this.wake_up_time, this.get_helping_bonus());
      pokemon_event_queue.push(new PokemonEvent(pokemon, next_help));
    }

    while (user_event_queue.length > 0) {
      const user_event = user_event_queue.shift();
      user_event_queue.push(user_event.get_next_day_event());

      if (user_event.event === UserEventType.wake_up) {
        day = Math.floor(user_event.timestamp / DAY) + 1;

        if (day === 1) {
          // 1日目だけ、入力された「1日目の料理大成功確率（イベント）」をそのまま使用
          base_cooking_chance = this.first_day_base_success_chance;
        } else {
          // 2〜6日目: 基本値 this.base_cooking_chance
          // 7日目: さらに日曜ボーナスを加算
          base_cooking_chance =
            this.base_cooking_chance + (day === 7 ? this.sunday_chance_bonus : 0.0);
        }

        base_cooking_energy =
          recipe_energy *
          this.cooking_energy_event_multiplier *
          (day === 7 ? this.sunday_success_energy_bonus : 1.0);
      }
      // ポケモンイベント（最小タイムスタンプ順に処理）
      while (true) {
        let nextEvent = null;
        let minIdx = -1;
        for (let i = 0; i < pokemon_event_queue.length; i++) {
          if (
            pokemon_event_queue[i].timestamp < user_event.timestamp &&
            (nextEvent === null || pokemon_event_queue[i].timestamp < nextEvent.timestamp)
          ) {
            nextEvent = pokemon_event_queue[i];
            minIdx = i;
          }
        }
        if (nextEvent === null) break;
        pokemon_event_queue.splice(minIdx, 1);

        let ret = 0.0;
        if (user_event.event !== UserEventType.wake_up) {
          ret = nextEvent.pokemon.help_in_daytime();
        } else {
          ret = nextEvent.pokemon.help_in_sleeping();
        }

        if (ret > 0.0) {
          skill_count += 1;
        }
        cooking_chance_probability += ret;

        pokemon_event_queue.push(
          nextEvent.get_next_event(this.get_helping_bonus())
        );
      }

      const eventDay = Math.floor(user_event.timestamp / DAY) + 1;
      if (eventDay === 8) break;

      if (
        user_event.event === UserEventType.wake_up ||
        user_event.event === UserEventType.sleep
      ) {
        continue;
      }

      let p = Math.random();
      cooking_chance_probability = Math.min(
        cooking_chance_probability,
        this.chance_limit
      );
      if (p < base_cooking_chance + cooking_chance_probability) {
        success_count += 1;
        cooking_chance_probability = 0.0;

        if (p > base_cooking_chance) {
          extra_energy += base_cooking_energy;
          extra_energies_per_day[day - 1] += base_cooking_energy;
        }
      }
    }

    this.total_skill_count += skill_count;
    this.total_success_count += success_count;
    this.total_extra_energy += extra_energy;
    for (let d = 0; d < 7; d++) {
      this.total_extra_energies_per_day[d] += extra_energies_per_day[d];
    }
  }

  simulate(trial, pokemons, recipe_energy, use_camp_ticket) {
    for (let i = 0; i < trial; i++) {
      this.simulate_a_week(pokemons, recipe_energy, use_camp_ticket);
    }

    this.average_skill_count = this.total_skill_count / 7.0 / trial;
    this.average_success_count = this.total_success_count / trial;
    this.average_extra_energy = this.total_extra_energy / 7.0 / trial;
    for (let d = 0; d < 7; d++) {
      this.average_extra_energies_per_day[d] =
        this.total_extra_energies_per_day[d] / trial;
    }
  }
}

// ====== UI 関連 ======

const MAX_SLOTS = 5;
let visibleSlots = 1;

// 上がる / 下がる組み合わせから性格リストを更新
function updateNatureOptions(slotIndex) {
  const upSelect = document.getElementById(`slot-${slotIndex}-nature-up`);
  const downSelect = document.getElementById(`slot-${slotIndex}-nature-down`);
  const natureSelect = document.getElementById(`slot-${slotIndex}-nature`);

  const up = upSelect.value;
  const down = downSelect.value;
  const oldValue = natureSelect.value;

  natureSelect.innerHTML = "";

  const candidates = Object.entries(Natures).filter(([key]) => {
    const meta = NatureMeta[key];
    return meta && meta.up === up && meta.down === down;
  });

  if (candidates.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "該当する性格なし";
    natureSelect.appendChild(opt);
    natureSelect.disabled = true;
    return;
  }

  natureSelect.disabled = false;
  for (const [key, nat] of candidates) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = nat.name;
    natureSelect.appendChild(opt);
  }

  if (oldValue && candidates.some(([k]) => k === oldValue)) {
    natureSelect.value = oldValue;
  }
}

// サブスキル取得（スロットごと）
function getSelectedSubSkillsForSlot(slotIndex) {
  const checked = [];
  for (const key of Object.keys(SubSkills)) {
    const cb = document.getElementById(`slot-${slotIndex}-subskill-${key}`);
    if (cb && cb.checked) checked.push(SubSkills[key]);
  }
  return checked;
}

function clearSubskillsForSlot(slotIndex) {
  for (const key of Object.keys(SubSkills)) {
    const cb = document.getElementById(`slot-${slotIndex}-subskill-${key}`);
    if (cb) cb.checked = false;
  }
}

function initPokemonSlots() {
  const container = document.getElementById("pokemonSlots");

  for (let i = 1; i <= MAX_SLOTS; i++) {
    const card = document.createElement("div");
    card.className = "slot-card";
    card.id = `slot-${i}-card`;
    if (i > 1) card.style.display = "none";

    card.innerHTML = `
      <div class="slot-header">ポケモン${i}</div>
      <div class="grid">
        <div class="row">
          <label for="slot-${i}-pokemon">料理チャンスポケモン</label>
          <select id="slot-${i}-pokemon">
            <option value="dedenne">デデンネ</option>
            <option value="uu">ウッウ</option>
            <option value="laglarge">ラグラージ</option>
            <option value="manyula">マニューラ</option>
          </select>
        </div>
        <div class="row">
          <label for="slot-${i}-level">レベル</label>
          <input id="slot-${i}-level" type="number" min="1" max="100" value="60">
        </div>
        <div class="row">
          <label for="slot-${i}-skillLevel">メインスキルレベル</label>
          <input id="slot-${i}-skillLevel" type="number" min="1" max="6" value="6">
        </div>
      </div>
      <div class="nature-box">
          <label>性格</label>
            <div class="row">
              <div class="row" style="margin-bottom:0.3rem;">
                <label for="slot-${i}-nature-up" style="font-weight:400;">上がる項目</label>
                <select id="slot-${i}-nature-up"></select>
              </div>
            </div>
            <div class="row">
              <div class="row" style="margin-bottom:0.3rem;">
                <label for="slot-${i}-nature-down" style="font-weight:400;">下がる項目</label>
                <select id="slot-${i}-nature-down"></select>
              </div>
            </div>
            <div class="row">
              <div class="row" style="margin-bottom:0;">
                <label for="slot-${i}-nature" style="font-weight:400;">性格</label>
                <select id="slot-${i}-nature"></select>
              </div>
            </div>
          </div>
        </div>
      <div class="row">
        <label>サブスキル</label>
        <div class="subskills-box" id="slot-${i}-subskills"></div>
        <div class="subskill-actions">
          <button type="button" id="slot-${i}-clear-subskills">サブスキルをクリア</button>
          <button type="button" id="slot-${i}-clear-slot">このポケモンの設定をクリア</button>
        </div>
        <div id="slot-${i}-subskillError" class="error" style="display:none;"></div>
      </div>
    `;

    container.appendChild(card);

    // 性格セレクトの初期化
    const upSelect = document.getElementById(`slot-${i}-nature-up`);
    const downSelect = document.getElementById(`slot-${i}-nature-down`);
    const natureSelect = document.getElementById(`slot-${i}-nature`);

    NatureUpGroups.forEach(g => {
      const opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.label;
      upSelect.appendChild(opt);
    });

    NatureDownGroups.forEach(g => {
      const opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.label;
      downSelect.appendChild(opt);
    });

    // デフォルトは無補正
    upSelect.value = "none";
    downSelect.value = "none";
    downSelect.disabled = true; // 上がる項目が無補正のときは選べない

    updateNatureOptions(i);

    upSelect.addEventListener("change", () => {
      if (upSelect.value === "none") {
        downSelect.value = "none";
        downSelect.disabled = true;
      } else {
        downSelect.disabled = false;
      }
      updateNatureOptions(i);
    });

    downSelect.addEventListener("change", () => {
      updateNatureOptions(i);
    });

    // サブスキルチェックボックス
    const subskillsBox = document.getElementById(`slot-${i}-subskills`);
    for (const key of Object.keys(SubSkills)) {
      const sub = SubSkills[key];

      // ▼ 1つ分のラッパーにクラスを付ける
      const wrapper = document.createElement("div");
      wrapper.className = "subskill-item";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = `slot-${i}-subskill-${key}`;
      cb.value = key;

      const label = document.createElement("label");
      label.htmlFor = cb.id;
      label.textContent = sub.name;

      wrapper.appendChild(cb);
      wrapper.appendChild(label);
      subskillsBox.appendChild(wrapper);
    }

    const clearSubskillsBtn = document.getElementById(`slot-${i}-clear-subskills`);
    if (clearSubskillsBtn) {
      clearSubskillsBtn.addEventListener("click", () => {
        clearSubskillsForSlot(i);
      });
    }

    const clearSlotBtn = document.getElementById(`slot-${i}-clear-slot`);
    if (clearSlotBtn) {
      clearSlotBtn.addEventListener("click", () => {
        clearPokemonSlotSettings(i);
      });
    }
  }

  const addBtn = document.getElementById("addPokemonBtn");
  const removeBtn = document.getElementById("removePokemonBtn");

  const updateAddRemoveButtons = () => {
    addBtn.disabled = visibleSlots >= MAX_SLOTS;
    removeBtn.disabled = visibleSlots <= 1;
  };
  updateAddRemoveButtons();

  addBtn.addEventListener("click", () => {
    if (visibleSlots >= MAX_SLOTS) return;
    visibleSlots += 1;
    const card = document.getElementById(`slot-${visibleSlots}-card`);
    if (card) card.style.display = "block";
    updateAddRemoveButtons();
  });

  removeBtn.addEventListener("click", () => {
    if (visibleSlots <= 1) return;
    const card = document.getElementById(`slot-${visibleSlots}-card`);
    if (card) card.style.display = "none";
    visibleSlots -= 1;
    updateAddRemoveButtons();
  });
}

function clearPokemonSlotSettings(slotIndex) {
  const pokemonSelect = document.getElementById(`slot-${slotIndex}-pokemon`);
  const levelInput = document.getElementById(`slot-${slotIndex}-level`);
  const skillLevelInput = document.getElementById(`slot-${slotIndex}-skillLevel`);
  const upSelect = document.getElementById(`slot-${slotIndex}-nature-up`);
  const downSelect = document.getElementById(`slot-${slotIndex}-nature-down`);
  const natureSelect = document.getElementById(`slot-${slotIndex}-nature`);

  // ポケモン名を最初の選択肢に戻す（デフォルト）
  if (pokemonSelect && pokemonSelect.options.length > 0) {
    pokemonSelect.selectedIndex = 0; // 0番目: デデンネ
  }

  // レベル・メインスキルレベルをデフォルト値に戻す
  if (levelInput) levelInput.value = 60;
  if (skillLevelInput) skillLevelInput.value = 6;

  // 性格：上がる項目/下がる項目を「無補正」に戻す
  if (upSelect) {
    upSelect.value = "none";
  }
  if (downSelect) {
    downSelect.value = "none";
    downSelect.disabled = true; // 無補正のときは選べない仕様を維持
  }

  // 性格セレクトの候補を更新
  if (natureSelect) {
    updateNatureOptions(slotIndex);
    // 「がんばりや(無補正)」があればそれを選ぶ
    if (natureSelect.querySelector('option[value="Hardy"]')) {
      natureSelect.value = "Hardy";
    }
  }

  // サブスキルを全解除
  clearSubskillsForSlot(slotIndex);

  // サブスキルエラー表示を消しておく
  const errorEl = document.getElementById(`slot-${slotIndex}-subskillError`);
  if (errorEl) {
    errorEl.style.display = "none";
    errorEl.textContent = "";
  }
}


// ====== 時刻関連のユーティリティ ======

function parseTimeToSeconds(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return null;
  const parts = timeStr.split(":");
  if (parts.length < 2) return null;
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  if (h < 0 || h >= 24 || m < 0 || m >= 60) return null;
  return h * 3600 + m * 60;
}

// 0〜4 時は 24 時間足して翌日として扱う
function normalizeTimeForSchedule(sec) {
  const FOUR = 4 * 3600;
  return sec < FOUR ? sec + 24 * 3600 : sec;
}

/**
 * 生活スケジュールの入力を検証し、OKなら simulator に反映する。
 * 条件を満たさない場合は false を返す。
 */
function applyScheduleFromUI(simulator) {
  const timeErrorEl = document.getElementById("timeError");
  if (timeErrorEl) {
    timeErrorEl.style.display = "none";
    timeErrorEl.textContent = "";
  }

  const wakeSec = parseTimeToSeconds(document.getElementById("wakeTime").value);
  const breakfastSec = parseTimeToSeconds(document.getElementById("breakfastTime").value);
  const lunchSec = parseTimeToSeconds(document.getElementById("lunchTime").value);
  const dinnerSec = parseTimeToSeconds(document.getElementById("dinnerTime").value);
  const sleepSec = parseTimeToSeconds(document.getElementById("sleepTime").value);

  const showError = (msg) => {
    if (timeErrorEl) {
      timeErrorEl.style.display = "block";
      timeErrorEl.textContent = msg;
    }
  };

  if ([wakeSec, breakfastSec, lunchSec, dinnerSec, sleepSec].some(v => v === null)) {
    showError("時刻の入力形式が正しくありません。");
    return false;
  }

  const FOUR = 4 * 3600;
  const NOON = 12 * 3600;
  const EVENING = 18 * 3600;
  const NEXTFOUR = 28 * 3600;

  // 起床は 4:00 以降
  if (wakeSec < FOUR) {
    showError("起床時刻は 4:00 以降にしてください。");
    return false;
  }

  // 朝食：起床〜12:00 未満
  if (breakfastSec < wakeSec || breakfastSec >= NOON) {
    showError("朝食時刻は起床〜12:00 未満の範囲で指定してください。");
    return false;
  }

  // 昼食：12:00〜18:00 未満
  if (lunchSec < NOON || lunchSec >= EVENING) {
    showError("昼食時刻は 12:00〜18:00 未満の範囲で指定してください。");
    return false;
  }

  // 就寝：4:00 より前
  if (sleepSec >= NEXTFOUR) {
    showError("就寝時刻は翌日 4:00 より前にしてください。");
    return false;
  }

  // 正規化した時刻で 18:00 以降〜就寝までをチェック
  const lunchNorm = normalizeTimeForSchedule(lunchSec);
  const dinnerNorm = normalizeTimeForSchedule(dinnerSec);
  const sleepNorm = normalizeTimeForSchedule(sleepSec);

  if (dinnerNorm < EVENING) {
    showError("夕食時刻は 18:00 以降にしてください。");
    return false;
  }

  if (dinnerNorm < lunchNorm) {
    showError("夕食時刻は昼食以降にしてください。");
    return false;
  }

  if (dinnerNorm > sleepNorm) {
    showError("夕食時刻は就寝時刻以前（同じでも可）にしてください。");
    return false;
  }

  // simulator に反映（内部では 0〜4 時は +24h 済み）
  simulator.wake_up_time = normalizeTimeForSchedule(wakeSec);
  simulator.breakfast_time = normalizeTimeForSchedule(breakfastSec);
  simulator.lunch_time = normalizeTimeForSchedule(lunchSec);
  simulator.dinner_time = dinnerNorm;
  simulator.sleep_time = sleepNorm;

  return true;
}

// ====== DOM 初期化とシミュレーション ======

window.addEventListener("DOMContentLoaded", () => {
  initPokemonSlots();

  const runBtn = document.getElementById("runBtn");
  const statusEl = document.getElementById("status");
  const outputEl = document.getElementById("output");

  runBtn.addEventListener("click", () => {
    statusEl.textContent = "";
    let hasError = false;

    const skillEventMultiplierInput = Number(
      document.getElementById("skillEventMultiplier").value || "1"
    );
    const skillEventMultiplier = Math.max(0, skillEventMultiplierInput || 0);

    const energyEventMultiplierInput = Number(
      document.getElementById("energyEventMultiplier").value || "1"
    );
    const energyEventMultiplier = Math.max(0, energyEventMultiplierInput || 0);

    const pokemons = [];

    for (let i = 1; i <= MAX_SLOTS; i++) {
      const card = document.getElementById(`slot-${i}-card`);
      const errorEl = document.getElementById(`slot-${i}-subskillError`);
      if (errorEl) {
        errorEl.style.display = "none";
        errorEl.textContent = "";
      }
      if (!card || card.style.display === "none") continue;

      const subSkills = getSelectedSubSkillsForSlot(i);
      // if (subSkills.length > 5) {
      //   hasError = true;
      //   if (errorEl) {
      //     errorEl.style.display = "block";
      //     errorEl.textContent = "サブスキルは最大 5 個までしか選べません。";
      //   }
      //   continue;
      // }

      const selectedPokemonKey = document.getElementById(`slot-${i}-pokemon`).value;
      const level = Number(document.getElementById(`slot-${i}-level`).value || "1");
      const skillLevel = Number(document.getElementById(`slot-${i}-skillLevel`).value || "1");
      let natureKey = document.getElementById(`slot-${i}-nature`).value;

      if (!natureKey || !Natures[natureKey]) {
        natureKey = "Hardy"; // フォールバックで無補正
      }

      const pokemonData = PokemonList[selectedPokemonKey];
      const nature = Natures[natureKey];
      const pokemonName = `${pokemonData.name}${i}`;

      const pokemon = new Pokemon(
        pokemonData,
        pokemonName,
        level,
        subSkills,
        nature,
        skillLevel,
        skillEventMultiplier
      );
      pokemons.push(pokemon);
    }

    if (hasError) {
      statusEl.textContent = "入力エラーがあります。各ポケモンのサブスキルを確認してください。";
      return;
    }
    if (pokemons.length === 0) {
      statusEl.textContent = "少なくとも 1 匹は表示されたポケモンを使ってください。";
      return;
    }

    const recipeEnergy = Number(document.getElementById("recipeEnergy").value || "0");
    const trials = Number(document.getElementById("trials").value || "1000");
    const useCampTicket = document.getElementById("campTicket").checked;

    // 1日目の料理大成功確率（%）を 0〜70 にクリップ
    const day1ChancePercentInput = Number(
      document.getElementById("day1SuccessChance").value || "0"
    );
    const day1ChancePercent = Math.max(0, Math.min(day1ChancePercentInput || 0, 70));

    const simulator = new Simulator();

    // 0〜1.0 に変換して Simulator に渡す
    simulator.first_day_base_success_chance = day1ChancePercent / 100.0;

    // ▼ 料理エナジーUP(イベント) 倍率を設定
    simulator.cooking_energy_event_multiplier = energyEventMultiplier;

    // 時刻設定を検証して simulator に反映
    if (!applyScheduleFromUI(simulator)) {
      statusEl.textContent = "時間設定にエラーがあります。";
      return;
    }

    runBtn.disabled = true;
    statusEl.textContent = `シミュレーション中…（試行回数: ${trials}）`;

    setTimeout(() => {
      simulator.simulate(trials, pokemons, recipeEnergy, useCampTicket);

      const avgSkill = simulator.average_skill_count;     // 1日あたり スキル発動数（全体）
      const avgSuccess = simulator.average_success_count; // 1週間あたり 料理成功回数
      const avgExtraPerDay = simulator.average_extra_energy; // 1日あたり 追加エナジー（全体）
      const perDay = simulator.average_extra_energies_per_day;

      const totalExtraPerWeek = avgExtraPerDay * 7; // 合計（1週間あたり）
      const perPokemonExtraPerWeek =
        pokemons.length > 0 ? totalExtraPerWeek / pokemons.length : 0;

      let text = "";

      text += "=== 入力パラメータ ===\n";
      pokemons.forEach((pkm, idx) => {
        const n = idx + 1;
        const subNames =
          pkm.sub_skills.length > 0
            ? pkm.sub_skills.map(s => s.name).join(", ")
            : "なし";
        text += `[ポケモン${n}] ${pkm.pokemon_data.name}\n`;
        text += `  レベル: ${pkm.level}\n`;
        text += `  メインスキルレベル: ${pkm.skill_level}\n`;
        text += `  サブスキル: ${subNames}\n`;
        text += `  性格: ${pkm.nature.name}\n`;
      });
      text += `\nレシピのエネルギー値: ${recipeEnergy}\n`;
      text += `キャンプチケット: ${useCampTicket ? "使用する" : "使用しない"}\n`;
      text += `試行回数: ${trials}\n\n`;
      text += `月曜日の朝の料理大成功確率: ${day1ChancePercent.toFixed(1)} %\n`;
      text += `スキル確率UP: ${skillEventMultiplier.toFixed(2)} 倍\n\n`;
      text += `料理エナジーUP（イベント）: ${energyEventMultiplier.toFixed(2)} 倍\n\n`;

      text += "=== ポケモン最終ステータス（確率） ===\n";
      pokemons.forEach((pkm, idx) => {
        const n = idx + 1;
        text += `[ポケモン${n}] ${pkm.pokemon_data.name}\n`;
        text += `  おてつだい時間: ${pkm.helping_speed} 秒\n`;
        text += `  食材確率: ${(pkm.ingredient_probability * 100).toFixed(2)} %\n`;
        text += `  スキル確率: ${(pkm.skill_probability * 100).toFixed(2)} %\n`;
        text += `  所持数: ${pkm.inventory_limit}\n`;
        text += `  きのみの数: ${pkm.berry_num}\n`;
        text += `  メインスキル効果: ${pkm.skill_effect}\n`;
      });

      text += "\n=== シミュレーション結果（1週間 × 試行回数の平均） ===\n";
      text += `1日あたりの平均スキル発動数（全ポケモン合計）: ${avgSkill.toFixed(3)} 回\n`;
      text += `1週間あたりの平均料理成功回数: ${avgSuccess.toFixed(3)} 回\n`;
      text += `1週間あたりの平均追加エナジー合計: ${totalExtraPerWeek.toFixed(3)}\n`;
      text += `1週間あたりの平均追加エナジー（1匹あたり）: ${perPokemonExtraPerWeek.toFixed(3)}\n`;
      text += `1日あたりの平均追加エナジー合計: ${avgExtraPerDay.toFixed(3)}\n\n`;

      text += "曜日別の平均追加エナジー（1週間ぶん）:\n";
      const labels = [
        "月曜目",
        "火曜目",
        "水曜目",
        "木曜目",
        "金曜目",
        "土曜目",
        "日曜目"
      ];
      perDay.forEach((val, idx) => {
        text += `  ${labels[idx]}: ${val.toFixed(3)}\n`;
      });

      // text が 1回分の出力ブロック
      const sep = "\n\n-------------------------------------------------------------------------------------------------------------------\n\n";

      let old_text = outputEl.textContent;

      outputEl.textContent = text + sep + old_text;

      statusEl.textContent = "シミュレーション完了";
      runBtn.disabled = false;
    }, 10);
  });
});
