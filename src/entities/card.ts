import { codeDeckExtension } from "src/conf/constants";
import { arraysEqual } from "src/utils";

export abstract class Card {
  id: number;
  deckName: string;
  initialContent: string;
  fields: Record<string, string>;
  reversed: boolean;
  initialOffset: number;
  endOffset: number;
  tags: string[];
  inserted: boolean;
  mediaNames: string[];
  mediaBase64Encoded: string[];
  oldTags: string[];
  containsCode: boolean;
  modelName: string;

  constructor(
    id: number,
    deckName: string,
    initialContent: string,
    fields: Record<string, string>,
    reversed: boolean,
    initialOffset: number,
    endOffset: number,
    tags: string[],
    inserted: boolean,
    mediaNames: string[],
    containsCode = false,
  ) {
    this.id = id;
    this.deckName = deckName;
    this.initialContent = initialContent;
    this.fields = fields;
    this.reversed = reversed;
    this.initialOffset = initialOffset;
    this.endOffset = endOffset;
    this.tags = tags;
    this.inserted = inserted;
    this.mediaNames = mediaNames;
    this.mediaBase64Encoded = [];
    this.oldTags = [];
    this.containsCode = containsCode;
    this.modelName = "";
  }

  abstract toString(): string;
  abstract getCard(update: boolean): object;
  abstract getMedias(): object[];
  abstract getIdFormat(): string;

  match(card: any): boolean {
    // TODO not supported currently
    // if (this.modelName !== card.modelName) {
    //     return false
    // }

    const fields: any = Object.entries(card.fields);
    // This is the case of a switch from a model to another one. It cannot be handeled
    if (fields.length !== Object.entries(this.fields).length) {
      console.warn("Flashcards: Card field count mismatch", {
        ankiCount: fields.length,
        localCount: Object.entries(this.fields).length,
        cardId: this.id,
        initialContent: this.initialContent,
        ankiFields: Object.keys(card.fields),
        localFields: Object.keys(this.fields),
      });
      return false;
    }

    for (const field of fields) {
      const fieldName = field[0];
      if (fieldName === "Source") {
        // For source field, compare the actual content but allow for block ID updates
        const ankiSource = field[1].value;
        const currentSource = this.fields[fieldName];
        
        // If source support is enabled, we need to properly compare the source
        if (currentSource && ankiSource) {
          // Replace placeholder with actual ID for comparison if this card has an ID
          const currentSourceForComparison = this.id !== -1 
            ? currentSource.replace("__BLOCK_ID__", String(this.id))
            : currentSource;
          
          // For comparison, we need to handle the case where the source format might have changed
          // Strip the actual block IDs for comparison to focus on the file reference
          const ankiSourceNormalized = ankiSource.replace(/#\^(\d{13})/, "");
          const currentSourceNormalized = currentSourceForComparison.replace(/#\^(\d{13})/, "").replace("__BLOCK_ID__", "");
          
          // If the normalized sources are different, the card needs updating
          if (ankiSourceNormalized !== currentSourceNormalized) {
            return false;
          }
        }
        continue;
      }
      // Compare text content (strip HTML tags) to avoid showdown rendering differences
      const ankiValue = field[1].value;
      const localValue = this.fields[fieldName];
      if (typeof ankiValue !== 'string' || typeof localValue !== 'string') {
        console.warn("Flashcards: match() non-string field", {
          cardId: this.id, fieldName,
          ankiType: typeof ankiValue, localType: typeof localValue,
          deckName: this.deckName,
        });
        return false;
      }
      const ankiText = ankiValue.replace(/<[^>]*>/g, '').trim();
      const localText = localValue.replace(/<[^>]*>/g, '').trim();
      if (ankiText !== localText) {
        console.warn("Flashcards: match() text differs", {
          cardId: this.id, fieldName,
          initialContent: this.initialContent,
          ankiText: ankiText.substring(0, 80),
          localText: localText.substring(0, 80),
        });
        return false;
      }
    }

    return arraysEqual(card.tags, this.tags);
  }

  private extractFilenameFromSource(source: string): string {
    // Extract filename from obsidian link format: [[filename]] or from URL
    const wikiMatch = source.match(/\[\[([^\]]+)\]\]/);
    if (wikiMatch) {
      return wikiMatch[1].replace("#^__BLOCK_ID__", "").replace(/#\^(\d{13})/, ""); // Remove block ID placeholders and actual IDs
    }
    
    // Extract from obsidian URL format
    const urlMatch = source.match(/file=([^#&]+)/);
    if (urlMatch) {
      return decodeURIComponent(urlMatch[1]).replace("#^__BLOCK_ID__", "").replace(/#\^(\d{13})/, "");
    }
    
    return source;
  }

  getCodeDeckNameExtension() {
    return this.containsCode ? codeDeckExtension : "";
  }
}
