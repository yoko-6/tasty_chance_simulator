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
        InventoryUpL: new SubSkill("InventoryUpL", "最大所持数アップL", 0.0, 0.0, 0.0, 18, 0),
        InventoryUpM: new SubSkill("InventoryUpM", "最大所持数アップM", 0.0, 0.0, 0.0, 12, 0),
        InventoryUpS: new SubSkill("InventoryUpS", "最大所持数アップS", 0.0, 0.0, 0.0, 6, 0),
    };

    PS.NatureParams = [
        { id: "help", baseLabel: "おてつだいスピード" },
        { id: "ing", baseLabel: "食材おてつだい確率" },
        { id: "skill", baseLabel: "メインスキル発生確率" },
        { id: "exp", baseLabel: "EXP獲得量" },
        { id: "energy", baseLabel: "げんき回復量" },
        { id: "none", baseLabel: "無補正" },
    ];
    PS.NatureParamById = Object.fromEntries(PS.NatureParams.map(x => [x.id, x]));

    class NatureEffectTable {
        constructor() {
            this.help = { up: 0.9, down: 1.075 };
            this.ing = { up: 1.2, down: 0.8 };
            this.skill = { up: 1.2, down: 0.8 };
        }
        coeffs(up, down) {
            let help = 1.0, ing = 1.0, skill = 1.0;
            if (up === "help") help *= this.help.up;
            if (down === "help") help *= this.help.down;
            if (up === "ing") ing *= this.ing.up;
            if (down === "ing") ing *= this.ing.down;
            if (up === "skill") skill *= this.skill.up;
            if (down === "skill") skill *= this.skill.down;
            return { help, ing, skill };
        }
    }
    PS.NatureEffects = new NatureEffectTable();

    class Nature {
        constructor(key, name, up, down) {
            this.key = key;
            this.name = name;
            this.up = up || "none";
            this.down = down || "none";
            this._coeff = PS.NatureEffects.coeffs(this.up, this.down);
            this.helping_speed_coefficient = this._coeff.help;
            this.ingredient_probability_coefficient = this._coeff.ing;
            this.skill_probability_coefficient = this._coeff.skill;
        }
    }

    PS.Natures = {
        Adamant: new Nature("Adamant", "いじっぱり", "help", "ing"),
        Lonely: new Nature("Lonely", "さみしがり", "help", "energy"),
        Naughty: new Nature("Naughty", "やんちゃ", "help", "skill"),
        Brave: new Nature("Brave", "ゆうかん", "help", "exp"),

        Calm: new Nature("Calm", "おだやか", "skill", "help"),
        Gentle: new Nature("Gentle", "おとなしい", "skill", "energy"),
        Careful: new Nature("Careful", "しんちょう", "skill", "ing"),
        Sassy: new Nature("Sassy", "なまいき", "skill", "exp"),

        Rash: new Nature("Rash", "うっかりや", "ing", "skill"),
        Mild: new Nature("Mild", "おっとり", "ing", "energy"),
        Modest: new Nature("Modest", "ひかえめ", "ing", "help"),
        Quiet: new Nature("Quiet", "れいせい", "ing", "exp"),

        Timid: new Nature("Timid", "おくびょう", "exp", "help"),
        Hasty: new Nature("Hasty", "せっかち", "exp", "energy"),
        Naive: new Nature("Naive", "むじゃき", "exp", "skill"),
        Jolly: new Nature("Jolly", "ようき", "exp", "ing"),

        Bold: new Nature("Bold", "ずぶとい", "energy", "help"),
        Lax: new Nature("Lax", "のうてんき", "energy", "skill"),
        Relaxed: new Nature("Relaxed", "のんき", "energy", "exp"),
        Impish: new Nature("Impish", "わんぱく", "energy", "ing"),

        Hardy: new Nature("Hardy", "がんばりや", "none", "none"),
        Quirky: new Nature("Quirky", "きまぐれ", "none", "none"),
        Docile: new Nature("Docile", "すなお", "none", "none"),
        Bashful: new Nature("Bashful", "てれや", "none", "none"),
        Serious: new Nature("Serious", "まじめ", "none", "none"),
    };

    PS.getNatureCandidates = (up, down) =>
        Object.values(PS.Natures).filter(n => n.up === up && n.down === down);

    PS.describeNatureEffect = (up, down) => {
        const upLabel = up !== "none" ? PS.NatureParamById[up]?.baseLabel : "";
        const downLabel = down !== "none" ? PS.NatureParamById[down]?.baseLabel : "";
        const parts = [];
        if (upLabel) parts.push(`${upLabel}↑`);
        if (downLabel) parts.push(`${downLabel}↓`);
        return parts.length ? parts.join(" / ") : "補正なし";
    };

    PS.createNatureFromUpDown = (up, down, natureKey) => {
        // natureKey は常に存在する前提（"" の場合あり）
        const preferred = natureKey && PS.Natures[natureKey] ? PS.Natures[natureKey] : null;
        if (preferred && preferred.up === up && preferred.down === down) return preferred;
        const hit = PS.getNatureCandidates(up, down)[0];
        if (hit) return hit;
        return new Nature("", "", up, down);
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
