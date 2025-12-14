(() => {
    const PS = (window.PSleepSim ??= {});

    // DOM helper: $ / $$
    const $ = (s, root = document) => {
        if (!s) return null;
        if (typeof s !== "string") return s;

        if (s[0] === "#" || s[0] === "." || s.includes(" ") || s.includes("[") || s.includes(">")) {
            return root.querySelector(s);
        }
        return document.getElementById(s) || root.querySelector(s);
    };
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    PS.$ = $;
    PS.$$ = $$;

    PS.model ??= {};
    PS.ui ??= {};
    PS.ui.$ = $;
    PS.ui.$$ = $$;
    PS.storage ??= {};
})();
