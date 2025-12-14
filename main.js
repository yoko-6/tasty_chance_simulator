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
                clearHistoryBtn.disabled = true;
                return;
            }

            const current = resultHistory[resultIndex];
            outputEl.innerHTML = ui.buildResultHtml(current);
            ui.attachResultPresetSaveHandlers(current);
            ui.renderEnergyChart(current);

            resultPageInfo.textContent = `結果 ${resultIndex + 1} / ${totalPages}（最新: ${totalPages}）`;
            prevResultBtn.disabled = resultIndex <= 0;
            nextResultBtn.disabled = resultIndex >= totalPages - 1;
            clearHistoryBtn.disabled = totalPages === 0;
        };

        prevResultBtn.addEventListener("click", () => {
            if (resultIndex > 0) {
                resultIndex -= 1;
                renderCurrentResult();
            }
        });

        nextResultBtn.addEventListener("click", () => {
            if (resultIndex < resultHistory.length - 1) {
                resultIndex += 1;
                renderCurrentResult();
            }
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
