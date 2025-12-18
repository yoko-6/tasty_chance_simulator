(() => {
    const PS = window.PSleepSim;
    const { $, $$, Type, Fields, SubSkills, Natures, NatureParams, ExEffectLabels, PokemonList, MAX_SLOTS } = PS;

    // ====== Field UI ======
    function populateTypeSelectOptions(selectEl) {
        selectEl.innerHTML = "";
        for (const key of Object.keys(Type)) {
            const opt = document.createElement("option");
            opt.value = Type[key];
            opt.textContent = Type[key];
            selectEl.appendChild(opt);
        }
    }

    function populateExEffectSelect(selectEl) {
        selectEl.innerHTML = "";
        for (const [value, label] of Object.entries(ExEffectLabels)) {
            const opt = document.createElement("option");
            opt.value = value;
            opt.textContent = label;
            selectEl.appendChild(opt);
        }
    }

    function initFieldUI() {
        const fieldSelect = $("fieldSelect");
        const mainSel = $("fieldMainType");
        const sub1Sel = $("fieldSub1Type");
        const sub2Sel = $("fieldSub2Type");
        const exOptionConfig = $("exOptionConfig");
        const exEffectSel = $("exEffect");

        [mainSel, sub1Sel, sub2Sel].forEach(populateTypeSelectOptions);
        populateExEffectSelect(exEffectSel);

        const applyField = () => {
            const key = fieldSelect.value || "wakakusa";
            const field = Fields[key];
            if (!field) return;

            const fixedTypes = field.types;
            if (fixedTypes && fixedTypes.length === 3) {
                mainSel.value = fixedTypes[0];
                sub1Sel.value = fixedTypes[1];
                sub2Sel.value = fixedTypes[2];
            } else {
                mainSel.disabled = false;
                sub1Sel.disabled = false;
                sub2Sel.disabled = false;
                if (!mainSel.value) mainSel.value = Type.None;
                if (!sub1Sel.value) sub1Sel.value = Type.None;
                if (!sub2Sel.value) sub2Sel.value = Type.None;
            }

            if (field.isEx) {
                exOptionConfig.style.display = "block";
            } else {
                exOptionConfig.style.display = "none";
                if (exEffectSel) exEffectSel.value = "";
            }
        };

        fieldSelect.addEventListener("change", applyField);
        applyField();
    }

    // ====== Nature helpers ======
    function updateNatureOptions(slotIndex) {
        const upSelect = $(`slot-${slotIndex}-nature-up`);
        const downSelect = $(`slot-${slotIndex}-nature-down`);
        const natureSelect = $(`slot-${slotIndex}-nature`);

        const up = upSelect.value;
        const down = downSelect.value;

        natureSelect.innerHTML = "";

        const candidates = PS.getNatureCandidates(up, down);

        if (!candidates.length) {
            const opt = document.createElement("option");
            opt.value = "";
            opt.textContent = "該当する性格なし";
            natureSelect.appendChild(opt);
            natureSelect.disabled = true;
            return;
        }

        natureSelect.disabled = false;
        for (const cand of candidates) {
            const opt = document.createElement("option");
            opt.value = cand.key;
            opt.textContent = cand.name;
            natureSelect.appendChild(opt);
        }
    }

    // ====== Subskills helpers ======
    function getSelectedSubSkillsForSlot(slotIndex) {
        const checked = [];
        for (const key of Object.keys(SubSkills)) {
            const cb = $(`slot-${slotIndex}-subskill-${key}`);
            if (cb && cb.checked) checked.push(SubSkills[key]);
        }
        return checked;
    }

    function clearSubskillsForSlot(slotIndex) {
        for (const key of Object.keys(SubSkills)) {
            const cb = $(`slot-${slotIndex}-subskill-${key}`);
            if (cb) cb.checked = false;
        }
    }

    // ====== Slot UI ======
    let visibleSlots = 1;

    function attachBenchModeHandlers(i) {
        const keys = ["weekday", "sunday"];
        for (const key of keys) {
            const radios = document.querySelectorAll(`input[name="slot-${i}-active-${key}"]`);
            const th = document.getElementById(`slot-${i}-active-${key}`);

            const update = () => {
                const mode = [...radios].find(r => r.checked)?.value || "always";
                if (th) th.disabled = (mode !== "threshold");
            };

            radios.forEach(r => r.addEventListener("change", update));
            update();
        }
    }

    function clearPokemonSlotSettings(slotIndex) {
        const pokemonSelect = $(`slot-${slotIndex}-pokemon`);
        const levelInput = $(`slot-${slotIndex}-level`);
        const skillLevelInput = $(`slot-${slotIndex}-skillLevel`);
        const upSelect = $(`slot-${slotIndex}-nature-up`);
        const downSelect = $(`slot-${slotIndex}-nature-down`);
        const natureSelect = $(`slot-${slotIndex}-nature`);

        // if (pokemonSelect && pokemonSelect.options.length > 0) pokemonSelect.selectedIndex = 0;
        if (levelInput) levelInput.value = 60;
        if (skillLevelInput) skillLevelInput.value = 6;

        if (upSelect) upSelect.value = "none";
        if (downSelect) downSelect.value = "none";
        if (natureSelect) updateNatureOptions(slotIndex);

        clearSubskillsForSlot(slotIndex);

        const errorEl = $(`slot-${slotIndex}-subskillError`);
        if (errorEl) {
            errorEl.style.display = "none";
            errorEl.textContent = "";
        }

        const helpMultInput = $(`slot-${slotIndex}-help-mult`);
        const ingBonusInput = $(`slot-${slotIndex}-ing-bonus`);
        const skillMultInput = $(`slot-${slotIndex}-skill-mult`);
        if (helpMultInput) helpMultInput.value = "1.0";
        if (ingBonusInput) ingBonusInput.value = "0";
        if (skillMultInput) skillMultInput.value = "1.0";

        const weekdayRadio = $(`slot-${slotIndex}-active-always-weekday`);
        const sundayRadio = $(`slot-${slotIndex}-active-always-sunday`);
        if (weekdayRadio) weekdayRadio.checked = true;
        if (sundayRadio) sundayRadio.checked = true;

        const chanceLimitWeekday = $(`slot-${slotIndex}-limit-chance-weekday`);
        const chanceLimitSunday = $(`slot-${slotIndex}-limit-chance-sunday`);
        if (chanceLimitWeekday) chanceLimitWeekday.value = "70";
        if (chanceLimitSunday) chanceLimitSunday.value = "70";
    }

    // ===== Preset (Pokemon Box) =====
    const loadPokemonPresets = () => PS.storage.loadPokemonPresets();
    const savePokemonPresets = (presets) => PS.storage.savePokemonPresets(presets);

    function collectSlotPokemonConfig(slotIndex) {
        const pokemonSel = $(`slot-${slotIndex}-pokemon`);
        const levelInput = $(`slot-${slotIndex}-level`);
        const skillLevelInput = $(`slot-${slotIndex}-skillLevel`);
        const upSelect = $(`slot-${slotIndex}-nature-up`);
        const downSelect = $(`slot-${slotIndex}-nature-down`);
        const natureSel = $(`slot-${slotIndex}-nature`);

        const pokemonKey = pokemonSel ? pokemonSel.value : "dedenne";
        const pokemonData = PokemonList[pokemonKey];
        const pokemonName = pokemonData ? pokemonData.name : pokemonKey;

        const level = levelInput ? Number(levelInput.value || "1") : 1;
        const skillLevel = skillLevelInput ? Number(skillLevelInput.value || "1") : 1;

        const natureUp = upSelect ? upSelect.value : "none";
        const natureDown = downSelect ? downSelect.value : "none";
        const natureKey = natureSel && natureSel.value ? natureSel.value : "";

        const subskills = [];
        for (const key of Object.keys(SubSkills)) {
            const cb = $(`slot-${slotIndex}-subskill-${key}`);
            if (cb && cb.checked) subskills.push(key);
        }

        const helpInput = $(`slot-${slotIndex}-help-mult`);
        const ingInput = $(`slot-${slotIndex}-ing-bonus`);
        const skillInput = $(`slot-${slotIndex}-skill-mult`);

        const personal = {
            helpMult: helpInput ? Number(helpInput.value || "1") : 1,
            ingBonus: ingInput ? Number(ingInput.value || "0") : 0,
            skillMult: skillInput ? Number(skillInput.value || "1") : 1,
        };

        return { pokemonKey, pokemonName, level, skillLevel, natureUp, natureDown, natureKey, subskills, personal };
    }

    function applyPresetToSlot(slotIndex, preset) {
        const pokemonSel = $(`slot-${slotIndex}-pokemon`);
        if (pokemonSel && preset.pokemonKey) pokemonSel.value = preset.pokemonKey;

        const levelInput = $(`slot-${slotIndex}-level`);
        const skillLevelInput = $(`slot-${slotIndex}-skillLevel`);
        if (levelInput && typeof preset.level === "number") levelInput.value = String(preset.level);
        if (skillLevelInput && typeof preset.skillLevel === "number") skillLevelInput.value = String(preset.skillLevel);

        const upSelect = $(`slot-${slotIndex}-nature-up`);
        const downSelect = $(`slot-${slotIndex}-nature-down`);
        const natureSel = $(`slot-${slotIndex}-nature`);

        upSelect.value = preset.natureUp;
        downSelect.value = preset.natureDown;

        updateNatureOptions(slotIndex);

        // natureKey は "" の可能性があるが、必ず存在する
        if (preset.natureKey && natureSel.querySelector(`option[value="${preset.natureKey}"]`)) {
            natureSel.value = preset.natureKey;
        }

        // サブスキル
        clearSubskillsForSlot(slotIndex);
        if (Array.isArray(preset.subskills)) {
            for (const key of preset.subskills) {
                const cb = $(`slot-${slotIndex}-subskill-${key}`);
                if (cb) cb.checked = true;
            }
        }

        // 個別補正
        const helpInput = $(`slot-${slotIndex}-help-mult`);
        const ingInput = $(`slot-${slotIndex}-ing-bonus`);
        const skillInput = $(`slot-${slotIndex}-skill-mult`);

        if (helpInput) helpInput.value = String(preset.personal?.helpMult ?? 1);
        if (ingInput) ingInput.value = String(preset.personal?.ingBonus ?? 0);
        if (skillInput) skillInput.value = String(preset.personal?.skillMult ?? 1);
    }

    function addPokemonPresetFromSlot(slotIndex) {
        const cfg = collectSlotPokemonConfig(slotIndex);
        const defaultName = `${cfg.pokemonName || cfg.pokemonKey}`;
        const name = (prompt("保存名を入力してください", defaultName) || "").trim();
        if (!name) return;

        const presets = loadPokemonPresets();
        presets.push({ id: Date.now(), name, ...cfg });
        savePokemonPresets(presets);
        alert(`「${name}」として保存しました。`);
    }

    // ===== Modal =====
    let presetReorderMode = false;

    function togglePresetReorderMode() {
        presetReorderMode = !presetReorderMode;

        const btn = document.getElementById("pokemonPresetReorderBtn");
        if (btn) btn.textContent = presetReorderMode ? "完了" : "並べ替え";

        const hint = document.getElementById("pokemonPresetReorderHint");
        if (hint) hint.style.display = presetReorderMode ? "block" : "none";

        // 開いていれば再描画
        const modal = document.getElementById("pokemonPresetModal");
        if (modal) {
            const slotIndex = Number(modal.dataset.targetSlot || "1");
            renderPokemonPresetList(slotIndex);
        }
    }

    function renderPokemonPresetList(slotIndex) {
        const presets = loadPokemonPresets();
        const listEl = $("pokemonPresetList");
        const emptyEl = $("pokemonPresetEmpty");
        if (!listEl || !emptyEl) return;

        listEl.innerHTML = "";
        if (!presets.length) {
            emptyEl.style.display = "block";
            return;
        }
        emptyEl.style.display = "none";

        presets.forEach((p, idx) => {
            const row = document.createElement("div");
            row.className = "preset-row";
            row.dataset.presetId = String(p.id);

            const main = document.createElement("div");
            main.className = "preset-main";

            const nameEl = document.createElement("div");
            nameEl.className = "preset-name";
            nameEl.textContent = p.name || "(ニックネームなし)";

            const metaEl = document.createElement("div");
            metaEl.className = "preset-meta";
            const pokemonName = p.pokemonName || p.pokemonKey || "";
            const lvStr = typeof p.level === "number" ? ` Lv${p.level}` : "";

            let natureText = "性格: ";
            if (p.natureKey && Natures[p.natureKey]) natureText += `${Natures[p.natureKey].name}`;
            else {
                natureText += "(" + PS.describeNatureEffect(p.natureUp, p.natureDown) + ")";
            }

            metaEl.textContent = `${pokemonName}${lvStr}` + (natureText ? ` ／ ${natureText}` : "");

            const subEl = document.createElement("div");
            subEl.className = "preset-meta";
            let subskillText = "-";
            if (Array.isArray(p.subskills) && p.subskills.length) {
                subskillText = p.subskills
                    .map((k) => (SubSkills[k] ? SubSkills[k].name : k))
                    .join(", ");
            }
            subEl.textContent = `サブスキル: ${subskillText}`;

            main.appendChild(nameEl);
            main.appendChild(metaEl);
            main.appendChild(subEl);

            const actions = document.createElement("div");
            actions.className = "preset-actions";

            const selectBtn = document.createElement("button");
            selectBtn.type = "button";
            selectBtn.className = "preset-select-btn";
            selectBtn.textContent = "読込";
            selectBtn.addEventListener("click", () => {
                applyPresetToSlot(slotIndex, p);
                closePokemonPresetModal();
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "preset-delete-btn";
            deleteBtn.textContent = "削除";
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (!confirm(`「${p.name}」を削除しますか？`)) return;
                const newList = loadPokemonPresets();
                const j = newList.findIndex(x => x.id === p.id);
                if (j >= 0) newList.splice(j, 1);
                savePokemonPresets(newList);
                renderPokemonPresetList(slotIndex);
            });

            actions.appendChild(selectBtn);
            actions.appendChild(deleteBtn);

            row.appendChild(main);
            row.appendChild(actions);

            const handle = document.createElement("button");
            handle.type = "button";
            handle.className = "preset-drag-handle";
            handle.textContent = "≡";
            handle.style.display = presetReorderMode ? "" : "none";
            row.appendChild(handle);

            listEl.appendChild(row);
        });

        listEl.classList.toggle("reorder-mode", presetReorderMode);
        attachPresetReorderHandlers(listEl, slotIndex); // イベントは一度だけ仕込む
    }

    function openPokemonPresetModal(slotIndex) {
        const modal = $("pokemonPresetModal");
        if (!modal) return;
        renderPokemonPresetList(slotIndex);
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        modal.dataset.targetSlot = String(slotIndex);
    }

    function closePokemonPresetModal() {
        const modal = $("pokemonPresetModal");
        if (!modal) return;

        // ★モーダルが閉じたら並べ替えモードをOFFにする
        presetReorderMode = false;

        // UIも戻す（残骸防止）
        const listEl = $("pokemonPresetList");
        if (listEl) listEl.classList.remove("reorder-mode");

        const hint = $("pokemonPresetReorderHint");
        if (hint) hint.style.display = "none";

        const btn = $("pokemonPresetReorderBtn");
        if (btn) btn.textContent = "並べ替え";

        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        delete modal.dataset.targetSlot;
    }

    function savePokemonPresetFromResult(p) {
        const presets = loadPokemonPresets();

        const defaultName = p.name || "";
        const nickname = window.prompt("保存するポケモン名（ニックネーム）を入力してください:", defaultName);
        if (nickname === null) return;

        const finalName = nickname.trim() || defaultName || "ポケモン";

        const preset = {
            id: Date.now(),
            name: finalName,
            pokemonKey: p.pokemonKey || "",
            pokemonName: p.name,
            level: p.level || 1,
            natureKey: p.natureKey,
            natureUp: p.natureUp,
            natureDown: p.natureDown,
            subskills: Array.isArray(p.subSkillKeys) ? [...p.subSkillKeys] : [],
            skillLevel: p.skillLevel || 1,
            personal: {
                helpMult: p.personal?.helpMult ?? 1.0,
                ingBonus: p.personal?.ingBonus ?? 0,
                skillMult: p.personal?.skillMult ?? 1.0,
            },
        };

        presets.push(preset);
        savePokemonPresets(presets);
        alert(`「${finalName}」をボックスに保存しました。`);
    }

    function attachResultPresetSaveHandlers(result) {
        $$(".preset-save-from-result-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const idx = Number(btn.dataset.pokemonIdx);
                if (!result || !Array.isArray(result.pokemons)) return;
                if (Number.isNaN(idx) || !result.pokemons[idx]) return;
                savePokemonPresetFromResult(result.pokemons[idx]);
            });
        });
    }

    function ensurePresetDnDStyle() {
        if (document.getElementById("presetDnDStyle")) return;
        const style = document.createElement("style");
        style.id = "presetDnDStyle";
        style.textContent = `
    .preset-drag-handle { touch-action:none; cursor:grab; user-select:none; }
    .preset-list.dragging { user-select:none; }
    .preset-row.dragging { position:absolute; z-index:50; background:#fff; }
    .preset-row.placeholder { border:2px dashed #bbb; }
    /* ★並べ替え中はアクションを完全に消す */
    .preset-list.reorder-mode .preset-actions { display: none !important; }
  `;
        document.head.appendChild(style);
    }

    function attachPresetReorderHandlers(listEl, slotIndex) {
        if (!listEl || listEl.dataset.reorderBound === "1") return;
        listEl.dataset.reorderBound = "1";
        listEl.classList.add("preset-list");
        ensurePresetDnDStyle();

        let draggingEl = null, placeholder = null, listRect = null, grabOffsetY = 0, pointerId = null;

        // 追加：浮き量（お好みで調整）
        const LIFT_PX = 8;          // “浮かせる”見た目の量（小さめ）
        const LIFT_SCALE = 1.01;    // 少しだけ拡大（不要なら 1.0）
        const LIFT_SHADOW = "0 8px 18px rgba(0,0,0,.14)";

        // listEl が absolute の基準になるように（どこか初期化時に1回）
        if (getComputedStyle(listEl).position === "static") {
            listEl.style.position = "relative";
        }

        listEl.addEventListener("pointerdown", (e) => {
            if (!presetReorderMode) return;
            const handle = e.target.closest(".preset-drag-handle");
            if (!handle) return;
            if (e.pointerType === "mouse" && e.button !== 0) return;

            const row = handle.closest(".preset-row");
            if (!row) return;

            e.preventDefault();

            pointerId = e.pointerId;

            listRect = listEl.getBoundingClientRect();
            const r = row.getBoundingClientRect();
            grabOffsetY = e.clientY - r.top;

            placeholder = document.createElement("div");
            placeholder.className = "preset-row placeholder";
            placeholder.style.height = `${r.height}px`;
            row.after(placeholder);

            draggingEl = row;
            draggingEl.classList.add("dragging");

            // ★ listEl 座標系で absolute 配置
            const leftInList = (r.left - listRect.left) + listEl.scrollLeft;
            const topInList = (r.top - listRect.top) + listEl.scrollTop;

            draggingEl.style.position = "absolute";
            draggingEl.style.width = `${r.width}px`;
            draggingEl.style.left = `${leftInList}px`;
            draggingEl.style.top = `${topInList}px`;
            draggingEl.style.pointerEvents = "none";
            draggingEl.style.zIndex = "10";

            // ★ “定数分浮かせる”見た目（位置はtopで管理し、見た目だけtransformで持ち上げる）
            draggingEl.style.transform = `translate3d(0, ${-LIFT_PX}px, 0) scale(${LIFT_SCALE})`;
            draggingEl.style.boxShadow = LIFT_SHADOW;

            listEl.classList.add("dragging");
            try { listEl.setPointerCapture(pointerId); } catch { }
        });

        listEl.addEventListener("pointermove", (e) => {
            if (!draggingEl || e.pointerId !== pointerId) return;
            e.preventDefault();

            // topはlistEl座標で追従（見た目の“浮き”は transform が担当）
            const top = e.clientY - listRect.top - grabOffsetY + listEl.scrollTop;
            draggingEl.style.top = `${top}px`;

            const y = e.clientY;
            const rows = [...listEl.querySelectorAll(".preset-row:not(.dragging):not(.placeholder)")];

            let inserted = false;
            for (const r of rows) {
                const rr = r.getBoundingClientRect();
                if (y < rr.top + rr.height / 2) {
                    listEl.insertBefore(placeholder, r);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) listEl.appendChild(placeholder);
        });

        const finish = (save) => {
            if (!draggingEl) return;

            draggingEl.classList.remove("dragging");
            draggingEl.style.position = "";
            draggingEl.style.left = "";
            draggingEl.style.top = "";
            draggingEl.style.width = "";
            draggingEl.style.pointerEvents = "";
            draggingEl.style.zIndex = "";
            draggingEl.style.transform = "";   // ★戻す
            draggingEl.style.boxShadow = "";   // ★戻す

            listEl.classList.remove("dragging");

            placeholder.replaceWith(draggingEl);

            if (save) {
                const ids = [...listEl.querySelectorAll(".preset-row")]
                    .map(el => Number(el.dataset.presetId))
                    .filter(Number.isFinite);

                const presets = loadPokemonPresets();
                const map = new Map(presets.map(p => [p.id, p]));
                const reordered = ids.map(id => map.get(id)).filter(Boolean);

                const used = new Set(reordered.map(p => p.id));
                for (const p of presets) if (!used.has(p.id)) reordered.push(p);

                savePokemonPresets(reordered);
                renderPokemonPresetList(slotIndex);
            }

            draggingEl = null;
            placeholder = null;
            listRect = null;
            grabOffsetY = 0;
            pointerId = null;
        };

        listEl.addEventListener("pointerup", (e) => {
            if (!draggingEl || e.pointerId !== pointerId) return;
            try { listEl.releasePointerCapture(pointerId); } catch { }
            finish(true);
        });

        listEl.addEventListener("pointercancel", (e) => {
            if (!draggingEl || e.pointerId !== pointerId) return;
            try { listEl.releasePointerCapture(pointerId); } catch { }
            finish(false);
        });
    }

    function initPokemonSlots() {
        const container = $("pokemonSlots");

        for (let i = 1; i <= MAX_SLOTS; i++) {
            const card = document.createElement("div");
            card.className = "slot-card";
            card.id = `slot-${i}-card`;
            if (i > 1) card.style.display = "none";

            card.innerHTML = `
        <div class="slot-header-row">
          ポケモン${i}
          <div class="slot-header-actions">
            <button type="button" class="preset-save" id="slot-${i}-savePresetBtn">保存</button>
            <button type="button" class="preset-save" id="slot-${i}-loadPresetBtn">読込</button>
          </div>
        </div>

        <div class="grid">
          <div class="row">
            <label for="slot-${i}-pokemon">ポケモン</label>
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

        <details class="advanced-settings">
          <summary>パーティから外す条件を設定</summary>
          <div class="advanced-body" style="padding:0.5rem;">
            <div class="slot-modifiers">
              <div class="row">
                <label>月曜~土曜</label>
                <div class="modifier-field">
                  <label class="inline">
                    <input id="slot-${i}-active-always-weekday" type="radio" name="slot-${i}-active-weekday" value="always" checked>
                    常にパーティに入れる
                  </label>
                  <label class="inline">
                    <input id="slot-${i}-active-threshold-weekday" type="radio" name="slot-${i}-active-weekday" value="threshold">
                    この値以上になったら
                  </label>
                </div>
                <div class="modifier-field">
                  <input id="slot-${i}-limit-chance-weekday" type="number" min="0" max="70" step="10" value="70">
                </div>
              </div>
              <div class="row">
                <label>日曜</label>
                <div class="modifier-field">
                  <label class="inline">
                    <input id="slot-${i}-active-always-sunday" type="radio" name="slot-${i}-active-sunday" value="always" checked>
                    常にパーティに入れる
                  </label>
                </div>
                <div class="modifier-field">
                  <label class="inline">
                    <input id="slot-${i}-active-threshold-sunday" type="radio" name="slot-${i}-active-sunday" value="threshold">
                    この値以上になったら
                  </label>
                </div>
                <div class="modifier-field">
                  <input id="slot-${i}-limit-chance-sunday" type="number" min="0" max="70" step="10" value="70">
                </div>
              </div>
            </div>
            <div class="muted">
                起きている間，料理チャンスによる上昇分がこの値以上になったらパーティから外れる．下回ったら戻る（0〜70%）
            </div>
            </div>
          </div>
        </details>

        <details class="advanced-settings">
          <summary>個別補正</summary>
          <div class="advanced-body">
            <div class="slot-modifiers">
              <div class="modifier-field">
                <span class="muted">スピード倍率</span>
                <input id="slot-${i}-help-mult" type="number" min="0.1" step="0.05" value="1.0">
              </div>
              <div class="modifier-field">
                <span class="muted">食材数ボーナス</span>
                <input id="slot-${i}-ing-bonus" type="number" min="0" step="1" value="0">
              </div>
              <div class="modifier-field">
                <span class="muted">スキル確率倍率</span>
                <input id="slot-${i}-skill-mult" type="number" min="0" step="0.05" value="1.0">
              </div>
            </div>
          </div>
        </details>

        <div class="subskill-actions">
          <button type="button" id="slot-${i}-clear-slot">このポケモンの設定をクリア</button>
          <button type="button" id="slot-${i}-delete-slot" disabled>このポケモンを削除</button>
        </div>
      `;

            container.appendChild(card);

            // save/load
            $(`slot-${i}-savePresetBtn`)?.addEventListener("click", () => addPokemonPresetFromSlot(i));
            $(`slot-${i}-loadPresetBtn`)?.addEventListener("click", () => openPokemonPresetModal(i));

            // nature selects
            const upSelect = $(`slot-${i}-nature-up`);
            const downSelect = $(`slot-${i}-nature-down`);

            NatureParams.forEach((g) => {
                const optUp = document.createElement("option");
                optUp.value = g.id;
                optUp.textContent = g.id === "none" ? "無補正" : `${g.baseLabel} ▲▲`;
                upSelect.appendChild(optUp);

                const optDown = document.createElement("option");
                optDown.value = g.id;
                optDown.textContent = g.id === "none" ? "無補正" : `${g.baseLabel} ▼▼`;
                downSelect.appendChild(optDown);
            });

            upSelect.value = "none";
            downSelect.value = "none";

            updateNatureOptions(i);

            upSelect.addEventListener("change", () => updateNatureOptions(i));
            downSelect.addEventListener("change", () => updateNatureOptions(i));

            // subskills
            const subskillsBox = $(`slot-${i}-subskills`);
            for (const key of Object.keys(SubSkills)) {
                const sub = SubSkills[key];
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

            $(`slot-${i}-clear-subskills`)?.addEventListener("click", () => clearSubskillsForSlot(i));
            $(`slot-${i}-clear-slot`)?.addEventListener("click", () => clearPokemonSlotSettings(i));
            $(`slot-${i}-delete-slot`)?.addEventListener("click", () => deleteSlot(i));
        }

        // --- スロット丸ごと削除（最後の1匹は不可）用 ---

        const collectSlotFullConfig = (slotIndex) => {
            const base = collectSlotPokemonConfig(slotIndex);

            const weekdayMode =
                document.querySelector(`input[name="slot-${slotIndex}-active-weekday"]:checked`)?.value || "always";
            const sundayMode =
                document.querySelector(`input[name="slot-${slotIndex}-active-sunday"]:checked`)?.value || "always";

            const limitWeekdayEl = $(`slot-${slotIndex}-limit-chance-weekday`);
            const limitSundayEl = $(`slot-${slotIndex}-limit-chance-sunday`);

            const limitWeekday = limitWeekdayEl ? Number(limitWeekdayEl.value || "70") : 70;
            const limitSunday = limitSundayEl ? Number(limitSundayEl.value || "70") : 70;

            return { ...base, weekdayMode, sundayMode, limitWeekday, limitSunday };
        };

        const applySlotFullConfig = (slotIndex, cfg) => {
            applyPresetToSlot(slotIndex, cfg);

            const wAlways = $(`slot-${slotIndex}-active-always-weekday`);
            const wThresh = $(`slot-${slotIndex}-active-threshold-weekday`);
            const sAlways = $(`slot-${slotIndex}-active-always-sunday`);
            const sThresh = $(`slot-${slotIndex}-active-threshold-sunday`);

            if (cfg.weekdayMode === "threshold") {
                if (wThresh) wThresh.checked = true;
            } else {
                if (wAlways) wAlways.checked = true;
            }

            if (cfg.sundayMode === "threshold") {
                if (sThresh) sThresh.checked = true;
            } else {
                if (sAlways) sAlways.checked = true;
            }

            const limitWeekdayEl = $(`slot-${slotIndex}-limit-chance-weekday`);
            const limitSundayEl = $(`slot-${slotIndex}-limit-chance-sunday`);
            if (limitWeekdayEl) limitWeekdayEl.value = String(cfg.limitWeekday ?? 70);
            if (limitSundayEl) limitSundayEl.value = String(cfg.limitSunday ?? 70);

            // もし attachBenchModeHandlers を使っているならここで反映（未使用ならOK）
            // attachBenchModeHandlers(slotIndex);
        };

        const updateDeleteButtons = () => {
            for (let i = 1; i <= MAX_SLOTS; i++) {
                const btn = $(`slot-${i}-delete-slot`);
                if (!btn) continue;
                // 表示中のスロットだけ有効化（最後の1匹なら全部無効）
                const isVisible = i <= visibleSlots;
                btn.disabled = !isVisible || visibleSlots <= 1;
            }
        };

        const deleteSlot = (slotIndex) => {
            if (visibleSlots <= 1) return;               // ★最後の1匹は削除しない
            if (slotIndex < 1 || slotIndex > visibleSlots) return;

            const last = visibleSlots;

            // 途中を消すなら、最後のスロット内容を詰める
            if (slotIndex !== last) {
                const lastCfg = collectSlotFullConfig(last);
                applySlotFullConfig(slotIndex, lastCfg);
            }

            // 最後を非表示にして中身は初期化（次に追加したとき汚れを残さない）
            const lastCard = $(`slot-${last}-card`);
            if (lastCard) lastCard.style.display = "none";
            clearPokemonSlotSettings(last);

            visibleSlots -= 1;
            updateAddRemoveButtons();
            updateDeleteButtons();
        };

        const addBtn = $("addPokemonBtn");
        const removeBtn = $("removePokemonBtn");

        const updateAddRemoveButtons = () => {
            addBtn.disabled = visibleSlots >= MAX_SLOTS;
            removeBtn.disabled = visibleSlots <= 1;
        };
        updateAddRemoveButtons();

        addBtn.addEventListener("click", () => {
            if (visibleSlots >= MAX_SLOTS) return;
            visibleSlots += 1;
            const card = $(`slot-${visibleSlots}-card`);
            if (card) card.style.display = "block";
            updateAddRemoveButtons();
            updateDeleteButtons();
        });

        removeBtn.addEventListener("click", () => {
            if (visibleSlots <= 1) return;
            const card = $(`slot-${visibleSlots}-card`);
            if (card) card.style.display = "none";
            visibleSlots -= 1;
            updateAddRemoveButtons();
            updateDeleteButtons();
        });
    }

    // ====== Field effect ======
    function getFieldEffectForType(pokemonType, fieldConfig) {
        const isMain = pokemonType === fieldConfig.mainType;
        const isSub1 = pokemonType === fieldConfig.sub1Type;
        const isSub2 = pokemonType === fieldConfig.sub2Type;
        const isSelected = isMain || isSub1 || isSub2;

        let helpingMult = 1.0;
        let skillMult = 1.0;
        let ingredientBonus = 0;
        let berryEnergyMult = isSelected ? 2.0 : 1.0;
        let effectLabel = "補正なし";

        if (fieldConfig.key === "wakakusa_ex") {
            if (isMain) helpingMult = 1.1;
            else if (!isSelected) helpingMult = 0.85;

            const effectKind = isSelected ? fieldConfig.exEffect || "" : "";

            switch (effectKind) {
                case "skill":
                    skillMult = 1.25;
                    effectLabel = ExEffectLabels.skill;
                    break;
                case "ingredient":
                    ingredientBonus = 1;
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

        return { helpingMult, skillMult, ingredientBonus, berryEnergyMult, effectLabel, matchesFieldType: isSelected, isMainType: isMain };
    }

    // ====== Time utils & schedule apply ======
    function parseTimeToSeconds(timeStr) {
        if (!timeStr || typeof timeStr !== "string") return null;
        const [hStr, mStr] = timeStr.split(":");
        const h = Number(hStr);
        const m = Number(mStr);
        if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
        if (h < 0 || h >= 24 || m < 0 || m >= 60) return null;
        return h * 3600 + m * 60;
    }

    function normalizeTimeForSchedule(sec) {
        const FOUR = 4 * 3600;
        return sec < FOUR ? sec + 24 * 3600 : sec;
    }

    function applyScheduleFromUI(simulator) {
        const timeErrorEl = $("timeError");
        const showError = (msg) => {
            if (!timeErrorEl) return;
            timeErrorEl.style.display = "block";
            timeErrorEl.textContent = msg;
        };
        if (timeErrorEl) {
            timeErrorEl.style.display = "none";
            timeErrorEl.textContent = "";
        }

        const wakeSec = parseTimeToSeconds($("wakeTime").value);
        const breakfastSec = parseTimeToSeconds($("breakfastTime").value);
        const lunchSec = parseTimeToSeconds($("lunchTime").value);
        const dinnerSec = parseTimeToSeconds($("dinnerTime").value);
        const sleepSec = parseTimeToSeconds($("sleepTime").value);

        if ([wakeSec, breakfastSec, lunchSec, dinnerSec, sleepSec].some((v) => v === null)) {
            showError("時刻の入力形式が正しくありません。");
            return false;
        }

        const FOUR = 4 * 3600;
        const NOON = 12 * 3600;
        const EVENING = 18 * 3600;
        const NEXTFOUR = 28 * 3600;

        const dinnerNorm = normalizeTimeForSchedule(dinnerSec);
        const sleepNorm = normalizeTimeForSchedule(sleepSec);

        if (wakeSec < FOUR) {
            showError("起床時刻は 4:00 以降にしてください。");
            return false;
        }
        if (breakfastSec < wakeSec || breakfastSec >= NOON) {
            showError("朝食時刻は起床〜12:00 未満の範囲で指定してください。");
            return false;
        }
        if (lunchSec < NOON || lunchSec >= EVENING) {
            showError("昼食時刻は 12:00〜18:00 未満の範囲で指定してください。");
            return false;
        }
        if (dinnerNorm < EVENING || dinnerNorm >= NEXTFOUR) {
            showError("夕食時刻は 18:00〜翌日 4:00 未満の範囲で指定してください。");
            return false;
        }
        if (sleepNorm >= NEXTFOUR) {
            showError("就寝時刻は翌日 4:00 より前にしてください。");
            return false;
        }

        if (dinnerNorm > sleepNorm) {
            showError("夕食時刻は就寝時刻以前（同じでも可）にしてください。");
            return false;
        }

        simulator.wake_up_time = normalizeTimeForSchedule(wakeSec);
        simulator.breakfast_time = normalizeTimeForSchedule(breakfastSec);
        simulator.lunch_time = normalizeTimeForSchedule(lunchSec);
        simulator.dinner_time = dinnerNorm;
        simulator.sleep_time = sleepNorm;

        return true;
    }

    // ====== Chart ======
    let energyChartInstance = null;

    function renderEnergyChart(result) {
        const canvas = $("energyChart");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        if (energyChartInstance) {
            energyChartInstance.destroy();
            energyChartInstance = null;
        }

        const { summary, pokemons } = result;
        const breakdown = summary.energyBreakdown;
        const labels = ["月", "火", "水", "木", "金", "土", "日"];

        const base = breakdown.baseByDay || new Array(7).fill(0);
        const carryOverByDay = breakdown.carryOverByDay || new Array(7).fill(0);
        const cookingEnergyByPokemonByDay = breakdown.cookingEnergyByPokemonByDay || [];
        const berryEnergyByPokemonByDay = breakdown.berryEnergyByPokemonByDay || [];

        const datasets = [
            { id: "base", label: "ベース(10%/30%)大成功エナジー", data: base, type: "bar", stack: "energy" },
            { id: "carry-over", label: "料理チャンス（週またぎ発動）", data: carryOverByDay, type: "bar", stack: "energy" },
        ];

        for (let i = 0; i < pokemons.length; i++) {
            const p = pokemons[i];
            const cook = cookingEnergyByPokemonByDay[i] || new Array(7).fill(0);
            const berry = berryEnergyByPokemonByDay[i] || new Array(7).fill(0);

            datasets.push({ id: `poke-${p.index}-berry`, label: `ポケモン${p.index}（${p.name}）きのみ`, data: berry, type: "bar", stack: "energy" });
            datasets.push({ id: `poke-${p.index}-cook`, label: `ポケモン${p.index}（${p.name}）料理チャンス`, data: cook, type: "bar", stack: "energy" });
        }

        const totalLabelPlugin = {
            id: "totalLabelPlugin",
            afterDatasetsDraw(chart) {
                const { ctx, data } = chart;
                const yAxis = chart.scales.y;

                ctx.save();
                ctx.font = '20px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
                ctx.fillStyle = "#333";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";

                data.labels.forEach((_, index) => {
                    let total = 0;
                    chart.data.datasets.forEach((ds, dsIndex) => {
                        const meta = chart.getDatasetMeta(dsIndex);
                        if (meta.hidden || ds.hidden) return;
                        const v = ds.data[index];
                        if (typeof v === "number" && !Number.isNaN(v)) total += v;
                    });
                    if (total <= 0) return;

                    const firstMeta = chart.getDatasetMeta(0);
                    const bar = firstMeta.data[index];
                    if (!bar) return;

                    const x = bar.x;
                    const y = yAxis.getPixelForValue(total);
                    ctx.fillText(total.toFixed(0), x, y + 3);
                });

                ctx.restore();
            },
        };

        energyChartInstance = new Chart(ctx, {
            type: "bar",
            data: { labels, datasets },
            plugins: [totalLabelPlugin],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        titleFont: { size: 18 },
                        bodyFont: { size: 16 },
                        callbacks: {
                            label(ctx) {
                                const label = ctx.dataset.label || "";
                                const val = ctx.parsed.y || 0;
                                return `${label}: ${val.toFixed(0)}`;
                            },
                        },
                    },
                },
                scales: {
                    x: { stacked: true, ticks: { font: { size: 18 } } },
                    y: { stacked: true, ticks: { font: { size: 20 } } },
                },
            },
        });

        // ★追加：チェックボックスの状態を初期表示に反映
        (function applyInitialHiddenFromToggles() {
            const checkedById = {};
            $$(".energy-series-toggle").forEach((cb) => {
                const id = cb.dataset.seriesId;
                if (id) checkedById[id] = !!cb.checked;
            });

            energyChartInstance.data.datasets.forEach((ds) => {
                if (!ds.id) return;
                if (Object.prototype.hasOwnProperty.call(checkedById, ds.id)) {
                    ds.hidden = !checkedById[ds.id];
                }
            });

            energyChartInstance.update();
        })();

        $$(".energy-series-toggle").forEach((cb) => {
            const id = cb.dataset.seriesId;
            cb.addEventListener("change", () => {
                if (!energyChartInstance) return;
                energyChartInstance.data.datasets.forEach((ds) => {
                    if (ds.id === id) ds.hidden = !cb.checked;
                });
                energyChartInstance.update();
            });
        });
    }

    const sum = (byDay) => byDay.reduce((s, v) => s + (Number(v) || 0), 0);
    const sum2D = (byPokeByDay) => byPokeByDay.reduce((s1, byDay) => s1 + sum(byDay), 0);
    const avg = (byDay) => sum(byDay) / byDay.length;

    const SEC_PER_DAY = 24 * 3600;

    const to24hEqEnergy = (energy, activeSec) => {
        if (!Number.isFinite(energy) || !Number.isFinite(activeSec) || activeSec <= 0) return null; // 0除算回避
        return energy * (SEC_PER_DAY / activeSec);
    };

    // ===== Result HTML =====
    function buildResultHtml(result) {
        const { summary, pokemons, settings } = result;
        const breakdown = summary.energyBreakdown;

        const pokemonCards = pokemons
            .map((p, i) => {
                const fieldTags = [];
                if (p.matchesFieldType) fieldTags.push('<span class="tag tag-field-match">好きなきのみ</span>');
                if (p.exEffectLabel && p.isMainType) fieldTags.push('<span class="tag tag-main-type">メインタイプ</span>');
                if (p.exEffectLabel && p.exEffectLabel !== "補正なし") fieldTags.push(`<span class="tag">${p.exEffectLabel}</span>`);

                const natureEffectText = PS.describeNatureEffect(p.natureUp, p.natureDown);

                const berryByDay = breakdown.berryEnergyByPokemonByDay[i] || new Array(7).fill(0);
                const cookByDay = breakdown.cookingEnergyByPokemonByDay[i] || new Array(7).fill(0);
                const skillCntByDay = breakdown.skillCountByPokemonByDay[i] || new Array(7).fill(0);
                const activeSecondsByDay = breakdown.activeSecondsByPokemonByDay[i] || new Array(7).fill(0);

                const berryEnergyPerDayAvg = avg(berryByDay);
                const skillEnergyPerDayAvg = avg(cookByDay);
                const skillCountPerDayAvg = avg(skillCntByDay);

                const activeSecondsPerWeekDayAvg = avg(activeSecondsByDay.slice(0, 6));
                const activeSecondsSunday = activeSecondsByDay[6] || 0;
                const activeTimePerWeekDayText = `${Math.floor(activeSecondsPerWeekDayAvg / 3600)}:${String(Math.floor((activeSecondsPerWeekDayAvg % 3600) / 60)).padStart(2, '0')}`;
                const activeTimeSundayText = `${Math.floor(activeSecondsSunday / 3600)}:${String(Math.floor((activeSecondsSunday % 3600) / 60)).padStart(2, '0')}`;

                const activeLimitWeekdayText = p.activeLimitChanceWeekday.toFixed(0) > 70 ? "常時" : `<${p.activeLimitChanceWeekday.toFixed(0)}%`;
                const activeLimitSundayText = p.activeLimitChanceSunday.toFixed(0) > 70 ? "常時" : `<${p.activeLimitChanceSunday.toFixed(0)}%`;

                const weekdayEnergyAvg = avg(berryByDay.slice(0, 6)) + avg(cookByDay.slice(0, 6));
                const sundayEnergy = berryByDay[6] + cookByDay[6];

                const weekdayEnergy24hEq = to24hEqEnergy(weekdayEnergyAvg, activeSecondsPerWeekDayAvg);
                const sundayEnergy24hEq = to24hEqEnergy(sundayEnergy, activeSecondsSunday);

                const weekdayEnergy24hEqText = weekdayEnergy24hEq == null ? "-" : weekdayEnergy24hEq.toFixed(0);
                const sundayEnergy24hEqText  = sundayEnergy24hEq  == null ? "-" : sundayEnergy24hEq.toFixed(0);

                const mainChipsHtml = `
          <div class="pokemon-main-stats">
            <div class="stat-chip-main">
              <span class="chip-label">合計</span>
              <span class="chip-value">${(berryEnergyPerDayAvg + skillEnergyPerDayAvg).toFixed(0)}</span>
              <span class="chip-sub-label">エナジー/日</span>
            </div>
            <div class="stat-chip">
              <span class="chip-label">きのみ</span>
              <span class="chip-value">${berryEnergyPerDayAvg.toFixed(0)}</span>
              <span class="chip-sub-label">エナジー/日</span>
            </div>
            <div class="stat-chip">
              <span class="chip-label">料理チャンス</span>
              <span class="chip-value">${skillEnergyPerDayAvg.toFixed(0)}</span>
              <span class="chip-sub-label">エナジー/日</span>
            </div>
            <div class="stat-chip">
              <span class="chip-label">スキル</span>
              <span class="chip-value">${skillCountPerDayAvg.toFixed(2)}</span>
              <span class="chip-sub-label">回/日</span>
            </div>
          </div>
        `;

                const detailsHtml = `
          <details class="pokemon-details" data-pokemon-index="${p.index}">
            <summary>詳細ステータスを見る</summary>
            <div class="pokemon-body-grid">
              <div>
                <div class="pokemon-body-block-title">おてつだい</div>
                <div class="pokemon-body-block-row">おてつだい時間: ${p.helpBase} 秒</div>
                <div class="pokemon-body-block-row">個別・全体補正: ${p.helpTotalMult.toFixed(2)} 倍</div>
                <div class="pokemon-body-block-row">補正後: ${p.helpEffectiveTime.toFixed(1)} 秒</div>
                <div class="pokemon-body-block-row">所持数: ${p.inventoryLimit}</div>
              </div>
              <div>
                <div class="pokemon-body-block-title">きのみ・食材</div>
                <div class="pokemon-body-block-row">食材確率: ${(p.ingredientProb * 100).toFixed(2)} %</div>
                <div class="pokemon-body-block-row">食材ボーナス合計: +${p.ingredientBonusTotal} 個</div>
                <div class="pokemon-body-block-row">きのみの数: ${p.berryNum}</div>
                <div class="pokemon-body-block-row">きのみエナジー: ${p.berryEnergyMultiplier.toFixed(2)} 倍</div>
              </div>
            </div>

            <div class="pokemon-body-grid" style="margin-top:1rem;">
              <div>
                <div class="pokemon-body-block-title">スキル</div>
                <div class="pokemon-body-block-row">スキル確率: ${(p.skillBaseProb * 100).toFixed(2)} %</div>
                <div class="pokemon-body-block-row">個別・全体補正: ${p.skillMultTotal.toFixed(2)} 倍</div>
                <div class="pokemon-body-block-row">補正後: ${(p.skillFinalProb * 100).toFixed(2)} %</div>
                <div class="pokemon-body-block-row">メインスキル効果: ${p.skillEffectPercent.toFixed(1)} %</div>
              </div>
              <div>
                <div class="pokemon-body-block-title">活動時間・エナジー</div>
                <div class="pokemon-body-block-row">月~土: ${activeTimePerWeekDayText} (${activeLimitWeekdayText})</div>
                <div class="pokemon-body-block-row">　1日換算: ${weekdayEnergy24hEqText} エナジー</div>
                <div class="pokemon-body-block-row">日: ${activeTimeSundayText} (${activeLimitSundayText})</div>
                <div class="pokemon-body-block-row">　1日換算: ${sundayEnergy24hEqText} エナジー</div>
              </div>
            </div>

            <hr />

            <div class="pokemon-body-block-row">他ポケモンの効果: ${p.teamSubSkillsLabel}</div>
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
                  ${p.type || "-"} ／ Lv${p.level} ／ ${p.natureName}
                  ${natureEffectText && natureEffectText !== "補正なし" ? `（${natureEffectText}）` : ""}
                </div>
                <div class="pokemon-sub">サブスキル: ${p.subSkillsLabel || "なし"}</div>
              </div>
              <div class="pokemon-side-controls">
                <button type="button" class="preset-save-from-result-btn" data-pokemon-idx="${p.index - 1}">保存</button>
                <div class="pokemon-tags pokemon-tags-right">${fieldTags.join("")}</div>
              </div>
            </div>
            ${mainChipsHtml}
            ${detailsHtml}
          </div>
        `;
            })
            .join("");

        const extraByDay = summary.extraEnergyByDay;
        const successByDay = summary.successCountByDay;

        const baseByDay = breakdown.baseByDay;
        const carryByDay = breakdown.carryOverByDay;

        const skillEnergyByDay = new Array(7).fill(0).map((_, d) => {
            return Math.max(0, (extraByDay[d] - baseByDay[d] - carryByDay[d]));
        });

        const extraPerDayAvg = avg(extraByDay);
        const successPerDayAvg = avg(successByDay);
        const skillEnergyPerDayAvg = avg(skillEnergyByDay);

        const skillCount = sum2D(breakdown.skillCountByPokemonByDay) / 7;
        const skillCountPerPokemonAvg =
            pokemons.length > 0 ? skillCount / pokemons.length : 0;

        const sundaySkillEnergy = skillEnergyByDay[6];
        const weekdaySkillEnergyAvg = avg(skillEnergyByDay.slice(0, 6));

        const sundayExtraEnergy = extraByDay[6];
        const weekdayExtraEnergyAvg = avg(extraByDay.slice(0, 6));

        const field = settings.field;
        const ev = settings.events;
        const sched = settings.schedule;
        const recipeEnergy = settings.recipeEnergy;

        const fieldExText = field.key === "wakakusa_ex" ? field.exEffectLabel || "補正なし" : "なし";
        const fieldBonusPercentText =
            field.fieldBonusPercent != null
                ? field.fieldBonusPercent.toFixed(1)
                : field.fieldEnergyMultiplier != null
                    ? (field.fieldEnergyMultiplier * 100).toFixed(1)
                    : "100.0";

        const line1Chips = [];
        const line2Chips = [];

        line1Chips.push(`
      <div class="header-chip" style="background-color:#f2c09d; color:#000;">
        <span class="chip-label">レシピ</span>
        <span class="chip-value">${recipeEnergy.toLocaleString()}</span>
        <span class="chip-label">エナジー</span>
      </div>
    `);

        line1Chips.push(`
      <div class="header-chip" style="background-color:#b6d7a8; color:#000;">
        <span class="chip-label">フィールドボーナス</span>
        <span class="chip-value">+${field.fieldBonusPercent.toFixed(0)}%</span>
      </div>
    `);

        if (ev.energyEventMultiplier && Math.abs(ev.energyEventMultiplier - 1.0) > 1e-6) {
            line2Chips.push(`
        <div class="header-chip" style="background-color:#ffd966; color:#000;">
          <span class="chip-label">料理エナジー</span>
          <span class="chip-value">×${ev.energyEventMultiplier.toFixed(2)}</span>
        </div>
      `);
        }
        if (ev.skillEventMultiplier && Math.abs(ev.skillEventMultiplier - 1.0) > 1e-6) {
            line2Chips.push(`
        <div class="header-chip" style="background-color:#d8b5f7; color:#000;">
          <span class="chip-label">スキル確率</span>
          <span class="chip-value">×${ev.skillEventMultiplier.toFixed(2)}</span>
        </div>
      `);
        }
        if (ev.helpingSpeedMultiplier && Math.abs(ev.helpingSpeedMultiplier - 1.0) > 1e-6) {
            line2Chips.push(`
        <div class="header-chip" style="background-color:#a4c2f4; color:#000;">
          <span class="chip-label">おてつだいスピード</span>
          <span class="chip-value">×${ev.helpingSpeedMultiplier.toFixed(2)}</span>
        </div>
      `);
        }

        const headerChipsHtml =
            line1Chips.length || line2Chips.length
                ? `
          <div class="header-chips">
            ${line1Chips.length ? `<div class="header-chip-row header-chip-row-1">${line1Chips.join("")}</div>` : ""}
            ${line2Chips.length ? `<div class="header-chip-row header-chip-row-2">${line2Chips.join("")}</div>` : ""}
          </div>
        `
                : "";

        return `
      <div class="result-container">
        <section class="result-section">
          <div class="result-section-header">
            <div class="result-title-row">
              <div class="result-section-title result-section-title-main">結果</div>
            </div>
            ${headerChipsHtml}
          </div>

          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-label">全体(ベース･持越･スキル)</div>
              <div class="stat-value" style="font-size: 1.2rem;">${extraPerDayAvg.toFixed(0)}<span class="stat-unit">エナジー/日</span></div>
              <div class="stat-value"><span class="stat-unit">月~土</span> ${weekdayExtraEnergyAvg.toFixed(0)}<span class="stat-unit">エナジー/日</span></div>
              <div class="stat-value"><span class="stat-unit">日曜</span> ${sundayExtraEnergy.toFixed(0)}<span class="stat-unit">エナジー/日</span></div>
            </div>
            <div class="stat-card">
              <div class="stat-label">料理チャンスのみ</div>
                <div class="stat-value" style="font-size: 1.2rem;">${skillEnergyPerDayAvg.toFixed(0)}<span class="stat-unit">エナジー/日</span></div>
              <div class="stat-value"><span class="stat-unit">月~土</span> ${weekdaySkillEnergyAvg.toFixed(0)}<span class="stat-unit">エナジー/日</span></div>
              <div class="stat-value"><span class="stat-unit">日曜</span> ${sundaySkillEnergy.toFixed(0)}<span class="stat-unit">エナジー/日</span></div>
            </div>
          </div>

          <div class="result-section-sub" style="margin:0.2rem;">表示切り替えボタン</div>
          <div class="energy-toggle-group" style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.2rem;">
            <label class="inline">
              <input type="checkbox" class="energy-series-toggle" data-series-id="base" checked />
              ベース大成功(10%/30%)
            </label>
            <label class="inline">
              <input type="checkbox" class="energy-series-toggle" data-series-id="carry-over" checked />
              週またぎ料理チャンス
            </label>
          </div>

          ${pokemons
                .map(
                    (p) => `
                <div class="energy-toggle-group" style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.2rem;">
                  <label class="inline">
                    <input type="checkbox" class="energy-series-toggle" data-series-id="poke-${p.index}-cook" checked />
                    ${p.index}.${p.name}料理チャンス
                  </label>
                  <label class="inline">
                    <input type="checkbox" class="energy-series-toggle" data-series-id="poke-${p.index}-berry" checked />
                    ${p.index}.${p.name}きのみ
                  </label>
                </div>
              `
                )
                .join("")}

          <div style="width:100%; overflow-x:auto;">
            <div style="min-width:280px; height:480px;">
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
              <div class="input-block-row">元気常時81%以上: ${settings.disableEnergyDecay ? "有効" : "無効"}</div>
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
              <div class="input-block-row">おてつだいスピード: ${ev.helpingSpeedMultiplier.toFixed(2)} 倍</div>
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

    // ===== export ui API =====
    PS.ui.initFieldUI = initFieldUI;
    PS.ui.initPokemonSlots = initPokemonSlots;
    PS.ui.updateNatureOptions = updateNatureOptions;

    PS.ui.getSelectedSubSkillsForSlot = getSelectedSubSkillsForSlot;
    PS.ui.clearSubskillsForSlot = clearSubskillsForSlot;

    PS.ui.getFieldEffectForType = getFieldEffectForType;
    PS.ui.applyScheduleFromUI = applyScheduleFromUI;

    PS.ui.renderEnergyChart = renderEnergyChart;
    PS.ui.buildResultHtml = buildResultHtml;
    PS.ui.attachResultPresetSaveHandlers = attachResultPresetSaveHandlers;

    PS.ui.openPokemonPresetModal = openPokemonPresetModal;
    PS.ui.closePokemonPresetModal = closePokemonPresetModal;
    PS.ui.togglePresetReorderMode = togglePresetReorderMode;
})();
