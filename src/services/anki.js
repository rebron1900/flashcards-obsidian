import { __awaiter, __generator, __values } from "tslib";
import { sourceField, codeScript, highlightjsBase64, hihglightjsInitBase64, highlightCssBase64, codeDeckExtension, sourceDeckExtension, } from "src/conf/constants";
var Anki = /** @class */ (function () {
    function Anki() {
    }
    Anki.prototype.createModels = function (sourceSupport, codeHighlightSupport) {
        return __awaiter(this, void 0, void 0, function () {
            var models;
            return __generator(this, function (_a) {
                models = this.getModels(sourceSupport, false);
                if (codeHighlightSupport) {
                    models = models.concat(this.getModels(sourceSupport, true));
                }
                return [2 /*return*/, this.invoke("multi", 6, { actions: models })];
            });
        });
    };
    Anki.prototype.createDeck = function (deckName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.invoke("createDeck", 6, { deck: deckName })];
            });
        });
    };
    Anki.prototype.storeMediaFiles = function (cards) {
        return __awaiter(this, void 0, void 0, function () {
            var actions, cards_1, cards_1_1, card, _a, _b, media;
            var e_1, _c, e_2, _d;
            return __generator(this, function (_e) {
                actions = [];
                try {
                    for (cards_1 = __values(cards), cards_1_1 = cards_1.next(); !cards_1_1.done; cards_1_1 = cards_1.next()) {
                        card = cards_1_1.value;
                        try {
                            for (_a = (e_2 = void 0, __values(card.getMedias())), _b = _a.next(); !_b.done; _b = _a.next()) {
                                media = _b.value;
                                actions.push({
                                    action: "storeMediaFile",
                                    params: media,
                                });
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (cards_1_1 && !cards_1_1.done && (_c = cards_1.return)) _c.call(cards_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (actions) {
                    return [2 /*return*/, this.invoke("multi", 6, { actions: actions })];
                }
                else {
                    return [2 /*return*/, {}];
                }
                return [2 /*return*/];
            });
        });
    };
    Anki.prototype.storeCodeHighlightMedias = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fileExists, highlightjs, highlightjsInit, highlightjcss;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.invoke("retrieveMediaFile", 6, {
                            filename: "_highlightInit.js",
                        })];
                    case 1:
                        fileExists = _a.sent();
                        if (!fileExists) {
                            highlightjs = {
                                action: "storeMediaFile",
                                params: {
                                    filename: "_highlight.js",
                                    data: highlightjsBase64,
                                },
                            };
                            highlightjsInit = {
                                action: "storeMediaFile",
                                params: {
                                    filename: "_highlightInit.js",
                                    data: hihglightjsInitBase64,
                                },
                            };
                            highlightjcss = {
                                action: "storeMediaFile",
                                params: {
                                    filename: "_highlight.css",
                                    data: highlightCssBase64,
                                },
                            };
                            return [2 /*return*/, this.invoke("multi", 6, {
                                    actions: [highlightjs, highlightjsInit, highlightjcss],
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Anki.prototype.addCards = function (cards) {
        return __awaiter(this, void 0, void 0, function () {
            var notes;
            return __generator(this, function (_a) {
                notes = [];
                cards.forEach(function (card) { return notes.push(card.getCard(false)); });
                return [2 /*return*/, this.invoke("addNotes", 6, {
                        notes: notes,
                    })];
            });
        });
    };
    /**
     * Given the new cards with an optional deck name, it updates all the cards on Anki.
     *
     * Be aware of https://github.com/FooSoft/anki-connect/issues/82. If the Browse pane is opened on Anki,
     * the update does not change all the cards.
     * @param cards the new cards.
     * @param deckName the new deck name.
     */
    Anki.prototype.updateCards = function (cards) {
        return __awaiter(this, void 0, void 0, function () {
            var updateActions, ids, cards_2, cards_2_1, card;
            var e_3, _a;
            return __generator(this, function (_b) {
                updateActions = [];
                ids = [];
                try {
                    for (cards_2 = __values(cards), cards_2_1 = cards_2.next(); !cards_2_1.done; cards_2_1 = cards_2.next()) {
                        card = cards_2_1.value;
                        updateActions.push({
                            action: "updateNoteFields",
                            params: {
                                note: card.getCard(true),
                            },
                        });
                        updateActions = updateActions.concat(this.mergeTags(card.oldTags, card.tags, card.id));
                        ids.push(card.id);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (cards_2_1 && !cards_2_1.done && (_a = cards_2.return)) _a.call(cards_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                // Update deck
                updateActions.push({
                    action: "changeDeck",
                    params: {
                        cards: ids,
                        deck: cards[0].deckName,
                    },
                });
                return [2 /*return*/, this.invoke("multi", 6, { actions: updateActions })];
            });
        });
    };
    Anki.prototype.changeDeck = function (ids, deckName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.invoke("changeDeck", 6, { cards: ids, deck: deckName })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Anki.prototype.cardsInfo = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.invoke("cardsInfo", 6, { cards: ids })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Anki.prototype.getCards = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.invoke("notesInfo", 6, { notes: ids })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Anki.prototype.deleteCards = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.invoke("deleteNotes", 6, { notes: ids })];
            });
        });
    };
    Anki.prototype.ping = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.invoke("version", 6)];
                    case 1: return [2 /*return*/, (_a.sent()) === 6];
                }
            });
        });
    };
    Anki.prototype.mergeTags = function (oldTags, newTags, cardId) {
        var e_4, _a, e_5, _b;
        var actions = [];
        try {
            // Find tags to Add
            for (var newTags_1 = __values(newTags), newTags_1_1 = newTags_1.next(); !newTags_1_1.done; newTags_1_1 = newTags_1.next()) {
                var tag = newTags_1_1.value;
                var index = oldTags.indexOf(tag);
                if (index > -1) {
                    oldTags.splice(index, 1);
                }
                else {
                    actions.push({
                        action: "addTags",
                        params: {
                            notes: [cardId],
                            tags: tag,
                        },
                    });
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (newTags_1_1 && !newTags_1_1.done && (_a = newTags_1.return)) _a.call(newTags_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        try {
            // All Tags to delete
            for (var oldTags_1 = __values(oldTags), oldTags_1_1 = oldTags_1.next(); !oldTags_1_1.done; oldTags_1_1 = oldTags_1.next()) {
                var tag = oldTags_1_1.value;
                actions.push({
                    action: "removeTags",
                    params: {
                        notes: [cardId],
                        tags: tag,
                    },
                });
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (oldTags_1_1 && !oldTags_1_1.done && (_b = oldTags_1.return)) _b.call(oldTags_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return actions;
    };
    Anki.prototype.invoke = function (action, version, params) {
        if (version === void 0) { version = 6; }
        if (params === void 0) { params = {}; }
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("error", function () { return reject("failed to issue request"); });
            xhr.addEventListener("load", function () {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (Object.getOwnPropertyNames(response).length != 2) {
                        throw "response has an unexpected number of fields";
                    }
                    if (!Object.prototype.hasOwnProperty.call(response, "error")) {
                        throw "response is missing required error field";
                    }
                    if (!Object.prototype.hasOwnProperty.call(response, "result")) {
                        throw "response is missing required result field";
                    }
                    if (response.error) {
                        throw response.error;
                    }
                    resolve(response.result);
                }
                catch (e) {
                    reject(e);
                }
            });
            xhr.open("POST", "http://127.0.0.1:8765");
            xhr.send(JSON.stringify({ action: action, version: version, params: params }));
        });
    };
    Anki.prototype.getModels = function (sourceSupport, codeHighlightSupport) {
        var sourceFieldContent = "";
        var codeScriptContent = "";
        var sourceExtension = "";
        var codeExtension = "";
        if (sourceSupport) {
            sourceFieldContent = "\r\n" + sourceField;
            sourceExtension = sourceDeckExtension;
        }
        if (codeHighlightSupport) {
            codeScriptContent = "\r\n" + codeScript + "\r\n";
            codeExtension = codeDeckExtension;
        }
        var css = '.card {\r\n font-family: arial;\r\n font-size: 20px;\r\n text-align: center;\r\n color: black;\r\n background-color: white;\r\n}\r\n\r\n.tag::before {\r\n\tcontent: "#";\r\n}\r\n\r\n.tag {\r\n  color: white;\r\n  background-color: #9F2BFF;\r\n  border: none;\r\n  font-size: 11px;\r\n  font-weight: bold;\r\n  padding: 1px 8px;\r\n  margin: 0px 3px;\r\n  text-align: center;\r\n  text-decoration: none;\r\n  cursor: pointer;\r\n  border-radius: 14px;\r\n  display: inline;\r\n  vertical-align: middle;\r\n}\r\n .cloze { font-weight: bold; color: blue;}.nightMode .cloze { color: lightblue;}';
        var front = "{{Front}}\r\n<p class=\"tags\">{{Tags}}</p>\r\n\r\n<script>\r\n    var tagEl = document.querySelector('.tags');\r\n    var tags = tagEl.innerHTML.split(' ');\r\n    var html = '';\r\n    tags.forEach(function(tag) {\r\n\tif (tag) {\r\n\t    var newTag = '<span class=\"tag\">' + tag + '</span>';\r\n           html += newTag;\r\n    \t    tagEl.innerHTML = html;\r\n\t}\r\n    });\r\n    \r\n</script>".concat(codeScriptContent);
        var back = "{{FrontSide}}\n\n<hr id=answer>\n\n{{Back}}".concat(sourceFieldContent);
        var frontReversed = "{{Back}}\r\n<p class=\"tags\">{{Tags}}</p>\r\n\r\n<script>\r\n    var tagEl = document.querySelector('.tags');\r\n    var tags = tagEl.innerHTML.split(' ');\r\n    var html = '';\r\n    tags.forEach(function(tag) {\r\n\tif (tag) {\r\n\t    var newTag = '<span class=\"tag\">' + tag + '</span>';\r\n           html += newTag;\r\n    \t    tagEl.innerHTML = html;\r\n\t}\r\n    });\r\n    \r\n</script>".concat(codeScriptContent);
        var backReversed = "{{FrontSide}}\n\n<hr id=answer>\n\n{{Front}}".concat(sourceFieldContent);
        var prompt = "{{Prompt}}\r\n<p class=\"tags\">\uD83E\uDDE0spaced {{Tags}}</p>\r\n\r\n<script>\r\n    var tagEl = document.querySelector('.tags');\r\n    var tags = tagEl.innerHTML.split(' ');\r\n    var html = '';\r\n    tags.forEach(function(tag) {\r\n\tif (tag) {\r\n\t    var newTag = '<span class=\"tag\">' + tag + '</span>';\r\n           html += newTag;\r\n    \t    tagEl.innerHTML = html;\r\n\t}\r\n    });\r\n    \r\n</script>".concat(codeScriptContent);
        var promptBack = "{{FrontSide}}\n\n<hr id=answer>\uD83E\uDDE0 Review done.".concat(sourceFieldContent);
        var clozeFront = "{{cloze:Text}}\n\n<script>\r\n    var tagEl = document.querySelector('.tags');\r\n    var tags = tagEl.innerHTML.split(' ');\r\n    var html = '';\r\n    tags.forEach(function(tag) {\r\n\tif (tag) {\r\n\t    var newTag = '<span class=\"tag\">' + tag + '</span>';\r\n           html += newTag;\r\n    \t    tagEl.innerHTML = html;\r\n\t}\r\n    });\r\n    \r\n</script>".concat(codeScriptContent);
        var clozeBack = "{{cloze:Text}}\n\n<br>{{Extra}}".concat(sourceFieldContent, "<script>\r\n    var tagEl = document.querySelector('.tags');\r\n    var tags = tagEl.innerHTML.split(' ');\r\n    var html = '';\r\n    tags.forEach(function(tag) {\r\n\tif (tag) {\r\n\t    var newTag = '<span class=\"tag\">' + tag + '</span>';\r\n           html += newTag;\r\n    \t    tagEl.innerHTML = html;\r\n\t}\r\n    });\r\n    \r\n</script>").concat(codeScriptContent);
        var classicFields = ["Front", "Back"];
        var promptFields = ["Prompt"];
        var clozeFields = ["Text", "Extra"];
        if (sourceSupport) {
            classicFields = classicFields.concat("Source");
            promptFields = promptFields.concat("Source");
            clozeFields = clozeFields.concat("Source");
        }
        var obsidianBasic = {
            action: "createModel",
            params: {
                modelName: "Obsidian-basic".concat(sourceExtension).concat(codeExtension),
                inOrderFields: classicFields,
                css: css,
                cardTemplates: [
                    {
                        Name: "Front / Back",
                        Front: front,
                        Back: back,
                    },
                ],
            },
        };
        var obsidianBasicReversed = {
            action: "createModel",
            params: {
                modelName: "Obsidian-basic-reversed".concat(sourceExtension).concat(codeExtension),
                inOrderFields: classicFields,
                css: css,
                cardTemplates: [
                    {
                        Name: "Front / Back",
                        Front: front,
                        Back: back,
                    },
                    {
                        Name: "Back / Front",
                        Front: frontReversed,
                        Back: backReversed,
                    },
                ],
            },
        };
        var obsidianCloze = {
            action: "createModel",
            params: {
                modelName: "Obsidian-cloze".concat(sourceExtension).concat(codeExtension),
                inOrderFields: clozeFields,
                css: css,
                isCloze: true,
                cardTemplates: [
                    {
                        Name: "Cloze",
                        Front: clozeFront,
                        Back: clozeBack,
                    },
                ],
            },
        };
        var obsidianSpaced = {
            action: "createModel",
            params: {
                modelName: "Obsidian-spaced".concat(sourceExtension).concat(codeExtension),
                inOrderFields: promptFields,
                css: css,
                cardTemplates: [
                    {
                        Name: "Spaced",
                        Front: prompt,
                        Back: promptBack,
                    },
                ],
            },
        };
        return [obsidianBasic, obsidianBasicReversed, obsidianCloze, obsidianSpaced];
    };
    Anki.prototype.requestPermission = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.invoke("requestPermission", 6)];
            });
        });
    };
    return Anki;
}());
export { Anki };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5raS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFua2kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFDTCxXQUFXLEVBQ1gsVUFBVSxFQUNWLGlCQUFpQixFQUNqQixxQkFBcUIsRUFDckIsa0JBQWtCLEVBQ2xCLGlCQUFpQixFQUNqQixtQkFBbUIsR0FDcEIsTUFBTSxvQkFBb0IsQ0FBQztBQUU1QjtJQUFBO0lBZ1VBLENBQUM7SUEvVGMsMkJBQVksR0FBekIsVUFDRSxhQUFzQixFQUN0QixvQkFBNkI7Ozs7Z0JBRXpCLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxvQkFBb0IsRUFBRTtvQkFDeEIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDN0Q7Z0JBRUQsc0JBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7OztLQUNyRDtJQUVZLHlCQUFVLEdBQXZCLFVBQXdCLFFBQWdCOzs7Z0JBQ3RDLHNCQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFDOzs7S0FDekQ7SUFFWSw4QkFBZSxHQUE1QixVQUE2QixLQUFhOzs7OztnQkFDbEMsT0FBTyxHQUFVLEVBQUUsQ0FBQzs7b0JBRTFCLEtBQW1CLFVBQUEsU0FBQSxLQUFLLENBQUEsMkVBQUU7d0JBQWYsSUFBSTs7NEJBQ2IsS0FBb0Isb0JBQUEsU0FBQSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUEsQ0FBQSw0Q0FBRTtnQ0FBM0IsS0FBSztnQ0FDZCxPQUFPLENBQUMsSUFBSSxDQUFDO29DQUNYLE1BQU0sRUFB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Q0FBRTtnQkFDN0QsYUFBYSxFQUFFLFdBQVc7Z0JBQzFCLEdBQUcsRUFBRSxHQUFHO2dCQUNSLE9BQU8sRUFBRSxJQUFJO2dCQUNiLGFBQWEsRUFBRTtvQkFDYjt3QkFDRSxJQUFJLEVBQUUsT0FBTzt3QkFDYixLQUFLLEVBQUUsVUFBVTt3QkFDakIsSUFBSSxFQUFFLFNBQVM7cUJBQ2hCO2lCQUNGO2FBQ0Y7U0FFRixDQUFBO1FBRUQsSUFBTSxjQUFjLEdBQUc7WUFDckIsTUFBTSxFQUFFLGFBQWE7WUFDckIsTUFBTSxFQUFFO2dCQUNOLFNBQVMsRUFBRSx5QkFBa0IsZUFBZSxTQUFHLGFBQWEsQ0FBRTtnQkFDOUQsYUFBYSxFQUFFLFlBQVk7Z0JBQzNCLEdBQUcsRUFBRSxHQUFHO2dCQUNSLGFBQWEsRUFBRTtvQkFDYjt3QkFDRSxJQUFJLEVBQUUsUUFBUTt3QkFDZCxLQUFLLEVBQUUsTUFBTTt3QkFDYixJQUFJLEVBQUUsVUFBVTtxQkFDakI7aUJBQ0Y7YUFDRjtTQUNGLENBQUM7UUFFRixPQUFPLENBQUMsYUFBYSxFQUFFLHFCQUFxQixFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRVksZ0NBQWlCLEdBQTlCOzs7Z0JBQ0Usc0JBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsRUFBQzs7O0tBQzVDO0lBQ0gsV0FBQztBQUFELENBQUMsQUFoVUQsSUFnVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYXJkIH0gZnJvbSBcInNyYy9lbnRpdGllcy9jYXJkXCI7XG5pbXBvcnQge1xuICBzb3VyY2VGaWVsZCxcbiAgY29kZVNjcmlwdCxcbiAgaGlnaGxpZ2h0anNCYXNlNjQsXG4gIGhpaGdsaWdodGpzSW5pdEJhc2U2NCxcbiAgaGlnaGxpZ2h0Q3NzQmFzZTY0LFxuICBjb2RlRGVja0V4dGVuc2lvbixcbiAgc291cmNlRGVja0V4dGVuc2lvbixcbn0gZnJvbSBcInNyYy9jb25mL2NvbnN0YW50c1wiO1xuXG5leHBvcnQgY2xhc3MgQW5raSB7XG4gIHB1YmxpYyBhc3luYyBjcmVhdGVNb2RlbHMoXG4gICAgc291cmNlU3VwcG9ydDogYm9vbGVhbixcbiAgICBjb2RlSGlnaGxpZ2h0U3VwcG9ydDogYm9vbGVhblxuICApIHtcbiAgICBsZXQgbW9kZWxzID0gdGhpcy5nZXRNb2RlbHMoc291cmNlU3VwcG9ydCwgZmFsc2UpO1xuICAgIGlmIChjb2RlSGlnaGxpZ2h0U3VwcG9ydCkge1xuICAgICAgbW9kZWxzID0gbW9kZWxzLmNvbmNhdCh0aGlzLmdldE1vZGVscyhzb3VyY2VTdXBwb3J0LCB0cnVlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW52b2tlKFwibXVsdGlcIiwgNiwgeyBhY3Rpb25zOiBtb2RlbHMgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgY3JlYXRlRGVjayhkZWNrTmFtZTogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5pbnZva2UoXCJjcmVhdGVEZWNrXCIsIDYsIHsgZGVjazogZGVja05hbWUgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc3RvcmVNZWRpYUZpbGVzKGNhcmRzOiBDYXJkW10pIHtcbiAgICBjb25zdCBhY3Rpb25zOiBhbnlbXSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBjYXJkIG9mIGNhcmRzKSB7XG4gICAgICBmb3IgKGNvbnN0IG1lZGlhIG9mIGNhcmQuZ2V0TWVkaWFzKCkpIHtcbiAgICAgICAgYWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICBhY3Rpb246IFwic3RvcmVNZWRpYUZpbGVcIixcbiAgICAgICAgICBwYXJhbXM6IG1lZGlhLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYWN0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuaW52b2tlKFwibXVsdGlcIiwgNiwgeyBhY3Rpb25zOiBhY3Rpb25zIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzeW5jIHN0b3JlQ29kZUhpZ2hsaWdodE1lZGlhcygpIHtcbiAgICBjb25zdCBmaWxlRXhpc3RzID0gYXdhaXQgdGhpcy5pbnZva2UoXCJyZXRyaWV2ZU1lZGlhRmlsZVwiLCA2LCB7XG4gICAgICBmaWxlbmFtZTogXCJfaGlnaGxpZ2h0SW5pdC5qc1wiLFxuICAgIH0pO1xuXG4gICAgaWYgKCFmaWxlRXhpc3RzKSB7XG4gICAgICBjb25zdCBoaWdobGlnaHRqcyA9IHtcbiAgICAgICAgYWN0aW9uOiBcInN0b3JlTWVkaWFGaWxlXCIsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIGZpbGVuYW1lOiBcIl9oaWdobGlnaHQuanNcIixcbiAgICAgICAgICBkYXRhOiBoaWdobGlnaHRqc0Jhc2U2NCxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICBjb25zdCBoaWdobGlnaHRqc0luaXQgPSB7XG4gICAgICAgIGFjdGlvbjogXCJzdG9yZU1lZGlhRmlsZVwiLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBmaWxlbmFtZTogXCJfaGlnaGxpZ2h0SW5pdC5qc1wiLFxuICAgICAgICAgIGRhdGE6IGhpaGdsaWdodGpzSW5pdEJhc2U2NCxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICBjb25zdCBoaWdobGlnaHRqY3NzID0ge1xuICAgICAgICBhY3Rpb246IFwic3RvcmVNZWRpYUZpbGVcIixcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgZmlsZW5hbWU6IFwiX2hpZ2hsaWdodC5jc3NcIixcbiAgICAgICAgICBkYXRhOiBoaWdobGlnaHRDc3NCYXNlNjQsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRoaXMuaW52b2tlKFwibXVsdGlcIiwgNiwge1xuICAgICAgICBhY3Rpb25zOiBbaGlnaGxpZ2h0anMsIGhpZ2hsaWdodGpzSW5pdCwgaGlnaGxpZ2h0amNzc10sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgYWRkQ2FyZHMoY2FyZHM6IENhcmRbXSk6IFByb21pc2U8bnVtYmVyW10+IHtcbiAgICBjb25zdCBub3RlczogYW55ID0gW107XG5cbiAgICBjYXJkcy5mb3JFYWNoKChjYXJkKSA9PiBub3Rlcy5wdXNoKGNhcmQuZ2V0Q2FyZChmYWxzZSkpKTtcblxuICAgIHJldHVybiB0aGlzLmludm9rZShcImFkZE5vdGVzXCIsIDYsIHtcbiAgICAgIG5vdGVzOiBub3RlcyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiB0aGUgbmV3IGNhcmRzIHdpdGggYW4gb3B0aW9uYWwgZGVjayBuYW1lLCBpdCB1cGRhdGVzIGFsbCB0aGUgY2FyZHMgb24gQW5raS5cbiAgICpcbiAgICogQmUgYXdhcmUgb2YgaHR0cHM6Ly9naXRodWIuY29tL0Zvb1NvZnQvYW5raS1jb25uZWN0L2lzc3Vlcy84Mi4gSWYgdGhlIEJyb3dzZSBwYW5lIGlzIG9wZW5lZCBvbiBBbmtpLFxuICAgKiB0aGUgdXBkYXRlIGRvZXMgbm90IGNoYW5nZSBhbGwgdGhlIGNhcmRzLlxuICAgKiBAcGFyYW0gY2FyZHMgdGhlIG5ldyBjYXJkcy5cbiAgICogQHBhcmFtIGRlY2tOYW1lIHRoZSBuZXcgZGVjayBuYW1lLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHVwZGF0ZUNhcmRzKGNhcmRzOiBDYXJkW10pOiBQcm9taXNlPGFueT4ge1xuICAgIGxldCB1cGRhdGVBY3Rpb25zOiBhbnlbXSA9IFtdO1xuXG4gICAgLy8gVW5mb3J0dW5hdGVseSBodHRwczovL2dpdGh1Yi5jb20vRm9vU29mdC9hbmtpLWNvbm5lY3QvaXNzdWVzLzE4M1xuICAgIC8vIFRoaXMgbWVhbnMgdGhhdCB0aGUgZGVsdGEgZnJvbSB0aGUgY3VycmVudCB0YWdzIG9uIEFua2kgYW5kIHRoZSBnZW5lcmF0ZWQgb25lIHNob3VsZCBiZSBhZGRlZC9yZW1vdmVkXG4gICAgLy8gVGhhdCdzIHdoYXQgdGhlIGN1cnJlbnQgYXBwcm9hY2ggZG9lcywgYnV0IGluIHRoZSBmdXR1cmUgaWYgdGhlIEFQSSBpdCBpcyBtYWRlIG1vcmUgY29uc2lzdGVudFxuICAgIC8vICB0aGVuIG1lcmdlVGFncyguLi4pIGlzIG5vdCBuZWVkZWQgYW55bW9yZVxuICAgIGNvbnN0IGlkczogbnVtYmVyW10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgY2FyZCBvZiBjYXJkcykge1xuICAgICAgdXBkYXRlQWN0aW9ucy5wdXNoKHtcbiAgICAgICAgYWN0aW9uOiBcInVwZGF0ZU5vdGVGaWVsZHNcIixcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgbm90ZTogY2FyZC5nZXRDYXJkKHRydWUpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIHVwZGF0ZUFjdGlvbnMgPSB1cGRhdGVBY3Rpb25zLmNvbmNhdChcbiAgICAgICAgdGhpcy5tZXJnZVRhZ3MoY2FyZC5vbGRUYWdzLCBjYXJkLnRhZ3MsIGNhcmQuaWQpXG4gICAgICApO1xuICAgICAgaWRzLnB1c2goY2FyZC5pZCk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGRlY2tcbiAgICB1cGRhdGVBY3Rpb25zLnB1c2goe1xuICAgICAgYWN0aW9uOiBcImNoYW5nZURlY2tcIixcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBjYXJkczogaWRzLFxuICAgICAgICBkZWNrOiBjYXJkc1swXS5kZWNrTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5pbnZva2UoXCJtdWx0aVwiLCA2LCB7IGFjdGlvbnM6IHVwZGF0ZUFjdGlvbnMgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgY2hhbmdlRGVjayhpZHM6IG51bWJlcltdLCBkZWNrTmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuaW52b2tlKFwiY2hhbmdlRGVja1wiLCA2LCB7IGNhcmRzOiBpZHMsIGRlY2s6IGRlY2tOYW1lIH0pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGNhcmRzSW5mbyhpZHM6IG51bWJlcltdKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuaW52b2tlKFwiY2FyZHNJbmZvXCIsIDYsIHsgY2FyZHM6IGlkcyB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRDYXJkcyhpZHM6IG51bWJlcltdKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuaW52b2tlKFwibm90ZXNJbmZvXCIsIDYsIHsgbm90ZXM6IGlkcyB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkZWxldGVDYXJkcyhpZHM6IG51bWJlcltdKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52b2tlKFwiZGVsZXRlTm90ZXNcIiwgNiwgeyBub3RlczogaWRzIH0pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHBpbmcoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmludm9rZShcInZlcnNpb25cIiwgNikpID09PSA2O1xuICB9XG5cbiAgcHJpdmF0ZSBtZXJnZVRhZ3Mob2xkVGFnczogc3RyaW5nW10sIG5ld1RhZ3M6IHN0cmluZ1tdLCBjYXJkSWQ6IG51bWJlcikge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBbXTtcblxuICAgIC8vIEZpbmQgdGFncyB0byBBZGRcbiAgICBmb3IgKGNvbnN0IHRhZyBvZiBuZXdUYWdzKSB7XG4gICAgICBjb25zdCBpbmRleCA9IG9sZFRhZ3MuaW5kZXhPZih0YWcpO1xuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgb2xkVGFncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICBhY3Rpb246IFwiYWRkVGFnc1wiLFxuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgbm90ZXM6IFtjYXJkSWRdLFxuICAgICAgICAgICAgdGFnczogdGFnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFsbCBUYWdzIHRvIGRlbGV0ZVxuICAgIGZvciAoY29uc3QgdGFnIG9mIG9sZFRhZ3MpIHtcbiAgICAgIGFjdGlvbnMucHVzaCh7XG4gICAgICAgIGFjdGlvbjogXCJyZW1vdmVUYWdzXCIsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIG5vdGVzOiBbY2FyZElkXSxcbiAgICAgICAgICB0YWdzOiB0YWcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aW9ucztcbiAgfVxuXG4gIHByaXZhdGUgaW52b2tlKGFjdGlvbjogc3RyaW5nLCB2ZXJzaW9uID0gNiwgcGFyYW1zID0ge30pOiBhbnkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKCkgPT4gcmVqZWN0KFwiZmFpbGVkIHRvIGlzc3VlIHJlcXVlc3RcIikpO1xuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHJlc3BvbnNlKS5sZW5ndGggIT0gMikge1xuICAgICAgICAgICAgdGhyb3cgXCJyZXNwb25zZSBoYXMgYW4gdW5leHBlY3RlZCBudW1iZXIgb2YgZmllbGRzXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3BvbnNlLCBcImVycm9yXCIpKSB7XG4gICAgICAgICAgICB0aHJvdyBcInJlc3BvbnNlIGlzIG1pc3NpbmcgcmVxdWlyZWQgZXJyb3IgZmllbGRcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzcG9uc2UsIFwicmVzdWx0XCIpKSB7XG4gICAgICAgICAgICB0aHJvdyBcInJlc3BvbnNlIGlzIG1pc3NpbmcgcmVxdWlyZWQgcmVzdWx0IGZpZWxkXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UucmVzdWx0KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCBcImh0dHA6Ly8xMjcuMC4wLjE6ODc2NVwiKTtcbiAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHsgYWN0aW9uLCB2ZXJzaW9uLCBwYXJhbXMgfSkpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRNb2RlbHMoXG4gICAgc291cmNlU3VwcG9ydDogYm9vbGVhbixcbiAgICBjb2RlSGlnaGxpZ2h0U3VwcG9ydDogYm9vbGVhblxuICApOiBvYmplY3RbXSB7XG4gICAgbGV0IHNvdXJjZUZpZWxkQ29udGVudCA9IFwiXCI7XG4gICAgbGV0IGNvZGVTY3JpcHRDb250ZW50ID0gXCJcIjtcbiAgICBsZXQgc291cmNlRXh0ZW5zaW9uID0gXCJcIjtcbiAgICBsZXQgY29kZUV4dGVuc2lvbiA9IFwiXCI7XG4gICAgaWYgKHNvdXJjZVN1cHBvcnQpIHtcbiAgICAgIHNvdXJjZUZpZWxkQ29udGVudCA9IFwiXFxyXFxuXCIgKyBzb3VyY2VGaWVsZDtcbiAgICAgIHNvdXJjZUV4dGVuc2lvbiA9IHNvdXJjZURlY2tFeHRlbnNpb247XG4gICAgfVxuXG4gICAgaWYgKGNvZGVIaWdobGlnaHRTdXBwb3J0KSB7XG4gICAgICBjb2RlU2NyaXB0Q29udGVudCA9IFwiXFxyXFxuXCIgKyBjb2RlU2NyaXB0ICsgXCJcXHJcXG5cIjtcbiAgICAgIGNvZGVFeHRlbnNpb24gPSBjb2RlRGVja0V4dGVuc2lvbjtcbiAgICB9XG5cbiAgICBjb25zdCBjc3MgPVxuICAgICAgJy5jYXJkIHtcXHJcXG4gZm9udC1mYW1pbHk6IGFyaWFsO1xcclxcbiBmb250LXNpemU6IDIwcHg7XFxyXFxuIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG4gY29sb3I6IGJsYWNrO1xcclxcbiBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcXHJcXG59XFxyXFxuXFxyXFxuLnRhZzo6YmVmb3JlIHtcXHJcXG5cXHRjb250ZW50OiBcIiNcIjtcXHJcXG59XFxyXFxuXFxyXFxuLnRhZyB7XFxyXFxuICBjb2xvcjogd2hpdGU7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjOUYyQkZGO1xcclxcbiAgYm9yZGVyOiBub25lO1xcclxcbiAgZm9udC1zaXplOiAxMXB4O1xcclxcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxyXFxuICBwYWRkaW5nOiAxcHggOHB4O1xcclxcbiAgbWFyZ2luOiAwcHggM3B4O1xcclxcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcclxcbiAgY3Vyc29yOiBwb2ludGVyO1xcclxcbiAgYm9yZGVyLXJhZGl1czogMTRweDtcXHJcXG4gIGRpc3BsYXk6IGlubGluZTtcXHJcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxyXFxufVxcclxcbiAuY2xvemUgeyBmb250LXdlaWdodDogYm9sZDsgY29sb3I6IGJsdWU7fS5uaWdodE1vZGUgLmNsb3plIHsgY29sb3I6IGxpZ2h0Ymx1ZTt9JztcbiAgICBjb25zdCBmcm9udCA9IGB7e0Zyb250fX1cXHJcXG48cCBjbGFzcz1cXFwidGFnc1xcXCI+e3tUYWdzfX08XFwvcD5cXHJcXG5cXHJcXG48c2NyaXB0PlxcclxcbiAgICB2YXIgdGFnRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxcJy50YWdzXFwnKTtcXHJcXG4gICAgdmFyIHRhZ3MgPSB0YWdFbC5pbm5lckhUTUwuc3BsaXQoXFwnIFxcJyk7XFxyXFxuICAgIHZhciBodG1sID0gXFwnXFwnO1xcclxcbiAgICB0YWdzLmZvckVhY2goZnVuY3Rpb24odGFnKSB7XFxyXFxuXFx0aWYgKHRhZykge1xcclxcblxcdCAgICB2YXIgbmV3VGFnID0gXFwnPHNwYW4gY2xhc3M9XFxcInRhZ1xcXCI+XFwnICsgdGFnICsgXFwnPFxcL3NwYW4+XFwnO1xcclxcbiAgICAgICAgICAgaHRtbCArPSBuZXdUYWc7XFxyXFxuICAgIFxcdCAgICB0YWdFbC5pbm5lckhUTUwgPSBodG1sO1xcclxcblxcdH1cXHJcXG4gICAgfSk7XFxyXFxuICAgIFxcclxcbjxcXC9zY3JpcHQ+JHtjb2RlU2NyaXB0Q29udGVudH1gO1xuICAgIGNvbnN0IGJhY2sgPSBge3tGcm9udFNpZGV9fVxcblxcbjxociBpZD1hbnN3ZXI+XFxuXFxue3tCYWNrfX0ke3NvdXJjZUZpZWxkQ29udGVudH1gO1xuICAgIGNvbnN0IGZyb250UmV2ZXJzZWQgPSBge3tCYWNrfX1cXHJcXG48cCBjbGFzcz1cXFwidGFnc1xcXCI+e3tUYWdzfX08XFwvcD5cXHJcXG5cXHJcXG48c2NyaXB0PlxcclxcbiAgICB2YXIgdGFnRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxcJy50YWdzXFwnKTtcXHJcXG4gICAgdmFyIHRhZ3MgPSB0YWdFbC5pbm5lckhUTUwuc3BsaXQoXFwnIFxcJyk7XFxyXFxuICAgIHZhciBodG1sID0gXFwnXFwnO1xcclxcbiAgICB0YWdzLmZvckVhY2goZnVuY3Rpb24odGFnKSB7XFxyXFxuXFx0aWYgKHRhZykge1xcclxcblxcdCAgICB2YXIgbmV3VGFnID0gXFwnPHNwYW4gY2xhc3M9XFxcInRhZ1xcXCI+XFwnICsgdGFnICsgXFwnPFxcL3NwYW4+XFwnO1xcclxcbiAgICAgICAgICAgaHRtbCArPSBuZXdUYWc7XFxyXFxuICAgIFxcdCAgICB0YWdFbC5pbm5lckhUTUwgPSBodG1sO1xcclxcblxcdH1cXHJcXG4gICAgfSk7XFxyXFxuICAgIFxcclxcbjxcXC9zY3JpcHQ+JHtjb2RlU2NyaXB0Q29udGVudH1gO1xuICAgIGNvbnN0IGJhY2tSZXZlcnNlZCA9IGB7e0Zyb250U2lkZX19XFxuXFxuPGhyIGlkPWFuc3dlcj5cXG5cXG57e0Zyb250fX0ke3NvdXJjZUZpZWxkQ29udGVudH1gO1xuICAgIGNvbnN0IHByb21wdCA9IGB7e1Byb21wdH19XFxyXFxuPHAgY2xhc3M9XCJ0YWdzXFxcIj7wn6egc3BhY2VkIHt7VGFnc319PFxcL3A+XFxyXFxuXFxyXFxuPHNjcmlwdD5cXHJcXG4gICAgdmFyIHRhZ0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcXCcudGFnc1xcJyk7XFxyXFxuICAgIHZhciB0YWdzID0gdGFnRWwuaW5uZXJIVE1MLnNwbGl0KFxcJyBcXCcpO1xcclxcbiAgICB2YXIgaHRtbCA9IFxcJ1xcJztcXHJcXG4gICAgdGFncy5mb3JFYWNoKGZ1bmN0aW9uKHRhZykge1xcclxcblxcdGlmICh0YWcpIHtcXHJcXG5cXHQgICAgdmFyIG5ld1RhZyA9IFxcJzxzcGFuIGNsYXNzPVxcXCJ0YWdcXFwiPlxcJyArIHRhZyArIFxcJzxcXC9zcGFuPlxcJztcXHJcXG4gICAgICAgICAgIGh0bWwgKz0gbmV3VGFnO1xcclxcbiAgICBcXHQgICAgdGFnRWwuaW5uZXJIVE1MID0gaHRtbDtcXHJcXG5cXHR9XFxyXFxuICAgIH0pO1xcclxcbiAgICBcXHJcXG48XFwvc2NyaXB0PiR7Y29kZVNjcmlwdENvbnRlbnR9YDtcbiAgICBjb25zdCBwcm9tcHRCYWNrID0gYHt7RnJvbnRTaWRlfX1cXG5cXG48aHIgaWQ9YW5zd2VyPvCfp6AgUmV2aWV3IGRvbmUuJHtzb3VyY2VGaWVsZENvbnRlbnR9YDtcbiAgICBjb25zdCBjbG96ZUZyb250ID0gYHt7Y2xvemU6VGV4dH19XFxuXFxuPHNjcmlwdD5cXHJcXG4gICAgdmFyIHRhZ0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcXCcudGFnc1xcJyk7XFxyXFxuICAgIHZhciB0YWdzID0gdGFnRWwuaW5uZXJIVE1MLnNwbGl0KFxcJyBcXCcpO1xcclxcbiAgICB2YXIgaHRtbCA9IFxcJ1xcJztcXHJcXG4gICAgdGFncy5mb3JFYWNoKGZ1bmN0aW9uKHRhZykge1xcclxcblxcdGlmICh0YWcpIHtcXHJcXG5cXHQgICAgdmFyIG5ld1RhZyA9IFxcJzxzcGFuIGNsYXNzPVxcXCJ0YWdcXFwiPlxcJyArIHRhZyArIFxcJzxcXC9zcGFuPlxcJztcXHJcXG4gICAgICAgICAgIGh0bWwgKz0gbmV3VGFnO1xcclxcbiAgICBcXHQgICAgdGFnRWwuaW5uZXJIVE1MID0gaHRtbDtcXHJcXG5cXHR9XFxyXFxuICAgIH0pO1xcclxcbiAgICBcXHJcXG48XFwvc2NyaXB0PiR7Y29kZVNjcmlwdENvbnRlbnR9YDtcbiAgICBjb25zdCBjbG96ZUJhY2sgPSBge3tjbG96ZTpUZXh0fX1cXG5cXG48YnI+e3tFeHRyYX19JHtzb3VyY2VGaWVsZENvbnRlbnR9PHNjcmlwdD5cXHJcXG4gICAgdmFyIHRhZ0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcXCcudGFnc1xcJyk7XFxyXFxuICAgIHZhciB0YWdzID0gdGFnRWwuaW5uZXJIVE1MLnNwbGl0KFxcJyBcXCcpO1xcclxcbiAgICB2YXIgaHRtbCA9IFxcJ1xcJztcXHJcXG4gICAgdGFncy5mb3JFYWNoKGZ1bmN0aW9uKHRhZykge1xcclxcblxcdGlmICh0YWcpIHtcXHJcXG5cXHQgICAgdmFyIG5ld1RhZyA9IFxcJzxzcGFuIGNsYXNzPVxcXCJ0YWdcXFwiPlxcJyArIHRhZyArIFxcJzxcXC9zcGFuPlxcJztcXHJcXG4gICAgICAgICAgIGh0bWwgKz0gbmV3VGFnO1xcclxcbiAgICBcXHQgICAgdGFnRWwuaW5uZXJIVE1MID0gaHRtbDtcXHJcXG5cXHR9XFxyXFxuICAgIH0pO1xcclxcbiAgICBcXHJcXG48XFwvc2NyaXB0PiR7Y29kZVNjcmlwdENvbnRlbnR9YDtcblxuICAgIGxldCBjbGFzc2ljRmllbGRzID0gW1wiRnJvbnRcIiwgXCJCYWNrXCJdO1xuICAgIGxldCBwcm9tcHRGaWVsZHMgPSBbXCJQcm9tcHRcIl07XG4gICAgbGV0IGNsb3plRmllbGRzID0gW1wiVGV4dFwiLCBcIkV4dHJhXCJdO1xuICAgIGlmIChzb3VyY2VTdXBwb3J0KSB7XG4gICAgICBjbGFzc2ljRmllbGRzID0gY2xhc3NpY0ZpZWxkcy5jb25jYXQoXCJTb3VyY2VcIik7XG4gICAgICBwcm9tcHRGaWVsZHMgPSBwcm9tcHRGaWVsZHMuY29uY2F0KFwiU291cmNlXCIpO1xuICAgICAgY2xvemVGaWVsZHMgPSBjbG96ZUZpZWxkcy5jb25jYXQoXCJTb3VyY2VcIik7XG4gICAgfVxuXG4gICAgY29uc3Qgb2JzaWRpYW5CYXNpYyA9IHtcbiAgICAgIGFjdGlvbjogXCJjcmVhdGVNb2RlbFwiLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIG1vZGVsTmFtZTogYE9ic2lkaWFuLWJhc2ljJHtzb3VyY2VFeHRlbnNpb259JHtjb2RlRXh0ZW5zaW9ufWAsXG4gICAgICAgIGluT3JkZXJGaWVsZHM6IGNsYXNzaWNGaWVsZHMsXG4gICAgICAgIGNzczogY3NzLFxuICAgICAgICBjYXJkVGVtcGxhdGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogXCJGcm9udCAvIEJhY2tcIixcbiAgICAgICAgICAgIEZyb250OiBmcm9udCxcbiAgICAgICAgICAgIEJhY2s6IGJhY2ssXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IG9ic2lkaWFuQmFzaWNSZXZlcnNlZCA9IHtcbiAgICAgIGFjdGlvbjogXCJjcmVhdGVNb2RlbFwiLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIG1vZGVsTmFtZTogYE9ic2lkaWFuLWJhc2ljLXJldmVyc2VkJHtzb3VyY2VFeHRlbnNpb259JHtjb2RlRXh0ZW5zaW9ufWAsXG4gICAgICAgIGluT3JkZXJGaWVsZHM6IGNsYXNzaWNGaWVsZHMsXG4gICAgICAgIGNzczogY3NzLFxuICAgICAgICBjYXJkVGVtcGxhdGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgTmFtZTogXCJGcm9udCAvIEJhY2tcIixcbiAgICAgICAgICAgIEZyb250OiBmcm9udCxcbiAgICAgICAgICAgIEJhY2s6IGJhY2ssXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiBcIkJhY2sgLyBGcm9udFwiLFxuICAgICAgICAgICAgRnJvbnQ6IGZyb250UmV2ZXJzZWQsXG4gICAgICAgICAgICBCYWNrOiBiYWNrUmV2ZXJzZWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IG9ic2lkaWFuQ2xvemUgPSB7XG4gICAgICBhY3Rpb246IFwiY3JlYXRlTW9kZWxcIixcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBtb2RlbE5hbWU6IGBPYnNpZGlhbi1jbG96ZSR7c291cmNlRXh0ZW5zaW9ufSR7Y29kZUV4dGVuc2lvbn1gLFxuICAgICAgICBpbk9yZGVyRmllbGRzOiBjbG96ZUZpZWxkcyxcbiAgICAgICAgY3NzOiBjc3MsXG4gICAgICAgIGlzQ2xvemU6IHRydWUsXG4gICAgICAgIGNhcmRUZW1wbGF0ZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiBcIkNsb3plXCIsXG4gICAgICAgICAgICBGcm9udDogY2xvemVGcm9udCxcbiAgICAgICAgICAgIEJhY2s6IGNsb3plQmFjayxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFxuICAgIH1cblxuICAgIGNvbnN0IG9ic2lkaWFuU3BhY2VkID0ge1xuICAgICAgYWN0aW9uOiBcImNyZWF0ZU1vZGVsXCIsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgbW9kZWxOYW1lOiBgT2JzaWRpYW4tc3BhY2VkJHtzb3VyY2VFeHRlbnNpb259JHtjb2RlRXh0ZW5zaW9ufWAsXG4gICAgICAgIGluT3JkZXJGaWVsZHM6IHByb21wdEZpZWxkcyxcbiAgICAgICAgY3NzOiBjc3MsXG4gICAgICAgIGNhcmRUZW1wbGF0ZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiBcIlNwYWNlZFwiLFxuICAgICAgICAgICAgRnJvbnQ6IHByb21wdCxcbiAgICAgICAgICAgIEJhY2s6IHByb21wdEJhY2ssXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIHJldHVybiBbb2JzaWRpYW5CYXNpYywgb2JzaWRpYW5CYXNpY1JldmVyc2VkLCBvYnNpZGlhbkNsb3plLCBvYnNpZGlhblNwYWNlZF07XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcmVxdWVzdFBlcm1pc3Npb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW52b2tlKFwicmVxdWVzdFBlcm1pc3Npb25cIiwgNik7XG4gIH1cbn1cbiJdfQ==