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
      return true;
    }

    for (const field of fields) {
      const fieldName = field[0];
      if (fieldName === "Source") {
        // For source field, compare the actual content but allow for block ID updates
        const ankiSource = field[1].value;
        const currentSource = this.fields[fieldName];
        
        // If source support is enabled, we need to properly compare the source
        if (currentSource && ankiSource) {
          // Extract the base filename from both sources for comparison
          const ankiFilename = this.extractFilenameFromSource(ankiSource);
          const currentFilename = this.extractFilenameFromSource(currentSource);
          
          // If filenames are different, the card needs updating
          if (ankiFilename !== currentFilename) {
            return false;
          }
        }
        continue;
      }
      if (field[1].value !== this.fields[fieldName]) {
        return false;
      }
    }

    return arraysEqual(card.tags, this.tags);
  }

  private extractFilenameFromSource(source: string): string {
    // Extract filename from obsidian link format: [[filename]] or from URL
    const wikiMatch = source.match(/\[\[([^\]]+)\]\]/);
    if (wikiMatch) {
      return wikiMatch[1];
    }
    
    // Extract from obsidian URL format
    const urlMatch = source.match(/file=([^#&]+)/);
    if (urlMatch) {
      return decodeURIComponent(urlMatch[1]);
    }
    
    return source;
  }

  getCodeDeckNameExtension() {
    return this.containsCode ? codeDeckExtension : "";
  }
}
