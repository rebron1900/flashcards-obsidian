import { __read, __spreadArray, __values } from "tslib";
import * as showdown from "showdown";
import { Flashcard } from "../entities/flashcard";
import { Inlinecard } from "src/entities/inlinecard";
import { Spacedcard } from "src/entities/spacedcard";
import { Clozecard } from "src/entities/clozecard";
import { escapeMarkdown } from "src/utils";
var Parser = /** @class */ (function () {
    function Parser(regex, settings) {
        this.regex = regex;
        this.settings = settings;
        this.htmlConverter = new showdown.Converter();
        this.htmlConverter.setOption("simplifiedAutoLink", true);
        this.htmlConverter.setOption("tables", true);
        this.htmlConverter.setOption("tasks", true);
        this.htmlConverter.setOption("strikethrough", true);
        this.htmlConverter.setOption("ghCodeBlocks", true);
        this.htmlConverter.setOption("requireSpaceBeforeHeadingText", true);
        this.htmlConverter.setOption("simpleLineBreaks", true);
    }
    Parser.prototype.generateFlashcards = function (file, deck, vault, note, globalTags) {
        var e_1, _a;
        if (globalTags === void 0) { globalTags = []; }
        var contextAware = this.settings.contextAwareMode;
        var cards = [];
        var headings = [];
        if (contextAware) {
            // https://regex101.com/r/agSp9X/4
            headings = __spreadArray([], __read(file.matchAll(this.regex.headingsRegex)), false);
        }
        // Don't preprocess note here, do it when setting Source field for each card
        cards = cards.concat(this.generateCardsWithTag(file, headings, deck, vault, note, globalTags));
        cards = cards.concat(this.generateInlineCards(file, headings, deck, vault, note, globalTags));
        cards = cards.concat(this.generateSpacedCards(file, headings, deck, vault, note, globalTags));
        cards = cards.concat(this.generateClozeCards(file, headings, deck, vault, note, globalTags));
        // Filter out cards that are fully inside a code block, a math block or a math inline block
        var codeBlocks = __spreadArray([], __read(file.matchAll(this.regex.obsidianCodeBlock)), false);
        var mathBlocks = __spreadArray([], __read(file.matchAll(this.regex.mathBlock)), false);
        var mathInline = __spreadArray([], __read(file.matchAll(this.regex.mathInline)), false);
        var blocksToFilter = __spreadArray(__spreadArray(__spreadArray([], __read(codeBlocks), false), __read(mathBlocks), false), __read(mathInline), false);
        var rangesToDiscard = blocksToFilter.map(function (x) { return ([x.index, x.index + x[0].length]); });
        cards = cards.filter(function (card) {
            var cardRange = [card.initialOffset, card.endOffset];
            var isInRangeToDiscard = rangesToDiscard.some(function (range) {
                return (cardRange[0] >= range[0] && cardRange[1] <= range[1]);
            });
            return !isInRangeToDiscard;
        });
        cards.sort(function (a, b) { return a.endOffset - b.endOffset; });
        var defaultAnkiTag = this.settings.defaultAnkiTag;
        if (defaultAnkiTag) {
            try {
                for (var cards_1 = __values(cards), cards_1_1 = cards_1.next(); !cards_1_1.done; cards_1_1 = cards_1.next()) {
                    var card = cards_1_1.value;
                    card.tags.push(defaultAnkiTag);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (cards_1_1 && !cards_1_1.done && (_a = cards_1.return)) _a.call(cards_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return cards;
    };
    /**
     * Gives back the ancestor headings of a line.
     * @param headings The list of all the headings available in a file.
     * @param line The line whose ancestors need to be calculated.
     * @param headingLevel The level of the first ancestor heading, i.e. the number of #.
     */
    Parser.prototype.getContext = function (headings, index, headingLevel) {
        var context = [];
        var currentIndex = index;
        var goalLevel = 6;
        var i = headings.length - 1;
        // Get the level of the first heading before the index (i.e. above the current line)
        if (headingLevel !== -1) {
            // This is the case of a #flashcard in a heading
            goalLevel = headingLevel - 1;
        }
        else {
            // Find first heading and its level
            // This is the case of a #flashcard in a paragraph
            for (i; i >= 0; i--) {
                if (headings[i].index < currentIndex) {
                    currentIndex = headings[i].index;
                    goalLevel = headings[i][1].length - 1;
                    context.unshift(headings[i][2].trim());
                    break;
                }
            }
        }
        // Search for the other headings
        for (i; i >= 0; i--) {
            var currentLevel = headings[i][1].length;
            if (currentLevel == goalLevel && headings[i].index < currentIndex) {
                currentIndex = headings[i].index;
                goalLevel = currentLevel - 1;
                context.unshift(headings[i][2].trim());
            }
        }
        return context;
    };
    Parser.prototype.generateSpacedCards = function (file, headings, deck, vault, note, globalTags) {
        var e_2, _a;
        if (globalTags === void 0) { globalTags = []; }
        var contextAware = this.settings.contextAwareMode;
        var cards = [];
        var matches = __spreadArray([], __read(file.matchAll(this.regex.cardsSpacedStyle)), false);
        try {
            for (var matches_1 = __values(matches), matches_1_1 = matches_1.next(); !matches_1_1.done; matches_1_1 = matches_1.next()) {
                var match = matches_1_1.value;
                var reversed = false;
                var headingLevel = -1;
                if (match[1]) {
                    headingLevel =
                        match[1].trim().length !== 0 ? match[1].trim().length : -1;
                }
                // Match.index - 1 because otherwise in the context there will be even match[1], i.e. the question itself
                var context = contextAware
                    ? this.getContext(headings, match.index - 1, headingLevel)
                    : "";
                var originalPrompt = match[2].trim();
                var prompt_1 = contextAware
                    ? __spreadArray(__spreadArray([], __read(context), false), [match[2].trim()], false).join("".concat(this.settings.contextSeparator))
                    : match[2].trim();
                var medias = this.getImageLinks(prompt_1);
                medias = medias.concat(this.getAudioLinks(prompt_1));
                prompt_1 = this.parseLine(prompt_1, vault);
                var initialOffset = match.index;
                var endingLine = match.index + match[0].length;
                var tags = this.parseTags(match[4], globalTags);
                var id = match[5] ? Number(match[5]) : -1;
                var inserted = match[5] ? true : false;
                var fields = { Prompt: prompt_1 };
                if (this.settings.sourceSupport) {
                    fields["Source"] = this.substituteObsidianLinks("[[".concat(note, "]]"), vault);
                }
                var containsCode = this.containsCode([prompt_1]);
                var card = new Spacedcard(id, deck, originalPrompt, fields, reversed, initialOffset, endingLine, tags, inserted, medias, containsCode);
                cards.push(card);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (matches_1_1 && !matches_1_1.done && (_a = matches_1.return)) _a.call(matches_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return cards;
    };
    Parser.prototype.generateClozeCards = function (file, headings, deck, vault, note, globalTags) {
        var e_3, _a;
        if (globalTags === void 0) { globalTags = []; }
        var contextAware = this.settings.contextAwareMode;
        var cards = [];
        var matches = __spreadArray([], __read(file.matchAll(this.regex.cardsClozeWholeLine)), false);
        var mathBlocks = __spreadArray([], __read(file.matchAll(this.regex.mathBlock)), false);
        var mathInline = __spreadArray([], __read(file.matchAll(this.regex.mathInline)), false);
        var blocksToFilter = __spreadArray(__spreadArray([], __read(mathBlocks), false), __read(mathInline), false);
        var rangesToDiscard = blocksToFilter.map(function (x) { return ([x.index, x.index + x[0].length]); });
        var _loop_1 = function (match) {
            var reversed = false;
            var headingLevel = -1;
            if (match[1]) {
                headingLevel =
                    match[1].trim().length !== 0 ? match[1].trim().length : -1;
            }
            // Match.index - 1 because otherwise in the context there will be even match[1], i.e. the question itself
            var context = contextAware
                ? this_1.getContext(headings, match.index - 1, headingLevel)
                : "";
            // If all the curly clozes are inside a math block, then do not create the card
            var curlyClozes = match[2].matchAll(this_1.regex.singleClozeCurly);
            var matchIndex = match.index;
            // Identify curly clozes, drop all the ones that are in math blocks i.e. ($\frac{1}{12}$) and substitute the others with Anki syntax
            var clozeText = match[2].replace(this_1.regex.singleClozeCurly, function (match, g1, g2, g3, offset) {
                var globalOffset = matchIndex + offset;
                var isInMathBlock = rangesToDiscard.some(function (x) { return (globalOffset >= x[0] && globalOffset + match[0].length <= x[1]); });
                if (isInMathBlock) {
                    return match;
                }
                else {
                    if (g2) {
                        return "{{c".concat(g2, "::").concat(g3, "}}");
                    }
                    else {
                        return "{{c1::".concat(g3, "}}");
                    }
                }
            });
            // Replace the highlight clozes in the line with Anki syntax
            clozeText = clozeText.replace(this_1.regex.singleClozeHighlight, "{{c1::$2}}");
            if (clozeText === match[2]) {
                return "continue";
            }
            var originalLine = match[2].trim();
            // Add context
            clozeText = contextAware
                ? __spreadArray(__spreadArray([], __read(context), false), [clozeText.trim()], false).join("".concat(this_1.settings.contextSeparator))
                : clozeText.trim();
            var medias = this_1.getImageLinks(clozeText);
            medias = medias.concat(this_1.getAudioLinks(clozeText));
            clozeText = this_1.parseLine(clozeText, vault);
            var initialOffset = match.index;
            var endingLine = match.index + match[0].length;
            var tags = this_1.parseTags(match[4], globalTags);
            var id = match[5] ? Number(match[5]) : -1;
            var inserted = match[5] ? true : false;
            var fields = { Text: clozeText, Extra: "" };
            if (this_1.settings.sourceSupport) {
                fields["Source"] = this_1.substituteObsidianLinks("[[".concat(note, "]]"), vault);
            }
            var containsCode = this_1.containsCode([clozeText]);
            var card = new Clozecard(id, deck, originalLine, fields, reversed, initialOffset, endingLine, tags, inserted, medias, containsCode);
            cards.push(card);
        };
        var this_1 = this;
        try {
            for (var matches_2 = __values(matches), matches_2_1 = matches_2.next(); !matches_2_1.done; matches_2_1 = matches_2.next()) {
                var match = matches_2_1.value;
                _loop_1(match);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (matches_2_1 && !matches_2_1.done && (_a = matches_2.return)) _a.call(matches_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return cards;
    };
    Parser.prototype.generateInlineCards = function (file, headings, deck, vault, note, globalTags) {
        var e_4, _a;
        if (globalTags === void 0) { globalTags = []; }
        var contextAware = this.settings.contextAwareMode;
        var cards = [];
        var matches = __spreadArray([], __read(file.matchAll(this.regex.cardsInlineStyle)), false);
        try {
            for (var matches_3 = __values(matches), matches_3_1 = matches_3.next(); !matches_3_1.done; matches_3_1 = matches_3.next()) {
                var match = matches_3_1.value;
                if (match[2].toLowerCase().startsWith("cards-deck") ||
                    match[2].toLowerCase().startsWith("tags")) {
                    continue;
                }
                var reversed = match[3] === this.settings.inlineSeparatorReverse;
                var headingLevel = -1;
                if (match[1]) {
                    headingLevel =
                        match[1].trim().length !== 0 ? match[1].trim().length : -1;
                }
                // Match.index - 1 because otherwise in the context there will be even match[1], i.e. the question itself
                var context = contextAware
                    ? this.getContext(headings, match.index - 1, headingLevel)
                    : "";
                var originalQuestion = match[2].trim();
                var question = contextAware
                    ? __spreadArray(__spreadArray([], __read(context), false), [match[2].trim()], false).join("".concat(this.settings.contextSeparator))
                    : match[2].trim();
                var answer = match[4].trim();
                var medias = this.getImageLinks(question);
                medias = medias.concat(this.getImageLinks(answer));
                medias = medias.concat(this.getAudioLinks(answer));
                question = this.parseLine(question, vault);
                answer = this.parseLine(answer, vault);
                var initialOffset = match.index;
                var endingLine = match.index + match[0].length;
                var tags = this.parseTags(match[5], globalTags);
                var id = match[6] ? Number(match[6]) : -1;
                var inserted = match[6] ? true : false;
                var fields = { Front: question, Back: answer };
                if (this.settings.sourceSupport) {
                    fields["Source"] = this.substituteObsidianLinks("[[".concat(note, "]]"), vault);
                }
                var containsCode = this.containsCode([question, answer]);
                var card = new Inlinecard(id, deck, originalQuestion, fields, reversed, initialOffset, endingLine, tags, inserted, medias, containsCode);
                cards.push(card);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (matches_3_1 && !matches_3_1.done && (_a = matches_3.return)) _a.call(matches_3);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return cards;
    };
    Parser.prototype.generateCardsWithTag = function (file, headings, deck, vault, note, globalTags) {
        var e_5, _a;
        if (globalTags === void 0) { globalTags = []; }
        var contextAware = this.settings.contextAwareMode;
        var cards = [];
        var matches = __spreadArray([], __read(file.matchAll(this.regex.flashscardsWithTag)), false);
        var embedMap = this.getEmbedMap();
        try {
            for (var matches_4 = __values(matches), matches_4_1 = matches_4.next(); !matches_4_1.done; matches_4_1 = matches_4.next()) {
                var match = matches_4_1.value;
                var reversed = match[3].trim().toLowerCase() ===
                    "#".concat(this.settings.flashcardsTag, "-reverse") ||
                    match[3].trim().toLowerCase() ===
                        "#".concat(this.settings.flashcardsTag, "/reverse");
                var headingLevel = match[1].trim().length !== 0 ? match[1].length : -1;
                // Match.index - 1 because otherwise in the context there will be even match[1], i.e. the question itself
                var context = contextAware
                    ? this.getContext(headings, match.index - 1, headingLevel).concat([])
                    : "";
                var originalQuestion = match[2].trim();
                var question = contextAware
                    ? __spreadArray(__spreadArray([], __read(context), false), [match[2].trim()], false).join("".concat(this.settings.contextSeparator))
                    : match[2].trim();
                var answer = match[5].trim();
                var medias = this.getImageLinks(question);
                medias = medias.concat(this.getImageLinks(answer));
                medias = medias.concat(this.getAudioLinks(answer));
                answer = this.getEmbedWrapContent(embedMap, answer);
                question = this.parseLine(question, vault);
                answer = this.parseLine(answer, vault);
                var initialOffset = match.index;
                var endingLine = match.index + match[0].length;
                var tags = this.parseTags(match[4], globalTags);
                var id = match[6] ? Number(match[6]) : -1;
                var inserted = match[6] ? true : false;
                var fields = { Front: question, Back: answer };
                if (this.settings.sourceSupport) {
                    fields["Source"] = this.substituteObsidianLinks("[[".concat(note, "]]"), vault);
                }
                var containsCode = this.containsCode([question, answer]);
                var card = new Flashcard(id, deck, originalQuestion, fields, reversed, initialOffset, endingLine, tags, inserted, medias, containsCode);
                cards.push(card);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (matches_4_1 && !matches_4_1.done && (_a = matches_4.return)) _a.call(matches_4);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return cards;
    };
    /**
     * 解析 list-field 格式卡片
     * ### 标题
     * - **FieldName**：Value
     * - **FieldName**：Value
     * 字段名直接对应 Anki 模型字段名
     */
    Parser.prototype.generateListFieldCards = function (file, deck, vault, note, globalTags, templateConfig) {
        var e_6, _a;
        if (globalTags === void 0) { globalTags = []; }
        var cards = [];
        // Regex for list-field card: heading followed by - **Field**：Value items
        // Card boundary: next heading or blank line (or EOF)
        var headingRegex = /^ {0,3}(#{1,6}) +(.+)$/gm;
        var fieldItemRegex = /^ {0,3}[-*] {0,3}\*\*(.+?)\*\*\s*[：:]\s*(.*)$/;
        var lines = file.split('\n');
        var i = 0;
        while (i < lines.length) {
            // Look for a heading
            var headingMatch = lines[i].match(headingRegex);
            if (!headingMatch) {
                i++;
                continue;
            }
            var cardStartLine = i;
            i++; // move past heading
            // Collect field lines (must be - **Field**：Value)
            var fieldLines = [];
            while (i < lines.length) {
                var trimmed = lines[i].trim();
                // Blank line or next heading → end of card
                if (trimmed === '' || /^#{1,6}\s/.test(trimmed)) {
                    break;
                }
                // Check for field item
                if (fieldItemRegex.test(trimmed)) {
                    fieldLines.push(trimmed);
                }
                i++;
            }
            if (fieldLines.length === 0)
                continue;
            // Parse fields
            var fields = {};
            try {
                for (var fieldLines_1 = (e_6 = void 0, __values(fieldLines)), fieldLines_1_1 = fieldLines_1.next(); !fieldLines_1_1.done; fieldLines_1_1 = fieldLines_1.next()) {
                    var line = fieldLines_1_1.value;
                    var m = line.match(fieldItemRegex);
                    if (m) {
                        var fieldName = m[1].trim();
                        var fieldValue = m[2].trim();
                        fields[fieldName] = this.parseLine(fieldValue, vault);
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (fieldLines_1_1 && !fieldLines_1_1.done && (_a = fieldLines_1.return)) _a.call(fieldLines_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
            // Build card offsets
            var cardText = lines.slice(cardStartLine, i).join('\n');
            var initialOffset = file.indexOf(cardText);
            var endOffset = initialOffset + cardText.length;
            var tags = __spreadArray([], __read(globalTags), false);
            var card = new Flashcard(-1, deck, headingMatch[2].trim(), fields, false, initialOffset, endOffset, tags, false, [], false, templateConfig.modelName);
            cards.push(card);
        }
        return cards;
    };
    Parser.prototype.containsCode = function (str) {
        var e_7, _a;
        try {
            for (var str_1 = __values(str), str_1_1 = str_1.next(); !str_1_1.done; str_1_1 = str_1.next()) {
                var s = str_1_1.value;
                if (s.match(this.regex.codeBlock)) {
                    return true;
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (str_1_1 && !str_1_1.done && (_a = str_1.return)) _a.call(str_1);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return false;
    };
    Parser.prototype.getCardsToDelete = function (file) {
        // Find block IDs with no content above it
        return __spreadArray([], __read(file.matchAll(this.regex.cardsToDelete)), false).map(function (match) {
            return Number(match[1]);
        });
    };
    Parser.prototype.parseLine = function (str, vaultName) {
        return this.htmlConverter.makeHtml(this.mathToAnki(this.substituteObsidianLinks(this.substituteImageLinks(this.substituteAudioLinks(str)), vaultName)));
    };
    Parser.prototype.getImageLinks = function (str) {
        var e_8, _a, e_9, _b;
        var wikiMatches = str.matchAll(this.regex.wikiImageLinks);
        var markdownMatches = str.matchAll(this.regex.markdownImageLinks);
        var links = [];
        try {
            for (var wikiMatches_1 = __values(wikiMatches), wikiMatches_1_1 = wikiMatches_1.next(); !wikiMatches_1_1.done; wikiMatches_1_1 = wikiMatches_1.next()) {
                var wikiMatch = wikiMatches_1_1.value;
                links.push(wikiMatch[1]);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (wikiMatches_1_1 && !wikiMatches_1_1.done && (_a = wikiMatches_1.return)) _a.call(wikiMatches_1);
            }
            finally { if (e_8) throw e_8.error; }
        }
        try {
            for (var markdownMatches_1 = __values(markdownMatches), markdownMatches_1_1 = markdownMatches_1.next(); !markdownMatches_1_1.done; markdownMatches_1_1 = markdownMatches_1.next()) {
                var markdownMatch = markdownMatches_1_1.value;
                links.push(decodeURIComponent(markdownMatch[1]));
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (markdownMatches_1_1 && !markdownMatches_1_1.done && (_b = markdownMatches_1.return)) _b.call(markdownMatches_1);
            }
            finally { if (e_9) throw e_9.error; }
        }
        return links;
    };
    Parser.prototype.getAudioLinks = function (str) {
        var e_10, _a;
        var wikiMatches = str.matchAll(this.regex.wikiAudioLinks);
        var links = [];
        try {
            for (var wikiMatches_2 = __values(wikiMatches), wikiMatches_2_1 = wikiMatches_2.next(); !wikiMatches_2_1.done; wikiMatches_2_1 = wikiMatches_2.next()) {
                var wikiMatch = wikiMatches_2_1.value;
                links.push(wikiMatch[1]);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (wikiMatches_2_1 && !wikiMatches_2_1.done && (_a = wikiMatches_2.return)) _a.call(wikiMatches_2);
            }
            finally { if (e_10) throw e_10.error; }
        }
        return links;
    };
    Parser.prototype.updateCardSource = function (cards) {
        var e_11, _a;
        try {
            for (var cards_2 = __values(cards), cards_2_1 = cards_2.next(); !cards_2_1.done; cards_2_1 = cards_2.next()) {
                var card = cards_2_1.value;
                if (card.id == null || card.id === -1) {
                    // For cards without valid block ID, remove the block reference from URL
                    card.fields["Source"] = card.fields["Source"].replace("#^__BLOCK_ID__", "");
                    continue;
                }
                card.fields["Source"] = card.fields["Source"].replace("__BLOCK_ID__", String(card.id));
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (cards_2_1 && !cards_2_1.done && (_a = cards_2.return)) _a.call(cards_2);
            }
            finally { if (e_11) throw e_11.error; }
        }
    };
    Parser.prototype.substituteObsidianLinks = function (str, vaultName) {
        var linkRegex = /\[\[(.+?)(?:\|(.+?))?\]\]/gim;
        vaultName = encodeURIComponent(vaultName);
        return str.replace(linkRegex, function (match, filename, rename) {
            var href = "obsidian://open?vault=".concat(vaultName, "&file=").concat(encodeURIComponent(filename + "#^__BLOCK_ID__"));
            var fileRename = rename ? rename : filename.split('/').pop(); // Use just the filename for display
            return "<a href=\"".concat(href, "\">").concat(fileRename, "</a>");
        });
    };
    Parser.prototype.substituteImageLinks = function (str) {
        str = str.replace(this.regex.wikiImageLinks, "<img src='$1'>");
        str = str.replace(this.regex.markdownImageLinks, "<img src='$1'>");
        return str;
    };
    Parser.prototype.substituteAudioLinks = function (str) {
        return str.replace(this.regex.wikiAudioLinks, "[sound:$1]");
    };
    Parser.prototype.mathToAnki = function (str) {
        str = str.replace(this.regex.mathBlock, function (match, p1, p2) {
            return "\\\\[" + escapeMarkdown(p2) + " \\\\]";
        });
        str = str.replace(this.regex.mathInline, function (match, p1, p2) {
            return "\\\\(" + escapeMarkdown(p2) + "\\\\)";
        });
        return str;
    };
    Parser.prototype.parseTags = function (str, globalTags) {
        var e_12, _a;
        var tags = __spreadArray([], __read(globalTags), false);
        if (str) {
            try {
                for (var _b = __values(str.split("#")), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tag = _c.value;
                    var newTag = tag.trim();
                    if (newTag) {
                        // Replace obsidian hierarchy tags delimeter \ with anki delimeter ::
                        newTag = newTag.replace(this.regex.tagHierarchy, "::");
                        tags.push(newTag);
                    }
                }
            }
            catch (e_12_1) { e_12 = { error: e_12_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_12) throw e_12.error; }
            }
        }
        return tags;
    };
    Parser.prototype.getAnkiIDsBlocks = function (file) {
        return Array.from(file.matchAll(/\^(\d{13})\s*/gm));
    };
    Parser.prototype.getEmbedMap = function () {
        var _this = this;
        // key：link url 
        // value： embed content parse from html document
        var embedMap = new Map();
        var embedList = Array.from(document.documentElement.getElementsByClassName('internal-embed'));
        Array.from(embedList).forEach(function (el) {
            // markdown-embed-content markdown-embed-page
            var embedValue = _this.htmlConverter.makeMarkdown(_this.htmlConverter.makeHtml(el.outerHTML).toString());
            var embedKey = el.getAttribute("src");
            embedMap.set(embedKey, embedValue);
            // console.log("embedKey: \n" + embedKey);
            // console.log("embedValue: \n" + embedValue);
        });
        return embedMap;
    };
    Parser.prototype.getEmbedWrapContent = function (embedMap, embedContent) {
        var result = embedContent.match(this.regex.embedBlock);
        while ((result = this.regex.embedBlock.exec(embedContent))) {
            // console.log("result[0]: " + result[0]);
            // console.log("embedMap.get(result[1]): " + embedMap.get(result[1]));
            embedContent = embedContent.concat(embedMap.get(result[1]));
        }
        return embedContent;
    };
    return Parser;
}());
export { Parser };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxPQUFPLEtBQUssUUFBUSxNQUFNLFVBQVUsQ0FBQztBQUVyQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUszQztJQUtFLGdCQUFZLEtBQVksRUFBRSxRQUFtQjtRQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzlDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsYUFBYSxDQUFD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dHRpbmdzIH0gZnJvbSBcInNyYy9jb25mL3NldHRpbmdzXCI7XG5pbXBvcnQgKiBhcyBzaG93ZG93biBmcm9tIFwic2hvd2Rvd25cIjtcbmltcG9ydCB7IFJlZ2V4IH0gZnJvbSBcInNyYy9jb25mL3JlZ2V4XCI7XG5pbXBvcnQgeyBGbGFzaGNhcmQgfSBmcm9tIFwiLi4vZW50aXRpZXMvZmxhc2hjYXJkXCI7XG5pbXBvcnQgeyBJbmxpbmVjYXJkIH0gZnJvbSBcInNyYy9lbnRpdGllcy9pbmxpbmVjYXJkXCI7XG5pbXBvcnQgeyBTcGFjZWRjYXJkIH0gZnJvbSBcInNyYy9lbnRpdGllcy9zcGFjZWRjYXJkXCI7XG5pbXBvcnQgeyBDbG96ZWNhcmQgfSBmcm9tIFwic3JjL2VudGl0aWVzL2Nsb3plY2FyZFwiO1xuaW1wb3J0IHsgZXNjYXBlTWFya2Rvd24gfSBmcm9tIFwic3JjL3V0aWxzXCI7XG5pbXBvcnQgeyBDYXJkIH0gZnJvbSBcInNyYy9lbnRpdGllcy9jYXJkXCI7XG5pbXBvcnQgeyBodG1sVG9NYXJrZG93biB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IElUZW1wbGF0ZUNvbmZpZyB9IGZyb20gXCJzcmMvY29uZi9zZXR0aW5nc1wiO1xuXG5leHBvcnQgY2xhc3MgUGFyc2VyIHtcbiAgcHJpdmF0ZSByZWdleDogUmVnZXg7XG4gIHByaXZhdGUgc2V0dGluZ3M6IElTZXR0aW5ncztcbiAgcHJpdmF0ZSBodG1sQ29udmVydGVyO1xuXG4gIGNvbnN0cnVjdG9yKHJlZ2V4OiBSZWdleCwgc2V0dGluZ3M6IElTZXR0aW5ncykge1xuICAgIHRoaXMucmVnZXggPSByZWdleDtcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgdGhpcy5odG1sQ29udmVydGVyID0gbmV3IHNob3dkb3duLkNvbnZlcnRlcigpO1xuICAgIHRoaXMuaHRtbENvbnZlcnRlci5zZXRPcHRpb24oXCJzaW1wbGlmaWVkQXV0b0xpbmtcIiwgdHJ1ZSk7XG4gICAgdGhpcy5odG1sQ29udmVydGVyLnNldE9wdGlvbihcInRhYmxlc1wiLCB0cnVlKTtcbiAgICB0aGlzLmh0bWxDb252ZXJ0ZXIuc2V0T3B0aW9uKFwidGFza3NcIiwgdHJ1ZSk7XG4gICAgdGhpcy5odG1sQ29udmVydGVyLnNldE9wdGlvbihcInN0cmlrZXRocm91Z2hcIiwgdHJ1ZSk7XG4gICAgdGhpcy5odG1sQ29udmVydGVyLnNldE9wdGlvbihcImdoQ29kZUJsb2Nrc1wiLCB0cnVlKTtcbiAgICB0aGlzLmh0bWxDb252ZXJ0ZXIuc2V0T3B0aW9uKFwicmVxdWlyZVNwYWNlQmVmb3JlSGVhZGluZ1RleHRcIiwgdHJ1ZSk7XG4gICAgdGhpcy5odG1sQ29udmVydGVyLnNldE9wdGlvbihcInNpbXBsZUxpbmVCcmVha3NcIiwgdHJ1ZSk7XG4gIH1cblxuICBwdWJsaWMgZ2VuZXJhdGVGbGFzaGNhcmRzKFxuICAgIGZpbGU6IHN0cmluZyxcbiAgICBkZWNrOiBzdHJpbmcsXG4gICAgdmF1bHQ6IHN0cmluZyxcbiAgICBub3RlOiBzdHJpbmcsXG4gICAgZ2xvYmFsVGFnczogc3RyaW5nW10gPSBbXVxuICApOiBGbGFzaGNhcmRbXSB7XG4gICAgY29uc3QgY29udGV4dEF3YXJlID0gdGhpcy5zZXR0aW5ncy5jb250ZXh0QXdhcmVNb2RlO1xuICAgIGxldCBjYXJkczogRmxhc2hjYXJkW10gPSBbXTtcbiAgICBsZXQgaGVhZGluZ3M6IGFueSA9IFtdO1xuXG4gICAgaWYgKGNvbnRleHRBd2FyZSkge1xuICAgICAgLy8gaHR0cHM6Ly9yZWdleDEwMS5jb20vci9hZ1NwOVgvNFxuICAgICAgaGVhZGluZ3MgPSBbLi4uZmlsZS5tYXRjaEFsbCh0aGlzLnJlZ2V4LmhlYWRpbmdzUmVnZXgpXTtcbiAgICB9XG5cbiAgICAvLyBEb24ndCBwcmVwcm9jZXNzIG5vdGUgaGVyZSwgZG8gaXQgd2hlbiBzZXR0aW5nIFNvdXJjZSBmaWVsZCBmb3IgZWFjaCBjYXJkXG4gICAgY2FyZHMgPSBjYXJkcy5jb25jYXQoXG4gICAgICB0aGlzLmdlbmVyYXRlQ2FyZHNXaXRoVGFnKGZpbGUsIGhlYWRpbmdzLCBkZWNrLCB2YXVsdCwgbm90ZSwgZ2xvYmFsVGFncylcbiAgICApO1xuICAgIGNhcmRzID0gY2FyZHMuY29uY2F0KFxuICAgICAgdGhpcy5nZW5lcmF0ZUlubGluZUNhcmRzKGZpbGUsIGhlYWRpbmdzLCBkZWNrLCB2YXVsdCwgbm90ZSwgZ2xvYmFsVGFncylcbiAgICApO1xuICAgIGNhcmRzID0gY2FyZHMuY29uY2F0KFxuICAgICAgdGhpcy5nZW5lcmF0ZVNwYWNlZENhcmRzKGZpbGUsIGhlYWRpbmdzLCBkZWNrLCB2YXVsdCwgbm90ZSwgZ2xvYmFsVGFncylcbiAgICApO1xuICAgIGNhcmRzID0gY2FyZHMuY29uY2F0KFxuICAgICAgdGhpcy5nZW5lcmF0ZUNsb3plQ2FyZHMoZmlsZSwgaGVhZGluZ3MsIGRlY2ssIHZhdWx0LCBub3RlLCBnbG9iYWxUYWdzKVxuICAgICk7XG5cbiAgICAvLyBGaWx0ZXIgb3V0IGNhcmRzIHRoYXQgYXJlIGZ1bGx5IGluc2lkZSBhIGNvZGUgYmxvY2ssIGEgbWF0aCBibG9jayBvciBhIG1hdGggaW5saW5lIGJsb2NrXG4gICAgY29uc3QgY29kZUJsb2NrcyA9IFsuLi5maWxlLm1hdGNoQWxsKHRoaXMucmVnZXgub2JzaWRpYW5Db2RlQmxvY2spXTtcbiAgICBjb25zdCBtYXRoQmxvY2tzID0gWy4uLmZpbGUubWF0Y2hBbGwodGhpcy5yZWdleC5tYXRoQmxvY2spXTtcbiAgICBjb25zdCBtYXRoSW5saW5lID0gWy4uLmZpbGUubWF0Y2hBbGwodGhpcy5yZWdleC5tYXRoSW5saW5lKV07XG4gICAgY29uc3QgYmxvY2tzVG9GaWx0ZXIgPSBbLi4uY29kZUJsb2NrcywgLi4ubWF0aEJsb2NrcywgLi4ubWF0aElubGluZV07XG4gICAgY29uc3QgcmFuZ2VzVG9EaXNjYXJkID0gYmxvY2tzVG9GaWx0ZXIubWFwKHggPT4gKFt4LmluZGV4LCB4LmluZGV4ICsgeFswXS5sZW5ndGhdKSlcbiAgICBjYXJkcyA9IGNhcmRzLmZpbHRlcihjYXJkID0+IHtcbiAgICAgIGNvbnN0IGNhcmRSYW5nZSA9IFtjYXJkLmluaXRpYWxPZmZzZXQsIGNhcmQuZW5kT2Zmc2V0XTtcbiAgICAgIGNvbnN0IGlzSW5SYW5nZVRvRGlzY2FyZCA9IHJhbmdlc1RvRGlzY2FyZC5zb21lKHJhbmdlID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBjYXJkUmFuZ2VbMF0gPj0gcmFuZ2VbMF0gJiYgY2FyZFJhbmdlWzFdIDw9IHJhbmdlWzFdXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiAhaXNJblJhbmdlVG9EaXNjYXJkO1xuICAgIH0pO1xuXG4gICAgY2FyZHMuc29ydCgoYSwgYikgPT4gYS5lbmRPZmZzZXQgLSBiLmVuZE9mZnNldCk7XG5cbiAgICBjb25zdCBkZWZhdWx0QW5raVRhZyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdEFua2lUYWc7XG4gICAgaWYgKGRlZmF1bHRBbmtpVGFnKSB7XG4gICAgICBmb3IgKGNvbnN0IGNhcmQgb2YgY2FyZHMpIHtcbiAgICAgICAgY2FyZC50YWdzLnB1c2goZGVmYXVsdEFua2lUYWcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjYXJkcztcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlcyBiYWNrIHRoZSBhbmNlc3RvciBoZWFkaW5ncyBvZiBhIGxpbmUuXG4gICAqIEBwYXJhbSBoZWFkaW5ncyBUaGUgbGlzdCBvZiBhbGwgdGhlIGhlYWRpbmdzIGF2YWlsYWJsZSBpbiBhIGZpbGUuXG4gICAqIEBwYXJhbSBsaW5lIFRoZSBsaW5lIHdob3NlIGFuY2VzdG9ycyBuZWVkIHRvIGJlIGNhbGN1bGF0ZWQuXG4gICAqIEBwYXJhbSBoZWFkaW5nTGV2ZWwgVGhlIGxldmVsIG9mIHRoZSBmaXJzdCBhbmNlc3RvciBoZWFkaW5nLCBpLmUuIHRoZSBudW1iZXIgb2YgIy5cbiAgICovXG4gIHByaXZhdGUgZ2V0Q29udGV4dChcbiAgICBoZWFkaW5nczogYW55LFxuICAgIGluZGV4OiBudW1iZXIsXG4gICAgaGVhZGluZ0xldmVsOiBudW1iZXJcbiAgKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGNvbnRleHQ6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IGN1cnJlbnRJbmRleDogbnVtYmVyID0gaW5kZXg7XG4gICAgbGV0IGdvYWxMZXZlbCA9IDY7XG5cbiAgICBsZXQgaSA9IGhlYWRpbmdzLmxlbmd0aCAtIDE7XG4gICAgLy8gR2V0IHRoZSBsZXZlbCBvZiB0aGUgZmlyc3QgaGVhZGluZyBiZWZvcmUgdGhlIGluZGV4IChpLmUuIGFib3ZlIHRoZSBjdXJyZW50IGxpbmUpXG4gICAgaWYgKGhlYWRpbmdMZXZlbCAhPT0gLTEpIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGNhc2Ugb2YgYSAjZmxhc2hjYXJkIGluIGEgaGVhZGluZ1xuICAgICAgZ29hbExldmVsID0gaGVhZGluZ0xldmVsIC0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRmluZCBmaXJzdCBoZWFkaW5nIGFuZCBpdHMgbGV2ZWxcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGNhc2Ugb2YgYSAjZmxhc2hjYXJkIGluIGEgcGFyYWdyYXBoXG4gICAgICBmb3IgKGk7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmIChoZWFkaW5nc1tpXS5pbmRleCA8IGN1cnJlbnRJbmRleCkge1xuICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGhlYWRpbmdzW2ldLmluZGV4O1xuICAgICAgICAgIGdvYWxMZXZlbCA9IGhlYWRpbmdzW2ldWzFdLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICBjb250ZXh0LnVuc2hpZnQoaGVhZGluZ3NbaV1bMl0udHJpbSgpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNlYXJjaCBmb3IgdGhlIG90aGVyIGhlYWRpbmdzXG4gICAgZm9yIChpOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgY3VycmVudExldmVsID0gaGVhZGluZ3NbaV1bMV0ubGVuZ3RoO1xuICAgICAgaWYgKGN1cnJlbnRMZXZlbCA9PSBnb2FsTGV2ZWwgJiYgaGVhZGluZ3NbaV0uaW5kZXggPCBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgY3VycmVudEluZGV4ID0gaGVhZGluZ3NbaV0uaW5kZXg7XG4gICAgICAgIGdvYWxMZXZlbCA9IGN1cnJlbnRMZXZlbCAtIDE7XG5cbiAgICAgICAgY29udGV4dC51bnNoaWZ0KGhlYWRpbmdzW2ldWzJdLnRyaW0oKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlU3BhY2VkQ2FyZHMoXG4gICAgZmlsZTogc3RyaW5nLFxuICAgIGhlYWRpbmdzOiBhbnksXG4gICAgZGVjazogc3RyaW5nLFxuICAgIHZhdWx0OiBzdHJpbmcsXG4gICAgbm90ZTogc3RyaW5nLFxuICAgIGdsb2JhbFRhZ3M6IHN0cmluZ1tdID0gW11cbiAgKSB7XG4gICAgY29uc3QgY29udGV4dEF3YXJlID0gdGhpcy5zZXR0aW5ncy5jb250ZXh0QXdhcmVNb2RlO1xuICAgIGNvbnN0IGNhcmRzOiBTcGFjZWRjYXJkW10gPSBbXTtcbiAgICBjb25zdCBtYXRjaGVzID0gWy4uLmZpbGUubWF0Y2hBbGwodGhpcy5yZWdleC5jYXJkc1NwYWNlZFN0eWxlKV07XG5cbiAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIG1hdGNoZXMpIHtcbiAgICAgIGNvbnN0IHJldmVyc2VkID0gZmFsc2U7XG4gICAgICBsZXQgaGVhZGluZ0xldmVsID0gLTE7XG4gICAgICBpZiAobWF0Y2hbMV0pIHtcbiAgICAgICAgaGVhZGluZ0xldmVsID1cbiAgICAgICAgICBtYXRjaFsxXS50cmltKCkubGVuZ3RoICE9PSAwID8gbWF0Y2hbMV0udHJpbSgpLmxlbmd0aCA6IC0xO1xuICAgICAgfVxuICAgICAgLy8gTWF0Y2guaW5kZXggLSAxIGJlY2F1c2Ugb3RoZXJ3aXNlIGluIHRoZSBjb250ZXh0IHRoZXJlIHdpbGwgYmUgZXZlbiBtYXRjaFsxXSwgaS5lLiB0aGUgcXVlc3Rpb24gaXRzZWxmXG4gICAgICBjb25zdCBjb250ZXh0ID0gY29udGV4dEF3YXJlXG4gICAgICAgID8gdGhpcy5nZXRDb250ZXh0KGhlYWRpbmdzLCBtYXRjaC5pbmRleCAtIDEsIGhlYWRpbmdMZXZlbClcbiAgICAgICAgOiBcIlwiO1xuXG4gICAgICBjb25zdCBvcmlnaW5hbFByb21wdCA9IG1hdGNoWzJdLnRyaW0oKTtcbiAgICAgIGxldCBwcm9tcHQgPSBjb250ZXh0QXdhcmVcbiAgICAgICAgPyBbLi4uY29udGV4dCwgbWF0Y2hbMl0udHJpbSgpXS5qb2luKFxuICAgICAgICAgIGAke3RoaXMuc2V0dGluZ3MuY29udGV4dFNlcGFyYXRvcn1gXG4gICAgICAgIClcbiAgICAgICAgOiBtYXRjaFsyXS50cmltKCk7XG4gICAgICBsZXQgbWVkaWFzOiBzdHJpbmdbXSA9IHRoaXMuZ2V0SW1hZ2VMaW5rcyhwcm9tcHQpO1xuICAgICAgbWVkaWFzID0gbWVkaWFzLmNvbmNhdCh0aGlzLmdldEF1ZGlvTGlua3MocHJvbXB0KSk7XG4gICAgICBwcm9tcHQgPSB0aGlzLnBhcnNlTGluZShwcm9tcHQsIHZhdWx0KTtcblxuICAgICAgY29uc3QgaW5pdGlhbE9mZnNldCA9IG1hdGNoLmluZGV4O1xuICAgICAgY29uc3QgZW5kaW5nTGluZSA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgY29uc3QgdGFnczogc3RyaW5nW10gPSB0aGlzLnBhcnNlVGFncyhtYXRjaFs0XSwgZ2xvYmFsVGFncyk7XG4gICAgICBjb25zdCBpZDogbnVtYmVyID0gbWF0Y2hbNV0gPyBOdW1iZXIobWF0Y2hbNV0pIDogLTE7XG4gICAgICBjb25zdCBpbnNlcnRlZDogYm9vbGVhbiA9IG1hdGNoWzVdID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgY29uc3QgZmllbGRzOiBhbnkgPSB7IFByb21wdDogcHJvbXB0IH07XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5zb3VyY2VTdXBwb3J0KSB7XG4gICAgICAgIGZpZWxkc1tcIlNvdXJjZVwiXSA9IHRoaXMuc3Vic3RpdHV0ZU9ic2lkaWFuTGlua3MoYFtbJHtub3RlfV1dYCwgdmF1bHQpO1xuICAgICAgfVxuICAgICAgY29uc3QgY29udGFpbnNDb2RlID0gdGhpcy5jb250YWluc0NvZGUoW3Byb21wdF0pO1xuXG4gICAgICBjb25zdCBjYXJkID0gbmV3IFNwYWNlZGNhcmQoXG4gICAgICAgIGlkLFxuICAgICAgICBkZWNrLFxuICAgICAgICBvcmlnaW5hbFByb21wdCxcbiAgICAgICAgZmllbGRzLFxuICAgICAgICByZXZlcnNlZCxcbiAgICAgICAgaW5pdGlhbE9mZnNldCxcbiAgICAgICAgZW5kaW5nTGluZSxcbiAgICAgICAgdGFncyxcbiAgICAgICAgaW5zZXJ0ZWQsXG4gICAgICAgIG1lZGlhcyxcbiAgICAgICAgY29udGFpbnNDb2RlXG4gICAgICApO1xuICAgICAgY2FyZHMucHVzaChjYXJkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2FyZHM7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlQ2xvemVDYXJkcyhcbiAgICBmaWxlOiBzdHJpbmcsXG4gICAgaGVhZGluZ3M6IGFueSxcbiAgICBkZWNrOiBzdHJpbmcsXG4gICAgdmF1bHQ6IHN0cmluZyxcbiAgICBub3RlOiBzdHJpbmcsXG4gICAgZ2xvYmFsVGFnczogc3RyaW5nW10gPSBbXVxuICApIHtcbiAgICBjb25zdCBjb250ZXh0QXdhcmUgPSB0aGlzLnNldHRpbmdzLmNvbnRleHRBd2FyZU1vZGU7XG4gICAgY29uc3QgY2FyZHM6IENsb3plY2FyZFtdID0gW107XG4gICAgY29uc3QgbWF0Y2hlcyA9IFsuLi5maWxlLm1hdGNoQWxsKHRoaXMucmVnZXguY2FyZHNDbG96ZVdob2xlTGluZSldO1xuXG4gICAgY29uc3QgbWF0aEJsb2NrcyA9IFsuLi5maWxlLm1hdGNoQWxsKHRoaXMucmVnZXgubWF0aEJsb2NrKV07XG4gICAgY29uc3QgbWF0aElubGluZSA9IFsuLi5maWxlLm1hdGNoQWxsKHRoaXMucmVnZXgubWF0aElubGluZSldO1xuICAgIGNvbnN0IGJsb2Nrc1RvRmlsdGVyID0gWy4uLm1hdGhCbG9ja3MsIC4uLm1hdGhJbmxpbmVdO1xuICAgIGNvbnN0IHJhbmdlc1RvRGlzY2FyZCA9IGJsb2Nrc1RvRmlsdGVyLm1hcCh4ID0+IChbeC5pbmRleCwgeC5pbmRleCArIHhbMF0ubGVuZ3RoXSkpXG5cbiAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIG1hdGNoZXMpIHtcbiAgICAgIGNvbnN0IHJldmVyc2VkID0gZmFsc2U7XG4gICAgICBsZXQgaGVhZGluZ0xldmVsID0gLTE7XG4gICAgICBpZiAobWF0Y2hbMV0pIHtcbiAgICAgICAgaGVhZGluZ0xldmVsID1cbiAgICAgICAgICBtYXRjaFsxXS50cmltKCkubGVuZ3RoICE9PSAwID8gbWF0Y2hbMV0udHJpbSgpLmxlbmd0aCA6IC0xO1xuICAgICAgfVxuICAgICAgLy8gTWF0Y2guaW5kZXggLSAxIGJlY2F1c2Ugb3RoZXJ3aXNlIGluIHRoZSBjb250ZXh0IHRoZXJlIHdpbGwgYmUgZXZlbiBtYXRjaFsxXSwgaS5lLiB0aGUgcXVlc3Rpb24gaXRzZWxmXG4gICAgICBjb25zdCBjb250ZXh0ID0gY29udGV4dEF3YXJlXG4gICAgICAgID8gdGhpcy5nZXRDb250ZXh0KGhlYWRpbmdzLCBtYXRjaC5pbmRleCAtIDEsIGhlYWRpbmdMZXZlbClcbiAgICAgICAgOiBcIlwiO1xuXG4gICAgICAvLyBJZiBhbGwgdGhlIGN1cmx5IGNsb3plcyBhcmUgaW5zaWRlIGEgbWF0aCBibG9jaywgdGhlbiBkbyBub3QgY3JlYXRlIHRoZSBjYXJkXG4gICAgICBjb25zdCBjdXJseUNsb3plcyA9IG1hdGNoWzJdLm1hdGNoQWxsKHRoaXMucmVnZXguc2luZ2xlQ2xvemVDdXJseSk7XG4gICAgICBjb25zdCBtYXRjaEluZGV4ID0gbWF0Y2guaW5kZXg7XG4gICAgICAvLyBJZGVudGlmeSBjdXJseSBjbG96ZXMsIGRyb3AgYWxsIHRoZSBvbmVzIHRoYXQgYXJlIGluIG1hdGggYmxvY2tzIGkuZS4gKCRcXGZyYWN7MX17MTJ9JCkgYW5kIHN1YnN0aXR1dGUgdGhlIG90aGVycyB3aXRoIEFua2kgc3ludGF4XG4gICAgICBsZXQgY2xvemVUZXh0ID0gbWF0Y2hbMl0ucmVwbGFjZSh0aGlzLnJlZ2V4LnNpbmdsZUNsb3plQ3VybHksIChtYXRjaCwgZzEsIGcyLCBnMywgb2Zmc2V0KSA9PiB7XG4gICAgICAgIGNvbnN0IGdsb2JhbE9mZnNldCA9IG1hdGNoSW5kZXggKyBvZmZzZXQ7XG4gICAgICAgIGNvbnN0IGlzSW5NYXRoQmxvY2sgPSByYW5nZXNUb0Rpc2NhcmQuc29tZSh4ID0+IChnbG9iYWxPZmZzZXQgPj0geFswXSAmJiBnbG9iYWxPZmZzZXQgKyBtYXRjaFswXS5sZW5ndGggPD0geFsxXSkpO1xuICAgICAgICBpZiAoaXNJbk1hdGhCbG9jaykge1xuICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZzIpIHtcbiAgICAgICAgICAgIHJldHVybiBge3tjJHtnMn06OiR7ZzN9fX1gO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYHt7YzE6OiR7ZzN9fX1gO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIFJlcGxhY2UgdGhlIGhpZ2hsaWdodCBjbG96ZXMgaW4gdGhlIGxpbmUgd2l0aCBBbmtpIHN5bnRheFxuICAgICAgY2xvemVUZXh0ID0gY2xvemVUZXh0LnJlcGxhY2UodGhpcy5yZWdleC5zaW5nbGVDbG96ZUhpZ2hsaWdodCwgXCJ7e2MxOjokMn19XCIpO1xuXG4gICAgICBpZiAoY2xvemVUZXh0ID09PSBtYXRjaFsyXSkge1xuICAgICAgICAvLyBJZiB0aGUgY2xvemVUZXh0IGlzIHRoZSBzYW1lIGFzIHRoZSBtYXRjaCBpdCBtZWFucyB0aGF0IHRoZSBjdXJseSBjbG96ZXMgd2VyZSBhbGwgaW4gbWF0aCBibG9ja3NcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9yaWdpbmFsTGluZSA9IG1hdGNoWzJdLnRyaW0oKTtcbiAgICAgIC8vIEFkZCBjb250ZXh0XG4gICAgICBjbG96ZVRleHQgPSBjb250ZXh0QXdhcmVcbiAgICAgICAgPyBbLi4uY29udGV4dCwgY2xvemVUZXh0LnRyaW0oKV0uam9pbihcbiAgICAgICAgICBgJHt0aGlzLnNldHRpbmdzLmNvbnRleHRTZXBhcmF0b3J9YFxuICAgICAgICApXG4gICAgICAgIDogY2xvemVUZXh0LnRyaW0oKTtcbiAgICAgIGxldCBtZWRpYXM6IHN0cmluZ1tdID0gdGhpcy5nZXRJbWFnZUxpbmtzKGNsb3plVGV4dCk7XG4gICAgICBtZWRpYXMgPSBtZWRpYXMuY29uY2F0KHRoaXMuZ2V0QXVkaW9MaW5rcyhjbG96ZVRleHQpKTtcbiAgICAgIGNsb3plVGV4dCA9IHRoaXMucGFyc2VMaW5lKGNsb3plVGV4dCwgdmF1bHQpO1xuXG4gICAgICBjb25zdCBpbml0aWFsT2Zmc2V0ID0gbWF0Y2guaW5kZXg7XG4gICAgICBjb25zdCBlbmRpbmdMaW5lID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XG4gICAgICBjb25zdCB0YWdzOiBzdHJpbmdbXSA9IHRoaXMucGFyc2VUYWdzKG1hdGNoWzRdLCBnbG9iYWxUYWdzKTtcbiAgICAgIGNvbnN0IGlkOiBudW1iZXIgPSBtYXRjaFs1XSA/IE51bWJlcihtYXRjaFs1XSkgOiAtMTtcbiAgICAgIGNvbnN0IGluc2VydGVkOiBib29sZWFuID0gbWF0Y2hbNV0gPyB0cnVlIDogZmFsc2U7XG4gICAgICBjb25zdCBmaWVsZHM6IGFueSA9IHsgVGV4dDogY2xvemVUZXh0LCBFeHRyYTogXCJcIiB9O1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3Muc291cmNlU3VwcG9ydCkge1xuICAgICAgICBmaWVsZHNbXCJTb3VyY2VcIl0gPSB0aGlzLnN1YnN0aXR1dGVPYnNpZGlhbkxpbmtzKGBbWyR7bm90ZX1dXWAsIHZhdWx0KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNvbnRhaW5zQ29kZSA9IHRoaXMuY29udGFpbnNDb2RlKFtjbG96ZVRleHRdKTtcblxuICAgICAgY29uc3QgY2FyZCA9IG5ldyBDbG96ZWNhcmQoXG4gICAgICAgIGlkLFxuICAgICAgICBkZWNrLFxuICAgICAgICBvcmlnaW5hbExpbmUsXG4gICAgICAgIGZpZWxkcyxcbiAgICAgICAgcmV2ZXJzZWQsXG4gICAgICAgIGluaXRpYWxPZmZzZXQsXG4gICAgICAgIGVuZGluZ0xpbmUsXG4gICAgICAgIHRhZ3MsXG4gICAgICAgIGluc2VydGVkLFxuICAgICAgICBtZWRpYXMsXG4gICAgICAgIGNvbnRhaW5zQ29kZVxuICAgICAgKTtcbiAgICAgIGNhcmRzLnB1c2goY2FyZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhcmRzO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZUlubGluZUNhcmRzKFxuICAgIGZpbGU6IHN0cmluZyxcbiAgICBoZWFkaW5nczogYW55LFxuICAgIGRlY2s6IHN0cmluZyxcbiAgICB2YXVsdDogc3RyaW5nLFxuICAgIG5vdGU6IHN0cmluZyxcbiAgICBnbG9iYWxUYWdzOiBzdHJpbmdbXSA9IFtdXG4gICkge1xuICAgIGNvbnN0IGNvbnRleHRBd2FyZSA9IHRoaXMuc2V0dGluZ3MuY29udGV4dEF3YXJlTW9kZTtcbiAgICBjb25zdCBjYXJkczogSW5saW5lY2FyZFtdID0gW107XG4gICAgY29uc3QgbWF0Y2hlcyA9IFsuLi5maWxlLm1hdGNoQWxsKHRoaXMucmVnZXguY2FyZHNJbmxpbmVTdHlsZSldO1xuXG4gICAgZm9yIChjb25zdCBtYXRjaCBvZiBtYXRjaGVzKSB7XG4gICAgICBpZiAoXG4gICAgICAgIG1hdGNoWzJdLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChcImNhcmRzLWRlY2tcIikgfHxcbiAgICAgICAgbWF0Y2hbMl0udG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwidGFnc1wiKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXZlcnNlZDogYm9vbGVhbiA9IG1hdGNoWzNdID09PSB0aGlzLnNldHRpbmdzLmlubGluZVNlcGFyYXRvclJldmVyc2U7XG4gICAgICBsZXQgaGVhZGluZ0xldmVsID0gLTE7XG4gICAgICBpZiAobWF0Y2hbMV0pIHtcbiAgICAgICAgaGVhZGluZ0xldmVsID1cbiAgICAgICAgICBtYXRjaFsxXS50cmltKCkubGVuZ3RoICE9PSAwID8gbWF0Y2hbMV0udHJpbSgpLmxlbmd0aCA6IC0xO1xuICAgICAgfVxuICAgICAgLy8gTWF0Y2guaW5kZXggLSAxIGJlY2F1c2Ugb3RoZXJ3aXNlIGluIHRoZSBjb250ZXh0IHRoZXJlIHdpbGwgYmUgZXZlbiBtYXRjaFsxXSwgaS5lLiB0aGUgcXVlc3Rpb24gaXRzZWxmXG4gICAgICBjb25zdCBjb250ZXh0ID0gY29udGV4dEF3YXJlXG4gICAgICAgID8gdGhpcy5nZXRDb250ZXh0KGhlYWRpbmdzLCBtYXRjaC5pbmRleCAtIDEsIGhlYWRpbmdMZXZlbClcbiAgICAgICAgOiBcIlwiO1xuXG4gICAgICBjb25zdCBvcmlnaW5hbFF1ZXN0aW9uID0gbWF0Y2hbMl0udHJpbSgpO1xuICAgICAgbGV0IHF1ZXN0aW9uID0gY29udGV4dEF3YXJlXG4gICAgICAgID8gWy4uLmNvbnRleHQsIG1hdGNoWzJdLnRyaW0oKV0uam9pbihcbiAgICAgICAgICBgJHt0aGlzLnNldHRpbmdzLmNvbnRleHRTZXBhcmF0b3J9YFxuICAgICAgICApXG4gICAgICAgIDogbWF0Y2hbMl0udHJpbSgpO1xuICAgICAgbGV0IGFuc3dlciA9IG1hdGNoWzRdLnRyaW0oKTtcbiAgICAgIGxldCBtZWRpYXM6IHN0cmluZ1tdID0gdGhpcy5nZXRJbWFnZUxpbmtzKHF1ZXN0aW9uKTtcbiAgICAgIG1lZGlhcyA9IG1lZGlhcy5jb25jYXQodGhpcy5nZXRJbWFnZUxpbmtzKGFuc3dlcikpO1xuICAgICAgbWVkaWFzID0gbWVkaWFzLmNvbmNhdCh0aGlzLmdldEF1ZGlvTGlua3MoYW5zd2VyKSk7XG4gICAgICBxdWVzdGlvbiA9IHRoaXMucGFyc2VMaW5lKHF1ZXN0aW9uLCB2YXVsdCk7XG4gICAgICBhbnN3ZXIgPSB0aGlzLnBhcnNlTGluZShhbnN3ZXIsIHZhdWx0KTtcblxuICAgICAgY29uc3QgaW5pdGlhbE9mZnNldCA9IG1hdGNoLmluZGV4XG4gICAgICBjb25zdCBlbmRpbmdMaW5lID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XG4gICAgICBjb25zdCB0YWdzOiBzdHJpbmdbXSA9IHRoaXMucGFyc2VUYWdzKG1hdGNoWzVdLCBnbG9iYWxUYWdzKTtcbiAgICAgIGNvbnN0IGlkOiBudW1iZXIgPSBtYXRjaFs2XSA/IE51bWJlcihtYXRjaFs2XSkgOiAtMTtcbiAgICAgIGNvbnN0IGluc2VydGVkOiBib29sZWFuID0gbWF0Y2hbNl0gPyB0cnVlIDogZmFsc2U7XG4gICAgICBjb25zdCBmaWVsZHM6IGFueSA9IHsgRnJvbnQ6IHF1ZXN0aW9uLCBCYWNrOiBhbnN3ZXIgfTtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLnNvdXJjZVN1cHBvcnQpIHtcbiAgICAgICAgZmllbGRzW1wiU291cmNlXCJdID0gdGhpcy5zdWJzdGl0dXRlT2JzaWRpYW5MaW5rcyhgW1ske25vdGV9XV1gLCB2YXVsdCk7XG4gICAgICB9XG4gICAgICBjb25zdCBjb250YWluc0NvZGUgPSB0aGlzLmNvbnRhaW5zQ29kZShbcXVlc3Rpb24sIGFuc3dlcl0pO1xuXG4gICAgICBjb25zdCBjYXJkID0gbmV3IElubGluZWNhcmQoXG4gICAgICAgIGlkLFxuICAgICAgICBkZWNrLFxuICAgICAgICBvcmlnaW5hbFF1ZXN0aW9uLFxuICAgICAgICBmaWVsZHMsXG4gICAgICAgIHJldmVyc2VkLFxuICAgICAgICBpbml0aWFsT2Zmc2V0LFxuICAgICAgICBlbmRpbmdMaW5lLFxuICAgICAgICB0YWdzLFxuICAgICAgICBpbnNlcnRlZCxcbiAgICAgICAgbWVkaWFzLFxuICAgICAgICBjb250YWluc0NvZGVcbiAgICAgICk7XG4gICAgICBjYXJkcy5wdXNoKGNhcmQpO1xuICAgIH1cblxuICAgIHJldHVybiBjYXJkcztcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVDYXJkc1dpdGhUYWcoXG4gICAgZmlsZTogc3RyaW5nLFxuICAgIGhlYWRpbmdzOiBhbnksXG4gICAgZGVjazogc3RyaW5nLFxuICAgIHZhdWx0OiBzdHJpbmcsXG4gICAgbm90ZTogc3RyaW5nLFxuICAgIGdsb2JhbFRhZ3M6IHN0cmluZ1tdID0gW11cbiAgKSB7XG4gICAgY29uc3QgY29udGV4dEF3YXJlID0gdGhpcy5zZXR0aW5ncy5jb250ZXh0QXdhcmVNb2RlO1xuICAgIGNvbnN0IGNhcmRzOiBGbGFzaGNhcmRbXSA9IFtdO1xuICAgIGNvbnN0IG1hdGNoZXMgPSBbLi4uZmlsZS5tYXRjaEFsbCh0aGlzLnJlZ2V4LmZsYXNoc2NhcmRzV2l0aFRhZyldO1xuXG4gICAgY29uc3QgZW1iZWRNYXAgPSB0aGlzLmdldEVtYmVkTWFwKCk7XG5cbiAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIG1hdGNoZXMpIHtcbiAgICAgIGNvbnN0IHJldmVyc2VkOiBib29sZWFuID1cbiAgICAgICAgbWF0Y2hbM10udHJpbSgpLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgIGAjJHt0aGlzLnNldHRpbmdzLmZsYXNoY2FyZHNUYWd9LXJldmVyc2VgIHx8XG4gICAgICAgIG1hdGNoWzNdLnRyaW0oKS50b0xvd2VyQ2FzZSgpID09PVxuICAgICAgICBgIyR7dGhpcy5zZXR0aW5ncy5mbGFzaGNhcmRzVGFnfS9yZXZlcnNlYDtcbiAgICAgIGNvbnN0IGhlYWRpbmdMZXZlbCA9IG1hdGNoWzFdLnRyaW0oKS5sZW5ndGggIT09IDAgPyBtYXRjaFsxXS5sZW5ndGggOiAtMTtcbiAgICAgIC8vIE1hdGNoLmluZGV4IC0gMSBiZWNhdXNlIG90aGVyd2lzZSBpbiB0aGUgY29udGV4dCB0aGVyZSB3aWxsIGJlIGV2ZW4gbWF0Y2hbMV0sIGkuZS4gdGhlIHF1ZXN0aW9uIGl0c2VsZlxuICAgICAgY29uc3QgY29udGV4dCA9IGNvbnRleHRBd2FyZVxuICAgICAgICA/IHRoaXMuZ2V0Q29udGV4dChoZWFkaW5ncywgbWF0Y2guaW5kZXggLSAxLCBoZWFkaW5nTGV2ZWwpLmNvbmNhdChbXSlcbiAgICAgICAgOiBcIlwiO1xuXG4gICAgICBjb25zdCBvcmlnaW5hbFF1ZXN0aW9uID0gbWF0Y2hbMl0udHJpbSgpO1xuICAgICAgbGV0IHF1ZXN0aW9uID0gY29udGV4dEF3YXJlXG4gICAgICAgID8gWy4uLmNvbnRleHQsIG1hdGNoWzJdLnRyaW0oKV0uam9pbihcbiAgICAgICAgICBgJHt0aGlzLnNldHRpbmdzLmNvbnRleHRTZXBhcmF0b3J9YFxuICAgICAgICApXG4gICAgICAgIDogbWF0Y2hbMl0udHJpbSgpO1xuICAgICAgbGV0IGFuc3dlciA9IG1hdGNoWzVdLnRyaW0oKTtcbiAgICAgIGxldCBtZWRpYXM6IHN0cmluZ1tdID0gdGhpcy5nZXRJbWFnZUxpbmtzKHF1ZXN0aW9uKTtcbiAgICAgIG1lZGlhcyA9IG1lZGlhcy5jb25jYXQodGhpcy5nZXRJbWFnZUxpbmtzKGFuc3dlcikpO1xuICAgICAgbWVkaWFzID0gbWVkaWFzLmNvbmNhdCh0aGlzLmdldEF1ZGlvTGlua3MoYW5zd2VyKSk7XG5cbiAgICAgIGFuc3dlciA9IHRoaXMuZ2V0RW1iZWRXcmFwQ29udGVudChlbWJlZE1hcCwgYW5zd2VyKTtcblxuICAgICAgcXVlc3Rpb24gPSB0aGlzLnBhcnNlTGluZShxdWVzdGlvbiwgdmF1bHQpO1xuICAgICAgYW5zd2VyID0gdGhpcy5wYXJzZUxpbmUoYW5zd2VyLCB2YXVsdCk7XG5cbiAgICAgIGNvbnN0IGluaXRpYWxPZmZzZXQgPSBtYXRjaC5pbmRleFxuICAgICAgY29uc3QgZW5kaW5nTGluZSA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgY29uc3QgdGFnczogc3RyaW5nW10gPSB0aGlzLnBhcnNlVGFncyhtYXRjaFs0XSwgZ2xvYmFsVGFncyk7XG4gICAgICBjb25zdCBpZDogbnVtYmVyID0gbWF0Y2hbNl0gPyBOdW1iZXIobWF0Y2hbNl0pIDogLTE7XG4gICAgICBjb25zdCBpbnNlcnRlZDogYm9vbGVhbiA9IG1hdGNoWzZdID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgY29uc3QgZmllbGRzOiBhbnkgPSB7IEZyb250OiBxdWVzdGlvbiwgQmFjazogYW5zd2VyIH07XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5zb3VyY2VTdXBwb3J0KSB7XG4gICAgICAgIGZpZWxkc1tcIlNvdXJjZVwiXSA9IHRoaXMuc3Vic3RpdHV0ZU9ic2lkaWFuTGlua3MoYFtbJHtub3RlfV1dYCwgdmF1bHQpO1xuICAgICAgfVxuICAgICAgY29uc3QgY29udGFpbnNDb2RlID0gdGhpcy5jb250YWluc0NvZGUoW3F1ZXN0aW9uLCBhbnN3ZXJdKTtcblxuICAgICAgY29uc3QgY2FyZCA9IG5ldyBGbGFzaGNhcmQoXG4gICAgICAgIGlkLFxuICAgICAgICBkZWNrLFxuICAgICAgICBvcmlnaW5hbFF1ZXN0aW9uLFxuICAgICAgICBmaWVsZHMsXG4gICAgICAgIHJldmVyc2VkLFxuICAgICAgICBpbml0aWFsT2Zmc2V0LFxuICAgICAgICBlbmRpbmdMaW5lLFxuICAgICAgICB0YWdzLFxuICAgICAgICBpbnNlcnRlZCxcbiAgICAgICAgbWVkaWFzLFxuICAgICAgICBjb250YWluc0NvZGVcbiAgICAgICk7XG4gICAgICBjYXJkcy5wdXNoKGNhcmQpO1xuICAgIH1cblxuICAgIHJldHVybiBjYXJkcztcbiAgfVxuXG4gIC8qKlxuICAgKiDop6PmnpAgbGlzdC1maWVsZCDmoLzlvI/ljaHniYdcbiAgICogIyMjIOagh+mimFxuICAgKiAtICoqRmllbGROYW1lKirvvJpWYWx1ZVxuICAgKiAtICoqRmllbGROYW1lKirvvJpWYWx1ZVxuICAgKiDlrZfmrrXlkI3nm7TmjqXlr7nlupQgQW5raSDmqKHlnovlrZfmrrXlkI1cbiAgICovXG4gIHB1YmxpYyBnZW5lcmF0ZUxpc3RGaWVsZENhcmRzKFxuICAgIGZpbGU6IHN0cmluZyxcbiAgICBkZWNrOiBzdHJpbmcsXG4gICAgdmF1bHQ6IHN0cmluZyxcbiAgICBub3RlOiBzdHJpbmcsXG4gICAgZ2xvYmFsVGFnczogc3RyaW5nW10gPSBbXSxcbiAgICB0ZW1wbGF0ZUNvbmZpZzogSVRlbXBsYXRlQ29uZmlnXG4gICk6IEZsYXNoY2FyZFtdIHtcbiAgICBjb25zdCBjYXJkczogRmxhc2hjYXJkW10gPSBbXTtcbiAgICAvLyBSZWdleCBmb3IgbGlzdC1maWVsZCBjYXJkOiBoZWFkaW5nIGZvbGxvd2VkIGJ5IC0gKipGaWVsZCoq77yaVmFsdWUgaXRlbXNcbiAgICAvLyBDYXJkIGJvdW5kYXJ5OiBuZXh0IGhlYWRpbmcgb3IgYmxhbmsgbGluZSAob3IgRU9GKVxuICAgIGNvbnN0IGhlYWRpbmdSZWdleCA9IC9eIHswLDN9KCN7MSw2fSkgKyguKykkL2dtO1xuICAgIGNvbnN0IGZpZWxkSXRlbVJlZ2V4ID0gL14gezAsM31bLSpdIHswLDN9XFwqXFwqKC4rPylcXCpcXCpcXHMqW++8mjpdXFxzKiguKikkLztcblxuICAgIGNvbnN0IGxpbmVzID0gZmlsZS5zcGxpdCgnXFxuJyk7XG4gICAgbGV0IGkgPSAwO1xuICAgIHdoaWxlIChpIDwgbGluZXMubGVuZ3RoKSB7XG4gICAgICAvLyBMb29rIGZvciBhIGhlYWRpbmdcbiAgICAgIGNvbnN0IGhlYWRpbmdNYXRjaCA9IGxpbmVzW2ldLm1hdGNoKGhlYWRpbmdSZWdleCk7XG4gICAgICBpZiAoIWhlYWRpbmdNYXRjaCkge1xuICAgICAgICBpKys7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgXG4gICAgICBjb25zdCBjYXJkU3RhcnRMaW5lID0gaTtcbiAgICAgIGkrKzsgLy8gbW92ZSBwYXN0IGhlYWRpbmdcblxuICAgICAgLy8gQ29sbGVjdCBmaWVsZCBsaW5lcyAobXVzdCBiZSAtICoqRmllbGQqKu+8mlZhbHVlKVxuICAgICAgY29uc3QgZmllbGRMaW5lczogc3RyaW5nW10gPSBbXTtcbiAgICAgIHdoaWxlIChpIDwgbGluZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHRyaW1tZWQgPSBsaW5lc1tpXS50cmltKCk7XG4gICAgICAgIC8vIEJsYW5rIGxpbmUgb3IgbmV4dCBoZWFkaW5nIOKGkiBlbmQgb2YgY2FyZFxuICAgICAgICBpZiAodHJpbW1lZCA9PT0gJycgfHwgL14jezEsNn1cXHMvLnRlc3QodHJpbW1lZCkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBmb3IgZmllbGQgaXRlbVxuICAgICAgICBpZiAoZmllbGRJdGVtUmVnZXgudGVzdCh0cmltbWVkKSkge1xuICAgICAgICAgIGZpZWxkTGluZXMucHVzaCh0cmltbWVkKTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWVsZExpbmVzLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG5cbiAgICAgIC8vIFBhcnNlIGZpZWxkc1xuICAgICAgY29uc3QgZmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgICBmb3IgKGNvbnN0IGxpbmUgb2YgZmllbGRMaW5lcykge1xuICAgICAgICBjb25zdCBtID0gbGluZS5tYXRjaChmaWVsZEl0ZW1SZWdleCk7XG4gICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgY29uc3QgZmllbGROYW1lID0gbVsxXS50cmltKCk7XG4gICAgICAgICAgY29uc3QgZmllbGRWYWx1ZSA9IG1bMl0udHJpbSgpO1xuICAgICAgICAgIGZpZWxkc1tmaWVsZE5hbWVdID0gdGhpcy5wYXJzZUxpbmUoZmllbGRWYWx1ZSwgdmF1bHQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEJ1aWxkIGNhcmQgb2Zmc2V0c1xuICAgICAgY29uc3QgY2FyZFRleHQgPSBsaW5lcy5zbGljZShjYXJkU3RhcnRMaW5lLCBpKS5qb2luKCdcXG4nKTtcbiAgICAgIGNvbnN0IGluaXRpYWxPZmZzZXQgPSBmaWxlLmluZGV4T2YoY2FyZFRleHQpO1xuICAgICAgY29uc3QgZW5kT2Zmc2V0ID0gaW5pdGlhbE9mZnNldCArIGNhcmRUZXh0Lmxlbmd0aDtcblxuICAgICAgY29uc3QgdGFnczogc3RyaW5nW10gPSBbLi4uZ2xvYmFsVGFnc107XG5cbiAgICAgIGNvbnN0IGNhcmQgPSBuZXcgRmxhc2hjYXJkKFxuICAgICAgICAtMSxcbiAgICAgICAgZGVjayxcbiAgICAgICAgaGVhZGluZ01hdGNoWzJdLnRyaW0oKSxcbiAgICAgICAgZmllbGRzLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgaW5pdGlhbE9mZnNldCxcbiAgICAgICAgZW5kT2Zmc2V0LFxuICAgICAgICB0YWdzLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgW10sXG4gICAgICAgIGZhbHNlLFxuICAgICAgICB0ZW1wbGF0ZUNvbmZpZy5tb2RlbE5hbWVcbiAgICAgICk7XG4gICAgICBjYXJkcy5wdXNoKGNhcmQpO1xuICAgIH1cblxuICAgIHJldHVybiBjYXJkcztcbiAgfVxuXG4gIHB1YmxpYyBjb250YWluc0NvZGUoc3RyOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgcyBvZiBzdHIpIHtcbiAgICAgIGlmIChzLm1hdGNoKHRoaXMucmVnZXguY29kZUJsb2NrKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHVibGljIGdldENhcmRzVG9EZWxldGUoZmlsZTogc3RyaW5nKTogbnVtYmVyW10ge1xuICAgIC8vIEZpbmQgYmxvY2sgSURzIHdpdGggbm8gY29udGVudCBhYm92ZSBpdFxuICAgIHJldHVybiBbLi4uZmlsZS5tYXRjaEFsbCh0aGlzLnJlZ2V4LmNhcmRzVG9EZWxldGUpXS5tYXAoKG1hdGNoKSA9PiB7XG4gICAgICByZXR1cm4gTnVtYmVyKG1hdGNoWzFdKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VMaW5lKHN0cjogc3RyaW5nLCB2YXVsdE5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmh0bWxDb252ZXJ0ZXIubWFrZUh0bWwoXG4gICAgICB0aGlzLm1hdGhUb0Fua2koXG4gICAgICAgIHRoaXMuc3Vic3RpdHV0ZU9ic2lkaWFuTGlua3MoXG4gICAgICAgICAgdGhpcy5zdWJzdGl0dXRlSW1hZ2VMaW5rcyh0aGlzLnN1YnN0aXR1dGVBdWRpb0xpbmtzKHN0cikpLFxuICAgICAgICAgIHZhdWx0TmFtZVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0SW1hZ2VMaW5rcyhzdHI6IHN0cmluZykge1xuICAgIGNvbnN0IHdpa2lNYXRjaGVzID0gc3RyLm1hdGNoQWxsKHRoaXMucmVnZXgud2lraUltYWdlTGlua3MpO1xuICAgIGNvbnN0IG1hcmtkb3duTWF0Y2hlcyA9IHN0ci5tYXRjaEFsbCh0aGlzLnJlZ2V4Lm1hcmtkb3duSW1hZ2VMaW5rcyk7XG4gICAgY29uc3QgbGlua3M6IHN0cmluZ1tdID0gW107XG5cbiAgICBmb3IgKGNvbnN0IHdpa2lNYXRjaCBvZiB3aWtpTWF0Y2hlcykge1xuICAgICAgbGlua3MucHVzaCh3aWtpTWF0Y2hbMV0pO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgbWFya2Rvd25NYXRjaCBvZiBtYXJrZG93bk1hdGNoZXMpIHtcbiAgICAgIGxpbmtzLnB1c2goZGVjb2RlVVJJQ29tcG9uZW50KG1hcmtkb3duTWF0Y2hbMV0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGlua3M7XG4gIH1cblxuICBwcml2YXRlIGdldEF1ZGlvTGlua3Moc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCB3aWtpTWF0Y2hlcyA9IHN0ci5tYXRjaEFsbCh0aGlzLnJlZ2V4Lndpa2lBdWRpb0xpbmtzKTtcbiAgICBjb25zdCBsaW5rczogc3RyaW5nW10gPSBbXTtcblxuICAgIGZvciAoY29uc3Qgd2lraU1hdGNoIG9mIHdpa2lNYXRjaGVzKSB7XG4gICAgICBsaW5rcy5wdXNoKHdpa2lNYXRjaFsxXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpbmtzO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZUNhcmRTb3VyY2UoY2FyZHM6IENhcmRbXSl7XG4gICAgICBmb3IobGV0IGNhcmQgb2YgY2FyZHMpe1xuICAgICAgICAgIGlmKGNhcmQuaWQgPT0gbnVsbCB8fCBjYXJkLmlkID09PSAtMSkge1xuICAgICAgICAgICAgICAvLyBGb3IgY2FyZHMgd2l0aG91dCB2YWxpZCBibG9jayBJRCwgcmVtb3ZlIHRoZSBibG9jayByZWZlcmVuY2UgZnJvbSBVUkxcbiAgICAgICAgICAgICAgY2FyZC5maWVsZHNbXCJTb3VyY2VcIl0gPSBjYXJkLmZpZWxkc1tcIlNvdXJjZVwiXS5yZXBsYWNlKFwiI15fX0JMT0NLX0lEX19cIiwgXCJcIik7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXJkLmZpZWxkc1tcIlNvdXJjZVwiXSA9IGNhcmQuZmllbGRzW1wiU291cmNlXCJdLnJlcGxhY2UoXCJfX0JMT0NLX0lEX19cIiwgU3RyaW5nKGNhcmQuaWQpKTtcbiAgICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3Vic3RpdHV0ZU9ic2lkaWFuTGlua3Moc3RyOiBzdHJpbmcsIHZhdWx0TmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgbGlua1JlZ2V4ID0gL1xcW1xcWyguKz8pKD86XFx8KC4rPykpP1xcXVxcXS9naW07XG4gICAgdmF1bHROYW1lID0gZW5jb2RlVVJJQ29tcG9uZW50KHZhdWx0TmFtZSk7XG5cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UobGlua1JlZ2V4LCAobWF0Y2gsIGZpbGVuYW1lLCByZW5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGhyZWYgPSBgb2JzaWRpYW46Ly9vcGVuP3ZhdWx0PSR7dmF1bHROYW1lfSZmaWxlPSR7ZW5jb2RlVVJJQ29tcG9uZW50KFxuICAgICAgICBmaWxlbmFtZSArIFwiI15fX0JMT0NLX0lEX19cIlxuICAgICAgKX1gO1xuICAgICAgY29uc3QgZmlsZVJlbmFtZSA9IHJlbmFtZSA/IHJlbmFtZSA6IGZpbGVuYW1lLnNwbGl0KCcvJykucG9wKCk7IC8vIFVzZSBqdXN0IHRoZSBmaWxlbmFtZSBmb3IgZGlzcGxheVxuICAgICAgcmV0dXJuIGA8YSBocmVmPVwiJHtocmVmfVwiPiR7ZmlsZVJlbmFtZX08L2E+YDtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3Vic3RpdHV0ZUltYWdlTGlua3Moc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKHRoaXMucmVnZXgud2lraUltYWdlTGlua3MsIFwiPGltZyBzcmM9JyQxJz5cIik7XG4gICAgc3RyID0gc3RyLnJlcGxhY2UodGhpcy5yZWdleC5tYXJrZG93bkltYWdlTGlua3MsIFwiPGltZyBzcmM9JyQxJz5cIik7XG5cbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgcHJpdmF0ZSBzdWJzdGl0dXRlQXVkaW9MaW5rcyhzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKHRoaXMucmVnZXgud2lraUF1ZGlvTGlua3MsIFwiW3NvdW5kOiQxXVwiKTtcbiAgfVxuXG4gIHByaXZhdGUgbWF0aFRvQW5raShzdHI6IHN0cmluZykge1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKHRoaXMucmVnZXgubWF0aEJsb2NrLCBmdW5jdGlvbiAobWF0Y2gsIHAxLCBwMikge1xuICAgICAgcmV0dXJuIFwiXFxcXFxcXFxbXCIgKyBlc2NhcGVNYXJrZG93bihwMikgKyBcIiBcXFxcXFxcXF1cIjtcbiAgICB9KTtcblxuICAgIHN0ciA9IHN0ci5yZXBsYWNlKHRoaXMucmVnZXgubWF0aElubGluZSwgZnVuY3Rpb24gKG1hdGNoLCBwMSwgcDIpIHtcbiAgICAgIHJldHVybiBcIlxcXFxcXFxcKFwiICsgZXNjYXBlTWFya2Rvd24ocDIpICsgXCJcXFxcXFxcXClcIjtcbiAgICB9KTtcblxuICAgIHJldHVybiBzdHI7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlVGFncyhzdHI6IHN0cmluZywgZ2xvYmFsVGFnczogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgdGFnczogc3RyaW5nW10gPSBbLi4uZ2xvYmFsVGFnc107XG5cbiAgICBpZiAoc3RyKSB7XG4gICAgICBmb3IgKGNvbnN0IHRhZyBvZiBzdHIuc3BsaXQoXCIjXCIpKSB7XG4gICAgICAgIGxldCBuZXdUYWcgPSB0YWcudHJpbSgpO1xuICAgICAgICBpZiAobmV3VGFnKSB7XG4gICAgICAgICAgLy8gUmVwbGFjZSBvYnNpZGlhbiBoaWVyYXJjaHkgdGFncyBkZWxpbWV0ZXIgXFwgd2l0aCBhbmtpIGRlbGltZXRlciA6OlxuICAgICAgICAgIG5ld1RhZyA9IG5ld1RhZy5yZXBsYWNlKHRoaXMucmVnZXgudGFnSGllcmFyY2h5LCBcIjo6XCIpO1xuICAgICAgICAgIHRhZ3MucHVzaChuZXdUYWcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhZ3M7XG4gIH1cblxuICBwdWJsaWMgZ2V0QW5raUlEc0Jsb2NrcyhmaWxlOiBzdHJpbmcpOiBSZWdFeHBNYXRjaEFycmF5W10ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGZpbGUubWF0Y2hBbGwoL1xcXihcXGR7MTN9KVxccyovZ20pKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RW1iZWRNYXAoKSB7XG5cbiAgICAvLyBrZXnvvJpsaW5rIHVybCBcbiAgICAvLyB2YWx1Ze+8miBlbWJlZCBjb250ZW50IHBhcnNlIGZyb20gaHRtbCBkb2N1bWVudFxuICAgIGNvbnN0IGVtYmVkTWFwID0gbmV3IE1hcCgpXG5cbiAgICBjb25zdCBlbWJlZExpc3QgPSBBcnJheS5mcm9tKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpbnRlcm5hbC1lbWJlZCcpKTtcblxuXG4gICAgQXJyYXkuZnJvbShlbWJlZExpc3QpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAvLyBtYXJrZG93bi1lbWJlZC1jb250ZW50IG1hcmtkb3duLWVtYmVkLXBhZ2VcbiAgICAgIGNvbnN0IGVtYmVkVmFsdWUgPSB0aGlzLmh0bWxDb252ZXJ0ZXIubWFrZU1hcmtkb3duKHRoaXMuaHRtbENvbnZlcnRlci5tYWtlSHRtbChlbC5vdXRlckhUTUwpLnRvU3RyaW5nKCkpO1xuXG4gICAgICBjb25zdCBlbWJlZEtleSA9IGVsLmdldEF0dHJpYnV0ZShcInNyY1wiKTtcbiAgICAgIGVtYmVkTWFwLnNldChlbWJlZEtleSwgZW1iZWRWYWx1ZSk7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiZW1iZWRLZXk6IFxcblwiICsgZW1iZWRLZXkpO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJlbWJlZFZhbHVlOiBcXG5cIiArIGVtYmVkVmFsdWUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVtYmVkTWFwO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFbWJlZFdyYXBDb250ZW50KGVtYmVkTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+LCBlbWJlZENvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IHJlc3VsdCA9IGVtYmVkQ29udGVudC5tYXRjaCh0aGlzLnJlZ2V4LmVtYmVkQmxvY2spO1xuICAgIHdoaWxlICgocmVzdWx0ID0gdGhpcy5yZWdleC5lbWJlZEJsb2NrLmV4ZWMoZW1iZWRDb250ZW50KSkpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwicmVzdWx0WzBdOiBcIiArIHJlc3VsdFswXSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcImVtYmVkTWFwLmdldChyZXN1bHRbMV0pOiBcIiArIGVtYmVkTWFwLmdldChyZXN1bHRbMV0pKTtcbiAgICAgIGVtYmVkQ29udGVudCA9IGVtYmVkQ29udGVudC5jb25jYXQoZW1iZWRNYXAuZ2V0KHJlc3VsdFsxXSkpO1xuICAgIH1cbiAgICByZXR1cm4gZW1iZWRDb250ZW50O1xuICB9XG5cbn1cbiJdfQ==