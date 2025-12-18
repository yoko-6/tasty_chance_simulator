(() => {
    const PS = window.PSleepSim;

    const safeJsonParse = (raw) => {
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    };

    const loadSchemaArray = (key, schemaVersion, arrayKey) => {
        const raw = localStorage.getItem(key);
        if (!raw) return [];

        const parsed = safeJsonParse(raw);
        if (!parsed || typeof parsed !== "object") {
            localStorage.removeItem(key);
            return [];
        }

        if (parsed.schemaVersion !== schemaVersion || !Array.isArray(parsed[arrayKey])) {
            localStorage.removeItem(key);
            return [];
        }

        return parsed[arrayKey];
    };

    const saveSchemaArray = (key, schemaVersion, arrayKey, arr) => {
        try {
            localStorage.setItem(key, JSON.stringify({ schemaVersion, [arrayKey]: arr }));
        } catch (e) {
            console.warn(`failed to save ${key}`, e);
        }
    };

    // ★ 追加：オブジェクト（UIキャッシュなど）用
    const loadSchemaObject = (key, schemaVersion, objectKey) => {
        const raw = localStorage.getItem(key);
        if (!raw) return {};

        const parsed = safeJsonParse(raw);
        if (!parsed || typeof parsed !== "object") {
            localStorage.removeItem(key);
            return {};
        }

        const obj = parsed[objectKey];
        const ok = parsed.schemaVersion === schemaVersion && obj && typeof obj === "object" && !Array.isArray(obj);
        if (!ok) {
            localStorage.removeItem(key);
            return {};
        }

        return obj;
    };

    const saveSchemaObject = (key, schemaVersion, objectKey, obj) => {
        try {
            localStorage.setItem(key, JSON.stringify({ schemaVersion, [objectKey]: obj }));
        } catch (e) {
            console.warn(`failed to save ${key}`, e);
        }
    };

    // ====== Pokemon Presets ======
    const POKEMON_BOX_SCHEMA_VERSION = 3;
    const POKEMON_BOX_STORAGE_KEY = "psleep_sim_pokemon_box";

    const loadPokemonPresets = () => loadSchemaArray(POKEMON_BOX_STORAGE_KEY, POKEMON_BOX_SCHEMA_VERSION, "presets");
    const savePokemonPresets = (presets) => saveSchemaArray(POKEMON_BOX_STORAGE_KEY, POKEMON_BOX_SCHEMA_VERSION, "presets", presets);

    // ====== Result History ======
    const HISTORY_SCHEMA_VERSION = 3;
    const HISTORY_STORAGE_KEY = "psleep_sim_result_history";

    const loadResultHistory = () => loadSchemaArray(HISTORY_STORAGE_KEY, HISTORY_SCHEMA_VERSION, "history");
    const saveResultHistory = (history) => saveSchemaArray(HISTORY_STORAGE_KEY, HISTORY_SCHEMA_VERSION, "history", history);
    const clearResultHistory = () => {
        try {
            localStorage.removeItem(HISTORY_STORAGE_KEY);
        } catch (e) {
            console.warn("結果履歴の削除に失敗しました:", e);
        }
    };

    const UI_CACHE_SCHEMA_VERSION = 1;
    const UI_CACHE_STORAGE_KEY = "psleep_sim_ui";

    // 例: { recipeEnergy:"...", trials:"...", campTicket:true, ... } みたいな自由形式
    const loadUICache = () => loadSchemaObject(UI_CACHE_STORAGE_KEY, UI_CACHE_SCHEMA_VERSION, "state");
    const saveUICache = (state) => saveSchemaObject(UI_CACHE_STORAGE_KEY, UI_CACHE_SCHEMA_VERSION, "state", state);
    const clearUICache = () => {
        try {
            localStorage.removeItem(UI_CACHE_STORAGE_KEY);
        } catch (e) {
            console.warn("UIキャッシュの削除に失敗しました:", e);
        }
    };

    PS.storage = {
        loadPokemonPresets,
        savePokemonPresets,
        loadResultHistory,
        saveResultHistory,
        clearResultHistory,

        loadUICache,
        saveUICache,
        clearUICache,

        keys: {
            POKEMON_BOX_STORAGE_KEY,
            HISTORY_STORAGE_KEY,
            UI_CACHE_STORAGE_KEY,
        },
    };
})();
