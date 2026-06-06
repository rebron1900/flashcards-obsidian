import { __extends } from "tslib";
import { Notice, PluginSettingTab, Setting } from "obsidian";
import { Anki } from "src/services/anki";
import { escapeRegExp } from "src/utils";
var SettingsTab = /** @class */ (function (_super) {
    __extends(SettingsTab, _super);
    function SettingsTab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SettingsTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        var plugin = this.plugin;
        containerEl.empty();
        // ── Template Config Section ──
        containerEl.createEl("h2", { text: "Custom Templates" });
        containerEl.createEl("p", {
            text: "Configure custom Anki note models. Cards in matching paths use the specified model.",
            cls: "setting-item-description"
        });
        // Render existing template configs
        var configs = plugin.settings.templateConfigs || [];
        for (var i = 0; i < configs.length; i++) {
            this.renderTemplateConfig(containerEl, plugin, configs[i], i);
        }
        // Add new template button
        new Setting(containerEl).addButton(function (btn) {
            btn.setButtonText("+ Add Template").onClick(function () {
                var newConfig = {
                    modelName: "执业中药师-详情卡",
                    filePathPattern: "77-Anki/执业中药师/**",
                    parseMode: "list-field",
                    enabled: true,
                };
                plugin.settings.templateConfigs.push(newConfig);
                plugin.saveData(plugin.settings);
                _this.display(); // re-render
            });
        });
        containerEl.createEl("hr");
        // ── Original Settings ──
        containerEl.createEl("h1", { text: "Flashcards - Settings" });
        // ... (keep all original settings below)
        var description = createFragment();
        description.append("This needs to be done only one time. Open Anki and click the button to grant permission.", createEl('br'), 'Be aware that AnkiConnect must be installed.');
        new Setting(containerEl)
            .setName("Give Permission")
            .setDesc(description)
            .addButton(function (button) {
            button.setButtonText("Grant Permission").onClick(function () {
                new Anki().requestPermission().then(function (result) {
                    if (result.permission === "granted") {
                        plugin.settings.ankiConnectPermission = true;
                        plugin.saveData(plugin.settings);
                        new Notice("Anki Connect permission granted");
                    }
                    else {
                        new Notice("AnkiConnect permission not granted");
                    }
                }).catch(function (error) {
                    new Notice("Something went wrong, is Anki open?");
                    console.error(error);
                });
            });
        });
        new Setting(containerEl)
            .setName("Test Anki")
            .setDesc("Test that connection between Anki and Obsidian actually works.")
            .addButton(function (text) {
            text.setButtonText("Test").onClick(function () {
                new Anki()
                    .ping()
                    .then(function () { return new Notice("Anki works"); })
                    .catch(function () { return new Notice("Anki is not connected"); });
            });
        });
        containerEl.createEl("h2", { text: "General" });
        new Setting(containerEl)
            .setName("Context-aware mode")
            .setDesc("Add the ancestor headings to the question of the flashcard.")
            .addToggle(function (toggle) {
            return toggle.setValue(plugin.settings.contextAwareMode).onChange(function (value) {
                plugin.settings.contextAwareMode = value;
                plugin.saveData(plugin.settings);
            });
        });
        new Setting(containerEl)
            .setName("Source support")
            .setDesc("Add to every card the source, i.e. the link to the original card. NOTE: Old cards made without source support cannot be updated.")
            .addToggle(function (toggle) {
            return toggle.setValue(plugin.settings.sourceSupport).onChange(function (value) {
                plugin.settings.sourceSupport = value;
                plugin.saveData(plugin.settings);
            });
        });
        new Setting(containerEl)
            .setName("Code highlight support")
            .setDesc("Add highlight of the code in Anki.")
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.codeHighlightSupport)
                .onChange(function (value) {
                plugin.settings.codeHighlightSupport = value;
                plugin.saveData(plugin.settings);
            });
        });
        new Setting(containerEl)
            .setName("Inline ID support")
            .setDesc("Add ID to end of line for inline cards.")
            .addToggle(function (toggle) {
            return toggle.setValue(plugin.settings.inlineID).onChange(function (value) {
                plugin.settings.inlineID = value;
                plugin.saveData(plugin.settings);
            });
        });
        new Setting(containerEl)
            .setName("Folder-based deck name")
            .setDesc("Add ID to end of line for inline cards.")
            .addToggle(function (toggle) {
            return toggle.setValue(plugin.settings.folderBasedDeck).onChange(function (value) {
                plugin.settings.folderBasedDeck = value;
                plugin.saveData(plugin.settings);
            });
        });
        new Setting(containerEl)
            .setName("Default deck name")
            .setDesc("The name of the default deck where the cards will be added when not specified.")
            .addText(function (text) {
            text
                .setValue(plugin.settings.deck)
                .setPlaceholder("Deck::sub-deck")
                .onChange(function (value) {
                if (value.length) {
                    plugin.settings.deck = value;
                    plugin.saveData(plugin.settings);
                }
                else {
                    new Notice("The deck name must be at least 1 character long");
                }
            });
        });
        new Setting(containerEl)
            .setName("Default Anki tag")
            .setDesc("This tag will be added to each generated card on Anki")
            .addText(function (text) {
            text
                .setValue(plugin.settings.defaultAnkiTag)
                .setPlaceholder("Anki tag")
                .onChange(function (value) {
                if (!value)
                    new Notice("No default tags will be added");
                plugin.settings.defaultAnkiTag = value.toLowerCase();
                plugin.saveData(plugin.settings);
            });
        });
        containerEl.createEl("h2", { text: "Cards Identification" });
        new Setting(containerEl)
            .setName("Flashcards #tag")
            .setDesc("The tag to identify the flashcards in the notes (case-insensitive).")
            .addText(function (text) {
            text
                .setValue(plugin.settings.flashcardsTag)
                .setPlaceholder("Card")
                .onChange(function (value) {
                if (value) {
                    plugin.settings.flashcardsTag = value.toLowerCase();
                    plugin.saveData(plugin.settings);
                }
                else {
                    new Notice("The tag must be at least 1 character long");
                }
            });
        });
        new Setting(containerEl)
            .setName("Inline card separator")
            .setDesc("The separator to identifty the inline cards in the notes.")
            .addText(function (text) {
            text
                .setValue(plugin.settings.inlineSeparator)
                .setPlaceholder("::")
                .onChange(function (value) {
                // if the value is empty or is the same like the inlineseparatorreverse then set it to the default, otherwise save it
                if (value.trim().length === 0 || value === plugin.settings.inlineSeparatorReverse) {
                    plugin.settings.inlineSeparator = "::";
                    if (value.trim().length === 0) {
                        new Notice("The separator must be at least 1 character long");
                    }
                    else if (value === plugin.settings.inlineSeparatorReverse) {
                        new Notice("The separator must be different from the inline reverse separator");
                    }
                }
                else {
                    plugin.settings.inlineSeparator = escapeRegExp(value.trim());
                    new Notice("The separator has been changed");
                }
                plugin.saveData(plugin.settings);
            });
        });
        new Setting(containerEl)
            .setName("Inline reverse card separator")
            .setDesc("The separator to identifty the inline revese cards in the notes.")
            .addText(function (text) {
            text
                .setValue(plugin.settings.inlineSeparatorReverse)
                .setPlaceholder(":::")
                .onChange(function (value) {
                // if the value is empty or is the same like the inlineseparatorreverse then set it to the default, otherwise save it
                if (value.trim().length === 0 || value === plugin.settings.inlineSeparator) {
                    plugin.settings.inlineSeparatorReverse = ":::";
                    if (value.trim().length === 0) {
                        new Notice("The separator must be at least 1 character long");
                    }
                    else if (value === plugin.settings.inlineSeparator) {
                        new Notice("The separator must be different from the inline separator");
                    }
                }
                else {
                    plugin.settings.inlineSeparatorReverse = escapeRegExp(value.trim());
                    new Notice("The separator has been changed");
                }
                plugin.saveData(plugin.settings);
            });
        });
    };
    // ═══════════════════════════════════════════════
    // Template Config UI
    // ═══════════════════════════════════════════════
    SettingsTab.prototype.renderTemplateConfig = function (containerEl, plugin, config, index) {
        var _this = this;
        var setting = new Setting(containerEl);
        setting.setName("Template #".concat(index + 1, ": ").concat(config.modelName));
        setting.setDesc("Path: ".concat(config.filePathPattern, " | Mode: ").concat(config.parseMode));
        // Model name
        setting.addText(function (text) {
            return text
                .setValue(config.modelName)
                .setPlaceholder("Model name")
                .onChange(function (value) {
                plugin.settings.templateConfigs[index].modelName = value;
                plugin.saveData(plugin.settings);
            });
        });
        // Parse mode dropdown
        setting.addDropdown(function (dd) {
            return dd
                .addOption("card-tag", "#card")
                .addOption("list-field", "list-field")
                .addOption("inline", "inline")
                .addOption("cloze", "cloze")
                .setValue(config.parseMode)
                .onChange(function (value) {
                plugin.settings.templateConfigs[index].parseMode = value;
                plugin.saveData(plugin.settings);
            });
        });
        // Enable/disable toggle
        setting.addToggle(function (toggle) {
            return toggle.setValue(config.enabled).onChange(function (value) {
                plugin.settings.templateConfigs[index].enabled = value;
                plugin.saveData(plugin.settings);
            });
        });
        // Delete button
        setting.addExtraButton(function (btn) {
            btn
                .setIcon("trash")
                .setTooltip("Delete template")
                .onClick(function () {
                plugin.settings.templateConfigs.splice(index, 1);
                plugin.saveData(plugin.settings);
                _this.display();
            });
        });
        // File path pattern (separate setting line for clarity)
        new Setting(containerEl)
            .setName("  File path pattern")
            .setDesc("e.g. 77-Anki/执业中药师/**")
            .addText(function (text) {
            return text
                .setValue(config.filePathPattern)
                .setPlaceholder("path/pattern/**")
                .onChange(function (value) {
                plugin.settings.templateConfigs[index].filePathPattern = value;
                plugin.saveData(plugin.settings);
            });
        });
    };
    return SettingsTab;
}(PluginSettingTab));
export { SettingsTab };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MtdGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2V0dGluZ3MtdGFiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUd6QztJQUFpQywrQkFBZ0I7SUFBakQ7O0lBZ1VFLENBQUM7SUEvVEQsNkJBQU8sR0FBUDtRQUFBLGlCQW9QQztRQW5QUyxJQUFBLFdBQVcsR0FBSyxJQUFJLFlBQVQsQ0FBVTtRQUM3QixJQUFNLE1BQU0sR0FBSSxJQUFZLENBQUMsTUFBTSxDQUFDO1FBRXBDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVwQixnQ0FBZ0M7UUFDaEMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO1lBQ3hCLElBQUksRUFBRSxxRkFBcUY7WUFDM0YsR0FBRyxFQUFFLDBCQUEwQjtTQUNoQyxDQUFDLENBQUM7UUFFSCxtQ0FBbUM7UUFDbkMsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDO1FBQ3RELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUMvRDtRQUVELDBCQUEwQjtRQUMxQixJQUFJLE9BQU8sQ0FBQyxXQUFXLENB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Q2pDLEtBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsd0RBQXdEO1FBQ3hELElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQzthQUN2QixPQUFPLENBQUMscUJBQXFCLENBQUM7YUFDOUIsT0FBTyxDQUFDLHVCQUF1QixDQUFDO2FBQ2hDLE9BQU8sQ0FBQyxVQUFDLElBQUk7WUFDWixPQUFBLElBQUk7aUJBQ0QsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7aUJBQ2hDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQztpQkFDakMsUUFBUSxDQUFDLFVBQUMsS0FBSztnQkFDZCxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO2dCQUMvRCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUM7UUFOSixDQU1JLENBQ0wsQ0FBQztJQUNGLENBQUM7SUFDRCxrQkFBQztBQUFELENBQUMsQUFoVUgsQ0FBaUMsZ0JBQWdCLEdBZ1U5QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5vdGljZSwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgQW5raSB9IGZyb20gXCJzcmMvc2VydmljZXMvYW5raVwiO1xuaW1wb3J0IHsgZXNjYXBlUmVnRXhwIH0gZnJvbSBcInNyYy91dGlsc1wiO1xuaW1wb3J0IHsgSVRlbXBsYXRlQ29uZmlnIH0gZnJvbSBcInNyYy9jb25mL3NldHRpbmdzXCI7XG5cbmV4cG9ydCBjbGFzcyBTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29uc3QgcGx1Z2luID0gKHRoaXMgYXMgYW55KS5wbHVnaW47XG5cbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgLy8g4pSA4pSAIFRlbXBsYXRlIENvbmZpZyBTZWN0aW9uIOKUgOKUgFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIkN1c3RvbSBUZW1wbGF0ZXNcIiB9KTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcInBcIiwge1xuICAgICAgdGV4dDogXCJDb25maWd1cmUgY3VzdG9tIEFua2kgbm90ZSBtb2RlbHMuIENhcmRzIGluIG1hdGNoaW5nIHBhdGhzIHVzZSB0aGUgc3BlY2lmaWVkIG1vZGVsLlwiLFxuICAgICAgY2xzOiBcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiXG4gICAgfSk7XG5cbiAgICAvLyBSZW5kZXIgZXhpc3RpbmcgdGVtcGxhdGUgY29uZmlnc1xuICAgIGNvbnN0IGNvbmZpZ3MgPSBwbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVDb25maWdzIHx8IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29uZmlncy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5yZW5kZXJUZW1wbGF0ZUNvbmZpZyhjb250YWluZXJFbCwgcGx1Z2luLCBjb25maWdzW2ldLCBpKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgbmV3IHRlbXBsYXRlIGJ1dHRvblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKS5hZGRCdXR0b24oKGJ0bikgPT4ge1xuICAgICAgYnRuLnNldEJ1dHRvblRleHQoXCIrIEFkZCBUZW1wbGF0ZVwiKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgY29uc3QgbmV3Q29uZmlnOiBJVGVtcGxhdGVDb25maWcgPSB7XG4gICAgICAgICAgbW9kZWxOYW1lOiBcIuaJp+S4muS4reiNr+W4iC3or6bmg4XljaFcIixcbiAgICAgICAgICBmaWxlUGF0aFBhdHRlcm46IFwiNzctQW5raS/miafkuJrkuK3oja/luIgvKipcIixcbiAgICAgICAgICBwYXJzZU1vZGU6IFwibGlzdC1maWVsZFwiLFxuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIH07XG4gICAgICAgIHBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZUNvbmZpZ3MucHVzaChuZXdDb25maWcpO1xuICAgICAgICBwbHVnaW4uc2F2ZURhdGEocGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5KCk7IC8vIHJlLXJlbmRlclxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImhyXCIpO1xuXG4gICAgLy8g4pSA4pSAIE9yaWdpbmFsIFNldHRpbmdzIOKUgOKUgFxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDFcIiwgeyB0ZXh0OiBcIkZsYXNoY2FyZHMgLSBTZXR0aW5nc1wiIH0pO1xuXG4gICAgLy8gLi4uIChrZWVwIGFsbCBvcmlnaW5hbCBzZXR0aW5ncyBiZWxvdylcblxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gY3JlYXRlRnJhZ21lbnQoKVxuICAgIGRlc2NyaXB0aW9uLmFwcGVuZChcbiAgICAgIFwiVGhpcyBuZWVkcyB0byBiZSBkb25lIG9ubHkgb25lIHRpbWUuIE9wZW4gQW5raSBhbmQgY2xpY2sgdGhlIGJ1dHRvbiB0byBncmFudCBwZXJtaXNzaW9uLlwiLFxuICAgICAgICAgIGNyZWF0ZUVsKCdicicpLFxuICAgICAgICAnQmUgYXdhcmUgdGhhdCBBbmtpQ29ubmVjdCBtdXN0IGJlIGluc3RhbGxlZC4nLFxuICAgIClcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJHaXZlIFBlcm1pc3Npb25cIilcbiAgICAgIC5zZXREZXNjKGRlc2NyaXB0aW9uKVxuICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgIGJ1dHRvbi5zZXRCdXR0b25UZXh0KFwiR3JhbnQgUGVybWlzc2lvblwiKS5vbkNsaWNrKCgpID0+IHtcblxuICAgICAgICAgIG5ldyBBbmtpKCkucmVxdWVzdFBlcm1pc3Npb24oKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQucGVybWlzc2lvbiA9PT0gXCJncmFudGVkXCIpIHtcbiAgICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmFua2lDb25uZWN0UGVybWlzc2lvbiA9IHRydWU7XG4gICAgICAgICAgICAgIHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICAgICAgICBuZXcgTm90aWNlKFwiQW5raSBDb25uZWN0IHBlcm1pc3Npb24gZ3JhbnRlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJBbmtpQ29ubmVjdCBwZXJtaXNzaW9uIG5vdCBncmFudGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgbmV3IE5vdGljZShcIlNvbWV0aGluZyB3ZW50IHdyb25nLCBpcyBBbmtpIG9wZW4/XCIpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIFxuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlRlc3QgQW5raVwiKVxuICAgICAgLnNldERlc2MoXCJUZXN0IHRoYXQgY29ubmVjdGlvbiBiZXR3ZWVuIEFua2kgYW5kIE9ic2lkaWFuIGFjdHVhbGx5IHdvcmtzLlwiKVxuICAgICAgLmFkZEJ1dHRvbigodGV4dCkgPT4ge1xuICAgICAgICB0ZXh0LnNldEJ1dHRvblRleHQoXCJUZXN0XCIpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgIG5ldyBBbmtpKClcbiAgICAgICAgICAgIC5waW5nKClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IG5ldyBOb3RpY2UoXCJBbmtpIHdvcmtzXCIpKVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IG5ldyBOb3RpY2UoXCJBbmtpIGlzIG5vdCBjb25uZWN0ZWRcIikpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICBcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJHZW5lcmFsXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ29udGV4dC1hd2FyZSBtb2RlXCIpXG4gICAgICAuc2V0RGVzYyhcIkFkZCB0aGUgYW5jZXN0b3IgaGVhZGluZ3MgdG8gdGhlIHF1ZXN0aW9uIG9mIHRoZSBmbGFzaGNhcmQuXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuY29udGV4dEF3YXJlTW9kZSkub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmNvbnRleHRBd2FyZU1vZGUgPSB2YWx1ZTtcbiAgICAgICAgICBwbHVnaW4uc2F2ZURhdGEocGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU291cmNlIHN1cHBvcnRcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkFkZCB0byBldmVyeSBjYXJkIHRoZSBzb3VyY2UsIGkuZS4gdGhlIGxpbmsgdG8gdGhlIG9yaWdpbmFsIGNhcmQuIE5PVEU6IE9sZCBjYXJkcyBtYWRlIHdpdGhvdXQgc291cmNlIHN1cHBvcnQgY2Fubm90IGJlIHVwZGF0ZWQuXCJcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5zb3VyY2VTdXBwb3J0KS5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICBwbHVnaW4uc2V0dGluZ3Muc291cmNlU3VwcG9ydCA9IHZhbHVlO1xuICAgICAgICAgIHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJDb2RlIGhpZ2hsaWdodCBzdXBwb3J0XCIpXG4gICAgICAuc2V0RGVzYyhcIkFkZCBoaWdobGlnaHQgb2YgdGhlIGNvZGUgaW4gQW5raS5cIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5jb2RlSGlnaGxpZ2h0U3VwcG9ydClcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuY29kZUhpZ2hsaWdodFN1cHBvcnQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJJbmxpbmUgSUQgc3VwcG9ydFwiKVxuICAgICAgLnNldERlc2MoXCJBZGQgSUQgdG8gZW5kIG9mIGxpbmUgZm9yIGlubGluZSBjYXJkcy5cIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5pbmxpbmVJRCkub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmlubGluZUlEID0gdmFsdWU7XG4gICAgICAgICAgcGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XG4gICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkZvbGRlci1iYXNlZCBkZWNrIG5hbWVcIilcbiAgICAgIC5zZXREZXNjKFwiQWRkIElEIHRvIGVuZCBvZiBsaW5lIGZvciBpbmxpbmUgY2FyZHMuXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuZm9sZGVyQmFzZWREZWNrKS5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuZm9sZGVyQmFzZWREZWNrID0gdmFsdWU7XG4gICAgICAgICAgcGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XG4gICAgICAgIH0pXG4gICAgICApO1xuXG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRGVmYXVsdCBkZWNrIG5hbWVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIlRoZSBuYW1lIG9mIHRoZSBkZWZhdWx0IGRlY2sgd2hlcmUgdGhlIGNhcmRzIHdpbGwgYmUgYWRkZWQgd2hlbiBub3Qgc3BlY2lmaWVkLlwiXG4gICAgICApXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5kZWNrKVxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIkRlY2s6OnN1Yi1kZWNrXCIpXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuZGVjayA9IHZhbHVlO1xuICAgICAgICAgICAgICBwbHVnaW4uc2F2ZURhdGEocGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJUaGUgZGVjayBuYW1lIG11c3QgYmUgYXQgbGVhc3QgMSBjaGFyYWN0ZXIgbG9uZ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoXCJEZWZhdWx0IEFua2kgdGFnXCIpXG4gICAgICAgIC5zZXREZXNjKFwiVGhpcyB0YWcgd2lsbCBiZSBhZGRlZCB0byBlYWNoIGdlbmVyYXRlZCBjYXJkIG9uIEFua2lcIilcbiAgICAgICAgLmFkZFRleHQoKHRleHQpID0+IHtcbiAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLmRlZmF1bHRBbmtpVGFnKVxuICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiQW5raSB0YWdcIilcbiAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCF2YWx1ZSkgbmV3IE5vdGljZShcIk5vIGRlZmF1bHQgdGFncyB3aWxsIGJlIGFkZGVkXCIpO1xuICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuZGVmYXVsdEFua2lUYWcgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICBwbHVnaW4uc2F2ZURhdGEocGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIkNhcmRzIElkZW50aWZpY2F0aW9uXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRmxhc2hjYXJkcyAjdGFnXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJUaGUgdGFnIHRvIGlkZW50aWZ5IHRoZSBmbGFzaGNhcmRzIGluIHRoZSBub3RlcyAoY2FzZS1pbnNlbnNpdGl2ZSkuXCJcbiAgICAgIClcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiB7XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLmZsYXNoY2FyZHNUYWcpXG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiQ2FyZFwiKVxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuZmxhc2hjYXJkc1RhZyA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgIHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbmV3IE5vdGljZShcIlRoZSB0YWcgbXVzdCBiZSBhdCBsZWFzdCAxIGNoYXJhY3RlciBsb25nXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIklubGluZSBjYXJkIHNlcGFyYXRvclwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiVGhlIHNlcGFyYXRvciB0byBpZGVudGlmdHkgdGhlIGlubGluZSBjYXJkcyBpbiB0aGUgbm90ZXMuXCJcbiAgICAgIClcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiB7XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLmlubGluZVNlcGFyYXRvcilcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCI6OlwiKVxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIC8vIGlmIHRoZSB2YWx1ZSBpcyBlbXB0eSBvciBpcyB0aGUgc2FtZSBsaWtlIHRoZSBpbmxpbmVzZXBhcmF0b3JyZXZlcnNlIHRoZW4gc2V0IGl0IHRvIHRoZSBkZWZhdWx0LCBvdGhlcndpc2Ugc2F2ZSBpdFxuICAgICAgICAgICAgaWYgKHZhbHVlLnRyaW0oKS5sZW5ndGggPT09IDAgfHwgdmFsdWUgPT09IHBsdWdpbi5zZXR0aW5ncy5pbmxpbmVTZXBhcmF0b3JSZXZlcnNlKSB7XG4gICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5pbmxpbmVTZXBhcmF0b3IgPSBcIjo6XCI7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZS50cmltKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbmV3IE5vdGljZShcIlRoZSBzZXBhcmF0b3IgbXVzdCBiZSBhdCBsZWFzdCAxIGNoYXJhY3RlciBsb25nXCIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBwbHVnaW4uc2V0dGluZ3MuaW5saW5lU2VwYXJhdG9yUmV2ZXJzZSkge1xuICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJUaGUgc2VwYXJhdG9yIG11c3QgYmUgZGlmZmVyZW50IGZyb20gdGhlIGlubGluZSByZXZlcnNlIHNlcGFyYXRvclwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmlubGluZVNlcGFyYXRvciA9IGVzY2FwZVJlZ0V4cCh2YWx1ZS50cmltKCkpO1xuICAgICAgICAgICAgICBuZXcgTm90aWNlKFwiVGhlIHNlcGFyYXRvciBoYXMgYmVlbiBjaGFuZ2VkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuXG4gICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJJbmxpbmUgcmV2ZXJzZSBjYXJkIHNlcGFyYXRvclwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiVGhlIHNlcGFyYXRvciB0byBpZGVudGlmdHkgdGhlIGlubGluZSByZXZlc2UgY2FyZHMgaW4gdGhlIG5vdGVzLlwiXG4gICAgICApXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5pbmxpbmVTZXBhcmF0b3JSZXZlcnNlKVxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIjo6OlwiKVxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIC8vIGlmIHRoZSB2YWx1ZSBpcyBlbXB0eSBvciBpcyB0aGUgc2FtZSBsaWtlIHRoZSBpbmxpbmVzZXBhcmF0b3JyZXZlcnNlIHRoZW4gc2V0IGl0IHRvIHRoZSBkZWZhdWx0LCBvdGhlcndpc2Ugc2F2ZSBpdFxuICAgICAgICAgICAgaWYgKHZhbHVlLnRyaW0oKS5sZW5ndGggPT09IDAgfHwgdmFsdWUgPT09IHBsdWdpbi5zZXR0aW5ncy5pbmxpbmVTZXBhcmF0b3IpIHtcbiAgICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmlubGluZVNlcGFyYXRvclJldmVyc2UgPSBcIjo6OlwiO1xuICAgICAgICAgICAgICBpZiAodmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJUaGUgc2VwYXJhdG9yIG11c3QgYmUgYXQgbGVhc3QgMSBjaGFyYWN0ZXIgbG9uZ1wiKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gcGx1Z2luLnNldHRpbmdzLmlubGluZVNlcGFyYXRvcikge1xuICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJUaGUgc2VwYXJhdG9yIG11c3QgYmUgZGlmZmVyZW50IGZyb20gdGhlIGlubGluZSBzZXBhcmF0b3JcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5pbmxpbmVTZXBhcmF0b3JSZXZlcnNlID0gZXNjYXBlUmVnRXhwKHZhbHVlLnRyaW0oKSk7XG4gICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJUaGUgc2VwYXJhdG9yIGhhcyBiZWVuIGNoYW5nZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwbHVnaW4uc2F2ZURhdGEocGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLy8g4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQXG4gIC8vIFRlbXBsYXRlIENvbmZpZyBVSVxuICAvLyDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZBcblxuICBwcml2YXRlIHJlbmRlclRlbXBsYXRlQ29uZmlnKFxuICBjb250YWluZXJFbDogSFRNTEVsZW1lbnQsXG4gIHBsdWdpbjogYW55LFxuICBjb25maWc6IElUZW1wbGF0ZUNvbmZpZyxcbiAgaW5kZXg6IG51bWJlclxuICApIHtcbiAgY29uc3Qgc2V0dGluZyA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKTtcbiAgc2V0dGluZy5zZXROYW1lKGBUZW1wbGF0ZSAjJHtpbmRleCArIDF9OiAke2NvbmZpZy5tb2RlbE5hbWV9YCk7XG4gIHNldHRpbmcuc2V0RGVzYyhgUGF0aDogJHtjb25maWcuZmlsZVBhdGhQYXR0ZXJufSB8IE1vZGU6ICR7Y29uZmlnLnBhcnNlTW9kZX1gKTtcblxuICAvLyBNb2RlbCBuYW1lXG4gIHNldHRpbmcuYWRkVGV4dCgodGV4dCkgPT5cbiAgdGV4dFxuICAgIC5zZXRWYWx1ZShjb25maWcubW9kZWxOYW1lKVxuICAgIC5zZXRQbGFjZWhvbGRlcihcIk1vZGVsIG5hbWVcIilcbiAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICBwbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVDb25maWdzW2luZGV4XS5tb2RlbE5hbWUgPSB2YWx1ZTtcbiAgICAgIHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xuICAgIH0pXG4gICk7XG5cbiAgLy8gUGFyc2UgbW9kZSBkcm9wZG93blxuICBzZXR0aW5nLmFkZERyb3Bkb3duKChkZCkgPT5cbiAgZGRcbiAgICAuYWRkT3B0aW9uKFwiY2FyZC10YWdcIiwgXCIjY2FyZFwiKVxuICAgIC5hZGRPcHRpb24oXCJsaXN0LWZpZWxkXCIsIFwibGlzdC1maWVsZFwiKVxuICAgIC5hZGRPcHRpb24oXCJpbmxpbmVcIiwgXCJpbmxpbmVcIilcbiAgICAuYWRkT3B0aW9uKFwiY2xvemVcIiwgXCJjbG96ZVwiKVxuICAgIC5zZXRWYWx1ZShjb25maWcucGFyc2VNb2RlKVxuICAgIC5vbkNoYW5nZSgodmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgcGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlQ29uZmlnc1tpbmRleF0ucGFyc2VNb2RlID0gdmFsdWUgYXMgYW55O1xuICAgICAgcGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XG4gICAgfSlcbiAgKTtcblxuICAvLyBFbmFibGUvZGlzYWJsZSB0b2dnbGVcbiAgc2V0dGluZy5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgdG9nZ2xlLnNldFZhbHVlKGNvbmZpZy5lbmFibGVkKS5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICBwbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVDb25maWdzW2luZGV4XS5lbmFibGVkID0gdmFsdWU7XG4gICAgcGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XG4gIH0pXG4gICk7XG5cbiAgLy8gRGVsZXRlIGJ1dHRvblxuICBzZXR0aW5nLmFkZEV4dHJhQnV0dG9uKChidG4pID0+IHtcbiAgYnRuXG4gICAgLnNldEljb24oXCJ0cmFzaFwiKVxuICAgIC5zZXRUb29sdGlwKFwiRGVsZXRlIHRlbXBsYXRlXCIpXG4gICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgcGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlQ29uZmlncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgcGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XG4gICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gRmlsZSBwYXRoIHBhdHRlcm4gKHNlcGFyYXRlIHNldHRpbmcgbGluZSBmb3IgY2xhcml0eSlcbiAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gIC5zZXROYW1lKFwiICBGaWxlIHBhdGggcGF0dGVyblwiKVxuICAuc2V0RGVzYyhcImUuZy4gNzctQW5raS/miafkuJrkuK3oja/luIgvKipcIilcbiAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgdGV4dFxuICAgICAgLnNldFZhbHVlKGNvbmZpZy5maWxlUGF0aFBhdHRlcm4pXG4gICAgICAuc2V0UGxhY2Vob2xkZXIoXCJwYXRoL3BhdHRlcm4vKipcIilcbiAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgcGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlQ29uZmlnc1tpbmRleF0uZmlsZVBhdGhQYXR0ZXJuID0gdmFsdWU7XG4gICAgICAgIHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgfSlcbiAgKTtcbiAgfVxuICB9XG4iXX0=