(() => {
    const PS = window.PSleepSim;
    const { $, ui, storage, Fields, PokemonList, SubSkills, Natures, ExEffectLabels, MAX_SLOTS } = PS;
    const { Simulator, Pokemon } = PS.model;

    const readNumber = (id, fallbackStr) => {
        const el = $(id);
        const raw = el ? el.value : "";
        const v = Number(raw === "" ? fallbackStr : raw);
        return Number.isFinite(v) ? v : Number(fallbackStr);
    };

    window.addEventListener("DOMContentLoaded", () => {
        ui.initPokemonSlots();
        ui.initFieldUI();

        // howto open/close
        const howtoCard = $("#howtoCard");
        const howtoHeader = $("#howtoHeader");
        if (howtoCard && howtoHeader) {
            howtoCard.classList.add("collapsed");
            howtoHeader.addEventListener("click", () => howtoCard.classList.toggle("collapsed"));
        }

        const runBtn = $("#runBtn");
        const statusEl = $("#status");
        const outputEl = $("#output");

        const prevResultBtn = $("#prevResultBtn");
        const nextResultBtn = $("#nextResultBtn");
        const resultPageInfo = $("#resultPageInfo");
        const clearHistoryBtn = $("#clearHistoryBtn");
        const deleteCurrentBtn = $("#deleteCurrentResultBtn");

        // ===== Persist view state across result navigation =====
        let persistedViewState = {
            seriesChecked: {},       // { [seriesId]: boolean }
            pokemonDetailsOpen: {},  // { [pokemonIndex]: boolean }
        };

        const captureViewState = () => {
            const state = { seriesChecked: {}, pokemonDetailsOpen: {} };

            // 棒グラフのON/OFF
            outputEl.querySelectorAll(".energy-series-toggle").forEach((cb) => {
                const id = cb.dataset.seriesId;
                if (id) state.seriesChecked[id] = !!cb.checked;
            });

            // ポケモン詳細の開閉
            outputEl.querySelectorAll("details.pokemon-details").forEach((d) => {
                const k = d.dataset.pokemonIndex;
                if (k) state.pokemonDetailsOpen[k] = !!d.open;
            });

            return state;
        };

        const mergeViewState = (base, patch) => {
            const next = {
                seriesChecked: { ...(base?.seriesChecked || {}) },
                pokemonDetailsOpen: { ...(base?.pokemonDetailsOpen || {}) },
            };
            if (patch?.seriesChecked) Object.assign(next.seriesChecked, patch.seriesChecked);
            if (patch?.pokemonDetailsOpen) Object.assign(next.pokemonDetailsOpen, patch.pokemonDetailsOpen);
            return next;
        };

        const applyViewState = (state) => {
            if (!state) return;

            outputEl.querySelectorAll(".energy-series-toggle").forEach((cb) => {
                const id = cb.dataset.seriesId;
                if (id && Object.prototype.hasOwnProperty.call(state.seriesChecked, id)) {
                    cb.checked = !!state.seriesChecked[id];
                }
            });

            outputEl.querySelectorAll("details.pokemon-details").forEach((d) => {
                const k = d.dataset.pokemonIndex;
                if (k && Object.prototype.hasOwnProperty.call(state.pokemonDetailsOpen, k)) {
                    d.open = !!state.pokemonDetailsOpen[k];
                }
            });
        };

        // ===== History =====
        let resultHistory = storage.loadResultHistory();
        let resultIndex = resultHistory.length ? resultHistory.length - 1 : -1;

        const saveHistory = () => storage.saveResultHistory(resultHistory);

        const renderCurrentResult = () => {
            const totalPages = resultHistory.length;

            if (resultIndex < 0 || resultIndex >= totalPages) {
                outputEl.innerHTML = "";
                resultPageInfo.textContent = "結果はまだありません";
                prevResultBtn.disabled = true;
                nextResultBtn.disabled = true;
                deleteCurrentBtn.disabled = true;
                clearHistoryBtn.disabled = true;
                return;
            }

            if (outputEl.querySelector(".result-container")) {
                persistedViewState = mergeViewState(persistedViewState, captureViewState());
            }

            const current = resultHistory[resultIndex];
            outputEl.innerHTML = ui.buildResultHtml(current);

            applyViewState(persistedViewState);
            ui.attachResultPresetSaveHandlers(current);
            ui.renderEnergyChart(current);

            resultPageInfo.textContent = `結果 ${resultIndex + 1} / ${totalPages}（最新: ${totalPages}）`;
            prevResultBtn.disabled = resultIndex <= 0;
            nextResultBtn.disabled = resultIndex >= totalPages - 1;
            clearHistoryBtn.disabled = totalPages === 0;
            deleteCurrentBtn.disabled = totalPages === 0;
        };

        // ===== Animated navigation helpers =====
        (function setupAnimatedResultNavigation() {
            // CSS（main.jsだけで完結させる）
            const style = document.createElement("style");
            style.textContent = `
    .ps-result-swipe-target {
      will-change: transform, opacity;
      touch-action: pan-y; /* 縦スクロールは殺さない（横だけ検知） */
    }
  `;
            document.head.appendChild(style);
            outputEl.classList.add("ps-result-swipe-target");

            let isAnimating = false;

            const isTypingTarget = () => {
                const el = document.activeElement;
                if (!el) return false;
                const tag = el.tagName;
                return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
            };

            const isInteractive = (el) => {
                if (!el || el.nodeType !== 1) return false;
                return !!el.closest("button, a, input, select, textarea, label, details, summary");
            };

            const canMoveTo = (newIndex) => {
                if (isAnimating) return false;
                if (!resultHistory.length) return false;
                if (newIndex < 0 || newIndex >= resultHistory.length) return false;
                return true;
            };

            // ===== Swipe Wrap (先に確保して、animate側から幅を参照できるようにする) =====
            const ensureSwipeWrap = () => {
                let wrap = document.getElementById("resultSwipeWrap");
                let under = document.getElementById("resultSwipeUnderlay");
                if (wrap && under) return { wrap, under };

                wrap = document.createElement("div");
                wrap.id = "resultSwipeWrap";

                under = document.createElement("div");
                under.id = "resultSwipeUnderlay";

                // outputEl(#output) をラップして underlay を背面に置く
                const parent = outputEl.parentNode;
                parent.insertBefore(wrap, outputEl);
                wrap.appendChild(under);
                wrap.appendChild(outputEl);

                return { wrap, under };
            };

            let swipeWrap, underlayEl;
            ({ wrap: swipeWrap, under: underlayEl } = ensureSwipeWrap());

            // 追従の「速さ」：指より少し速く（ドラッグが大きいほど少し増える）
            const followFactor = (absDx) => 1.05 + 0.25 * Math.min(1, absDx / 260); // 1.05〜1.30

            // ★「戻さずにヒントだけ消す」：遷移時に使う
            const clearSwipeHintOnly = () => {
                swipeWrap.classList.remove("swiping", "swipe-ready");
                swipeWrap.removeAttribute("data-dir");
                underlayEl.style.opacity = "0";
                underlayEl.textContent = "";
            };

            const resetSwipeVisual = (animate = true) => {
                clearSwipeHintOnly();

                if (animate) {
                    outputEl.style.transition = "transform 180ms ease";
                    outputEl.style.transform = "translateX(0px)";
                } else {
                    outputEl.style.transition = "none";
                    outputEl.style.transform = "translateX(0px)";
                }
            };

            const canMove = (dir) => {
                if (dir === "prev") return resultIndex > 0;
                if (dir === "next") return resultIndex < resultHistory.length - 1;
                return false;
            };

            const animateToIndex = (newIndex, delta /* -1 prev, +1 next */, opt = {}) => {
                if (!canMoveTo(newIndex)) return;

                isAnimating = true;

                const OUT_MS = 160;
                const IN_MS = 180;

                // click時は小さめ、swipe遷移時は画面外まで抜ける
                const wrapWidth = swipeWrap?.getBoundingClientRect().width || outputEl.getBoundingClientRect().width || 320;
                const DIST_CLICK = 90;
                const DIST_SWIPE = Math.round(wrapWidth * 1.02);

                const viaSwipe = !!opt.viaSwipe;
                const startOffsetPx = Number.isFinite(opt.startOffsetPx) ? opt.startOffsetPx : 0;

                const outDist = viaSwipe ? DIST_SWIPE : DIST_CLICK;

                // 次へ(+1)なら左へ抜ける / 前へ(-1)なら右へ抜ける
                const outX = delta > 0 ? -outDist : outDist;
                const inFromX = delta > 0 ? outDist : -outDist;

                // ★SWIPE遷移：今の位置(startOffsetPx)からそのまま外へ（0に戻さない）
                if (viaSwipe) {
                    // ヒントは消すが transform は触らない
                    clearSwipeHintOnly();

                    outputEl.style.opacity = "1";
                    outputEl.style.transition = "none";
                    outputEl.style.transform = `translateX(${startOffsetPx}px)`;

                    // OUT（transformのみ：戻る/フェードに見えにくい）
                    requestAnimationFrame(() => {
                        outputEl.style.transition = `transform ${OUT_MS}ms ease`;
                        outputEl.style.transform = `translateX(${outX}px)`;
                    });

                    const onOutEnd = (ev) => {
                        // transform以外のtransitionendを拾ってしまう可能性を避ける
                        if (ev.propertyName && ev.propertyName !== "transform") return;
                        outputEl.removeEventListener("transitionend", onOutEnd);

                        // 反対側に瞬間移動して中身を差し替え
                        outputEl.style.transition = "none";
                        outputEl.style.transform = `translateX(${inFromX}px)`;
                        outputEl.style.opacity = "1";

                        resultIndex = newIndex;
                        renderCurrentResult();

                        outputEl.getBoundingClientRect(); // reflow

                        // IN
                        requestAnimationFrame(() => {
                            outputEl.style.transition = `transform ${IN_MS}ms ease`;
                            outputEl.style.transform = "translateX(0px)";
                        });

                        const onInEnd = (ev2) => {
                            if (ev2.propertyName && ev2.propertyName !== "transform") return;
                            outputEl.removeEventListener("transitionend", onInEnd);
                            outputEl.style.transition = "";
                            isAnimating = false;
                        };
                        outputEl.addEventListener("transitionend", onInEnd);
                    };

                    outputEl.addEventListener("transitionend", onOutEnd);
                    return;
                }

                // ===== click/キー：従来どおり（0からOUT→IN） =====
                outputEl.style.transition = `transform ${OUT_MS}ms ease, opacity ${OUT_MS}ms ease`;
                outputEl.style.transform = `translateX(${outX}px)`;
                outputEl.style.opacity = "0";

                const onOutEnd = () => {
                    outputEl.removeEventListener("transitionend", onOutEnd);

                    outputEl.style.transition = "none";
                    outputEl.style.transform = `translateX(${inFromX}px)`;
                    outputEl.style.opacity = "0";

                    resultIndex = newIndex;
                    renderCurrentResult();

                    outputEl.getBoundingClientRect();

                    requestAnimationFrame(() => {
                        outputEl.style.transition = `transform ${IN_MS}ms ease, opacity ${IN_MS}ms ease`;
                        outputEl.style.transform = "translateX(0px)";
                        outputEl.style.opacity = "1";
                    });

                    const onInEnd = () => {
                        outputEl.removeEventListener("transitionend", onInEnd);
                        outputEl.style.transition = "";
                        isAnimating = false;
                    };
                    outputEl.addEventListener("transitionend", onInEnd);
                };

                outputEl.addEventListener("transitionend", onOutEnd);
            };

            const moveResult = (delta, opt = {}) => {
                if (resultIndex < 0) return;
                animateToIndex(resultIndex + delta, delta, opt);
            };

            // 既存の prev/next の click を「アニメ付き」に置き換え
            prevResultBtn.addEventListener("click", () => moveResult(-1));
            nextResultBtn.addEventListener("click", () => moveResult(+1));

            // ===== Swipe / Drag (Pointer Events: touch + mouse) =====
            let tracking = false;
            let dragging = false;
            let pointerId = null;

            let startX = 0, startY = 0;
            let lastX = 0, lastTime = 0;
            let lastDx = 0;

            // ★現在の見た目のdx（effDx）を保持して、pointerupでその位置から遷移できるようにする
            let currentEffDx = 0;

            swipeWrap.addEventListener("pointerdown", (e) => {
                if (e.pointerType === "mouse" && e.button !== 0) return;
                if (isInteractive(e.target)) return;
                if (resultIndex < 0) return;

                tracking = true;
                dragging = false;
                pointerId = e.pointerId;

                startX = lastX = e.clientX;
                startY = e.clientY;
                lastTime = performance.now();
                lastDx = 0;
                currentEffDx = 0;

                try { swipeWrap.setPointerCapture(pointerId); } catch { }
            });

            swipeWrap.addEventListener("pointermove", (e) => {
                if (!tracking || e.pointerId !== pointerId) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                if (!dragging) {
                    if (Math.abs(dx) < 10) return;
                    if (Math.abs(dx) < Math.abs(dy) * 1.2) return;
                    dragging = true;
                    swipeWrap.classList.add("swiping");
                    outputEl.style.transition = "none";
                }

                const wrapWidth = swipeWrap.getBoundingClientRect().width || 1;
                const dir = dx > 0 ? "prev" : "next";
                const ok = canMove(dir);

                const absDx = Math.abs(dx);
                let effDx = dx * followFactor(absDx);
                const maxMove = wrapWidth * 0.85;
                effDx = Math.max(-maxMove, Math.min(maxMove, effDx));

                if (!ok) effDx *= 0.35;

                const THRESH = Math.max(90, wrapWidth * 0.22);
                const ready = ok && Math.abs(effDx) >= THRESH;

                swipeWrap.dataset.dir = dir;
                swipeWrap.classList.toggle("swipe-ready", ready);

                underlayEl.textContent = !ok
                    ? "これ以上移動できません"
                    : ready
                        ? (dir === "next" ? "離すと次の結果へ" : "離すと前の結果へ")
                        : (dir === "next" ? "次へスワイプ…" : "前へスワイプ…");

                const p = Math.min(1, Math.abs(effDx) / THRESH);
                underlayEl.style.opacity = String(0.25 + 0.75 * p);

                outputEl.style.transform = `translateX(${effDx}px)`;

                // ★ここを保持
                currentEffDx = effDx;

                lastDx = dx;
                lastX = e.clientX;
                lastTime = performance.now();
            });

            swipeWrap.addEventListener("pointerup", (e) => {
                if (!tracking || e.pointerId !== pointerId) return;

                tracking = false;
                try { swipeWrap.releasePointerCapture(pointerId); } catch { }
                pointerId = null;

                if (!dragging) return;

                dragging = false;

                const dx = e.clientX - startX;
                const wrapWidth = swipeWrap.getBoundingClientRect().width || 1;

                const dir = dx > 0 ? "prev" : "next";
                const ok = canMove(dir);

                const THRESH = Math.max(90, wrapWidth * 0.22);

                // 速度（フリック）
                const dt = Math.max(1, performance.now() - lastTime);
                const vx = (e.clientX - lastX) / dt; // px/ms
                const fast = Math.abs(vx) > 0.75;

                // ★判定は「今の見た目(currentEffDx)」で
                const ready = ok && (Math.abs(currentEffDx) >= THRESH || fast);

                // ★遷移するなら絶対に戻さない（resetSwipeVisualしない）
                if (ready) {
                    moveResult(dir === "prev" ? -1 : +1, {
                        viaSwipe: true,
                        dir,
                        startOffsetPx: currentEffDx, // ★この位置からOUTへ
                    });
                } else {
                    resetSwipeVisual(true);
                }
            });

            swipeWrap.addEventListener("pointercancel", () => {
                tracking = false;
                dragging = false;
                pointerId = null;
                resetSwipeVisual(true);
            });
        })();

        deleteCurrentBtn.addEventListener("click", () => {
            if (resultIndex < 0 || resultIndex >= resultHistory.length) return;

            // 現UI状態をいったん退避（削除後に次の結果へ適用したいので）
            if (outputEl.querySelector(".result-container")) {
                persistedViewState = mergeViewState(persistedViewState, captureViewState());
            }

            const currentNo = resultIndex + 1;
            if (!confirm(`結果 ${currentNo} を削除しますか？`)) return;

            resultHistory.splice(resultIndex, 1);
            saveHistory();

            if (resultHistory.length === 0) {
                resultIndex = -1;
            } else if (resultIndex >= resultHistory.length) {
                resultIndex = resultHistory.length - 1; // 最後を表示
            }
            statusEl.textContent = "この結果を削除しました";
            renderCurrentResult();
        });

        clearHistoryBtn.addEventListener("click", () => {
            if (!resultHistory.length) return;
            if (!confirm("シミュレーション履歴をすべて削除しますか？")) return;

            resultHistory = [];
            resultIndex = -1;
            storage.clearResultHistory();
            statusEl.textContent = "履歴をクリアしました";
            renderCurrentResult();
        });

        renderCurrentResult();

        // ===== Modal close =====
        const presetModal = $("#pokemonPresetModal");
        const presetCloseBtn = $("#pokemonPresetCloseBtn");
        const presetBackdrop = presetModal ? presetModal.querySelector(".preset-modal-backdrop") : null;

        presetCloseBtn?.addEventListener("click", () => ui.closePokemonPresetModal());
        presetBackdrop?.addEventListener("click", () => ui.closePokemonPresetModal());

        // ===== Run simulation =====
        runBtn.addEventListener("click", () => {
            statusEl.textContent = "";

            const skillEventMultiplier = Math.max(0, readNumber("skillEventMultiplier", "1"));
            const energyEventMultiplier = Math.max(0, readNumber("energyEventMultiplier", "1"));
            const helpingSpeedMultiplier = Math.max(0.1, readNumber("helpingSpeedMultiplier", "1"));

            const ingredientBonus = Math.max(0, Math.floor(readNumber("ingredientBonus", "0")));
            const fieldBonusPercent = Math.max(0, readNumber("fieldBonus", "0"));
            const fieldEnergyMultiplier = 1.0 + fieldBonusPercent / 100.0;

            const useCampTicket = $("#campTicket").checked;
            const campTicketConfig = {
                enabled: useCampTicket,
                helpingMult: useCampTicket ? 1.2 : 1.0,
                inventoryBonus: useCampTicket ? 1.2 : 1.0,
            };

            const disableEnergyDecay = $("#disableEnergyDecay").checked;
            const energyDecay = disableEnergyDecay ? 0.0 : 1.0 / 600.0;

            const fieldKey = $("#fieldSelect").value || "wakakusa";
            const fieldConfig = {
                key: fieldKey,
                mainType: $("#fieldMainType").value || "",
                sub1Type: $("#fieldSub1Type").value || "",
                sub2Type: $("#fieldSub2Type").value || "",
                exEffect: fieldKey === "wakakusa_ex" ? $("#exEffect").value || "" : "",
            };

            // collect slot configs
            const slotConfigs = [];
            for (let i = 1; i <= MAX_SLOTS; i++) {
                const card = $(`slot-${i}-card`);
                if (!card || card.style.display === "none") continue;

                const subSkills = ui.getSelectedSubSkillsForSlot(i);
                const selectedPokemonKey = $(`slot-${i}-pokemon`).value;
                const level = Number($(`slot-${i}-level`).value || "1");
                const skillLevel = Number($(`slot-${i}-skillLevel`).value || "1");

                const natureUp = $(`slot-${i}-nature-up`).value || "none";
                const natureDown = $(`slot-${i}-nature-down`).value || "none";
                const natureKey = $(`slot-${i}-nature`).value || "";

                const personalHelpMult = Math.max(0.1, readNumber(`slot-${i}-help-mult`, "1"));
                const personalSkillMult = Math.max(0, readNumber(`slot-${i}-skill-mult`, "1"));
                const personalIngredientBonus = Math.max(0, Math.floor(readNumber(`slot-${i}-ing-bonus`, "0")));

                const activeWeekdayCb = $(`slot-${i}-active-always-weekday`);
                const activeSundayCb = $(`slot-${i}-active-always-sunday`);

                const activeLimitChanceWeekday = Math.max(0, Math.min(70, readNumber(`slot-${i}-limit-chance-weekday`, "70"))) + (activeWeekdayCb && activeWeekdayCb.checked ? 100 : 0);
                const activeLimitChanceSunday = Math.max(0, Math.min(70, readNumber(`slot-${i}-limit-chance-sunday`, "70"))) + (activeSundayCb && activeSundayCb.checked ? 100 : 0);
                slotConfigs.push({
                    slotIndex: i,
                    subSkills,
                    selectedPokemonKey,
                    level,
                    skillLevel,
                    natureUp,
                    natureDown,
                    natureKey,
                    personalHelpMult,
                    personalSkillMult,
                    personalIngredientBonus,
                    activeLimitChanceWeekday,
                    activeLimitChanceSunday,
                });
            }

            if (!slotConfigs.length) {
                statusEl.textContent = "少なくとも 1 匹は表示されたポケモンを使ってください。";
                return;
            }

            // team helping bonus count
            const teamHelpingBonusCount = slotConfigs.reduce((cnt, cfg) => {
                const selfCount = cfg.subSkills.filter((s) => s === SubSkills.HelpingBonus).length;
                return cnt + selfCount;
            }, 0);

            const pokemons = slotConfigs.map((cfg) => {
                const pokemonData = PokemonList[cfg.selectedPokemonKey];
                const nature = PS.createNatureFromUpDown(cfg.natureUp, cfg.natureDown, cfg.natureKey);
                const pokemonName = `${pokemonData.name}${cfg.slotIndex}`;

                const f = ui.getFieldEffectForType(pokemonData.type, fieldConfig);

                const selfHelpingBonusCount = cfg.subSkills.filter((s) => s === SubSkills.HelpingBonus).length;
                const extraHelpingBonus = Math.max(0, teamHelpingBonusCount - selfHelpingBonusCount);
                const teamSubSkills = Array.from({ length: extraHelpingBonus }, () => SubSkills.HelpingBonus);

                const activeLimitChanceWeekday = cfg.activeLimitChanceWeekday / 100.0;
                const activeLimitChanceSunday = cfg.activeLimitChanceSunday / 100.0;

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
                    f.effectLabel,
                    fieldEnergyMultiplier,
                    energyDecay,
                    activeLimitChanceWeekday,
                    activeLimitChanceSunday
                );
            });

            const recipeEnergy = readNumber("recipeEnergy", "0");
            const trials = readNumber("trials", "1000");

            const day1ChancePercentInput = readNumber("day1SuccessChance", "0");
            const day1ChancePercent = Math.max(0, Math.min(day1ChancePercentInput, 70));

            const simulator = new Simulator();
            simulator.first_day_base_success_chance = day1ChancePercent / 100.0;
            simulator.cooking_energy_event_multiplier = energyEventMultiplier;
            simulator.field_energy_multiplier = fieldEnergyMultiplier;

            if (!ui.applyScheduleFromUI(simulator)) {
                statusEl.textContent = "時間設定にエラーがあります。";
                return;
            }

            runBtn.disabled = true;
            statusEl.textContent = `シミュレーション中…（試行回数: ${trials}）`;

            setTimeout(() => {
                const avg = simulator.simulate(trials, pokemons, recipeEnergy);

                const timestampStr = new Date().toLocaleString("ja-JP");

                const sched = {
                    wake: $("#wakeTime").value,
                    breakfast: $("#breakfastTime").value,
                    lunch: $("#lunchTime").value,
                    dinner: $("#dinnerTime").value,
                    sleep: $("#sleepTime").value,
                };

                const fieldLabel = Fields[fieldKey]?.label || fieldKey;

                const result = {
                    timestampStr,
                    summary: {
                        extraEnergyByDay: avg.extraEnergyByDay,
                        successCountByDay: avg.successCountByDay,
                        energyBreakdown: {
                            baseByDay: avg.baseEnergyByDay,
                            carryOverByDay: avg.carryOverEnergyByDay,
                            cookingEnergyByPokemonByDay: avg.cookingEnergyByPokemonByDay,
                            berryEnergyByPokemonByDay: avg.berryEnergyByPokemonByDay,
                            skillCountByPokemonByDay: avg.skillCountByPokemonByDay,
                            activeSecondsByPokemonByDay: avg.activeSecondsByPokemonByDay,
                        },
                    },
                    pokemons: pokemons.map((pkm, idx) => {
                        const totalHelpMult =
                            pkm.personal_helping_speed_multiplier *
                            pkm.team_helping_speed_multiplier *
                            pkm.ex_helping_speed_multiplier *
                            pkm.camp_ticket_helping_speed_multiplier;

                        const helpEffectiveTime = pkm.helping_speed / totalHelpMult;

                        const totalIngBonus = pkm.personal_ingredient_bonus + pkm.team_ingredient_bonus + pkm.ex_ingredient_bonus;

                        const skillMultTotal = pkm.personal_skill_multiplier * pkm.team_skill_multiplier * pkm.ex_skill_multiplier;
                        const finalSkillProb = pkm.skill_probability * skillMultTotal;

                        const fInfo = ui.getFieldEffectForType(pkm.pokemon_data.type, fieldConfig);

                        return {
                            index: idx + 1,
                            pokemonKey: pkm.pokemon_data.key,
                            natureUp: pkm.nature.up,
                            natureDown: pkm.nature.down,
                            natureKey: pkm.nature.key,
                            natureName: pkm.nature.name,
                            subSkillKeys: pkm.sub_skills.map((s) => s.key),
                            teamSubSkillKeys: pkm.team_sub_skills.map((s) => s.key),
                            name: pkm.pokemon_data.name,
                            type: pkm.pokemon_data.type,
                            level: pkm.level,
                            skillLevel: pkm.skill_level,
                            berryName: pkm.pokemon_data.berry.name,
                            berryNum: pkm.berry_num,
                            berryEnergyMultiplier: pkm.berry_energy_multiplier,
                            helpBase: pkm.helping_speed,
                            helpTotalMult: totalHelpMult,
                            helpEffectiveTime,
                            ingredientProb: pkm.ingredient_probability,
                            ingredientBonusTotal: totalIngBonus,
                            skillBaseProb: pkm.skill_probability,
                            skillMultTotal,
                            skillFinalProb: finalSkillProb,
                            skillEffectPercent: pkm.skill_effect * 100,
                            inventoryLimit: pkm.inventory_limit,
                            exEffectLabel: pkm.ex_effect_label,
                            subSkillsLabel: pkm.sub_skills.length ? pkm.sub_skills.map((s) => s.name).join(", ") : "なし",
                            teamSubSkillsLabel: pkm.team_sub_skills.length ? pkm.team_sub_skills.map((s) => s.name).join(", ") : "なし",
                            personal: {
                                helpMult: pkm.personal_helping_speed_multiplier,
                                ingBonus: pkm.personal_ingredient_bonus,
                                skillMult: pkm.personal_skill_multiplier,
                            },
                            matchesFieldType: fInfo.matchesFieldType,
                            isMainType: fInfo.isMainType && fieldKey === "wakakusa_ex",
                            activeLimitChanceWeekday: pkm.active_chance_limit_weekday * 100,
                            activeLimitChanceSunday: pkm.active_chance_limit_sunday * 100,
                        };
                    }),
                    settings: {
                        recipeEnergy,
                        trials,
                        day1ChancePercent,
                        useCampTicket,
                        campTicket: campTicketConfig,
                        disableEnergyDecay,
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
                            fieldEnergyMultiplier,
                        },
                        events: {
                            helpingSpeedMultiplier,
                            ingredientBonus,
                            skillEventMultiplier,
                            energyEventMultiplier,
                        },
                    },
                };

                resultHistory.push(result);
                resultIndex = resultHistory.length - 1;
                saveHistory();
                renderCurrentResult();

                statusEl.textContent = "シミュレーション完了";
                runBtn.disabled = false;
            }, 10);
        });
    });
})();
