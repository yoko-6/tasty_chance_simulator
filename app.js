// ====== 基本データ定義 ======

const Type = {
  None: "",
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
  Fairy: "フェアリー",
};

class Berry {
  constructor(name, energy) {
    this.name = name;
    this.energy = energy;
  }
}

const Berries = {
  Persim: new Berry("キーのみ", 28),
  Leppa: new Berry("ヒメリのみ", 27),
  Oran: new Berry("オレンのみ", 31),
  Grepa: new Berry("ウブのみ", 25),
  Durin: new Berry("ドリのみ", 30),
  Rawst: new Berry("チーゴのみ", 32),
  Cheri: new Berry("クラボのみ", 27),
  Chesto: new Berry("カゴのみ", 32),
  Figy: new Berry("フィラのみ", 29),
  Pamtre: new Berry("シーヤのみ", 24),
  Mago: new Berry("マゴのみ", 26),
  Lum: new Berry("ラムのみ", 24),
  Sitrus: new Berry("オボンのみ", 30),
  Bluk: new Berry("ブリーのみ", 26),
  Yache: new Berry("ヤチェのみ", 35),
  Wiki: new Berry("ウイのみ", 31),
  Belue: new Berry("ベリブのみ", 33),
  Pecha: new Berry("モモンのみ", 26)
};

// フィールド定義
const Fields = {
  wakakusa: {
    key: "wakakusa",
    label: "ワカクサ本島",
    types: null,      // ユーザーが3タイプを選ぶ
    isEx: false
  },
  cyan: {
    key: "cyan",
    label: "シアンの砂浜",
    types: [Type.Water, Type.Fairy, Type.Flying],
    isEx: false
  },
  taupe: {
    key: "taupe",
    label: "トープ洞窟",
    types: [Type.Ground, Type.Fire, Type.Rock],
    isEx: false
  },
  unohana: {
    key: "unohana",
    label: "ウノハナ雪原",
    types: [Type.Ice, Type.Normal, Type.Dark],
    isEx: false
  },
  lapis: {
    key: "lapis",
    label: "ラピスラズリ湖畔",
    types: [Type.Grass, Type.Psychic, Type.Fighting],
    isEx: false
  },
  gold: {
    key: "gold",
    label: "ゴールド旧発電所",
    types: [Type.Electric, Type.Ghost, Type.Steel],
    isEx: false
  },
  amber: {
    key: "amber",
    label: "アンバー渓谷",
    types: [Type.Poison, Type.Bug, Type.Dragon],
    isEx: false
  },
  wakakusa_ex: {
    key: "wakakusa_ex",
    label: "ワカクサ本島EX",
    types: null,    // ユーザーが3タイプを選ぶ
    isEx: true
  }
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
  { id: "help", label: "おてつだいスピード ▲▲" },
  { id: "ing", label: "食材おてつだい確率 ▲▲" },
  { id: "skill", label: "メインスキル発生確率 ▲▲" },
  { id: "exp", label: "EXP獲得量 ▲▲" },
  { id: "energy", label: "げんき回復量 ▲▲" },
  { id: "none", label: "無補正" }
];

const NatureDownGroups = [
  { id: "help", label: "おてつだいスピード ▼▼" },
  { id: "ing", label: "食材おてつだい確率 ▼▼" },
  { id: "skill", label: "メインスキル発生確率 ▼▼" },
  { id: "exp", label: "EXP獲得量 ▼▼" },
  { id: "energy", label: "げんき回復量 ▼▼" },
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
  constructor(name, type, berry, specialty, helping_speed, ingredient_probability, skill_probability, inventory_limit, main_skill) {
    this.name = name;
    this.type = type;
    this.berry = berry;
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
  dedenne: new PokemonData("デデンネ", Type.Electric, Berries.Grepa, Specialty.Skills, 2500, 0.177, 0.045, 19, MainSkills.TastyChanceS),
  uu: new PokemonData("ウッウ", Type.Flying, Berries.Pamtre, Specialty.Ingredients, 2700, 0.165, 0.039, 19, MainSkills.TastyChanceS),
  laglarge: new PokemonData("ラグラージ", Type.Ground, Berries.Figy, Specialty.Berries, 2800, 0.146, 0.034, 30, MainSkills.TastyChanceS),
  manyula: new PokemonData("マニューラ", Type.Dark, Berries.Wiki, Specialty.Berries, 2700, 0.251, 0.018, 26, MainSkills.TastyChanceS)
};

class Pokemon {
  constructor(
    pokemon_data,
    name,
    level,
    sub_skills,
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
    ex_effect_label,                  // EX: 表示用のラベル

  ) {
    this.pokemon_data = pokemon_data;
    this.name = name;
    this.level = level;
    this.sub_skills = sub_skills;
    this.nature = nature;
    this.skill_level = skill_level;

    this.berry_energy_multiplier = Number.isFinite(berry_energy_multiplier)
      ? berry_energy_multiplier
      : 1.0;

    this.camp_ticket_helping_speed_multiplier = Number.isFinite(camp_ticket_helping_speed_multiplier)
      ? camp_ticket_helping_speed_multiplier
      : 1.0;

    this.camp_ticket_inventory_limit_bonus = Number.isFinite(camp_ticket_inventory_limit_bonus)
      ? camp_ticket_inventory_limit_bonus
      : 1.0;

    this.team_helping_speed_multiplier = Number.isFinite(team_helping_speed_multiplier)
      ? team_helping_speed_multiplier
      : 1.0;
    this.team_ingredient_bonus = Number.isFinite(team_ingredient_bonus)
      ? team_ingredient_bonus
      : 0;
    this.team_skill_multiplier = Number.isFinite(team_skill_multiplier)
      ? team_skill_multiplier
      : 1.0;

    this.personal_helping_speed_multiplier = Number.isFinite(personal_helping_multiplier)
      ? personal_helping_multiplier
      : 1.0;
    this.personal_ingredient_bonus = Number.isFinite(personal_ingredient_bonus)
      ? personal_ingredient_bonus
      : 0;
    this.personal_skill_multiplier = Number.isFinite(personal_skill_multiplier)
      ? personal_skill_multiplier
      : 1.0;

    // ★ EX 用倍率
    this.ex_helping_speed_multiplier = Number.isFinite(ex_helping_multiplier)
      ? ex_helping_multiplier
      : 1.0;
    this.ex_ingredient_bonus = Number.isFinite(ex_ingredient_bonus)
      ? ex_ingredient_bonus
      : 0;
    this.ex_skill_multiplier = Number.isFinite(ex_skill_multiplier)
      ? ex_skill_multiplier
      : 1.0;

    // EX専用フラグ
    this.ex_extra_ingredient_if_specialty = (this.ex_ingredient_bonus > 0) && (this.pokemon_data.specialty === Specialty.Ingredients);
    this.ex_effect_label = ex_effect_label || "なし";

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
      this.team_skill_multiplier *
      this.personal_skill_multiplier *
      this.ex_skill_multiplier;

    this.inventory_limit = Math.floor((this.pokemon_data.inventory_limit + inventory_up) * this.camp_ticket_inventory_limit_bonus);
    this.berry_num = this.pokemon_data.berry_num + berry_finding;
    this.ingredient_nums = this.pokemon_data.ingredient_nums.slice();
    this.skill_stock_limit = this.pokemon_data.skill_stock_limit;

    const idx =
      Math.max(1, Math.min(this.skill_level, this.pokemon_data.main_skill.effects.length)) - 1;
    this.skill_effect = this.pokemon_data.main_skill.effects[idx];

    this.resetStats();
  }

  resetStats() {
    this.inventory = 0;
    this.skill_stock = 0;
    this.health = 100;

    this.total_berry_energy = 0;
    this.total_skill_energy = 0;
    this.total_skill_count = 0;
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

  get_berry_energy() {
    return Math.round(Math.max(this.pokemon_data.berry.energy + (this.level - 1), this.pokemon_data.berry.energy * Math.pow(1.025, this.level - 1)));
  }

  get_next_helping_time(nowSeconds) {
    const effectiveBonus =
      this.get_health_speed_bonus() *
      this.camp_ticket_helping_speed_multiplier * // キャンプチケット倍率
      this.team_helping_speed_multiplier *    // イベント倍率
      this.personal_helping_speed_multiplier * // 個別倍率
      this.ex_helping_speed_multiplier;        // EX倍率

    const interval = this.helping_speed / effectiveBonus;
    return nowSeconds + Math.floor(interval);
  }

  help_in_daytime() {
    let skill_effect = this.help_in_sleeping();

    this.inventory = 0;
    this.skill_stock = 0;
    return skill_effect;
  }

  help_in_sleeping() {
    let skill_effect = 0.0;

    if (this.inventory >= this.inventory_limit) {
      this.get_berries();
      return skill_effect;
    }

    if (Math.random() < this.ingredient_probability) {
      this.get_ingredients();
    } else {
      this.get_berries();
    }

    return this.trigger_skill();
  }

  get_berries() {
    this.total_berry_energy += this.get_berry_energy() * this.berry_num * this.berry_energy_multiplier;
    if (this.inventory < this.inventory_limit) {
      this.inventory += this.berry_num;
    }
  }

  get_ingredients() {
    const idx = Math.floor(Math.random() * this.ingredient_nums.length);
    let gain = this.ingredient_nums[idx] + this.team_ingredient_bonus + this.personal_ingredient_bonus + this.ex_ingredient_bonus;
    if (
      this.ex_extra_ingredient_if_specialty &&
      Math.random() < 0.5
    ) {
      gain += 1;
    }
    if (gain < 0) gain = 0;
    if (this.inventory < this.inventory_limit) {
      this.inventory += gain;
    }
  }

  trigger_skill() {
    if (this.skill_stock >= this.skill_stock_limit) {
      return 0.0;
    }

    if (Math.random() < this.skill_probability) {
      this.skill_stock += 1;
      this.total_skill_count += 1;
      return this.skill_effect;
    }

    return 0.0;
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
  constructor(idx, pokemon, timestampSeconds) {
    this.idx = idx;
    this.pokemon = pokemon;
    this.timestamp = timestampSeconds;
  }

  get_next_event() {
    const next = this.pokemon.get_next_helping_time(this.timestamp);
    return new PokemonEvent(this.idx, this.pokemon, next);
  }
}

// EXフィールド用の補正種別
const ExEffectLabels = {
  "": "補正なし",
  berry: "きのみエナジー2.4倍",
  ingredient: "食材数+1（食材タイプなら50%でさらに+1）",
  skill: "スキル確率1.25倍"
};

function populateTypeSelectOptions(selectEl) {
  selectEl.innerHTML = "";
  for (const key of Object.keys(Type)) {
    const opt = document.createElement("option");
    opt.value = Type[key];       // 例: "でんき"
    opt.textContent = Type[key]; // 表示も同じ
    selectEl.appendChild(opt);
  }
}

function populateExEffectSelect(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = "";
  Object.entries(ExEffectLabels).forEach(([value, label]) => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    sel.appendChild(opt);
  });
}

function initFieldUI() {
  const fieldSelect = document.getElementById("fieldSelect");
  const mainSel = document.getElementById("fieldMainType");
  const sub1Sel = document.getElementById("fieldSub1Type");
  const sub2Sel = document.getElementById("fieldSub2Type");
  const exOptionConfig = document.getElementById("exOptionConfig");

  // タイプ選択肢を埋める
  [mainSel, sub1Sel, sub2Sel].forEach(populateTypeSelectOptions);
  // EX補正選択肢を埋める
  populateExEffectSelect("exEffect");

  const applyField = () => {
    const key = fieldSelect.value || "wakakusa";
    const field = Fields[key];
    if (!field) return;

    const fixedTypes = field.types; // null ならユーザー自由

    if (fixedTypes && fixedTypes.length === 3) {
      mainSel.value = fixedTypes[0];
      sub1Sel.value = fixedTypes[1];
      sub2Sel.value = fixedTypes[2];

      // mainSel.disabled = true;
      // sub1Sel.disabled = true;
      // sub2Sel.disabled = true;
    } else {
      // ワカクサ本島 / ワカクサ本島EX → ユーザーが編集可能
      mainSel.disabled = false;
      sub1Sel.disabled = false;
      sub2Sel.disabled = false;
      if (!mainSel.value) mainSel.value = Type.None;
      if (!sub1Sel.value) sub1Sel.value = Type.None;
      if (!sub2Sel.value) sub2Sel.value = Type.None;
    }

    // EX補正欄の表示・非表示（ワカクサ本島EXのみ）
    if (field.isEx) {
      exOptionConfig.style.display = "block";
    } else {
      exOptionConfig.style.display = "none";
      const exEffectSel = document.getElementById("exEffect");
      if (exEffectSel) exEffectSel.value = "";
    }
  };

  fieldSelect.addEventListener("change", applyField);
  applyField(); // 初期反映
}

const MAX_SLOTS = 5;

class Simulator {
  constructor() {
    this.total_skill_count = 0;
    this.total_success_count = 0;
    this.total_extra_energy = 0;
    this.total_extra_energies_per_day = new Array(7).fill(0);
    this.total_berry_energies = new Array(MAX_SLOTS).fill(0);
    this.total_skill_energies = new Array(MAX_SLOTS).fill(0);
    this.total_skill_counts = new Array(MAX_SLOTS).fill(0);

    this.average_skill_count = 0.0;
    this.average_success_count = 0.0;
    this.average_extra_energy = 0.0;
    this.average_extra_energies_per_day = new Array(7).fill(0.0);
    this.average_berry_energies = new Array(MAX_SLOTS).fill(0.0);
    this.average_skill_energies = new Array(MAX_SLOTS).fill(0.0);
    this.average_skill_counts = new Array(MAX_SLOTS).fill(0.0);

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

  simulate_a_week(pokemons, recipe_energy) {
    const DAY = 24 * 3600;

    let extra_energy = 0;
    const extra_energies_per_day = new Array(7).fill(0);
    let cooking_chance_probability = 0.0;
    let cooking_chance_probabilities = new Array(pokemons.length).fill(0.0);
    let skill_count = 0;
    let success_count = 0;

    let day = 1;
    let base_cooking_chance = 0.0;
    let base_cooking_energy = 0;

    const user_event_queue = [];
    user_event_queue.push(new UserEvent(UserEventType.wake_up, this.wake_up_time));
    user_event_queue.push(new UserEvent(UserEventType.have_breakfast, this.breakfast_time));
    user_event_queue.push(new UserEvent(UserEventType.have_lunch, this.lunch_time));
    user_event_queue.push(new UserEvent(UserEventType.have_dinner, this.dinner_time));
    user_event_queue.push(new UserEvent(UserEventType.sleep, this.sleep_time));

    const pokemon_event_queue = [];

    for (let i = 0; i < pokemons.length; i++) {
      const pokemon = pokemons[i];
      pokemon.resetStats();
      const next_help = pokemon.get_next_helping_time(this.wake_up_time);
      pokemon_event_queue.push(new PokemonEvent(i, pokemon, next_help));
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
        let nextEvents = [];
        let minIdxs = [];
        for (let i = 0; i < pokemon_event_queue.length; i++) {
          if (
            pokemon_event_queue[i].timestamp < user_event.timestamp) {
            if (nextEvents.length === 0 || pokemon_event_queue[i].timestamp < nextEvents[0].timestamp) {
              nextEvents = [pokemon_event_queue[i]];
              minIdxs = [i];
            }
            else if (pokemon_event_queue[i].timestamp === nextEvents[0].timestamp) {
              nextEvents.push(pokemon_event_queue[i]);
              minIdxs.push(i);
            }
          }
        }
        if (nextEvents.length === 0) break;

        // 同タイムスタンプのものが複数あればランダムに1つ選ぶ
        const minIdx = minIdxs[Math.floor(Math.random() * minIdxs.length)];
        const nextEvent = pokemon_event_queue[minIdx];
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

        ret = Math.min(ret, this.chance_limit - cooking_chance_probability);
        cooking_chance_probability += ret;
        cooking_chance_probabilities[nextEvent.idx] += ret;

        pokemon_event_queue.push(
          nextEvent.get_next_event()
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
      if (p < base_cooking_chance + cooking_chance_probability) {
        success_count += 1;
        cooking_chance_probability = 0.0;

        let total_cooking_chance_probability = base_cooking_chance;
        for (let i = 0; i < pokemons.length; i++) {
          if (p > total_cooking_chance_probability && p < total_cooking_chance_probability + cooking_chance_probabilities[i]) {
            extra_energy += base_cooking_energy;
            extra_energies_per_day[day - 1] += base_cooking_energy;
            pokemons[i].total_skill_energy += base_cooking_energy;
            break;
          }
          total_cooking_chance_probability += cooking_chance_probabilities[i];
        }

        cooking_chance_probabilities = new Array(pokemons.length).fill(0.0);
      }
    }

    this.total_skill_count += skill_count;
    this.total_success_count += success_count;
    this.total_extra_energy += extra_energy;
    for (let d = 0; d < 7; d++) {
      this.total_extra_energies_per_day[d] += extra_energies_per_day[d];
    }
    for (let i = 0; i < pokemons.length; i++) {
      this.total_berry_energies[i] += pokemons[i].total_berry_energy;
      this.total_skill_energies[i] += pokemons[i].total_skill_energy;
      this.total_skill_counts[i] += pokemons[i].total_skill_count;
    }
  }

  simulate(trial, pokemons, recipe_energy) {
    for (let i = 0; i < trial; i++) {
      this.simulate_a_week(pokemons, recipe_energy);
    }

    this.average_skill_count = this.total_skill_count / 7.0 / trial;
    this.average_success_count = this.total_success_count / 7.0 / trial;
    this.average_extra_energy = this.total_extra_energy / 7.0 / trial;
    for (let d = 0; d < 7; d++) {
      this.average_extra_energies_per_day[d] =
        this.total_extra_energies_per_day[d] / trial;
    }
    for (let i = 0; i < pokemons.length; i++) {
      this.average_berry_energies[i] =
        this.total_berry_energies[i] / 7.0 / trial;
      this.average_skill_energies[i] =
        this.total_skill_energies[i] / 7.0 / trial;
      this.average_skill_counts[i] =
        this.total_skill_counts[i] / 7.0 / trial;
    }
  }
}

// ====== UI 関連 ======

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

      <div class="row">
        <label>サブスキル</label>
        <div class="subskills-box" id="slot-${i}-subskills"></div>
        <div class="subskill-actions">
          <button type="button" id="slot-${i}-clear-subskills">サブスキルをクリア</button>
        </div>
        <div id="slot-${i}-subskillError" class="error" style="display:none;"></div>
      </div>
      <div class="row">
        <label>性格</label>
          <div class="nature-box">
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
      </div>
      <div class="row">
      <label>個別補正</label>
      <div class="slot-modifiers">
        <div class="modifier-field">
          <span class="muted">おてつだいスピード倍率</span>
          <input
            id="slot-${i}-help-mult"
            type="number"
            min="0.1"
            step="0.05"
            value="1.0"
          >
        </div>
        <div class="modifier-field">
          <span class="muted">食材数ボーナス</span>
          <input
            id="slot-${i}-ing-bonus"
            type="number"
            min="0"
            step="1"
            value="0"
          >
        </div>
        <div class="modifier-field">
          <span class="muted">スキル確率倍率</span>
          <input
            id="slot-${i}-skill-mult"
            type="number"
            min="0"
            step="0.05"
            value="1.0"
          >
        </div>
      </div>
      <div class="subskill-actions">
        <button type="button" id="slot-${i}-clear-slot">このポケモンの設定をクリア</button>
      </div>
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

  // 個別補正をデフォルト値に戻す
  const helpMultInput = document.getElementById(`slot-${slotIndex}-help-mult`);
  const ingBonusInput = document.getElementById(`slot-${slotIndex}-ing-bonus`);
  const skillMultInput = document.getElementById(`slot-${slotIndex}-skill-mult`);
  if (helpMultInput) helpMultInput.value = "1.0";
  if (ingBonusInput) ingBonusInput.value = "0";
  if (skillMultInput) skillMultInput.value = "1.0";
}

function getFieldEffectForType(pokemonType, fieldConfig) {
  const isMain = pokemonType === fieldConfig.mainType;
  const isSub1 = pokemonType === fieldConfig.sub1Type;
  const isSub2 = pokemonType === fieldConfig.sub2Type;
  const isSelected = isMain || isSub1 || isSub2;

  let helpingMult = 1.0;
  let skillMult = 1.0;
  let ingredientBonus = 0;
  let extraIngredientIfSpecialty = false;
  let berryEnergyMult = (isSelected ? 2.0 : 1.0);
  let effectLabel = "補正なし";

  // ワカクサ本島EX 以外は EX 補正なし
  if (fieldConfig.key === "wakakusa_ex") {
    // おてつだいスピード
    if (isMain) {
      helpingMult = 1.1;      // メインタイプ
    } else if (!isSelected) {
      helpingMult = 0.85;     // 選ばれていない残りのタイプ
    } else {
      helpingMult = 1.0;      // サブ1 / サブ2
    }

    // 3タイプに共通のEX補正（きのみ / 食材 / スキル）
    let effectKind = "";
    if (isSelected) {
      effectKind = fieldConfig.exEffect || "";
    }

    switch (effectKind) {
      case "skill":
        skillMult = 1.25;
        effectLabel = ExEffectLabels.skill;
        break;
      case "ingredient":
        ingredientBonus = 1;
        extraIngredientIfSpecialty = true; // 食材とくいなら 50% でもう1個
        effectLabel = ExEffectLabels.ingredient;
        break;
      case "berry":
        berryEnergyMult = 2.4;
        effectLabel = ExEffectLabels.berry;
        break;
      default:
        effectLabel = "補正なし";
        break;
    }
  }

  return {
    helpingMult,
    skillMult,
    ingredientBonus,
    extraIngredientIfSpecialty,
    berryEnergyMult,
    effectLabel,
    matchesFieldType: isSelected,
    isMainType: isMain
  };
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
  initFieldUI();

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

    const helpingSpeedMultiplierInput = Number(
      document.getElementById("helpingSpeedMultiplier").value || "1"
    );
    const helpingSpeedMultiplier = Math.max(0.1, helpingSpeedMultiplierInput || 1.0);

    const ingredientBonusInput = Number(
      document.getElementById("ingredientBonus").value || "0"
    );
    const ingredientBonus = Math.max(0, Math.floor(ingredientBonusInput || 0));

    const useCampTicket = document.getElementById("campTicket").checked;
    const campTicketConfig = {
      enabled: useCampTicket,
      helpingMult: useCampTicket ? 1.2 : 1.0,
      inventoryBonus: useCampTicket ? 1.2 : 1.0
    }

    // ▼ EXフィールド設定を読み込み ▼
    const fieldKey = document.getElementById("fieldSelect").value || "wakakusa";
    const fieldMainType = document.getElementById("fieldMainType").value || "";
    const fieldSub1Type = document.getElementById("fieldSub1Type").value || "";
    const fieldSub2Type = document.getElementById("fieldSub2Type").value || "";
    const exEffectValue =
      fieldKey === "wakakusa_ex"
        ? (document.getElementById("exEffect").value || "")
        : "";

    const fieldConfig = {
      key: fieldKey,
      mainType: fieldMainType,
      sub1Type: fieldSub1Type,
      sub2Type: fieldSub2Type,
      exEffect: exEffectValue
    };

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

      const slotHelpMultInput = Number(
        document.getElementById(`slot-${i}-help-mult`).value || "1"
      );
      const slotSkillMultInput = Number(
        document.getElementById(`slot-${i}-skill-mult`).value || "1"
      );
      const slotIngBonusInput = Number(
        document.getElementById(`slot-${i}-ing-bonus`).value || "0"
      );

      const personalHelpMult = Math.max(0.1, slotHelpMultInput || 1.0);
      const personalSkillMult = Math.max(0, slotSkillMultInput || 1.0);
      const personalIngredientBonus = Math.max(
        0,
        Math.floor(slotIngBonusInput || 0)
      );

      const pokemonData = PokemonList[selectedPokemonKey];
      const nature = Natures[natureKey];
      const pokemonName = `${pokemonData.name}${i}`;

      const f = getFieldEffectForType(pokemonData.type, fieldConfig);

      const pokemon = new Pokemon(
        pokemonData,
        pokemonName,
        level,
        subSkills,
        nature,
        skillLevel,
        f.berryEnergyMult,
        campTicketConfig.helpingMult,
        campTicketConfig.inventoryBonus,
        helpingSpeedMultiplier,
        ingredientBonus,
        skillEventMultiplier,
        personalHelpMult,
        personalIngredientBonus,
        personalSkillMult,
        f.helpingMult,
        f.ingredientBonus,
        f.skillMult,
        f.effectLabel
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
      simulator.simulate(trials, pokemons, recipeEnergy);

      const avgSkill = simulator.average_skill_count;     // 1日あたり スキル発動数（全体）
      const avgSuccess = simulator.average_success_count; // 1日あたり 料理成功回数
      const avgExtraPerDay = simulator.average_extra_energy; // 1日あたり 追加エナジー（全体）
      const perDay = simulator.average_extra_energies_per_day;

      const avgBerryEnergies = simulator.average_berry_energies; // ポケモン別 きのみエナジー
      const avgSkillEnergies = simulator.average_skill_energies; // ポケモン別 スキルエナジー
      const avgSkillCounts = simulator.average_skill_counts;     // ポケモン別 スキル発動数

      const perPokemonExtraPerDay =
        pokemons.length > 0 ? avgExtraPerDay / pokemons.length : 0;

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
        text += `  個別おてつだいスピード倍率: ${pkm.personal_helping_speed_multiplier.toFixed(2)} 倍\n`;
        text += `  個別食材ボーナス: +${pkm.personal_ingredient_bonus} 個\n`;
        text += `  個別スキル確率倍率: ${pkm.personal_skill_multiplier.toFixed(2)} 倍\n`;
      });
      text += `\nレシピのエネルギー値: ${recipeEnergy}\n`;
      text += `試行回数: ${trials}\n\n`;
      text += `月曜日の朝の料理大成功確率: ${day1ChancePercent.toFixed(1)} %\n`;
      text += `キャンプチケット: ${useCampTicket ? "使用する" : "使用しない"}\n`;
      if (useCampTicket) {
        text += `  おてつだいスピード倍率: ${campTicketConfig.helpingMult} 倍\n`;
        text += `  所持数倍率: ${campTicketConfig.inventoryBonus} 倍\n`;
      }

      const fieldLabel = Fields[fieldKey]?.label || fieldKey;
      text += `\n=== フィールド＆イベント補正設定 ===\n`;
      text += `フィールド ${fieldLabel}\n`;
      text += `  メインタイプ: ${fieldConfig.mainType}\n`;
      text += `  サブタイプ1: ${fieldConfig.sub1Type}\n`;
      text += `  サブタイプ2: ${fieldConfig.sub2Type}\n`;
      if (fieldKey === "wakakusa_ex") {
        text += `  EXフィールド補正: ${ExEffectLabels[fieldConfig.exEffect] || "補正なし"}\n`;
      }
      text += `イベント補正:\n`;
      text += `  おてつだいスピード倍率: ${helpingSpeedMultiplier.toFixed(2)} 倍\n`;
      text += `  食材数ボーナス: +${ingredientBonus} 個\n`;
      text += `  スキル確率倍率: ${skillEventMultiplier.toFixed(2)} 倍\n`;
      text += `  料理エナジー倍率: ${energyEventMultiplier.toFixed(2)} 倍\n\n`;

      text += "=== ポケモン最終ステータス ===\n";
      pokemons.forEach((pkm, idx) => {
        const n = idx + 1;
        text += `[ポケモン${n}] ${pkm.pokemon_data.name}\n`;
        text += `  おてつだい時間: ${pkm.helping_speed} 秒\n`;
        text += `    おてつだいスピード倍率: ${(pkm.personal_helping_speed_multiplier * pkm.team_helping_speed_multiplier * pkm.ex_helping_speed_multiplier * pkm.camp_ticket_helping_speed_multiplier).toFixed(2)} 倍\n`;
        text += `    補正後: ${pkm.helping_speed * 0.45 / (pkm.personal_helping_speed_multiplier * pkm.team_helping_speed_multiplier * pkm.ex_helping_speed_multiplier * pkm.camp_ticket_helping_speed_multiplier)} 秒 (げんき81%↑)\n`;
        text += `  食材確率: ${(pkm.ingredient_probability * 100).toFixed(2)} %\n`;
        text += `    食材ボーナス: +${pkm.personal_ingredient_bonus + pkm.team_ingredient_bonus + pkm.ex_ingredient_bonus} 個\n`;
        text += `  スキル確率: ${(pkm.pokemon_data.skill_probability * 100).toFixed(2)} %\n`;
        text += `    スキル確率倍率: ${(pkm.personal_skill_multiplier * pkm.team_skill_multiplier * pkm.ex_skill_multiplier).toFixed(2)} 倍\n`;
        text += `    補正後: ${(pkm.skill_probability * 100).toFixed(2)} %\n`;
        text += `  所持数: ${pkm.inventory_limit}`;
        if (pkm.inventory_limit_bonus > 0) {
          text += `(いいキャンプチケット効果を含む)`;
        }
        text += `\n`;
        text += `  きのみの数: ${pkm.berry_num}\n`;
        text += `    きのみエナジー倍率: ${pkm.berry_energy_multiplier.toFixed(2)} 倍\n`;
        text += `  メインスキル効果: ${pkm.skill_effect * 100} %\n`;
        text += `  EXフィールド補正: ${pkm.ex_effect_label}\n\n`;

        text += `  1日あたり:\n`;
        text += `  きのみエナジー: ${avgBerryEnergies[idx].toFixed(3)}\n`;
        text += `  スキル発動回数: ${avgSkillCounts[idx].toFixed(3)} 回\n`;
        text += `  スキルエナジー: ${avgSkillEnergies[idx].toFixed(3)}\n\n`;
      });

      text += "\n=== シミュレーション結果（1週間 × 試行回数の平均） ===\n";
      text += "1日あたり\n"
      text += `  平均スキル発動数: ${avgSkill.toFixed(3)} 回\n`;
      text += `  平均料理大成功回数: ${avgSuccess.toFixed(3)} 回\n`;
      text += `  平均追加エナジー: ${avgExtraPerDay.toFixed(3)}\n`;
      text += `    1匹あたり: ${perPokemonExtraPerDay.toFixed(3)}\n\n`;

      text += "曜日別の平均追加エナジー:\n";
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
