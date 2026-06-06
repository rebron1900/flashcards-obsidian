import { codeDeckExtension, sourceDeckExtension } from "src/conf/constants";
import { Card } from "src/entities/card";

export class Flashcard extends Card {
  constructor(
    id = -1,
    deckName: string,
    initialContent: string,
    fields: Record<string, string>,
    reversed: boolean,
    initialOffset: number,
    endOffset: number,
    tags: string[] = [],
    inserted = false,
    mediaNames: string[],
    containsCode: boolean,
    /** 自定义模型名，传此参数时覆盖默认 Obsidian-basic */
    customModelName?: string
  ) {
    super(
      id,
      deckName,
      initialContent,
      fields,
      reversed,
      initialOffset,
      endOffset,
      tags,
      inserted,
      mediaNames,
      containsCode
    );
    if (customModelName) {
      this.modelName = customModelName;
    } else {
      this.modelName = this.reversed
        ? `Obsidian-basic-reversed`
        : `Obsidian-basic`;
      if (fields["Source"]) {
        this.modelName += sourceDeckExtension;
      }
      if (containsCode) {
        this.modelName += codeDeckExtension;
      }
    }
  }

  public getCard(update = false): object {
    const card: any = {
      deckName: this.deckName,
      modelName: this.modelName,
      fields: this.fields,
      tags: this.tags,
    };

    if (update) {
      card["id"] = this.id;
    }

    return card;
  }

  public getMedias(): object[] {
    const medias: object[] = [];
    this.mediaBase64Encoded.forEach((data, index) => {
      medias.push({
        filename: this.mediaNames[index],
        data: data,
      });
    });

    return medias;
  }

  public toString = (): string => {
    return `Q: ${this.fields[0]}\nA: ${this.fields[1]}`;
  };

  public getIdFormat(): string {
    return "^" + this.id.toString() + "\n";
  }
}
