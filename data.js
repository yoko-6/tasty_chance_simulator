(() => {
  const PS = window.PSleepSim;

  // ====== 基本データ定義 ======

  PS.Type = {
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

  PS.Berries = {
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
    Pecha: new Berry("モモンのみ", 26),
  };

  // フィールド定義
  PS.Fields = {
    wakakusa: { key: "wakakusa", label: "ワカクサ本島", types: null, isEx: false },
    cyan: { key: "cyan", label: "シアンの砂浜", types: [PS.Type.Water, PS.Type.Fairy, PS.Type.Flying], isEx: false },
    taupe: { key: "taupe", label: "トープ洞窟", types: [PS.Type.Ground, PS.Type.Fire, PS.Type.Rock], isEx: false },
    unohana: { key: "unohana", label: "ウノハナ雪原", types: [PS.Type.Ice, PS.Type.Normal, PS.Type.Dark], isEx: false },
    lapis: { key: "lapis", label: "ラピスラズリ湖畔", types: [PS.Type.Grass, PS.Type.Psychic, PS.Type.Fighting], isEx: false },
    gold: { key: "gold", label: "ゴールド旧発電所", types: [PS.Type.Electric, PS.Type.Ghost, PS.Type.Steel], isEx: false },
    amber: { key: "amber", label: "アンバー渓谷", types: [PS.Type.Poison, PS.Type.Bug, PS.Type.Dragon], isEx: false },
    wakakusa_ex: { key: "wakakusa_ex", label: "ワカクサ本島EX", types: null, isEx: true },
  };

  PS.Specialty = {
    Berries: "きのみとくい",
    Ingredients: "食材とくい",
    Skills: "スキルとくい",
  };

  class SubSkill {
    constructor(key, name, helping_speed, ingredient_probability, skill_probability, inventory_up, berry_finding) {
      this.key = key;
      this.name = name;
      this.helping_speed = helping_speed;
      this.ingredient_probability = ingredient_probability;
      this.skill_probability = skill_probability;
      this.inventory_up = inventory_up;
      this.berry_finding = berry_finding;
    }
  }

  PS.SubSkills = {
    SkillTriggerM: new SubSkill("SkillTriggerM", "スキル確率アップM", 0.0, 0.0, 0.36, 0, 0),
    SkillTriggerS: new SubSkill("SkillTriggerS", "スキル確率アップS", 0.0, 0.0, 0.18, 0, 0),
    HelpingSpeedM: new SubSkill("HelpingSpeedM", "おてつだいスピードM", 0.14, 0.0, 0.0, 0, 0),
    HelpingSpeedS: new SubSkill("HelpingSpeedS", "おてつだいスピードS", 0.07, 0.0, 0.0, 0, 0),
    HelpingBonus: new SubSkill("HelpingBonus", "おてつだいボーナス", 0.05, 0.0, 0.0, 0, 0),
    BerryFindingS: new SubSkill("BerryFindingS", "きのみの数S", 0.0, 0.0, 0.0, 0, 1),
    IngredientFinderM: new SubSkill("IngredientFinderM", "食材確率アップM", 0.0, 0.36, 0.0, 0, 0),
    IngredientFinderS: new SubSkill("IngredientFinderS", "食材確率アップS", 0.0, 0.18, 0.0, 0, 0),
    InventoryUpL: new SubSkill("InventoryUpL", "最大確率アップL", 0.0, 0.0, 0.0, 18, 0),
    InventoryUpM: new SubSkill("InventoryUpM", "最大確率アップM", 0.0, 0.0, 0.0, 12, 0),
    InventoryUpS: new SubSkill("InventoryUpS", "最大確率アップS", 0.0, 0.0, 0.0, 6, 0),
  };

  class Nature {
    constructor(key, name, helping_speed_coefficient, ingredient_probability_coefficient, skill_probability_coefficient) {
      this.key = key;
      this.name = name;
      this.helping_speed_coefficient = helping_speed_coefficient;
      this.ingredient_probability_coefficient = ingredient_probability_coefficient;
      this.skill_probability_coefficient = skill_probability_coefficient;
    }
  }

  PS.Natures = {
    Adamant: new Nature("Adamant", "いじっぱり", 0.9, 0.8, 1.0),
    Lonely: new Nature("Lonely", "さみしがり", 0.9, 1.0, 1.0),
    Naughty: new Nature("Naughty", "やんちゃ", 0.9, 1.0, 0.8),
    Brave: new Nature("Brave", "ゆうかん", 0.9, 1.0, 1.0),

    Calm: new Nature("Calm", "おだやか", 1.075, 1.0, 1.2),
    Gentle: new Nature("Gentle", "おとなしい", 1.0, 1.0, 1.2),
    Careful: new Nature("Careful", "しんちょう", 1.0, 0.8, 1.2),
    Sassy: new Nature("Sassy", "なまいき", 1.0, 1.0, 1.2),

    Rash: new Nature("Rash", "うっかりや", 1.0, 1.2, 0.8),
    Mild: new Nature("Mild", "おっとり", 1.0, 1.2, 1.0),
    Modest: new Nature("Modest", "ひかえめ", 1.075, 1.2, 1.0),
    Quiet: new Nature("Quiet", "れいせい", 1.0, 1.2, 1.0),

    Timid: new Nature("Timid", "おくびょう", 1.075, 1.0, 1.0),
    Hasty: new Nature("Hasty", "せっかち", 1.0, 1.0, 1.0),
    Naive: new Nature("Naive", "むじゃき", 1.0, 1.0, 0.8),
    Jolly: new Nature("Jolly", "ようき", 1.0, 0.8, 1.0),

    Bold: new Nature("Bold", "ずぶとい", 1.075, 1.0, 1.0),
    Lax: new Nature("Lax", "のうてんき", 1.0, 1.0, 0.8),
    Relaxed: new Nature("Relaxed", "のんき", 1.0, 1.0, 1.0),
    Impish: new Nature("Impish", "わんぱく", 1.0, 0.8, 1.0),

    Hardy: new Nature("Hardy", "がんばりや", 1.0, 1.0, 1.0),
    Quirky: new Nature("Quirky", "きまぐれ", 1.0, 1.0, 1.0),
    Docile: new Nature("Docile", "すなお", 1.0, 1.0, 1.0),
    Bashful: new Nature("Bashful", "てれや", 1.0, 1.0, 1.0),
    Serious: new Nature("Serious", "まじめ", 1.0, 1.0, 1.0),
  };

  PS.NatureUpGroups = [
    { id: "help", label: "おてつだいスピード ▲▲" },
    { id: "ing", label: "食材おてつだい確率 ▲▲" },
    { id: "skill", label: "メインスキル発生確率 ▲▲" },
    { id: "exp", label: "EXP獲得量 ▲▲" },
    { id: "energy", label: "げんき回復量 ▲▲" },
    { id: "none", label: "無補正" },
  ];

  PS.NatureDownGroups = [
    { id: "help", label: "おてつだいスピード ▼▼" },
    { id: "ing", label: "食材おてつだい確率 ▼▼" },
    { id: "skill", label: "メインスキル発生確率 ▼▼" },
    { id: "exp", label: "EXP獲得量 ▼▼" },
    { id: "energy", label: "げんき回復量 ▼▼" },
    { id: "none", label: "無補正" },
  ];

  PS.NatureMeta = {
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
    Serious: { up: "none", down: "none" },
  };

  class MainSkill {
    constructor(name, effects) {
      this.name = name;
      this.effects = effects;
    }
  }

  PS.MainSkills = {
    TastyChanceS: new MainSkill("料理チャンスS", [0.04, 0.05, 0.06, 0.07, 0.08, 0.10]),
  };

  class PokemonData {
    constructor(key, name, type, berry, specialty, helping_speed, ingredient_probability, skill_probability, inventory_limit, main_skill) {
      this.key = key;
      this.name = name;
      this.type = type;
      this.berry = berry;
      this.specialty = specialty;
      this.helping_speed = helping_speed;
      this.ingredient_probability = ingredient_probability;
      this.skill_probability = skill_probability;
      this.inventory_limit = inventory_limit;
      this.main_skill = main_skill;

      this.berry_num = specialty === PS.Specialty.Berries ? 2 : 1;
      this.ingredient_nums = specialty === PS.Specialty.Ingredients ? [2, 5, 7] : [1, 2, 4];
      this.skill_stock_limit = specialty === PS.Specialty.Skills ? 2 : 1;
    }
  }

  PS.PokemonList = {
    dedenne: new PokemonData("dedenne", "デデンネ", PS.Type.Electric, PS.Berries.Grepa, PS.Specialty.Skills, 2500, 0.177, 0.045, 19, PS.MainSkills.TastyChanceS),
    uu: new PokemonData("uu", "ウッウ", PS.Type.Flying, PS.Berries.Pamtre, PS.Specialty.Ingredients, 2700, 0.165, 0.039, 19, PS.MainSkills.TastyChanceS),
    laglarge: new PokemonData("laglarge", "ラグラージ", PS.Type.Ground, PS.Berries.Figy, PS.Specialty.Berries, 2800, 0.146, 0.034, 30, PS.MainSkills.TastyChanceS),
    manyula: new PokemonData("manyula", "マニューラ", PS.Type.Dark, PS.Berries.Wiki, PS.Specialty.Berries, 2700, 0.251, 0.018, 26, PS.MainSkills.TastyChanceS),
  };

  PS.UserEventType = {
    wake_up: "wake_up",
    have_breakfast: "have_breakfast",
    have_lunch: "have_lunch",
    have_dinner: "have_dinner",
    sleep: "sleep",
  };

  PS.ExEffectLabels = {
    "": "補正なし",
    berry: "きのみエナジー2.4倍",
    ingredient: "食材数+1（食材タイプなら50%でさらに+1）",
    skill: "スキル確率1.25倍",
  };

  PS.MAX_SLOTS = 5;
})();
