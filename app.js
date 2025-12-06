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
  HelpingBonus: new SubSkill("おてつだいボーナス", 0.05, 0.0, 0.0, 0, 0),
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
    ex_effect_label,                  // EX: 表示用のラベル
    field_energy_multiplier,
  ) {
    this.pokemon_data = pokemon_data;
    this.name = name;
    this.level = level;
    this.sub_skills = sub_skills;
    this.team_sub_skills = team_sub_skills;
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

    // ★ フィールドボーナス（エナジー用）
    this.field_energy_multiplier = Number.isFinite(field_energy_multiplier)
      ? field_energy_multiplier
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

    for (const sub of this.team_sub_skills) {
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
      this.nature.skill_probability_coefficient;

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
    this.total_berry_energy += this.get_berry_energy() * this.berry_num * this.berry_energy_multiplier * this.field_energy_multiplier;
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

    if (Math.random() < this.skill_probability * this.team_skill_multiplier * this.personal_skill_multiplier * this.ex_skill_multiplier) {
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

    this.total_base_energies_per_day = new Array(7).fill(0); // base_chance 由来
    this.total_carry_over_energies_per_day = new Array(7).fill(0); // 持ち越し由来
    this.total_cooking_energies_per_pokemon_per_day = Array.from(
      { length: MAX_SLOTS },
      () => new Array(7).fill(0)
    );
    this.total_berry_energies_per_pokemon_per_day = Array.from(
      { length: MAX_SLOTS },
      () => new Array(7).fill(0)
    );

    this.average_base_energies_per_day = new Array(7).fill(0);
    this.average_carry_over_energies_per_day = new Array(7).fill(0);
    this.average_cooking_energies_per_pokemon_per_day = []; // simulate 内で長さ決定
    this.average_berry_energies_per_pokemon_per_day = [];

    this.chance_limit = 0.7;
    this.base_cooking_chance = 0.1;
    this.first_day_base_success_chance = 0.0;
    this.sunday_chance_bonus = 0.2;
    this.sunday_success_energy_bonus = 1.5;
    this.cooking_energy_event_multiplier = 1.0;
    this.field_energy_multiplier = 1.0;

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
    const base_energies_per_day = new Array(7).fill(0);
    const carry_over_energies_per_day = new Array(7).fill(0);
    const cooking_energies_per_pokemon_per_day = Array.from(
      { length: pokemons.length },
      () => new Array(7).fill(0)
    );
    const berry_energies_per_pokemon_per_day = Array.from(
      { length: pokemons.length },
      () => new Array(7).fill(0)
    );
    let cooking_chance_probability = 0.0;
    let cooking_chance_probabilities = new Array(pokemons.length).fill(0.0);
    let skill_count = 0;
    let success_count = 0;

    let base_cooking_chance = 0.0;
    let carry_over_cooking_chance = this.first_day_base_success_chance;
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

        ret = Math.min(ret, this.chance_limit - cooking_chance_probability - carry_over_cooking_chance);
        cooking_chance_probability += ret;
        cooking_chance_probabilities[nextEvent.idx] += ret;

        pokemon_event_queue.push(
          nextEvent.get_next_event()
        );
      }

      const eventDay = Math.floor((user_event.timestamp - 4 * 3600) / DAY) + 1;
      const dayIndex = eventDay - 1; // 0〜6

      if (user_event.event === UserEventType.wake_up) {
        base_cooking_chance =
          this.base_cooking_chance + (eventDay === 7 ? this.sunday_chance_bonus : 0.0);

        base_cooking_energy =
          recipe_energy *
          this.cooking_energy_event_multiplier *
          (eventDay === 7 ? this.sunday_success_energy_bonus : 1.0) *
          this.field_energy_multiplier;

        if (eventDay === 2) {
          for (let i = 0; i < pokemons.length; i++) {
            berry_energies_per_pokemon_per_day[i][eventDay - 2] = pokemons[i].total_berry_energy;
          }
        }
        else if (eventDay > 2) {
          for (let i = 0; i < pokemons.length; i++) {
            berry_energies_per_pokemon_per_day[i][eventDay - 2] = pokemons[i].total_berry_energy - berry_energies_per_pokemon_per_day[i][eventDay - 3];
          }
        }
      }

      if (eventDay === 8) break;

      if (
        user_event.event === UserEventType.wake_up ||
        user_event.event === UserEventType.sleep
      ) {
        continue;
      }

      let p = Math.random();
      if (p < base_cooking_chance + carry_over_cooking_chance + cooking_chance_probability) {
        success_count += 1;
        extra_energy += base_cooking_energy;
        extra_energies_per_day[dayIndex] += base_cooking_energy;

        if (p < base_cooking_chance) {
          base_energies_per_day[dayIndex] += base_cooking_energy;
        } else if (p < base_cooking_chance + carry_over_cooking_chance) {
          carry_over_energies_per_day[dayIndex] += base_cooking_energy;
        } else {
          // ★ どのポケモンの料理チャンスかを判定
          let total_cooking_chance_probability = base_cooking_chance + carry_over_cooking_chance;
          for (let i = 0; i < pokemons.length; i++) {
            const segEnd = total_cooking_chance_probability + cooking_chance_probabilities[i];
            if (p < segEnd) {
              pokemons[i].total_skill_energy += base_cooking_energy;
              cooking_energies_per_pokemon_per_day[i][dayIndex] += base_cooking_energy;

              break;
            }
            total_cooking_chance_probability = segEnd;
          }
        }

        // リセット
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

      // ★ 料理エナジー（ポケモン別/曜日別）
      for (let d = 0; d < 7; d++) {
        this.total_cooking_energies_per_pokemon_per_day[i][d] +=
          cooking_energies_per_pokemon_per_day[i][d];
        this.total_berry_energies_per_pokemon_per_day[i][d] +=
          berry_energies_per_pokemon_per_day[i][d];
      }
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
      this.average_base_energies_per_day[d] =
        this.total_base_energies_per_day[d] / trial;
      this.average_carry_over_energies_per_day[d] =
        this.total_carry_over_energies_per_day[d] / trial;
    }

    const n = pokemons.length;
    this.average_berry_energies = new Array(n).fill(0);
    this.average_skill_energies = new Array(n).fill(0);
    this.average_skill_counts = new Array(n).fill(0);
    this.average_cooking_energies_per_pokemon_per_day = Array.from(
      { length: n },
      () => new Array(7).fill(0)
    );
    this.average_berry_energies_per_pokemon_per_day = Array.from(
      { length: n },
      () => new Array(7).fill(0)
    );

    for (let i = 0; i < n; i++) {
      this.average_berry_energies[i] =
        this.total_berry_energies[i] / 7.0 / trial;
      this.average_skill_energies[i] =
        this.total_skill_energies[i] / 7.0 / trial;
      this.average_skill_counts[i] =
        this.total_skill_counts[i] / 7.0 / trial;

      for (let d = 0; d < 7; d++) {
        this.average_cooking_energies_per_pokemon_per_day[i][d] =
          this.total_cooking_energies_per_pokemon_per_day[i][d] / trial;
        this.average_berry_energies_per_pokemon_per_day[i][d] =
          this.total_berry_energies_per_pokemon_per_day[i][d] / trial;
      }
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
      <details class="advanced-settings">
        <summary>個別補正</summary>
        <div class="advanced-body">
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
        </div>
      </details>
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

function getNatureEffectDescription(natureName) {
  if (!natureName) return "";

  // 性格名からキーを逆引き
  let natureKey = null;
  for (const [key, nat] of Object.entries(Natures)) {
    if (nat.name === natureName) {
      natureKey = key;
      break;
    }
  }
  if (!natureKey) return "";

  const meta = NatureMeta[natureKey];
  if (!meta || (meta.up === "none" && meta.down === "none")) {
    return "補正なし";
  }

  const findLabel = (id, groups) => {
    const g = groups.find(g => g.id === id);
    if (!g) return "";
    // 「おてつだいスピード ▲▲」→「おてつだいスピード」
    return g.label.replace(/[▲▼]+/g, "").trim();
  };

  const upLabel = meta.up !== "none" ? findLabel(meta.up, NatureUpGroups) : "";
  const downLabel = meta.down !== "none" ? findLabel(meta.down, NatureDownGroups) : "";

  const parts = [];
  if (upLabel) parts.push(`${upLabel} ▲▲`);
  if (downLabel) parts.push(`${downLabel} ▼▼`);

  return parts.length ? parts.join(" / ") : "補正なし";
}

let energyChartInstance = null;

function renderEnergyChart(result) {
  const canvas = document.getElementById("energyChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (energyChartInstance) {
    energyChartInstance.destroy();
    energyChartInstance = null;
  }

  const { summary, pokemons } = result;
  const breakdown = summary.energyBreakdown;
  const labels = ["月", "火", "水", "木", "金", "土", "日"];

  const base = breakdown.basePerDay || new Array(7).fill(0);
  const carryOver = breakdown.carryOverPerDay || new Array(7).fill(0);
  const cookPerPoke = breakdown.cookingPerPokemonPerDay || [];
  const berryPerPoke = breakdown.berryPerPokemonPerDay || [];

  const datasets = [];

  // ベース料理大成功エナジー
  datasets.push({
    id: "base",
    label: "ベース(10%/30%)大成功エナジー",
    data: base,
    type: "bar",
    stack: "energy"
  });

  datasets.push({
    id: "carry-over",
    label: "料理チャンス（週またぎ発動）",
    data: carryOver,
    type: "bar",
    stack: "energy"
  });

  // ポケモンごとの料理エナジー & きのみエナジー
  for (let i = 0; i < pokemons.length; i++) {
    const p = pokemons[i];
    const cook = cookPerPoke[i] || new Array(7).fill(0);
    const berry = berryPerPoke[i] || new Array(7).fill(0);

    datasets.push({
      id: `poke-${p.index}-cook`,
      label: `ポケモン${p.index}（${p.name}）料理チャンス`,
      data: cook,
      type: "bar",
      stack: "energy"
    });

    datasets.push({
      id: `poke-${p.index}-berry`,
      label: `ポケモン${p.index}（${p.name}）きのみ`,
      data: berry,
      type: "bar",
      stack: "energy"
    });
  }

  // 棒の上に合計値を表示するローカルプラグイン
  const totalLabelPlugin = {
    id: "totalLabelPlugin",
    afterDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, data } = chart;
      const xAxis = chart.scales.x;
      const yAxis = chart.scales.y;

      ctx.save();
      ctx.font = '11px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";

      data.labels.forEach((_, index) => {
        let total = 0;
        chart.data.datasets.forEach((ds, dsIndex) => {
          const meta = chart.getDatasetMeta(dsIndex);
          if (meta.hidden || ds.hidden) return;
          const v = ds.data[index];
          if (typeof v === "number" && !Number.isNaN(v)) {
            total += v;
          }
        });

        if (total <= 0) return;

        // x,y 座標を計算（x は一番目のデータセットのバー位置を利用）
        const firstMeta = chart.getDatasetMeta(0);
        const bar = firstMeta.data[index];
        if (!bar) return;

        const x = bar.x;
        const y = yAxis.getPixelForValue(total);

        ctx.fillText(total.toFixed(0), x, y - 3);
      });

      ctx.restore();
    }
  };

  energyChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets
    },
    plugins: [totalLabelPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const label = ctx.dataset.label || "";
              const val = ctx.parsed.y || 0;
              return `${label}: ${val.toFixed(0)}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: "エナジー"
          }
        }
      }
    }
  });

  // チェックボックスで各シリーズの表示・非表示を切り替え
  document
    .querySelectorAll(".energy-series-toggle")
    .forEach((cb) => {
      const id = cb.dataset.seriesId;
      cb.addEventListener("change", () => {
        if (!energyChartInstance) return;
        energyChartInstance.data.datasets.forEach(ds => {
          if (ds.id === id) {
            ds.hidden = !cb.checked;
          }
        });
        energyChartInstance.update();
      });
    });
}

function buildResultHtml(result) {
  const { timestampStr, summary, pokemons, settings } = result;
  const dayLabels = [
    "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"
  ];

  const dayRows = summary.perDayValues
    .map((v, idx) => {
      return `
        <tr>
          <td>${dayLabels[idx]}</td>
          <td>${v.toFixed(3)}</td>
        </tr>
      `;
    })
    .join("");

  const pokemonCards = pokemons
    .map(p => {
      const fieldTags = [];
      if (p.matchesFieldType) fieldTags.push('<span class="tag tag-field-match">好きなきのみ</span>');
      if (p.exEffectLabel && p.isMainType) fieldTags.push('<span class="tag tag-main-type">メインタイプ</span>');
      if (p.exEffectLabel && p.exEffectLabel !== "補正なし") {
        fieldTags.push(`<span class="tag">${p.exEffectLabel}</span>`);
      }

      // 性格補正の説明（ヘッダーの表示用に使うだけ。詳細中身はそのまま）
      const natureEffectText = getNatureEffectDescription(p.natureName);

      // チップ用 1日あたり指標
      const perDayBerry = (p.perDayBerryEnergy ?? 0);
      const perDaySkillEnergy = (p.perDaySkillEnergy ?? 0);
      const perDaySkillCount = (p.perDaySkillCount ?? 0);

      const mainChipsHtml = `
        <div class="pokemon-main-stats">
          <div class="stat-chip-main">
            <span class="chip-label">合計</span>
            <span class="chip-value">${(perDayBerry + perDaySkillEnergy).toFixed(0)}</span>
            <span class="chip-label">エナジー/日</span>
          </div>
          <div class="stat-chip">
            <span class="chip-label">きのみ</span>
            <span class="chip-value">${perDayBerry.toFixed(0)}</span>
            <span class="chip-label">エナジー/日</span>
          </div>
          <div class="stat-chip">
            <span class="chip-label">料理チャンス</span>
            <span class="chip-value">${perDaySkillEnergy.toFixed(0)}</span>
            <span class="chip-label">エナジー/日</span>
          </div>
          <div class="stat-chip">
            <span class="chip-label">スキル発動</span>
            <span class="chip-value">${perDaySkillCount.toFixed(2)}</span>
            <span class="chip-label">回/日</span>
          </div>
        </div>
      `;

      // ★ 詳細情報の中身は「以前のまま」のレイアウト
      const detailsHtml = `
        <details class="pokemon-details">
          <summary>詳細ステータスを見る</summary>
          <div class="pokemon-body-grid">
            <div>
              <div class="pokemon-body-block-title">おてつだい</div>
              <div class="pokemon-body-block-row">
                おてつだい時間: ${p.helpBase} 秒
              </div>
              <div class="pokemon-body-block-row">
                個別・全体補正: ${p.helpTotalMult.toFixed(2)} 倍
              </div>
              <div class="pokemon-body-block-row">
                補正後: ${p.helpEffectiveTime.toFixed(1)} 秒
              </div>
              <div class="pokemon-body-block-row">
                所持数: ${p.inventoryLimit}
              </div>
            </div>
            <div>
              <div class="pokemon-body-block-title">きのみ・食材</div>
              <div class="pokemon-body-block-row">
                食材確率: ${(p.ingredientProb * 100).toFixed(2)} %
              </div>
              <div class="pokemon-body-block-row">
                食材ボーナス合計: +${p.ingredientBonusTotal} 個
              </div>
              <div class="pokemon-body-block-row">
                きのみの数: ${p.berryNum}
              </div>
              <div class="pokemon-body-block-row">
                きのみエナジー倍率: ${p.berryEnergyMultiplier.toFixed(2)} 倍
              </div>
            </div>
          </div>
          <div class="pokemon-body-grid" style="margin-top:1rem;">
            <div>
              <div class="pokemon-body-block-title">スキル</div>
              <div class="pokemon-body-block-row">
                スキル確率: ${(p.skillBaseProb * 100).toFixed(2)} %
              </div>
              <div class="pokemon-body-block-row">
                個別・全体補正: ${p.skillMultTotal.toFixed(2)} 倍
              </div>
              <div class="pokemon-body-block-row">
                補正後: ${(p.skillFinalProb * 100).toFixed(2)} %
              </div>
              <div class="pokemon-body-block-row">
                メインスキル効果: ${p.skillEffectPercent.toFixed(1)} %
              </div>
            </div>
            <div>
              <div class="pokemon-body-block-title">1日あたりの寄与</div>
              <div class="pokemon-body-block-row">
                きのみエナジー: ${p.perDayBerryEnergy.toFixed(3)}
              </div>
              <div class="pokemon-body-block-row">
                スキル発動回数: ${p.perDaySkillCount.toFixed(3)} 回
              </div>
              <div class="pokemon-body-block-row">
                スキルエナジー: ${p.perDaySkillEnergy.toFixed(3)}
              </div>
            </div>
          </div>
          <div class="pokemon-body-block-row" style="margin-top:1rem;">
            サブスキル: ${p.subSkillsLabel}
          </div>
          <div class="pokemon-body-block-row">
            サブスキル(他ポケモンの効果): ${p.teamSubSkillsLabel}
          </div>
          <div class="pokemon-body-block-row">
            個別補正: おてつだい×${p.personal.helpMult.toFixed(2)} ／ 食材+${p.personal.ingBonus} ／ スキル×${p.personal.skillMult.toFixed(2)}
          </div>
        </details>
      `;

      return `
        <div class="pokemon-card">
          <div class="pokemon-card-header">
            <div>
              <div class="pokemon-title">ポケモン${p.index}: ${p.name}</div>
              <div class="pokemon-sub">
                タイプ: ${p.type || "-"} ／ Lv${p.level} ／ 性格: ${p.natureName}
                ${natureEffectText && natureEffectText !== "補正なし"
          ? `（${natureEffectText}）`
          : ""
        }
              </div>
              <div class="pokemon-sub">サブスキル: ${p.subSkillsLabel || "なし"}
              </div>
            </div>
            <div class="pokemon-tags">
              ${fieldTags.join("")}
            </div>
          </div>
          ${mainChipsHtml}
          ${detailsHtml}
        </div>
      `;
    })
    .join("");

  const field = settings.field;
  const ev = settings.events;
  const sched = settings.schedule;

  const fieldExText = field.key === "wakakusa_ex"
    ? (field.exEffectLabel || "補正なし")
    : "なし";

  const fieldBonusPercentText =
    field.fieldBonusPercent != null
      ? field.fieldBonusPercent.toFixed(1)
      : (field.fieldEnergyMultiplier != null
        ? (field.fieldEnergyMultiplier * 100).toFixed(1)
        : "100.0");

  return `
    <div class="result-container">
      <!-- 料理・エナジー結果（棒グラフ） -->
      <section class="result-section">
        <div class="result-section-header">
          <div class="result-section-title">料理・エナジー結果</div>
          <div class="result-section-sub">実行日時: ${timestampStr}</div>
        </div>

        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-label">料理大成功</div>
            <div class="stat-value">
              ${summary.avgSuccess.toFixed(2)}<span class="stat-unit">回/日</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">料理大成功による増加</div>
            <div class="stat-value">
              ${summary.avgExtraPerDay.toFixed(0)}<span class="stat-unit">エナジー/日</span>
            </div>
          </div>
        </div>
        <div class="stat-grid" style="margin-top:0.5rem;">
          <div class="stat-card">
            <div class="stat-label">料理チャンス（全体）</div>
            <div class="stat-value">
              ${summary.avgSkill.toFixed(2)}<span class="stat-unit">回/日</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-label">料理チャンス(1匹あたり)</div>
            <div class="stat-value">
              ${summary.perPokemonExtraPerDay.toFixed(0)}<span class="stat-unit">エナジー/日</span>
            </div>
          </div>
        </div>

        <!-- 表示切り替えチェックボックス -->
        <div class="result-section-sub" style="margin:0.2rem;">表示切り替えボタン</div>
        <div class="energy-toggle-group" style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.2rem;">
          <label class="inline">
            <input type="checkbox" class="energy-series-toggle" data-series-id="base" checked />
            ベース料理大成功(10%/30%)
          </label>
          <label class="inline">
            <input type="checkbox" class="energy-series-toggle" data-series-id="carry-over" checked />
            料理チャンス(週またぎ発動)
          </label>
        </div>
          ${pokemons
      .map(
        p => `
              <div class="energy-toggle-group" style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.2rem;">
                <label class="inline">
                  <input
                    type="checkbox"
                    class="energy-series-toggle"
                    data-series-id="poke-${p.index}-cook"
                    checked
                  />
                  ポケモン${p.index}（${p.name}）料理チャンス
                </label>
                <label class="inline">
                  <input
                    type="checkbox"
                    class="energy-series-toggle"
                    data-series-id="poke-${p.index}-berry"
                    checked
                  />
                  ポケモン${p.index}（${p.name}）きのみ
                </label>
              </div>
              `
      )
      .join("")}

        <div style="width:100%; overflow-x:auto;">
          <div style="min-width:280px; height:240px;">
            <canvas id="energyChart"></canvas>
          </div>
        </div>
      </section>

      <section class="result-section">
        <div class="result-section-header">
          <div class="result-section-title">ポケモン別の結果</div>
        </div>
        ${pokemonCards}
      </section>

      <section class="result-section">
        <div class="result-section-header">
          <div class="result-section-title">入力パラメータ</div>
        </div>
        <div class="input-grid">
          <div class="input-block">
            <div class="input-block-title">共通設定</div>
            <div class="input-block-row">レシピエナジー: ${settings.recipeEnergy}</div>
            <div class="input-block-row">試行回数: ${settings.trials}</div>
            <div class="input-block-row">月曜朝の大成功確率: ${settings.day1ChancePercent.toFixed(1)} %</div>
            <div class="input-block-row">キャンプチケット: ${settings.useCampTicket ? "使用する" : "使用しない"}</div>
          </div>
          <div class="input-block">
            <div class="input-block-title">フィールド設定</div>
            <div class="input-block-row">フィールド: ${field.label}</div>
            <div class="input-block-row">メインタイプ: ${field.mainType || "-"}</div>
            <div class="input-block-row">サブタイプ1: ${field.sub1Type || "-"}</div>
            <div class="input-block-row">サブタイプ2: ${field.sub2Type || "-"}</div>
            <div class="input-block-row">EX補正: ${fieldExText}</div>
            <div class="input-block-row">フィールドボーナス: ${fieldBonusPercentText} %</div>
          </div>
        </div>
        <div class="input-grid">
          <div class="input-block">
            <div class="input-block-title">イベント補正</div>
            <div class="input-block-row">おてつだいスピード倍率: ${ev.helpingSpeedMultiplier.toFixed(2)} 倍</div>
            <div class="input-block-row">食材数ボーナス: +${ev.ingredientBonus} 個</div>
            <div class="input-block-row">スキル確率倍率: ${ev.skillEventMultiplier.toFixed(2)} 倍</div>
            <div class="input-block-row">料理エナジー倍率: ${ev.energyEventMultiplier.toFixed(2)} 倍</div>
          </div>
          <div class="input-block">
            <div class="input-block-title">生活スケジュール</div>
            <div class="input-block-row">起床: ${sched.wake}</div>
            <div class="input-block-row">朝食: ${sched.breakfast}</div>
            <div class="input-block-row">昼食: ${sched.lunch}</div>
            <div class="input-block-row">夕食: ${sched.dinner}</div>
            <div class="input-block-row">就寝: ${sched.sleep}</div>
          </div>
        </div>
      </section>
    </div>
  `;
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

  const howtoCard = document.getElementById("howtoCard");
  const howtoHeader = document.getElementById("howtoHeader");

  if (howtoCard && howtoHeader) {
    // 最初は閉じておく
    howtoCard.classList.add("collapsed");

    howtoHeader.addEventListener("click", () => {
      howtoCard.classList.toggle("collapsed");
    });
  }

  const runBtn = document.getElementById("runBtn");
  const statusEl = document.getElementById("status");
  const outputEl = document.getElementById("output");

  const prevResultBtn = document.getElementById("prevResultBtn");
  const nextResultBtn = document.getElementById("nextResultBtn");
  const resultPageInfo = document.getElementById("resultPageInfo");

  const STORAGE_KEY_RESULTS = "sleepSimResults_v1";

  // 古い順に 0,1,2,...  最新が末尾になる
  let resultHistory = [];
  let resultIndex = -1;

  function loadResultsFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RESULTS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (e) {
      console.warn("結果履歴の復元に失敗しました:", e);
      return [];
    }
  }

  function saveResultsToStorage() {
    try {
      // 必要であれば「最新◯件だけ残す」などのロジックもここに書けます
      localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(resultHistory));
    } catch (e) {
      console.warn("結果履歴の保存に失敗しました:", e);
    }
  }

  function clearResultHistory() {
    resultHistory = [];
    resultIndex = -1;
    try {
      localStorage.removeItem(STORAGE_KEY_RESULTS);
    } catch (e) {
      console.warn("結果履歴の削除に失敗しました:", e);
    }
    renderCurrentResult();
  }

  function renderCurrentResult() {
    if (resultIndex < 0 || resultIndex >= resultHistory.length) {
      outputEl.innerHTML = "";
      if (resultPageInfo) {
        resultPageInfo.textContent = "結果はまだありません";
      }
      if (prevResultBtn) prevResultBtn.disabled = true;
      if (nextResultBtn) nextResultBtn.disabled = true;

      const clearHistoryBtn = document.getElementById("clearHistoryBtn");
      if (clearHistoryBtn) clearHistoryBtn.disabled = true;

      return;
    }

    const current = resultHistory[resultIndex];
    outputEl.innerHTML = buildResultHtml(current);
    renderEnergyChart(current);

    const currentPage = resultIndex + 1;
    const totalPages = resultHistory.length;
    if (resultPageInfo) {
      resultPageInfo.textContent = `結果 ${currentPage} / ${totalPages}（最新: ${totalPages}）`;
    }

    if (prevResultBtn) prevResultBtn.disabled = (resultIndex <= 0);
    if (nextResultBtn) nextResultBtn.disabled = (resultIndex >= totalPages - 1);

    const clearHistoryBtn = document.getElementById("clearHistoryBtn");
    if (clearHistoryBtn) clearHistoryBtn.disabled = (totalPages === 0);
  }

  if (prevResultBtn) {
    prevResultBtn.addEventListener("click", () => {
      // 1つ前（番号が小さい＝古い結果）へ
      if (resultIndex > 0) {
        resultIndex -= 1;
        renderCurrentResult();
      }
    });
  }

  if (nextResultBtn) {
    nextResultBtn.addEventListener("click", () => {
      // 1つ後（番号が大きい＝新しい結果）へ
      if (resultIndex < resultHistory.length - 1) {
        resultIndex += 1;
        renderCurrentResult();
      }
    });
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
      if (!resultHistory.length) return;

      const ok = window.confirm("シミュレーション履歴をすべて削除しますか？");
      if (!ok) return;

      clearResultHistory();
      statusEl.textContent = "履歴をクリアしました";
    });
  }

  // ページ読み込み時に履歴を復元
  const stored = loadResultsFromStorage();
  if (stored.length > 0) {
    resultHistory = stored;
    resultIndex = resultHistory.length - 1;  // 一番新しい結果を表示
  } else {
    resultHistory = [];
    resultIndex = -1;
  }

  renderCurrentResult();

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

    const fieldBonusPercentInput = Number(
      document.getElementById("fieldBonus").value || "0"
    );
    const fieldBonusPercent = Math.max(0, fieldBonusPercentInput || 0);
    const fieldEnergyMultiplier = 1.0 + fieldBonusPercent / 100.0;

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

    const slotConfigs = [];   // ← ここに一旦すべての情報を入れる

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

      slotConfigs.push({
        slotIndex: i,
        subSkills,
        selectedPokemonKey,
        level,
        skillLevel,
        natureKey,
        personalHelpMult,
        personalSkillMult,
        personalIngredientBonus,
      });
    }

    if (hasError) {
      statusEl.textContent = "入力エラーがあります。各ポケモンのサブスキルを確認してください。";
      return;
    }
    if (slotConfigs.length === 0) {
      statusEl.textContent = "少なくとも 1 匹は表示されたポケモンを使ってください。";
      return;
    }

    // チーム全体のおてつだいボーナス数
    const teamHelpingBonusCount = slotConfigs.reduce((cnt, cfg) => {
      const selfCount = cfg.subSkills.filter(s => s === SubSkills.HelpingBonus).length;
      return cnt + selfCount;
    }, 0);

    const pokemons = slotConfigs.map(cfg => {
      const pokemonData = PokemonList[cfg.selectedPokemonKey];
      const nature = Natures[cfg.natureKey];
      const pokemonName = `${pokemonData.name}${cfg.slotIndex}`;

      const f = getFieldEffectForType(pokemonData.type, fieldConfig);

      // 自分が元々持っているおてつだいボーナスの数
      const selfHelpingBonusCount = cfg.subSkills.filter(
        s => s === SubSkills.HelpingBonus
      ).length;

      // ★「チーム合計」と「自分の個数」の差だけ追加する
      const extraHelpingBonus = Math.max(0, teamHelpingBonusCount - selfHelpingBonusCount);

      const teamSubSkills = [];
      for (let k = 0; k < extraHelpingBonus; k++) {
        teamSubSkills.push(SubSkills.HelpingBonus);
      }

      return new Pokemon(
        pokemonData,
        pokemonName,
        cfg.level,
        cfg.subSkills,
        teamSubSkills,
        nature,
        cfg.skillLevel,
        f.berryEnergyMult,
        campTicketConfig.helpingMult,
        campTicketConfig.inventoryBonus,
        helpingSpeedMultiplier,
        ingredientBonus,
        skillEventMultiplier,
        cfg.personalHelpMult,
        cfg.personalIngredientBonus,
        cfg.personalSkillMult,
        f.helpingMult,
        f.ingredientBonus,
        f.skillMult,
        f.effectLabel
      );
    });

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

    simulator.field_energy_multiplier = fieldEnergyMultiplier;

    // 時刻設定を検証して simulator に反映
    if (!applyScheduleFromUI(simulator)) {
      statusEl.textContent = "時間設定にエラーがあります。";
      return;
    }

    runBtn.disabled = true;
    statusEl.textContent = `シミュレーション中…（試行回数: ${trials}）`;

    setTimeout(() => {
      simulator.simulate(trials, pokemons, recipeEnergy);

      const avgSkill = simulator.average_skill_count;
      const avgSuccess = simulator.average_success_count;
      const avgExtraPerDay = simulator.average_extra_energy;
      const perDay = simulator.average_extra_energies_per_day;

      const avgBerryEnergies = simulator.average_berry_energies;
      const avgSkillEnergies = simulator.average_skill_energies;
      const avgSkillCounts = simulator.average_skill_counts;

      const baseEnergyPerDay = simulator.average_base_energies_per_day.slice();
      const carryOverEnergyPerDay = simulator.average_carry_over_energies_per_day.slice();

      const baseAvgPerDay = baseEnergyPerDay.reduce((sum, v) => sum + v, 0) / baseEnergyPerDay.length;
      const carryAvgPerDay = carryOverEnergyPerDay.reduce((sum, v) => sum + v, 0) / carryOverEnergyPerDay.length;

      const perPokemonExtraPerDay =
        pokemons.length > 0
          ? Math.max(0, (avgExtraPerDay - baseAvgPerDay - carryAvgPerDay) / pokemons.length)
          : 0;

      const cookingEnergyPerPokemonPerDay = pokemons.map((_, idx) =>
        simulator.average_cooking_energies_per_pokemon_per_day[idx].slice()
      );

      const berryEnergyPerPokemonPerDay = pokemons.map((_, idx) =>
        simulator.average_berry_energies_per_pokemon_per_day[idx].slice()
      );

      const now = new Date();
      const timestampStr = now.toLocaleString("ja-JP");

      // 入力値の再取得（スケジュール表示用）
      const sched = {
        wake: document.getElementById("wakeTime").value,
        breakfast: document.getElementById("breakfastTime").value,
        lunch: document.getElementById("lunchTime").value,
        dinner: document.getElementById("dinnerTime").value,
        sleep: document.getElementById("sleepTime").value
      };

      const fieldLabel = Fields[fieldKey]?.label || fieldKey;

      // ▼ 結果オブジェクトを作成
      const result = {
        timestampStr,
        summary: {
          avgSkill,
          avgSuccess,
          avgExtraPerDay,
          perPokemonExtraPerDay,
          perDayValues: perDay,
          energyBreakdown: {
            basePerDay: baseEnergyPerDay,
            carryOverPerDay: carryOverEnergyPerDay,
            cookingPerPokemonPerDay: cookingEnergyPerPokemonPerDay,
            berryPerPokemonPerDay: berryEnergyPerPokemonPerDay
          }
        },
        pokemons: pokemons.map((pkm, idx) => {
          const totalHelpMult =
            pkm.personal_helping_speed_multiplier *
            pkm.team_helping_speed_multiplier *
            pkm.ex_helping_speed_multiplier *
            pkm.camp_ticket_helping_speed_multiplier;

          const helpEffectiveTime = pkm.helping_speed / totalHelpMult;

          const totalIngBonus =
            pkm.personal_ingredient_bonus +
            pkm.team_ingredient_bonus +
            pkm.ex_ingredient_bonus;

          const baseSkillProb = pkm.skill_probability;
          const skillMultTotal =
            pkm.personal_skill_multiplier *
            pkm.team_skill_multiplier *
            pkm.ex_skill_multiplier;
          const finalSkillProb = pkm.skill_probability * pkm.personal_skill_multiplier * pkm.team_skill_multiplier * pkm.ex_skill_multiplier;

          // フィールド一致情報（表示用）
          const fInfo = getFieldEffectForType(pkm.pokemon_data.type, fieldConfig);

          return {
            index: idx + 1,
            name: pkm.pokemon_data.name,
            type: pkm.pokemon_data.type,
            level: pkm.level,
            skillLevel: pkm.skill_level,
            natureName: pkm.nature.name,
            berryName: pkm.pokemon_data.berry.name,
            berryNum: pkm.berry_num,
            berryEnergyMultiplier: pkm.berry_energy_multiplier,
            helpBase: pkm.helping_speed,
            helpTotalMult: totalHelpMult,
            helpEffectiveTime,
            ingredientProb: pkm.ingredient_probability,
            ingredientBonusTotal: totalIngBonus,
            skillBaseProb: baseSkillProb,
            skillMultTotal,
            skillFinalProb: finalSkillProb,
            skillEffectPercent: pkm.skill_effect * 100,
            inventoryLimit: pkm.inventory_limit,
            exEffectLabel: pkm.ex_effect_label,
            perDayBerryEnergy: avgBerryEnergies[idx],
            perDaySkillCount: avgSkillCounts[idx],
            perDaySkillEnergy: avgSkillEnergies[idx],
            subSkillsLabel:
              pkm.sub_skills.length > 0
                ? pkm.sub_skills.map(s => s.name).join(", ")
                : "なし",
            teamSubSkillsLabel:
              pkm.team_sub_skills.length > 0
                ? pkm.team_sub_skills.map(s => s.name).join(", ")
                : "なし",
            personal: {
              helpMult: pkm.personal_helping_speed_multiplier,
              ingBonus: pkm.personal_ingredient_bonus,
              skillMult: pkm.personal_skill_multiplier
            },
            matchesFieldType: fInfo.matchesFieldType,
            isMainType: (fInfo.isMainType && fieldKey === "wakakusa_ex")
          };
        }),
        settings: {
          recipeEnergy,
          trials,
          day1ChancePercent,
          useCampTicket,
          campTicket: campTicketConfig,
          schedule: sched,
          field: {
            key: fieldKey,
            label: fieldLabel,
            mainType: fieldConfig.mainType,
            sub1Type: fieldConfig.sub1Type,
            sub2Type: fieldConfig.sub2Type,
            exEffect: fieldConfig.exEffect,
            exEffectLabel: ExEffectLabels[fieldConfig.exEffect] || "",
            fieldBonusPercent,
            fieldEnergyMultiplier
          },
          events: {
            helpingSpeedMultiplier,
            ingredientBonus,
            skillEventMultiplier,
            energyEventMultiplier
          }
        }
      };

      resultHistory.push(result);
      resultIndex = resultHistory.length - 1;

      saveResultsToStorage();
      renderCurrentResult();

      statusEl.textContent = "シミュレーション完了";
      runBtn.disabled = false;
    }, 10);
  });
});
