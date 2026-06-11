> **Fork with custom template support.** Built on [reuseman/flashcards-obsidian](https://github.com/reuseman/flashcards-obsidian), extended with list-field parser, custom Anki models, and `:key` field dedup.

# Flashcards (Custom Template)

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/rebron1900/flashcards-obsidian?style=for-the-badge&sort=semver)](https://github.com/rebron1900/flashcards-obsidian/releases/latest)
![GitHub All Releases](https://img.shields.io/github/downloads/rebron1900/flashcards-obsidian/total?style=for-the-badge)

Anki integration for [Obsidian](https://obsidian.md/) — supports standard flashcards and custom template-based cards.

## Features

### Standard (upstream)

🗃️ Basic flashcards with **#card**  
🎴 Reversed flashcards with **#card-reverse** or **#card/reverse**  
📅 Spaced-only cards with **#card-spaced** or **#card/spaced**  
✍️ Inline style with **Question::Answer** / **Question:::Answer** (reversed)  
📃 Cloze with **==Highlight==** or **{Curly brackets}** or **{2:Cloze}**  
🧠 **Context-aware mode** (prepends heading hierarchy)  
🏷️ Global and local tags  
🔢 LaTeX support  
🖼️ Image / 🎤 audio / 🔗 Obsidian URI / ⚓ note reference  
📟 Code syntax highlight

### Custom (list-field template system)

**Define your own Anki note model** and write cards in a clean field-based format:

```
## Card Title #card
- **Question**: What is the capital of France?
- **Answer**: Paris
- **Note**: Also known as the City of Light
```

Fields map directly to Anki model fields. Missing fields are auto-filled.

**Template config** matches by frontmatter `template:` field or file path:

```yaml
---
template: 执业中药师-详情卡
cards-deck: 执业中药师::中药二
---
```

**`:key` field marker** designates which field Anki uses for deduplication:

```ts
fields: ["Breadcrumb", "Question:key", "Answer", "CoreEfficacy", "MemoryAid", "ExamHistory"]
```

- Plugin auto-creates the Anki model (key field first) if it doesn't exist
- Verifies field order on every sync; warns if key field isn't field 1
- Runtime dedup safety: if model's field 1 ≠ key field, prefixes key value for unique detection

**Settings UI** — add/remove/edit template configs directly in Obsidian settings.

## How to install

### Via BRAT (recommended)

1. Install [BRAT](obsidian://show-plugin?id=obsidian42-brat) from Community plugins
2. BRAT → **Add Beta plugin** → enter `rebron1900/flashcards-obsidian`
3. Plugin appears as **Flashcards (Custom Template)**

### Manual

1. Download latest `flashcards.zip` from [Releases](https://github.com/rebron1900/flashcards-obsidian/releases)
2. Extract to `.obsidian/plugins/flashcards-obsidian/`
3. Enable plugin in Obsidian settings

### Anki

Install [AnkiConnect](https://ankiweb.net/shared/info/2055492159) (2055492159) on Anki, then click **Grant Permission** in plugin settings.

## List-field card format

```
## 黄芩·功效 #card
- **Breadcrumb**: 中药二 > 第二章·清热药 > 清热燥湿药
- **Question**: 黄芩的功效是？
- **Answer**: 清热燥湿，泻火解毒，止血，安胎
- **CoreEfficacy**: 清热燥湿（上焦肺火、中焦湿热、下焦泻痢）
- **MemoryAid**: 芩→擒→擒住湿热火毒
- **ExamHistory**: 2023-01 配伍题

## 黄芩·鉴别 #card
- **Breadcrumb**: 中药二 > 第二章·清热药 > 清热燥湿药
- **Question**: 黄芩 vs 黄连 vs 黄柏的鉴别要点？
- **Answer**: 黄芩清上焦、黄连清中焦、黄柏清下焦
```

## Template configuration

Configure in plugin settings (or via `getDefaultSettings()` in `main.ts`):

| Field | Description |
|-------|-------------|
| `modelName` | Anki model name (e.g. `执业中药师-详情卡`) |
| `fields` | Field list. Append `:key` to mark dedup field |
| `filePathPattern` | Glob pattern (fallback if no frontmatter match) |
| `parseMode` | `list-field` (or card-tag / inline / cloze) |
| `enabled` | Toggle on/off |

## Changelog (since fork)

- **v1.7.10** — `:key` field drives model creation + field order verification; per-card addNote with dedup safety
- **v1.7.6** — Incremental sync: block ref tracking, field fill, HTML-stripped match()
- **v1.7.5** — BRAT-compatible semver tags, CI auto-release
- **v1.7.2–1.7.4** — List-field parser, frontmatter template matching, custom model support

## How it works

1. Read `.md` file → parse deck from `cards-deck` frontmatter or folder path
2. Match template config (frontmatter `template:` > path pattern)
3. If list-field mode: parse `- **Field**: Value` items; check/create Anki model
4. Compare generated cards with existing Anki cards via `^blockID` markers
5. Create/update/delete cards via AnkiConnect (per-card `addNote`)
6. Write `^blockID` back to file for incremental sync

## Support

If this plugin is useful, [buy me a coffee](https://ko-fi.com/V7V0ABKAF) ☕
