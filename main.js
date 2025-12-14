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

                let natureKey = $(`slot-${i}-nature`).value;
                if (!natureKey || !Natures[natureKey]) natureKey = "Hardy";

                const personalHelpMult = Math.max(0.1, readNumber(`slot-${i}-help-mult`, "1"));
                const personalSkillMult = Math.max(0, readNumber(`slot-${i}-skill-mult`, "1"));
                const personalIngredientBonus = Math.max(0, Math.floor(readNumber(`slot-${i}-ing-bonus`, "0")));

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

            console.log("Slot Configs:", slotConfigs);

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
                const nature = Natures[cfg.natureKey];
                const pokemonName = `${pokemonData.name}${cfg.slotIndex}`;

                const f = ui.getFieldEffectForType(pokemonData.type, fieldConfig);

                const selfHelpingBonusCount = cfg.subSkills.filter((s) => s === SubSkills.HelpingBonus).length;
                const extraHelpingBonus = Math.max(0, teamHelpingBonusCount - selfHelpingBonusCount);
                const teamSubSkills = Array.from({ length: extraHelpingBonus }, () => SubSkills.HelpingBonus);

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
                    energyDecay
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

                const sundayExtraEnergy = perDay[6] || 0;
                const sundayBaseEnergy = baseEnergyPerDay[6] || 0;
                const sundayCarryOverEnergy = carryOverEnergyPerDay[6] || 0;

                const withoutSundayExtraEnergy = perDay.slice(0, 6).reduce((s, v) => s + v, 0);
                const withoutSundayBaseEnergy = baseEnergyPerDay.slice(0, 6).reduce((s, v) => s + v, 0);
                const withoutSundayCarryOverEnergy = carryOverEnergyPerDay.slice(0, 6).reduce((s, v) => s + v, 0);

                const perPokemonExtraPerDay =
                    pokemons.length > 0 ? Math.max(0, (avgExtraPerDay - baseAvgPerDay - carryAvgPerDay) / pokemons.length) : 0;

                const sundayPerPokemonExtra =
                    pokemons.length > 0 ? Math.max(0, (sundayExtraEnergy - sundayBaseEnergy - sundayCarryOverEnergy) / pokemons.length) : 0;

                const withoutSundayPerPokemonExtraPerDay =
                    pokemons.length > 0
                        ? Math.max(0, (withoutSundayExtraEnergy - withoutSundayBaseEnergy - withoutSundayCarryOverEnergy) / pokemons.length / 6)
                        : 0;

                const cookingEnergyPerPokemonPerDay = pokemons.map((_, idx) => simulator.average_cooking_energies_per_pokemon_per_day[idx].slice());
                const berryEnergyPerPokemonPerDay = pokemons.map((_, idx) => simulator.average_berry_energies_per_pokemon_per_day[idx].slice());

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
                        avgSkill,
                        avgSuccess,
                        avgExtraPerDay,
                        perPokemonExtraPerDay,
                        perDayValues: perDay,
                        withoutSundayPerPokemonExtraPerDay,
                        sundayPerPokemonExtra,
                        energyBreakdown: {
                            basePerDay: baseEnergyPerDay,
                            carryOverPerDay: carryOverEnergyPerDay,
                            cookingPerPokemonPerDay: cookingEnergyPerPokemonPerDay,
                            berryPerPokemonPerDay: berryEnergyPerPokemonPerDay,
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
                            natureKey: pkm.nature.key,
                            subSkillKeys: pkm.sub_skills.map((s) => s.key),
                            teamSubSkillKeys: pkm.team_sub_skills.map((s) => s.key),
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
                            skillBaseProb: pkm.skill_probability,
                            skillMultTotal,
                            skillFinalProb: finalSkillProb,
                            skillEffectPercent: pkm.skill_effect * 100,
                            inventoryLimit: pkm.inventory_limit,
                            exEffectLabel: pkm.ex_effect_label,
                            perDayBerryEnergy: avgBerryEnergies[idx],
                            perDaySkillCount: avgSkillCounts[idx],
                            perDaySkillEnergy: avgSkillEnergies[idx],
                            subSkillsLabel: pkm.sub_skills.length ? pkm.sub_skills.map((s) => s.name).join(", ") : "なし",
                            teamSubSkillsLabel: pkm.team_sub_skills.length ? pkm.team_sub_skills.map((s) => s.name).join(", ") : "なし",
                            personal: {
                                helpMult: pkm.personal_helping_speed_multiplier,
                                ingBonus: pkm.personal_ingredient_bonus,
                                skillMult: pkm.personal_skill_multiplier,
                            },
                            matchesFieldType: fInfo.matchesFieldType,
                            isMainType: fInfo.isMainType && fieldKey === "wakakusa_ex",
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
