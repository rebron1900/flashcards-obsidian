import { Anki } from "src/services/anki";
import {
  App,
  FileSystemAdapter,
  FrontMatterCache,
  Notice,
  parseFrontMatterEntry,
  TFile,
} from "obsidian";
import { Parser } from "src/services/parser";
import { ISettings, ITemplateConfig } from "src/conf/settings";
import { Card } from "src/entities/card";
import { arrayBufferToBase64 } from "src/utils";
import { Regex } from "src/conf/regex";
import { noticeTimeout } from "src/conf/constants";
import { Inlinecard } from "src/entities/inlinecard";

export class CardsService {
  private app: App;
  private settings: ISettings;
  private regex: Regex;
  private parser: Parser;
  private anki: Anki;

  private updateFile: boolean;
  private totalOffset: number;
  private file: string;
  private notifications: string[];

  constructor(app: App, settings: ISettings) {
    this.app = app;
    this.settings = settings;
    this.regex = new Regex(this.settings);
    this.parser = new Parser(this.regex, this.settings);
    this.anki = new Anki();
  }

  public async execute(activeFile: TFile): Promise<string[]> {
    this.regex.update(this.settings);

    try {
      await this.anki.ping();
    } catch (err) {
      console.error(err);
      return ["Error: Anki must be open with AnkiConnect installed."];
    }

    // Init for the execute phase
    this.updateFile = false;
    this.totalOffset = 0;
    this.notifications = [];
    const filePath = activeFile.basename;
    const sourcePath = activeFile.path;
    const fileCachedMetadata = this.app.metadataCache.getFileCache(activeFile);
    const vaultName = this.app.vault.getName();
    let globalTags: string[] = undefined;

    // Parse frontmatter
    const frontmatter = fileCachedMetadata.frontmatter;
    let deckName = "";
    if (parseFrontMatterEntry(frontmatter, "cards-deck")) {
      deckName = parseFrontMatterEntry(frontmatter, "cards-deck");
    } else if (this.settings.folderBasedDeck && activeFile.parent.path !== "/") {
      deckName = activeFile.parent.path.split("/").join("::");
    } else {
      deckName = this.settings.deck;
    }

    try {
      // Find matching template config (frontmatter template field > path pattern)
      const templateConfig = this.matchTemplateConfig(sourcePath, frontmatter);
      const useListFieldParser = templateConfig && templateConfig.parseMode === 'list-field' && templateConfig.enabled;

      // For custom models, verify or create the model with correct field order
      if (!templateConfig) {
        this.anki.storeCodeHighlightMedias();
        await this.anki.createModels(
          this.settings.sourceSupport,
          this.settings.codeHighlightSupport
        );
      } else {
        this.anki.storeCodeHighlightMedias();
        // Verify/create custom model so key field is first for dedup
        const keyField = extractKeyField(templateConfig.fields);
        if (useListFieldParser) {
          const rawFields = templateConfig.fields.map(f => f.replace(/:key$/, ''));
          try {
            const ankiFields = await this.anki.modelFieldNames(templateConfig.modelName);
            // Model exists — check field order
            if (keyField && ankiFields[0] !== keyField) {
              this.notifications.push(
                `Warning: Anki model "${templateConfig.modelName}" has "${ankiFields[0]}" as field 1, ` +
                `but "${keyField}" is the key. Reorder fields in Anki Desktop (${keyField} first) ` +
                `to avoid duplicate errors. The plugin will auto-prefix key values as fallback.`
              );
            }
          } catch {
            // Model doesn't exist — create it with correct field order
            try {
              const modelId = await this.anki.createCustomModel(
                templateConfig.modelName,
                rawFields,
                keyField
              );
              console.debug(`Flashcards: created model "${templateConfig.modelName}" (id=${modelId}) with key="${keyField}"`);
              this.notifications.push(`Created Anki model "${templateConfig.modelName}" with ${keyField} as field 1.`);
            } catch (createErr) {
              console.error('Flashcards: failed to create model:', createErr);
              this.notifications.push(`Error: Could not create Anki model "${templateConfig.modelName}". Anki must be running.`);
            }
          }
        }
      }
      await this.anki.createDeck(deckName);
      this.file = await this.app.vault.read(activeFile);
      if (!this.file.endsWith("\n")) {
        this.file += "\n";
      }
      globalTags = this.parseGlobalTags(this.file);
      // TODO with empty check that does not call ankiCards line
      const ankiBlocks = this.parser.getAnkiIDsBlocks(this.file);
      const ankiCards = ankiBlocks
        ? await this.anki.getCards(this.getAnkiIDs(ankiBlocks))
        : undefined;

      let cards: Card[];
      if (useListFieldParser) {
        // Use list-field parser with custom model
        cards = this.parser.generateListFieldCards(
          this.file,
          deckName,
          vaultName,
          filePath,
          globalTags,
          templateConfig
        );
      } else {
        // Use default parsers
        cards = this.parser.generateFlashcards(
          this.file,
          deckName,
          vaultName,
          filePath,
          globalTags
        );
      }
      const [cardsToCreate, cardsToUpdate, cardsNotInAnki] =
        this.filterByUpdate(ankiCards, cards);
      const cardIds: number[] = this.getCardsIds(ankiCards, cards);
      const cardsToDelete: number[] = this.parser.getCardsToDelete(this.file);

      console.info("Flashcards: Cards to create");
      console.info(cardsToCreate);
      console.info("Flashcards: Cards to update");
      console.info(cardsToUpdate);
      console.info("Flashcards: Cards to delete");
      console.info(cardsToDelete);
      if (cardsNotInAnki) {
        console.info("Flashcards: Cards not in Anki (maybe deleted)");
        for (const card of cardsNotInAnki) {
          this.notifications.push(
            `Error: Card with ID ${card.id} is not in Anki!`,
          );
        }
      }
      console.info(cardsNotInAnki);

      this.insertMedias(cards, sourcePath);
      await this.deleteCardsOnAnki(cardsToDelete, ankiBlocks);
      await this.updateCardsOnAnki(cardsToUpdate);
      await this.insertCardsOnAnki(cardsToCreate, useListFieldParser ? extractKeyField(templateConfig?.fields || []) : null);

      // Update decks if needed
      const deckNeedToBeChanged = await this.deckNeedToBeChanged(
        cardIds,
        deckName,
      );
      if (deckNeedToBeChanged) {
        try {
          this.anki.changeDeck(cardIds, deckName);
          this.notifications.push("Cards moved in new deck");
        } catch {
          return ["Error: Could not update deck the file."];
        }
      }

      // Update file
      if (this.updateFile) {
        try {
          this.app.vault.modify(activeFile, this.file);
        } catch (err) {
          Error("Could not update the file.");
          return ["Error: Could not update the file."];
        }
      }

      this.updateFrontmatter(frontmatter, deckName);

      if (!this.notifications.length) {
        this.notifications.push("Nothing to do. Everything is up to date");
      }
      return this.notifications;
    } catch (err) {
      console.error(err);
      Error("Something went wrong");
    }
  }

  private async insertMedias(cards: Card[], sourcePath: string) {
    try {
      // Currently the media are created for every run, this is not a problem since Anki APIs overwrite the file
      // A more efficient way would be to keep track of the medias saved
      await this.generateMediaLinks(cards, sourcePath);
      await this.anki.storeMediaFiles(cards);
    } catch (err) {
      console.error(err);
      Error("Error: Could not upload medias");
    }
  }

  private async generateMediaLinks(cards: Card[], sourcePath: string) {
    if (this.app.vault.adapter instanceof FileSystemAdapter) {
      // @ts-ignore: Unreachable code error

      for (const card of cards) {
        for (const media of card.mediaNames) {
          const image = this.app.metadataCache.getFirstLinkpathDest(
            decodeURIComponent(media),
            sourcePath,
          );
          try {
            const binaryMedia = await this.app.vault.readBinary(image);
            card.mediaBase64Encoded.push(arrayBufferToBase64(binaryMedia));
          } catch (err) {
            Error("Error: Could not read media");
          }
        }
      }
    }
  }

  private async insertCardsOnAnki(cardsToCreate: Card[], keyField: string | null = null): Promise<number> {
    if (cardsToCreate.length) {
      let insertedCards = 0;
      try {
        const ids = await this.anki.addCardsWithKey(cardsToCreate, keyField);
        // Add IDs from response to Flashcard[]
        ids.map((id: number, index: number) => {
          cardsToCreate[index].id = id;
        });

        // For list-field cards: addNotes returns null for existing cards (no block ref yet).
        // Find their real Anki note IDs via content search so block refs can be written.
        for (let i = 0; i < ids.length; i++) {
          if (ids[i] === null && cardsToCreate[i]) {
            const card = cardsToCreate[i];
            const fieldValues = Object.values(card.fields);
            if (fieldValues.length > 0) {
              const cleanText = String(fieldValues[0]).replace(/<[^>]*>/g, '').trim();
              const existingIds = await this.anki.findNotes(
                `deck:"${card.deckName}" "${cleanText}"`
              );
              if (existingIds && existingIds.length > 0) {
                cardsToCreate[i].id = existingIds[0];
              }
            }
          }
        }

        let total = 0;
        cardsToCreate.forEach((card) => {
          if (card.id === null) {
            new Notice(
              `Error, could not add: '${card.initialContent}'`,
              noticeTimeout,
            );
          } else {
            card.reversed ? (insertedCards += 2) : insertedCards++;
          }
          card.reversed ? (total += 2) : total++;
        });

        if (this.settings.sourceSupport) {
          this.parser.updateCardSource(cardsToCreate);
          this.anki.updateCards(cardsToCreate);
        }

        this.writeAnkiBlocks(cardsToCreate);

        this.notifications.push(
          `Inserted successfully ${insertedCards}/${total} cards.`,
        );
        return insertedCards;
      } catch (err) {
        console.error(err);
        Error("Error: Could not write cards on Anki");
      }
    }
  }

  private updateFrontmatter(frontmatter: FrontMatterCache, deckName: string) {
    const activeFile = this.app.workspace.getActiveFile();

    this.app.fileManager.processFrontMatter(activeFile, (frontmatter) => {
      frontmatter["cards-deck"] = deckName;
    });
  }

  private writeAnkiBlocks(cardsToCreate: Card[]) {
    for (const card of cardsToCreate) {
      // Card.id cannot be null, because if written already previously it has an ID,
      //   if it has been inserted it has an ID too
      if (card.id !== null && !card.inserted) {
        let id = card.getIdFormat();
        if (card instanceof Inlinecard) {
          if (this.settings.inlineID) {
            id = " " + id;
          } else {
            id = "\n" + id;
          }
        }
        card.endOffset += this.totalOffset;
        const offset = card.endOffset;

        this.updateFile = true;
        this.file =
          this.file.substring(0, offset) +
          id +
          this.file.substring(offset, this.file.length + 1);
        this.totalOffset += id.length;
      }
    }
  }

  private async updateCardsOnAnki(cards: Card[]): Promise<number> {
    if (cards.length) {
      try {
        if (this.settings.sourceSupport) {
          this.parser.updateCardSource(cards);
        }
        this.anki.updateCards(cards);
        this.notifications.push(
          `Updated successfully ${cards.length}/${cards.length} cards.`,
        );
      } catch (err) {
        console.error(err);
        Error("Error: Could not update cards on Anki");
      }

      return cards.length;
    }
  }

  public async deleteCardsOnAnki(
    cards: number[],
    ankiBlocks: RegExpMatchArray[],
  ): Promise<number> {
    if (cards.length) {
      let deletedCards = 0;
      for (const block of ankiBlocks) {
        const id = Number(block[1]);

        // Deletion of cards that need to be deleted (i.e. blocks ID that don't have content)
        if (cards.includes(id)) {
          try {
            this.anki.deleteCards(cards);
            deletedCards++;

            this.updateFile = true;
            this.file =
              this.file.substring(0, block["index"]) +
              this.file.substring(
                block["index"] + block[0].length,
                this.file.length,
              );
            this.totalOffset -= block[0].length;
            this.notifications.push(
              `Deleted successfully ${deletedCards}/${cards.length} cards.`,
            );
          } catch (err) {
            console.error(err);
            Error("Error, could not delete the card from Anki");
          }
        }
      }

      return deletedCards;
    }
  }

  private getAnkiIDs(blocks: RegExpMatchArray[]): number[] {
    const IDs: number[] = [];
    for (const b of blocks) {
      IDs.push(Number(b[1]));
    }

    return IDs;
  }

  public filterByUpdate(ankiCards: any, generatedCards: Card[]) {
    let cardsToCreate: Card[] = [];
    const cardsToUpdate: Card[] = [];
    const cardsNotInAnki: Card[] = [];

    if (ankiCards) {
      for (const flashcard of generatedCards) {
        // Inserted means that anki blocks are available, that means that the card should
        // 	(the user can always delete it) be in Anki
        let ankiCard = undefined;
        if (flashcard.inserted) {
          ankiCard = ankiCards.filter(
            (card: any) => Number(card.noteId) === flashcard.id,
          )[0];
          if (!ankiCard) {
            cardsNotInAnki.push(flashcard);
          } else if (!flashcard.match(ankiCard)) {
            flashcard.oldTags = ankiCard.tags;
            cardsToUpdate.push(flashcard);
          }
        } else {
          cardsToCreate.push(flashcard);
        }
      }
    } else {
      cardsToCreate = [...generatedCards];
    }

    return [cardsToCreate, cardsToUpdate, cardsNotInAnki];
  }

  public async deckNeedToBeChanged(cardsIds: number[], deckName: string) {
    const cardsInfo = await this.anki.cardsInfo(cardsIds);
    console.log("Flashcards: Cards info");
    console.log(cardsInfo);
    if (cardsInfo.length !== 0) {
      return cardsInfo[0].deckName !== deckName;
    }

    return false;
  }

  public getCardsIds(ankiCards: any, generatedCards: Card[]): number[] {
    let ids: number[] = [];

    if (ankiCards) {
      for (const flashcard of generatedCards) {
        let ankiCard = undefined;
        if (flashcard.inserted) {
          ankiCard = ankiCards.filter(
            (card: any) => Number(card.noteId) === flashcard.id,
          )[0];
          if (ankiCard) {
            ids = ids.concat(ankiCard.cards);
          }
        }
      }
    }

    return ids;
  }

  /**
   * Match template config:
   * 1. frontmatter.template → match by modelName (highest priority)
   * 2. file path pattern (fallback)
   */
  public matchTemplateConfig(filePath: string, frontmatter?: any): ITemplateConfig | null {
    // Priority 1: frontmatter template field
    if (frontmatter && frontmatter["template"]) {
      const templateName = frontmatter["template"];
      for (const tc of this.settings.templateConfigs) {
        if (!tc.enabled) continue;
        if (tc.modelName === templateName) {
          return tc;
        }
      }
    }
    // Priority 2: fallback to path pattern matching
    for (const tc of this.settings.templateConfigs) {
      if (!tc.enabled) continue;
      const pattern = tc.filePathPattern;
      // Convert simple glob to regex: ** → .*, * → [^/]*
      let regexStr = pattern
        .replace(/\*\*/g, '___DOUBLE_STAR___')
        .replace(/\*/g, '[^/]*')
        .replace(/___DOUBLE_STAR___/g, '.*');
      const re = new RegExp('^' + regexStr + '$');
      if (re.test(filePath)) {
        return tc;
      }
    }
    return null;
  }

  public parseGlobalTags(file: string): string[] {
    let globalTags: string[] = [];

    const tags = file.match(/(?:cards-)?tags: ?(.*)/im);
    globalTags = tags ? tags[1].match(this.regex.globalTagsSplitter) : [];

    if (globalTags) {
      for (let i = 0; i < globalTags.length; i++) {
        globalTags[i] = globalTags[i].replace("#", "");
        globalTags[i] = globalTags[i].replace(/\//g, "::");
        globalTags[i] = globalTags[i].replace(/\[\[(.*)\]\]/, "$1");
        globalTags[i] = globalTags[i].trim();
        globalTags[i] = globalTags[i].replace(/ /g, "-");
      }

      return globalTags;
    }

    return [];
  }
}

/** Extract the key field name from a template config's fields array.
 *  The field marked with ":key" suffix (e.g. "Question:key") is the key field.
 *  Returns null if no field is marked. */
function extractKeyField(fields: string[]): string | null {
  for (const f of fields) {
    if (f.endsWith(':key')) {
      return f.replace(/:key$/, '');
    }
  }
  return null;
}
