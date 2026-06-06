import { Notice, PluginSettingTab, Setting } from "obsidian";
import { Anki } from "src/services/anki";
import { escapeRegExp } from "src/utils";
import { ITemplateConfig } from "src/conf/settings";

export class SettingsTab extends PluginSettingTab {
  display(): void {
    const { containerEl } = this;
    const plugin = (this as any).plugin;

    containerEl.empty();

    // ── Template Config Section ──
    containerEl.createEl("h2", { text: "Custom Templates" });
    containerEl.createEl("p", {
      text: "Configure custom Anki note models. Set `template:` in your .md frontmatter to match a model name. Cards in matching paths use the specified model as fallback.",
      cls: "setting-item-description"
    });

    // Render existing template configs
    const configs = plugin.settings.templateConfigs || [];
    for (let i = 0; i < configs.length; i++) {
      this.renderTemplateConfig(containerEl, plugin, configs[i], i);
    }

    // Add new template button
    new Setting(containerEl).addButton((btn) => {
      btn.setButtonText("+ Add Template").onClick(() => {
        const newConfig: ITemplateConfig = {
          modelName: "new-template",
          fields: ["Question", "Answer"],
          filePathPattern: "**",
          parseMode: "list-field",
          enabled: true,
        };
        plugin.settings.templateConfigs.push(newConfig);
        plugin.saveData(plugin.settings);
        this.display(); // re-render
      });
    });

    containerEl.createEl("hr");

    // ── Original Settings ──
    containerEl.createEl("h1", { text: "Flashcards - Settings" });

    // ... (keep all original settings below)

    const description = createFragment()
    description.append(
      "This needs to be done only one time. Open Anki and click the button to grant permission.",
          createEl('br'),
        'Be aware that AnkiConnect must be installed.',
    )

    new Setting(containerEl)
      .setName("Give Permission")
      .setDesc(description)
      .addButton((button) => {
        button.setButtonText("Grant Permission").onClick(() => {

          new Anki().requestPermission().then((result) => {
            if (result.permission === "granted") {
              plugin.settings.ankiConnectPermission = true;
              plugin.saveData(plugin.settings);
              new Notice("Anki Connect permission granted");
            } else {
              new Notice("AnkiConnect permission not granted");
            }
          }).catch((error) => {
            new Notice("Something went wrong, is Anki open?");
            console.error(error);
          });
        });
      });
  

    new Setting(containerEl)
      .setName("Test Anki")
      .setDesc("Test that connection between Anki and Obsidian actually works.")
      .addButton((text) => {
        text.setButtonText("Test").onClick(() => {
          new Anki()
            .ping()
            .then(() => new Notice("Anki works"))
            .catch(() => new Notice("Anki is not connected"));
        });
      });
  
    containerEl.createEl("h2", { text: "General" });

    new Setting(containerEl)
      .setName("Context-aware mode")
      .setDesc("Add the ancestor headings to the question of the flashcard.")
      .addToggle((toggle) =>
        toggle.setValue(plugin.settings.contextAwareMode).onChange((value) => {
          plugin.settings.contextAwareMode = value;
          plugin.saveData(plugin.settings);
        })
      );

    new Setting(containerEl)
      .setName("Source support")
      .setDesc(
        "Add to every card the source, i.e. the link to the original card. NOTE: Old cards made without source support cannot be updated."
      )
      .addToggle((toggle) =>
        toggle.setValue(plugin.settings.sourceSupport).onChange((value) => {
          plugin.settings.sourceSupport = value;
          plugin.saveData(plugin.settings);
        })
      );

    new Setting(containerEl)
      .setName("Code highlight support")
      .setDesc("Add highlight of the code in Anki.")
      .addToggle((toggle) =>
        toggle
          .setValue(plugin.settings.codeHighlightSupport)
          .onChange((value) => {
            plugin.settings.codeHighlightSupport = value;
            plugin.saveData(plugin.settings);
          })
      );
    new Setting(containerEl)
      .setName("Inline ID support")
      .setDesc("Add ID to end of line for inline cards.")
      .addToggle((toggle) =>
        toggle.setValue(plugin.settings.inlineID).onChange((value) => {
          plugin.settings.inlineID = value;
          plugin.saveData(plugin.settings);
        })
      );

    new Setting(containerEl)
      .setName("Folder-based deck name")
      .setDesc("Add ID to end of line for inline cards.")
      .addToggle((toggle) =>
        toggle.setValue(plugin.settings.folderBasedDeck).onChange((value) => {
          plugin.settings.folderBasedDeck = value;
          plugin.saveData(plugin.settings);
        })
      );


    new Setting(containerEl)
      .setName("Default deck name")
      .setDesc(
        "The name of the default deck where the cards will be added when not specified."
      )
      .addText((text) => {
        text
          .setValue(plugin.settings.deck)
          .setPlaceholder("Deck::sub-deck")
          .onChange((value) => {
            if (value.length) {
              plugin.settings.deck = value;
              plugin.saveData(plugin.settings);
            } else {
              new Notice("The deck name must be at least 1 character long");
            }
          });
      });

      new Setting(containerEl)
        .setName("Default Anki tag")
        .setDesc("This tag will be added to each generated card on Anki")
        .addText((text) => {
          text
            .setValue(plugin.settings.defaultAnkiTag)
            .setPlaceholder("Anki tag")
            .onChange((value) => {
              if (!value) new Notice("No default tags will be added");
              plugin.settings.defaultAnkiTag = value.toLowerCase();
              plugin.saveData(plugin.settings);
            });
        });

    containerEl.createEl("h2", { text: "Cards Identification" });

    new Setting(containerEl)
      .setName("Flashcards #tag")
      .setDesc(
        "The tag to identify the flashcards in the notes (case-insensitive)."
      )
      .addText((text) => {
        text
          .setValue(plugin.settings.flashcardsTag)
          .setPlaceholder("Card")
          .onChange((value) => {
            if (value) {
              plugin.settings.flashcardsTag = value.toLowerCase();
              plugin.saveData(plugin.settings);
            } else {
              new Notice("The tag must be at least 1 character long");
            }
          });
      });

     new Setting(containerEl)
      .setName("Inline card separator")
      .setDesc(
        "The separator to identifty the inline cards in the notes."
      )
      .addText((text) => {
        text
          .setValue(plugin.settings.inlineSeparator)
          .setPlaceholder("::")
          .onChange((value) => {
            // if the value is empty or is the same like the inlineseparatorreverse then set it to the default, otherwise save it
            if (value.trim().length === 0 || value === plugin.settings.inlineSeparatorReverse) {
              plugin.settings.inlineSeparator = "::";
              if (value.trim().length === 0) {
                new Notice("The separator must be at least 1 character long");
              } else if (value === plugin.settings.inlineSeparatorReverse) {
                new Notice("The separator must be different from the inline reverse separator");
              }
            } else {
              plugin.settings.inlineSeparator = escapeRegExp(value.trim());
              new Notice("The separator has been changed");
            }
            plugin.saveData(plugin.settings);
          });
      });


     new Setting(containerEl)
      .setName("Inline reverse card separator")
      .setDesc(
        "The separator to identifty the inline revese cards in the notes."
      )
      .addText((text) => {
        text
          .setValue(plugin.settings.inlineSeparatorReverse)
          .setPlaceholder(":::")
          .onChange((value) => {
            // if the value is empty or is the same like the inlineseparatorreverse then set it to the default, otherwise save it
            if (value.trim().length === 0 || value === plugin.settings.inlineSeparator) {
              plugin.settings.inlineSeparatorReverse = ":::";
              if (value.trim().length === 0) {
                new Notice("The separator must be at least 1 character long");
              } else if (value === plugin.settings.inlineSeparator) {
                new Notice("The separator must be different from the inline separator");
              }
            } else {
              plugin.settings.inlineSeparatorReverse = escapeRegExp(value.trim());
              new Notice("The separator has been changed");
            }
            plugin.saveData(plugin.settings);
          });
      });
  }

  // ═══════════════════════════════════════════════
  // Template Config UI
  // ═══════════════════════════════════════════════

  private renderTemplateConfig(
  containerEl: HTMLElement,
  plugin: any,
  config: ITemplateConfig,
  index: number
  ) {
  const setting = new Setting(containerEl);
  setting.setName(`Template #${index + 1}: ${config.modelName}`);
  setting.setDesc(`Mode: ${config.parseMode}`);

  // Model name
  setting.addText((text) =>
  text
    .setValue(config.modelName)
    .setPlaceholder("Model name")
    .onChange((value) => {
      plugin.settings.templateConfigs[index].modelName = value;
      plugin.saveData(plugin.settings);
    })
  );

  // Parse mode dropdown
  setting.addDropdown((dd) =>
  dd
    .addOption("card-tag", "#card")
    .addOption("list-field", "list-field")
    .addOption("inline", "inline")
    .addOption("cloze", "cloze")
    .setValue(config.parseMode)
    .onChange((value: string) => {
      plugin.settings.templateConfigs[index].parseMode = value as any;
      plugin.saveData(plugin.settings);
    })
  );

  // Enable/disable toggle
  setting.addToggle((toggle) =>
  toggle.setValue(config.enabled).onChange((value) => {
    plugin.settings.templateConfigs[index].enabled = value;
    plugin.saveData(plugin.settings);
  })
  );

  // Delete button
  setting.addExtraButton((btn) => {
  btn
    .setIcon("trash")
    .setTooltip("Delete template")
    .onClick(() => {
      plugin.settings.templateConfigs.splice(index, 1);
      plugin.saveData(plugin.settings);
      this.display();
    });
  });

  // Fields (one per line) — replaces file path pattern
  new Setting(containerEl)
  .setName("  Fields")
  .setDesc("One field name per line. In .md use: - **FieldName**：value")
  .addTextArea((text) =>
    text
      .setValue((config.fields || []).join("\n"))
      .setPlaceholder("Question\nAnswer\nNote")
      .onChange((value) => {
        plugin.settings.templateConfigs[index].fields = value.split("\n").map(s => s.trim()).filter(s => s.length > 0);
        plugin.saveData(plugin.settings);
      })
  );

  // Template format preview
  const previewContainer = containerEl.createDiv({ cls: "setting-item" });
  const previewDesc = previewContainer.createDiv({ cls: "setting-item-description" });
  const fields = config.fields || [];
  if (fields.length > 0) {
    previewDesc.createEl("strong", { text: "Template format:" });
    previewDesc.createEl("br");
    previewDesc.createEl("code", { text: "# Card Title #card" });
    for (const f of fields) {
      previewDesc.createEl("br");
      previewDesc.createEl("code", { text: `- **${f}**：{{value}}` });
    }
  }

  // File path pattern (fallback, secondary)
  new Setting(containerEl)
  .setName("  File path (fallback)")
  .setDesc("Optional: match by path if no frontmatter template field")
  .addText((text) =>
    text
      .setValue(config.filePathPattern)
      .setPlaceholder("path/pattern/**")
      .onChange((value) => {
        plugin.settings.templateConfigs[index].filePathPattern = value;
        plugin.saveData(plugin.settings);
      })
  );
  }
  }
