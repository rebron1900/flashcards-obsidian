export interface ITemplateConfig {
  /** Anki 模型名，如 "执业中药师-详情卡" */
  modelName: string;
  /** 字段列表，如 ["Question","Answer","Note","DrugName"] */
  fields: string[];
  /** 匹配路径（fallback），如 "77-Anki/执业中药师/**" */
  filePathPattern: string;
  /** Markdown 解析模式 */
  parseMode: 'card-tag' | 'list-field' | 'inline' | 'cloze';
  /** 是否启用 */
  enabled: boolean;
}

export interface ISettings {
  contextAwareMode: boolean;
  sourceSupport: boolean;
  codeHighlightSupport: boolean;
  inlineID: boolean;
  contextSeparator: string;
  deck: string;
  folderBasedDeck: boolean;
  flashcardsTag: string;
  inlineSeparator: string;
  inlineSeparatorReverse: string;
  defaultAnkiTag: string;
  ankiConnectPermission: boolean;
  /** 自定义模板配置列表 */
  templateConfigs: ITemplateConfig[];
}
