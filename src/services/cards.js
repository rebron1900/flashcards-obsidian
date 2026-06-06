import { __awaiter, __generator, __read, __spreadArray, __values } from "tslib";
import { Anki } from "src/services/anki";
import { FileSystemAdapter, Notice, parseFrontMatterEntry, } from "obsidian";
import { Parser } from "src/services/parser";
import { arrayBufferToBase64 } from "src/utils";
import { Regex } from "src/conf/regex";
import { noticeTimeout } from "src/conf/constants";
import { Inlinecard } from "src/entities/inlinecard";
var CardsService = /** @class */ (function () {
    function CardsService(app, settings) {
        this.app = app;
        this.settings = settings;
        this.regex = new Regex(this.settings);
        this.parser = new Parser(this.regex, this.settings);
        this.anki = new Anki();
    }
    CardsService.prototype.execute = function (activeFile) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1, filePath, sourcePath, fileCachedMetadata, vaultName, globalTags, frontmatter, deckName, templateConfig, useListFieldParser, _a, ankiBlocks, ankiCards, _b, cards, _c, cardsToCreate, cardsToUpdate, cardsNotInAnki, cardIds, cardsToDelete, cardsNotInAnki_1, cardsNotInAnki_1_1, card, deckNeedToBeChanged, err_2;
            var e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        this.regex.update(this.settings);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.anki.ping()];
                    case 2:
                        _e.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _e.sent();
                        console.error(err_1);
                        return [2 /*return*/, ["Error: Anki must be open with AnkiConnect installed."]];
                    case 4:
                        // Init for the execute phase
                        this.updateFile = false;
                        this.totalOffset = 0;
                        this.notifications = [];
                        filePath = activeFile.basename;
                        sourcePath = activeFile.path;
                        fileCachedMetadata = this.app.metadataCache.getFileCache(activeFile);
                        vaultName = this.app.vault.getName();
                        globalTags = undefined;
                        frontmatter = fileCachedMetadata.frontmatter;
                        deckName = "";
                        if (parseFrontMatterEntry(frontmatter, "cards-deck")) {
                            deckName = parseFrontMatterEntry(frontmatter, "cards-deck");
                        }
                        else if (this.settings.folderBasedDeck && activeFile.parent.path !== "/") {
                            deckName = activeFile.parent.path.split("/").join("::");
                        }
                        else {
                            deckName = this.settings.deck;
                        }
                        _e.label = 5;
                    case 5:
                        _e.trys.push([5, 18, , 19]);
                        templateConfig = this.matchTemplateConfig(sourcePath);
                        useListFieldParser = templateConfig && templateConfig.parseMode === 'list-field' && templateConfig.enabled;
                        if (!!templateConfig) return [3 /*break*/, 7];
                        this.anki.storeCodeHighlightMedias();
                        return [4 /*yield*/, this.anki.createModels(this.settings.sourceSupport, this.settings.codeHighlightSupport)];
                    case 6:
                        _e.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        // Still store highlight medias if needed, but skip model creation
                        this.anki.storeCodeHighlightMedias();
                        _e.label = 8;
                    case 8: return [4 /*yield*/, this.anki.createDeck(deckName)];
                    case 9:
                        _e.sent();
                        _a = this;
                        return [4 /*yield*/, this.app.vault.read(activeFile)];
                    case 10:
                        _a.file = _e.sent();
                        if (!this.file.endsWith("\n")) {
                            this.file += "\n";
                        }
                        globalTags = this.parseGlobalTags(this.file);
                        ankiBlocks = this.parser.getAnkiIDsBlocks(this.file);
                        if (!ankiBlocks) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.anki.getCards(this.getAnkiIDs(ankiBlocks))];
                    case 11:
                        _b = _e.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        _b = undefined;
                        _e.label = 13;
                    case 13:
                        ankiCards = _b;
                        cards = void 0;
                        if (useListFieldParser) {
                            // Use list-field parser with custom model
                            cards = this.parser.generateListFieldCards(this.file, deckName, vaultName, filePath, globalTags, templateConfig);
                        }
                        else {
                            // Use default parsers
                            cards = this.parser.generateFlashcards(this.file, deckName, vaultName, filePath, globalTags);
                        }
                        _c = __read(this.filterByUpdate(ankiCards, cards), 3), cardsToCreate = _c[0], cardsToUpdate = _c[1], cardsNotInAnki = _c[2];
                        cardIds = this.getCardsIds(ankiCards, cards);
                        cardsToDelete = this.parser.getCardsToDelete(this.file);
                        console.info("Flashcards: Cards to create");
                        console.info(cardsToCreate);
                        console.info("Flashcards: Cards to update");
                        console.info(cardsToUpdate);
                        console.info("Flashcards: Cards to delete");
                        console.info(cardsToDelete);
                        if (cardsNotInAnki) {
                            console.info("Flashcards: Cards not in Anki (maybe deleted)");
                            try {
                                for (cardsNotInAnki_1 = __values(cardsNotInAnki), cardsNotInAnki_1_1 = cardsNotInAnki_1.next(); !cardsNotInAnki_1_1.done; cardsNotInAnki_1_1 = cardsNotInAnki_1.next()) {
                                    card = cardsNotInAnki_1_1.value;
                                    this.notifications.push("Error: Card with ID ".concat(card.id, " is not in Anki!"));
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (cardsNotInAnki_1_1 && !cardsNotInAnki_1_1.done && (_d = cardsNotInAnki_1.return)) _d.call(cardsNotInAnki_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                        }
                        console.info(cardsNotInAnki);
                        this.insertMedias(cards, sourcePath);
                        return [4 /*yield*/, this.deleteCardsOnAnki(cardsToDelete, ankiBlocks)];
                    case 14:
                        _e.sent();
                        return [4 /*yield*/, this.updateCardsOnAnki(cardsToUpdate)];
                    case 15:
                        _e.sent();
                        return [4 /*yield*/, this.insertCardsOnAnki(cardsToCreate)];
                    case 16:
                        _e.sent();
                        return [4 /*yield*/, this.deckNeedToBeChanged(cardIds, deckName)];
                    case 17:
                        deckNeedToBeChanged = _e.sent();
                        if (deckNeedToBeChanged) {
                            try {
                                this.anki.changeDeck(cardIds, deckName);
                                this.notifications.push("Cards moved in new deck");
                            }
                            catch (_f) {
                                return [2 /*return*/, ["Error: Could not update deck the file."]];
                            }
                        }
                        // Update file
                        if (this.updateFile) {
                            try {
                                this.app.vault.modify(activeFile, this.file);
                            }
                            catch (err) {
                                Error("Could not update the file.");
                                return [2 /*return*/, ["Error: Could not update the file."]];
                            }
                        }
                        this.updateFrontmatter(frontmatter, deckName);
                        if (!this.notifications.length) {
                            this.notifications.push("Nothing to do. Everything is up to date");
                        }
                        return [2 /*return*/, this.notifications];
                    case 18:
                        err_2 = _e.sent();
                        console.error(err_2);
                        Error("Something went wrong");
                        return [3 /*break*/, 19];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    CardsService.prototype.insertMedias = function (cards, sourcePath) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // Currently the media are created for every run, this is not a problem since Anki APIs overwrite the file
                        // A more efficient way would be to keep track of the medias saved
                        return [4 /*yield*/, this.generateMediaLinks(cards, sourcePath)];
                    case 1:
                        // Currently the media are created for every run, this is not a problem since Anki APIs overwrite the file
                        // A more efficient way would be to keep track of the medias saved
                        _a.sent();
                        return [4 /*yield*/, this.anki.storeMediaFiles(cards)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        console.error(err_3);
                        Error("Error: Could not upload medias");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CardsService.prototype.generateMediaLinks = function (cards, sourcePath) {
        return __awaiter(this, void 0, void 0, function () {
            var cards_1, cards_1_1, card, _a, _b, media, image, binaryMedia, err_4, e_2_1, e_3_1;
            var e_3, _c, e_2, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!(this.app.vault.adapter instanceof FileSystemAdapter)) return [3 /*break*/, 16];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 14, 15, 16]);
                        cards_1 = __values(cards), cards_1_1 = cards_1.next();
                        _e.label = 2;
                    case 2:
                        if (!!cards_1_1.done) return [3 /*break*/, 13];
                        card = cards_1_1.value;
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 10, 11, 12]);
                        _a = (e_2 = void 0, __values(card.mediaNames)), _b = _a.next();
                        _e.label = 4;
                    case 4:
                        if (!!_b.done) return [3 /*break*/, 9];
                        media = _b.value;
                        image = this.app.metadataCache.getFirstLinkpathDest(decodeURIComponent(media), sourcePath);
                        _e.label = 5;
                    case 5:
                        _e.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.app.vault.readBinary(image)];
                    case 6:
                        binaryMedia = _e.sent();
                        card.mediaBase64Encoded.push(arrayBufferToBase64(binaryMedia));
                        return [3 /*break*/, 8];
                    case 7:
                        err_4 = _e.sent();
                        Error("Error: Could not read media");
                        return [3 /*break*/, 8];
                    case 8:
                        _b = _a.next();
                        return [3 /*break*/, 4];
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 12];
                    case 11:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 12:
                        cards_1_1 = cards_1.next();
                        return [3 /*break*/, 2];
                    case 13: return [3 /*break*/, 16];
                    case 14:
                        e_3_1 = _e.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 16];
                    case 15:
                        try {
                            if (cards_1_1 && !cards_1_1.done && (_c = cards_1.return)) _c.call(cards_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    CardsService.prototype.insertCardsOnAnki = function (cardsToCreate) {
        return __awaiter(this, void 0, void 0, function () {
            var insertedCards_1, ids, total_1, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!cardsToCreate.length) return [3 /*break*/, 4];
                        insertedCards_1 = 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.anki.addCards(cardsToCreate)];
                    case 2:
                        ids = _a.sent();
                        // Add IDs from response to Flashcard[]
                        ids.map(function (id, index) {
                            cardsToCreate[index].id = id;
                        });
                        total_1 = 0;
                        cardsToCreate.forEach(function (card) {
                            if (card.id === null) {
                                new Notice("Error, could not add: '".concat(card.initialContent, "'"), noticeTimeout);
                            }
                            else {
                                card.reversed ? (insertedCards_1 += 2) : insertedCards_1++;
                            }
                            card.reversed ? (total_1 += 2) : total_1++;
                        });
                        if (this.settings.sourceSupport) {
                            this.parser.updateCardSource(cardsToCreate);
                            this.anki.updateCards(cardsToCreate);
                        }
                        this.writeAnkiBlocks(cardsToCreate);
                        this.notifications.push("Inserted successfully ".concat(insertedCards_1, "/").concat(total_1, " cards."));
                        return [2 /*return*/, insertedCards_1];
                    case 3:
                        err_5 = _a.sent();
                        console.error(err_5);
                        Error("Error: Could not write cards on Anki");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CardsService.prototype.updateFrontmatter = function (frontmatter, deckName) {
        var activeFile = this.app.workspace.getActiveFile();
        this.app.fileManager.processFrontMatter(activeFile, function (frontmatter) {
            frontmatter["cards-deck"] = deckName;
        });
    };
    CardsService.prototype.writeAnkiBlocks = function (cardsToCreate) {
        var e_4, _a;
        try {
            for (var cardsToCreate_1 = __values(cardsToCreate), cardsToCreate_1_1 = cardsToCreate_1.next(); !cardsToCreate_1_1.done; cardsToCreate_1_1 = cardsToCreate_1.next()) {
                var card = cardsToCreate_1_1.value;
                // Card.id cannot be null, because if written already previously it has an ID,
                //   if it has been inserted it has an ID too
                if (card.id !== null && !card.inserted) {
                    var id = card.getIdFormat();
                    if (card instanceof Inlinecard) {
                        if (this.settings.inlineID) {
                            id = " " + id;
                        }
                        else {
                            id = "\n" + id;
                        }
                    }
                    card.endOffset += this.totalOffset;
                    var offset = card.endOffset;
                    this.updateFile = true;
                    this.file =
                        this.file.substring(0, offset) +
                            id +
                            this.file.substring(offset, this.file.length + 1);
                    this.totalOffset += id.length;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (cardsToCreate_1_1 && !cardsToCreate_1_1.done && (_a = cardsToCreate_1.return)) _a.call(cardsToCreate_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    CardsService.prototype.updateCardsOnAnki = function (cards) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (cards.length) {
                    try {
                        if (this.settings.sourceSupport) {
                            this.parser.updateCardSource(cards);
                        }
                        this.anki.updateCards(cards);
                        this.notifications.push("Updated successfully ".concat(cards.length, "/").concat(cards.length, " cards."));
                    }
                    catch (err) {
                        console.error(err);
                        Error("Error: Could not update cards on Anki");
                    }
                    return [2 /*return*/, cards.length];
                }
                return [2 /*return*/];
            });
        });
    };
    CardsService.prototype.deleteCardsOnAnki = function (cards, ankiBlocks) {
        return __awaiter(this, void 0, void 0, function () {
            var deletedCards, ankiBlocks_1, ankiBlocks_1_1, block, id;
            var e_5, _a;
            return __generator(this, function (_b) {
                if (cards.length) {
                    deletedCards = 0;
                    try {
                        for (ankiBlocks_1 = __values(ankiBlocks), ankiBlocks_1_1 = ankiBlocks_1.next(); !ankiBlocks_1_1.done; ankiBlocks_1_1 = ankiBlocks_1.next()) {
                            block = ankiBlocks_1_1.value;
                            id = Number(block[1]);
                            // Deletion of cards that need to be deleted (i.e. blocks ID that don't have content)
                            if (cards.includes(id)) {
                                try {
                                    this.anki.deleteCards(cards);
                                    deletedCards++;
                                    this.updateFile = true;
                                    this.file =
                                        this.file.substring(0, block["index"]) +
                                            this.file.substring(block["index"] + block[0].length, this.file.length);
                                    this.totalOffset -= block[0].length;
                                    this.notifications.push("Deleted successfully ".concat(deletedCards, "/").concat(cards.length, " cards."));
                                }
                                catch (err) {
                                    console.error(err);
                                    Error("Error, could not delete the card from Anki");
                                }
                            }
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (ankiBlocks_1_1 && !ankiBlocks_1_1.done && (_a = ankiBlocks_1.return)) _a.call(ankiBlocks_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                    return [2 /*return*/, deletedCards];
                }
                return [2 /*return*/];
            });
        });
    };
    CardsService.prototype.getAnkiIDs = function (blocks) {
        var e_6, _a;
        var IDs = [];
        try {
            for (var blocks_1 = __values(blocks), blocks_1_1 = blocks_1.next(); !blocks_1_1.done; blocks_1_1 = blocks_1.next()) {
                var b = blocks_1_1.value;
                IDs.push(Number(b[1]));
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (blocks_1_1 && !blocks_1_1.done && (_a = blocks_1.return)) _a.call(blocks_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return IDs;
    };
    CardsService.prototype.filterByUpdate = function (ankiCards, generatedCards) {
        var e_7, _a;
        var cardsToCreate = [];
        var cardsToUpdate = [];
        var cardsNotInAnki = [];
        if (ankiCards) {
            var _loop_1 = function (flashcard) {
                // Inserted means that anki blocks are available, that means that the card should
                // 	(the user can always delete it) be in Anki
                var ankiCard = undefined;
                if (flashcard.inserted) {
                    ankiCard = ankiCards.filter(function (card) { return Number(card.noteId) === flashcard.id; })[0];
                    if (!ankiCard) {
                        cardsNotInAnki.push(flashcard);
                    }
                    else if (!flashcard.match(ankiCard)) {
                        flashcard.oldTags = ankiCard.tags;
                        cardsToUpdate.push(flashcard);
                    }
                }
                else {
                    cardsToCreate.push(flashcard);
                }
            };
            try {
                for (var generatedCards_1 = __values(generatedCards), generatedCards_1_1 = generatedCards_1.next(); !generatedCards_1_1.done; generatedCards_1_1 = generatedCards_1.next()) {
                    var flashcard = generatedCards_1_1.value;
                    _loop_1(flashcard);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (generatedCards_1_1 && !generatedCards_1_1.done && (_a = generatedCards_1.return)) _a.call(generatedCards_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
        else {
            cardsToCreate = __spreadArray([], __read(generatedCards), false);
        }
        return [cardsToCreate, cardsToUpdate, cardsNotInAnki];
    };
    CardsService.prototype.deckNeedToBeChanged = function (cardsIds, deckName) {
        return __awaiter(this, void 0, void 0, function () {
            var cardsInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.anki.cardsInfo(cardsIds)];
                    case 1:
                        cardsInfo = _a.sent();
                        console.log("Flashcards: Cards info");
                        console.log(cardsInfo);
                        if (cardsInfo.length !== 0) {
                            return [2 /*return*/, cardsInfo[0].deckName !== deckName];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    CardsService.prototype.getCardsIds = function (ankiCards, generatedCards) {
        var e_8, _a;
        var ids = [];
        if (ankiCards) {
            var _loop_2 = function (flashcard) {
                var ankiCard = undefined;
                if (flashcard.inserted) {
                    ankiCard = ankiCards.filter(function (card) { return Number(card.noteId) === flashcard.id; })[0];
                    if (ankiCard) {
                        ids = ids.concat(ankiCard.cards);
                    }
                }
            };
            try {
                for (var generatedCards_2 = __values(generatedCards), generatedCards_2_1 = generatedCards_2.next(); !generatedCards_2_1.done; generatedCards_2_1 = generatedCards_2.next()) {
                    var flashcard = generatedCards_2_1.value;
                    _loop_2(flashcard);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (generatedCards_2_1 && !generatedCards_2_1.done && (_a = generatedCards_2.return)) _a.call(generatedCards_2);
                }
                finally { if (e_8) throw e_8.error; }
            }
        }
        return ids;
    };
    /**
     * Match file path against template config patterns.
     * Pattern supports basic glob: ** for wildcard
     */
    CardsService.prototype.matchTemplateConfig = function (filePath) {
        var e_9, _a;
        try {
            for (var _b = __values(this.settings.templateConfigs), _c = _b.next(); !_c.done; _c = _b.next()) {
                var tc = _c.value;
                if (!tc.enabled)
                    continue;
                var pattern = tc.filePathPattern;
                // Convert simple glob to regex: ** → .*, * → [^/]*
                var regexStr = pattern
                    .replace(/\*\*/g, '___DOUBLE_STAR___')
                    .replace(/\*/g, '[^/]*')
                    .replace(/___DOUBLE_STAR___/g, '.*');
                var re = new RegExp('^' + regexStr + '$');
                if (re.test(filePath)) {
                    return tc;
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
        }
        return null;
    };
    CardsService.prototype.parseGlobalTags = function (file) {
        var globalTags = [];
        var tags = file.match(/(?:cards-)?tags: ?(.*)/im);
        globalTags = tags ? tags[1].match(this.regex.globalTagsSplitter) : [];
        if (globalTags) {
            for (var i = 0; i < globalTags.length; i++) {
                globalTags[i] = globalTags[i].replace("#", "");
                globalTags[i] = globalTags[i].replace(/\//g, "::");
                globalTags[i] = globalTags[i].replace(/\[\[(.*)\]\]/, "$1");
                globalTags[i] = globalTags[i].trim();
                globalTags[i] = globalTags[i].replace(/ /g, "-");
            }
            return globalTags;
        }
        return [];
    };
    return CardsService;
}());
export { CardsService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYXJkcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCxpQkFBaUIsRUFFakIsTUFBTSxFQUNOLHFCQUFxQixHQUV0QixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHN0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ2hELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRXJEO0lBWUUsc0JBQVksR0FBUSxFQUFFLFFBQW1CO1FBQ3ZDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVZLDhCQUFPLEdBQXBCLFVBQXFCLFVBQWlCOzs7Ozs7O3dCQUNwQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7d0JBRy9CLHFCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dCQUF0QixTQUFzQixDQUFDOzs7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QyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzVELFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3JDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQzthQUNsRDtZQUVELE9BQU8sVUFBVSxDQUFDO1NBQ25CO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBdGJELElBc2JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5raSB9IGZyb20gXCJzcmMvc2VydmljZXMvYW5raVwiO1xuaW1wb3J0IHtcbiAgQXBwLFxuICBGaWxlU3lzdGVtQWRhcHRlcixcbiAgRnJvbnRNYXR0ZXJDYWNoZSxcbiAgTm90aWNlLFxuICBwYXJzZUZyb250TWF0dGVyRW50cnksXG4gIFRGaWxlLFxufSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCJzcmMvc2VydmljZXMvcGFyc2VyXCI7XG5pbXBvcnQgeyBJU2V0dGluZ3MsIElUZW1wbGF0ZUNvbmZpZyB9IGZyb20gXCJzcmMvY29uZi9zZXR0aW5nc1wiO1xuaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCJzcmMvZW50aXRpZXMvY2FyZFwiO1xuaW1wb3J0IHsgYXJyYXlCdWZmZXJUb0Jhc2U2NCB9IGZyb20gXCJzcmMvdXRpbHNcIjtcbmltcG9ydCB7IFJlZ2V4IH0gZnJvbSBcInNyYy9jb25mL3JlZ2V4XCI7XG5pbXBvcnQgeyBub3RpY2VUaW1lb3V0IH0gZnJvbSBcInNyYy9jb25mL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgSW5saW5lY2FyZCB9IGZyb20gXCJzcmMvZW50aXRpZXMvaW5saW5lY2FyZFwiO1xuXG5leHBvcnQgY2xhc3MgQ2FyZHNTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBhcHA6IEFwcDtcbiAgcHJpdmF0ZSBzZXR0aW5nczogSVNldHRpbmdzO1xuICBwcml2YXRlIHJlZ2V4OiBSZWdleDtcbiAgcHJpdmF0ZSBwYXJzZXI6IFBhcnNlcjtcbiAgcHJpdmF0ZSBhbmtpOiBBbmtpO1xuXG4gIHByaXZhdGUgdXBkYXRlRmlsZTogYm9vbGVhbjtcbiAgcHJpdmF0ZSB0b3RhbE9mZnNldDogbnVtYmVyO1xuICBwcml2YXRlIGZpbGU6IHN0cmluZztcbiAgcHJpdmF0ZSBub3RpZmljYXRpb25zOiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgc2V0dGluZ3M6IElTZXR0aW5ncykge1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICB0aGlzLnJlZ2V4ID0gbmV3IFJlZ2V4KHRoaXMuc2V0dGluZ3MpO1xuICAgIHRoaXMucGFyc2VyID0gbmV3IFBhcnNlcih0aGlzLnJlZ2V4LCB0aGlzLnNldHRpbmdzKTtcbiAgICB0aGlzLmFua2kgPSBuZXcgQW5raSgpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGV4ZWN1dGUoYWN0aXZlRmlsZTogVEZpbGUpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgdGhpcy5yZWdleC51cGRhdGUodGhpcy5zZXR0aW5ncyk7XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5hbmtpLnBpbmcoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiBbXCJFcnJvcjogQW5raSBtdXN0IGJlIG9wZW4gd2l0aCBBbmtpQ29ubmVjdCBpbnN0YWxsZWQuXCJdO1xuICAgIH1cblxuICAgIC8vIEluaXQgZm9yIHRoZSBleGVjdXRlIHBoYXNlXG4gICAgdGhpcy51cGRhdGVGaWxlID0gZmFsc2U7XG4gICAgdGhpcy50b3RhbE9mZnNldCA9IDA7XG4gICAgdGhpcy5ub3RpZmljYXRpb25zID0gW107XG4gICAgY29uc3QgZmlsZVBhdGggPSBhY3RpdmVGaWxlLmJhc2VuYW1lO1xuICAgIGNvbnN0IHNvdXJjZVBhdGggPSBhY3RpdmVGaWxlLnBhdGg7XG4gICAgY29uc3QgZmlsZUNhY2hlZE1ldGFkYXRhID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoYWN0aXZlRmlsZSk7XG4gICAgY29uc3QgdmF1bHROYW1lID0gdGhpcy5hcHAudmF1bHQuZ2V0TmFtZSgpO1xuICAgIGxldCBnbG9iYWxUYWdzOiBzdHJpbmdbXSA9IHVuZGVmaW5lZDtcblxuICAgIC8vIFBhcnNlIGZyb250bWF0dGVyXG4gICAgY29uc3QgZnJvbnRtYXR0ZXIgPSBmaWxlQ2FjaGVkTWV0YWRhdGEuZnJvbnRtYXR0ZXI7XG4gICAgbGV0IGRlY2tOYW1lID0gXCJcIjtcbiAgICBpZiAocGFyc2VGcm9udE1hdHRlckVudHJ5KGZyb250bWF0dGVyLCBcImNhcmRzLWRlY2tcIikpIHtcbiAgICAgIGRlY2tOYW1lID0gcGFyc2VGcm9udE1hdHRlckVudHJ5KGZyb250bWF0dGVyLCBcImNhcmRzLWRlY2tcIik7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLmZvbGRlckJhc2VkRGVjayAmJiBhY3RpdmVGaWxlLnBhcmVudC5wYXRoICE9PSBcIi9cIikge1xuICAgICAgZGVja05hbWUgPSBhY3RpdmVGaWxlLnBhcmVudC5wYXRoLnNwbGl0KFwiL1wiKS5qb2luKFwiOjpcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlY2tOYW1lID0gdGhpcy5zZXR0aW5ncy5kZWNrO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBGaW5kIG1hdGNoaW5nIHRlbXBsYXRlIGNvbmZpZ1xuICAgICAgY29uc3QgdGVtcGxhdGVDb25maWcgPSB0aGlzLm1hdGNoVGVtcGxhdGVDb25maWcoc291cmNlUGF0aCk7XG4gICAgICBjb25zdCB1c2VMaXN0RmllbGRQYXJzZXIgPSB0ZW1wbGF0ZUNvbmZpZyAmJiB0ZW1wbGF0ZUNvbmZpZy5wYXJzZU1vZGUgPT09ICdsaXN0LWZpZWxkJyAmJiB0ZW1wbGF0ZUNvbmZpZy5lbmFibGVkO1xuXG4gICAgICAvLyBGb3IgY3VzdG9tIG1vZGVscywgc2tpcCBjcmVhdGVNb2RlbHMgKG1vZGVsIG11c3QgYWxyZWFkeSBleGlzdCBpbiBBbmtpKVxuICAgICAgaWYgKCF0ZW1wbGF0ZUNvbmZpZykge1xuICAgICAgICB0aGlzLmFua2kuc3RvcmVDb2RlSGlnaGxpZ2h0TWVkaWFzKCk7XG4gICAgICAgIGF3YWl0IHRoaXMuYW5raS5jcmVhdGVNb2RlbHMoXG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5zb3VyY2VTdXBwb3J0LFxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuY29kZUhpZ2hsaWdodFN1cHBvcnRcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFN0aWxsIHN0b3JlIGhpZ2hsaWdodCBtZWRpYXMgaWYgbmVlZGVkLCBidXQgc2tpcCBtb2RlbCBjcmVhdGlvblxuICAgICAgICB0aGlzLmFua2kuc3RvcmVDb2RlSGlnaGxpZ2h0TWVkaWFzKCk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmFua2kuY3JlYXRlRGVjayhkZWNrTmFtZSk7XG4gICAgICB0aGlzLmZpbGUgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGFjdGl2ZUZpbGUpO1xuICAgICAgaWYgKCF0aGlzLmZpbGUuZW5kc1dpdGgoXCJcXG5cIikpIHtcbiAgICAgICAgdGhpcy5maWxlICs9IFwiXFxuXCI7XG4gICAgICB9XG4gICAgICBnbG9iYWxUYWdzID0gdGhpcy5wYXJzZUdsb2JhbFRhZ3ModGhpcy5maWxlKTtcbiAgICAgIC8vIFRPRE8gd2l0aCBlbXB0eSBjaGVjayB0aGF0IGRvZXMgbm90IGNhbGwgYW5raUNhcmRzIGxpbmVcbiAgICAgIGNvbnN0IGFua2lCbG9ja3MgPSB0aGlzLnBhcnNlci5nZXRBbmtpSURzQmxvY2tzKHRoaXMuZmlsZSk7XG4gICAgICBjb25zdCBhbmtpQ2FyZHMgPSBhbmtpQmxvY2tzXG4gICAgICAgID8gYXdhaXQgdGhpcy5hbmtpLmdldENhcmRzKHRoaXMuZ2V0QW5raUlEcyhhbmtpQmxvY2tzKSlcbiAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGxldCBjYXJkczogQ2FyZFtdO1xuICAgICAgaWYgKHVzZUxpc3RGaWVsZFBhcnNlcikge1xuICAgICAgICAvLyBVc2UgbGlzdC1maWVsZCBwYXJzZXIgd2l0aCBjdXN0b20gbW9kZWxcbiAgICAgICAgY2FyZHMgPSB0aGlzLnBhcnNlci5nZW5lcmF0ZUxpc3RGaWVsZENhcmRzKFxuICAgICAgICAgIHRoaXMuZmlsZSxcbiAgICAgICAgICBkZWNrTmFtZSxcbiAgICAgICAgICB2YXVsdE5hbWUsXG4gICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICAgZ2xvYmFsVGFncyxcbiAgICAgICAgICB0ZW1wbGF0ZUNvbmZpZ1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVXNlIGRlZmF1bHQgcGFyc2Vyc1xuICAgICAgICBjYXJkcyA9IHRoaXMucGFyc2VyLmdlbmVyYXRlRmxhc2hjYXJkcyhcbiAgICAgICAgICB0aGlzLmZpbGUsXG4gICAgICAgICAgZGVja05hbWUsXG4gICAgICAgICAgdmF1bHROYW1lLFxuICAgICAgICAgIGZpbGVQYXRoLFxuICAgICAgICAgIGdsb2JhbFRhZ3NcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IFtjYXJkc1RvQ3JlYXRlLCBjYXJkc1RvVXBkYXRlLCBjYXJkc05vdEluQW5raV0gPVxuICAgICAgICB0aGlzLmZpbHRlckJ5VXBkYXRlKGFua2lDYXJkcywgY2FyZHMpO1xuICAgICAgY29uc3QgY2FyZElkczogbnVtYmVyW10gPSB0aGlzLmdldENhcmRzSWRzKGFua2lDYXJkcywgY2FyZHMpO1xuICAgICAgY29uc3QgY2FyZHNUb0RlbGV0ZTogbnVtYmVyW10gPSB0aGlzLnBhcnNlci5nZXRDYXJkc1RvRGVsZXRlKHRoaXMuZmlsZSk7XG5cbiAgICAgIGNvbnNvbGUuaW5mbyhcIkZsYXNoY2FyZHM6IENhcmRzIHRvIGNyZWF0ZVwiKTtcbiAgICAgIGNvbnNvbGUuaW5mbyhjYXJkc1RvQ3JlYXRlKTtcbiAgICAgIGNvbnNvbGUuaW5mbyhcIkZsYXNoY2FyZHM6IENhcmRzIHRvIHVwZGF0ZVwiKTtcbiAgICAgIGNvbnNvbGUuaW5mbyhjYXJkc1RvVXBkYXRlKTtcbiAgICAgIGNvbnNvbGUuaW5mbyhcIkZsYXNoY2FyZHM6IENhcmRzIHRvIGRlbGV0ZVwiKTtcbiAgICAgIGNvbnNvbGUuaW5mbyhjYXJkc1RvRGVsZXRlKTtcbiAgICAgIGlmIChjYXJkc05vdEluQW5raSkge1xuICAgICAgICBjb25zb2xlLmluZm8oXCJGbGFzaGNhcmRzOiBDYXJkcyBub3QgaW4gQW5raSAobWF5YmUgZGVsZXRlZClcIik7XG4gICAgICAgIGZvciAoY29uc3QgY2FyZCBvZiBjYXJkc05vdEluQW5raSkge1xuICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5wdXNoKFxuICAgICAgICAgICAgYEVycm9yOiBDYXJkIHdpdGggSUQgJHtjYXJkLmlkfSBpcyBub3QgaW4gQW5raSFgLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnNvbGUuaW5mbyhjYXJkc05vdEluQW5raSk7XG5cbiAgICAgIHRoaXMuaW5zZXJ0TWVkaWFzKGNhcmRzLCBzb3VyY2VQYXRoKTtcbiAgICAgIGF3YWl0IHRoaXMuZGVsZXRlQ2FyZHNPbkFua2koY2FyZHNUb0RlbGV0ZSwgYW5raUJsb2Nrcyk7XG4gICAgICBhd2FpdCB0aGlzLnVwZGF0ZUNhcmRzT25BbmtpKGNhcmRzVG9VcGRhdGUpO1xuICAgICAgYXdhaXQgdGhpcy5pbnNlcnRDYXJkc09uQW5raShjYXJkc1RvQ3JlYXRlKTtcblxuICAgICAgLy8gVXBkYXRlIGRlY2tzIGlmIG5lZWRlZFxuICAgICAgY29uc3QgZGVja05lZWRUb0JlQ2hhbmdlZCA9IGF3YWl0IHRoaXMuZGVja05lZWRUb0JlQ2hhbmdlZChcbiAgICAgICAgY2FyZElkcyxcbiAgICAgICAgZGVja05hbWUsXG4gICAgICApO1xuICAgICAgaWYgKGRlY2tOZWVkVG9CZUNoYW5nZWQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLmFua2kuY2hhbmdlRGVjayhjYXJkSWRzLCBkZWNrTmFtZSk7XG4gICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLnB1c2goXCJDYXJkcyBtb3ZlZCBpbiBuZXcgZGVja1wiKTtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgcmV0dXJuIFtcIkVycm9yOiBDb3VsZCBub3QgdXBkYXRlIGRlY2sgdGhlIGZpbGUuXCJdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFVwZGF0ZSBmaWxlXG4gICAgICBpZiAodGhpcy51cGRhdGVGaWxlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGFjdGl2ZUZpbGUsIHRoaXMuZmlsZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIEVycm9yKFwiQ291bGQgbm90IHVwZGF0ZSB0aGUgZmlsZS5cIik7XG4gICAgICAgICAgcmV0dXJuIFtcIkVycm9yOiBDb3VsZCBub3QgdXBkYXRlIHRoZSBmaWxlLlwiXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnVwZGF0ZUZyb250bWF0dGVyKGZyb250bWF0dGVyLCBkZWNrTmFtZSk7XG5cbiAgICAgIGlmICghdGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCkge1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMucHVzaChcIk5vdGhpbmcgdG8gZG8uIEV2ZXJ5dGhpbmcgaXMgdXAgdG8gZGF0ZVwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm5vdGlmaWNhdGlvbnM7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICBFcnJvcihcIlNvbWV0aGluZyB3ZW50IHdyb25nXCIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaW5zZXJ0TWVkaWFzKGNhcmRzOiBDYXJkW10sIHNvdXJjZVBhdGg6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICAvLyBDdXJyZW50bHkgdGhlIG1lZGlhIGFyZSBjcmVhdGVkIGZvciBldmVyeSBydW4sIHRoaXMgaXMgbm90IGEgcHJvYmxlbSBzaW5jZSBBbmtpIEFQSXMgb3ZlcndyaXRlIHRoZSBmaWxlXG4gICAgICAvLyBBIG1vcmUgZWZmaWNpZW50IHdheSB3b3VsZCBiZSB0byBrZWVwIHRyYWNrIG9mIHRoZSBtZWRpYXMgc2F2ZWRcbiAgICAgIGF3YWl0IHRoaXMuZ2VuZXJhdGVNZWRpYUxpbmtzKGNhcmRzLCBzb3VyY2VQYXRoKTtcbiAgICAgIGF3YWl0IHRoaXMuYW5raS5zdG9yZU1lZGlhRmlsZXMoY2FyZHMpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgRXJyb3IoXCJFcnJvcjogQ291bGQgbm90IHVwbG9hZCBtZWRpYXNcIik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBnZW5lcmF0ZU1lZGlhTGlua3MoY2FyZHM6IENhcmRbXSwgc291cmNlUGF0aDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIgaW5zdGFuY2VvZiBGaWxlU3lzdGVtQWRhcHRlcikge1xuICAgICAgLy8gQHRzLWlnbm9yZTogVW5yZWFjaGFibGUgY29kZSBlcnJvclxuXG4gICAgICBmb3IgKGNvbnN0IGNhcmQgb2YgY2FyZHMpIHtcbiAgICAgICAgZm9yIChjb25zdCBtZWRpYSBvZiBjYXJkLm1lZGlhTmFtZXMpIHtcbiAgICAgICAgICBjb25zdCBpbWFnZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QoXG4gICAgICAgICAgICBkZWNvZGVVUklDb21wb25lbnQobWVkaWEpLFxuICAgICAgICAgICAgc291cmNlUGF0aCxcbiAgICAgICAgICApO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBiaW5hcnlNZWRpYSA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWRCaW5hcnkoaW1hZ2UpO1xuICAgICAgICAgICAgY2FyZC5tZWRpYUJhc2U2NEVuY29kZWQucHVzaChhcnJheUJ1ZmZlclRvQmFzZTY0KGJpbmFyeU1lZGlhKSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBFcnJvcihcIkVycm9yOiBDb3VsZCBub3QgcmVhZCBtZWRpYVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGluc2VydENhcmRzT25BbmtpKGNhcmRzVG9DcmVhdGU6IENhcmRbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgaWYgKGNhcmRzVG9DcmVhdGUubGVuZ3RoKSB7XG4gICAgICBsZXQgaW5zZXJ0ZWRDYXJkcyA9IDA7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBpZHMgPSBhd2FpdCB0aGlzLmFua2kuYWRkQ2FyZHMoY2FyZHNUb0NyZWF0ZSk7XG4gICAgICAgIC8vIEFkZCBJRHMgZnJvbSByZXNwb25zZSB0byBGbGFzaGNhcmRbXVxuICAgICAgICBpZHMubWFwKChpZDogbnVtYmVyLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgY2FyZHNUb0NyZWF0ZVtpbmRleF0uaWQgPSBpZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IHRvdGFsID0gMDtcbiAgICAgICAgY2FyZHNUb0NyZWF0ZS5mb3JFYWNoKChjYXJkKSA9PiB7XG4gICAgICAgICAgaWYgKGNhcmQuaWQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgICAgICAgIGBFcnJvciwgY291bGQgbm90IGFkZDogJyR7Y2FyZC5pbml0aWFsQ29udGVudH0nYCxcbiAgICAgICAgICAgICAgbm90aWNlVGltZW91dCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhcmQucmV2ZXJzZWQgPyAoaW5zZXJ0ZWRDYXJkcyArPSAyKSA6IGluc2VydGVkQ2FyZHMrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FyZC5yZXZlcnNlZCA/ICh0b3RhbCArPSAyKSA6IHRvdGFsKys7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnNvdXJjZVN1cHBvcnQpIHtcbiAgICAgICAgICB0aGlzLnBhcnNlci51cGRhdGVDYXJkU291cmNlKGNhcmRzVG9DcmVhdGUpO1xuICAgICAgICAgIHRoaXMuYW5raS51cGRhdGVDYXJkcyhjYXJkc1RvQ3JlYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMud3JpdGVBbmtpQmxvY2tzKGNhcmRzVG9DcmVhdGUpO1xuXG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5wdXNoKFxuICAgICAgICAgIGBJbnNlcnRlZCBzdWNjZXNzZnVsbHkgJHtpbnNlcnRlZENhcmRzfS8ke3RvdGFsfSBjYXJkcy5gLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gaW5zZXJ0ZWRDYXJkcztcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIEVycm9yKFwiRXJyb3I6IENvdWxkIG5vdCB3cml0ZSBjYXJkcyBvbiBBbmtpXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRnJvbnRtYXR0ZXIoZnJvbnRtYXR0ZXI6IEZyb250TWF0dGVyQ2FjaGUsIGRlY2tOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBhY3RpdmVGaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcblxuICAgIHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcihhY3RpdmVGaWxlLCAoZnJvbnRtYXR0ZXIpID0+IHtcbiAgICAgIGZyb250bWF0dGVyW1wiY2FyZHMtZGVja1wiXSA9IGRlY2tOYW1lO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB3cml0ZUFua2lCbG9ja3MoY2FyZHNUb0NyZWF0ZTogQ2FyZFtdKSB7XG4gICAgZm9yIChjb25zdCBjYXJkIG9mIGNhcmRzVG9DcmVhdGUpIHtcbiAgICAgIC8vIENhcmQuaWQgY2Fubm90IGJlIG51bGwsIGJlY2F1c2UgaWYgd3JpdHRlbiBhbHJlYWR5IHByZXZpb3VzbHkgaXQgaGFzIGFuIElELFxuICAgICAgLy8gICBpZiBpdCBoYXMgYmVlbiBpbnNlcnRlZCBpdCBoYXMgYW4gSUQgdG9vXG4gICAgICBpZiAoY2FyZC5pZCAhPT0gbnVsbCAmJiAhY2FyZC5pbnNlcnRlZCkge1xuICAgICAgICBsZXQgaWQgPSBjYXJkLmdldElkRm9ybWF0KCk7XG4gICAgICAgIGlmIChjYXJkIGluc3RhbmNlb2YgSW5saW5lY2FyZCkge1xuICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmlubGluZUlEKSB7XG4gICAgICAgICAgICBpZCA9IFwiIFwiICsgaWQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlkID0gXCJcXG5cIiArIGlkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXJkLmVuZE9mZnNldCArPSB0aGlzLnRvdGFsT2Zmc2V0O1xuICAgICAgICBjb25zdCBvZmZzZXQgPSBjYXJkLmVuZE9mZnNldDtcblxuICAgICAgICB0aGlzLnVwZGF0ZUZpbGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmZpbGUgPVxuICAgICAgICAgIHRoaXMuZmlsZS5zdWJzdHJpbmcoMCwgb2Zmc2V0KSArXG4gICAgICAgICAgaWQgK1xuICAgICAgICAgIHRoaXMuZmlsZS5zdWJzdHJpbmcob2Zmc2V0LCB0aGlzLmZpbGUubGVuZ3RoICsgMSk7XG4gICAgICAgIHRoaXMudG90YWxPZmZzZXQgKz0gaWQubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgdXBkYXRlQ2FyZHNPbkFua2koY2FyZHM6IENhcmRbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgaWYgKGNhcmRzLmxlbmd0aCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3Muc291cmNlU3VwcG9ydCkge1xuICAgICAgICAgIHRoaXMucGFyc2VyLnVwZGF0ZUNhcmRTb3VyY2UoY2FyZHMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYW5raS51cGRhdGVDYXJkcyhjYXJkcyk7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5wdXNoKFxuICAgICAgICAgIGBVcGRhdGVkIHN1Y2Nlc3NmdWxseSAke2NhcmRzLmxlbmd0aH0vJHtjYXJkcy5sZW5ndGh9IGNhcmRzLmAsXG4gICAgICAgICk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICBFcnJvcihcIkVycm9yOiBDb3VsZCBub3QgdXBkYXRlIGNhcmRzIG9uIEFua2lcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjYXJkcy5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzeW5jIGRlbGV0ZUNhcmRzT25BbmtpKFxuICAgIGNhcmRzOiBudW1iZXJbXSxcbiAgICBhbmtpQmxvY2tzOiBSZWdFeHBNYXRjaEFycmF5W10sXG4gICk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgaWYgKGNhcmRzLmxlbmd0aCkge1xuICAgICAgbGV0IGRlbGV0ZWRDYXJkcyA9IDA7XG4gICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIGFua2lCbG9ja3MpIHtcbiAgICAgICAgY29uc3QgaWQgPSBOdW1iZXIoYmxvY2tbMV0pO1xuXG4gICAgICAgIC8vIERlbGV0aW9uIG9mIGNhcmRzIHRoYXQgbmVlZCB0byBiZSBkZWxldGVkIChpLmUuIGJsb2NrcyBJRCB0aGF0IGRvbid0IGhhdmUgY29udGVudClcbiAgICAgICAgaWYgKGNhcmRzLmluY2x1ZGVzKGlkKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmFua2kuZGVsZXRlQ2FyZHMoY2FyZHMpO1xuICAgICAgICAgICAgZGVsZXRlZENhcmRzKys7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlRmlsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmZpbGUgPVxuICAgICAgICAgICAgICB0aGlzLmZpbGUuc3Vic3RyaW5nKDAsIGJsb2NrW1wiaW5kZXhcIl0pICtcbiAgICAgICAgICAgICAgdGhpcy5maWxlLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICBibG9ja1tcImluZGV4XCJdICsgYmxvY2tbMF0ubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHRoaXMuZmlsZS5sZW5ndGgsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLnRvdGFsT2Zmc2V0IC09IGJsb2NrWzBdLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5wdXNoKFxuICAgICAgICAgICAgICBgRGVsZXRlZCBzdWNjZXNzZnVsbHkgJHtkZWxldGVkQ2FyZHN9LyR7Y2FyZHMubGVuZ3RofSBjYXJkcy5gLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIEVycm9yKFwiRXJyb3IsIGNvdWxkIG5vdCBkZWxldGUgdGhlIGNhcmQgZnJvbSBBbmtpXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGVsZXRlZENhcmRzO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0QW5raUlEcyhibG9ja3M6IFJlZ0V4cE1hdGNoQXJyYXlbXSk6IG51bWJlcltdIHtcbiAgICBjb25zdCBJRHM6IG51bWJlcltdID0gW107XG4gICAgZm9yIChjb25zdCBiIG9mIGJsb2Nrcykge1xuICAgICAgSURzLnB1c2goTnVtYmVyKGJbMV0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gSURzO1xuICB9XG5cbiAgcHVibGljIGZpbHRlckJ5VXBkYXRlKGFua2lDYXJkczogYW55LCBnZW5lcmF0ZWRDYXJkczogQ2FyZFtdKSB7XG4gICAgbGV0IGNhcmRzVG9DcmVhdGU6IENhcmRbXSA9IFtdO1xuICAgIGNvbnN0IGNhcmRzVG9VcGRhdGU6IENhcmRbXSA9IFtdO1xuICAgIGNvbnN0IGNhcmRzTm90SW5BbmtpOiBDYXJkW10gPSBbXTtcblxuICAgIGlmIChhbmtpQ2FyZHMpIHtcbiAgICAgIGZvciAoY29uc3QgZmxhc2hjYXJkIG9mIGdlbmVyYXRlZENhcmRzKSB7XG4gICAgICAgIC8vIEluc2VydGVkIG1lYW5zIHRoYXQgYW5raSBibG9ja3MgYXJlIGF2YWlsYWJsZSwgdGhhdCBtZWFucyB0aGF0IHRoZSBjYXJkIHNob3VsZFxuICAgICAgICAvLyBcdCh0aGUgdXNlciBjYW4gYWx3YXlzIGRlbGV0ZSBpdCkgYmUgaW4gQW5raVxuICAgICAgICBsZXQgYW5raUNhcmQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChmbGFzaGNhcmQuaW5zZXJ0ZWQpIHtcbiAgICAgICAgICBhbmtpQ2FyZCA9IGFua2lDYXJkcy5maWx0ZXIoXG4gICAgICAgICAgICAoY2FyZDogYW55KSA9PiBOdW1iZXIoY2FyZC5ub3RlSWQpID09PSBmbGFzaGNhcmQuaWQsXG4gICAgICAgICAgKVswXTtcbiAgICAgICAgICBpZiAoIWFua2lDYXJkKSB7XG4gICAgICAgICAgICBjYXJkc05vdEluQW5raS5wdXNoKGZsYXNoY2FyZCk7XG4gICAgICAgICAgfSBlbHNlIGlmICghZmxhc2hjYXJkLm1hdGNoKGFua2lDYXJkKSkge1xuICAgICAgICAgICAgZmxhc2hjYXJkLm9sZFRhZ3MgPSBhbmtpQ2FyZC50YWdzO1xuICAgICAgICAgICAgY2FyZHNUb1VwZGF0ZS5wdXNoKGZsYXNoY2FyZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhcmRzVG9DcmVhdGUucHVzaChmbGFzaGNhcmQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhcmRzVG9DcmVhdGUgPSBbLi4uZ2VuZXJhdGVkQ2FyZHNdO1xuICAgIH1cblxuICAgIHJldHVybiBbY2FyZHNUb0NyZWF0ZSwgY2FyZHNUb1VwZGF0ZSwgY2FyZHNOb3RJbkFua2ldO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGRlY2tOZWVkVG9CZUNoYW5nZWQoY2FyZHNJZHM6IG51bWJlcltdLCBkZWNrTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgY2FyZHNJbmZvID0gYXdhaXQgdGhpcy5hbmtpLmNhcmRzSW5mbyhjYXJkc0lkcyk7XG4gICAgY29uc29sZS5sb2coXCJGbGFzaGNhcmRzOiBDYXJkcyBpbmZvXCIpO1xuICAgIGNvbnNvbGUubG9nKGNhcmRzSW5mbyk7XG4gICAgaWYgKGNhcmRzSW5mby5sZW5ndGggIT09IDApIHtcbiAgICAgIHJldHVybiBjYXJkc0luZm9bMF0uZGVja05hbWUgIT09IGRlY2tOYW1lO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDYXJkc0lkcyhhbmtpQ2FyZHM6IGFueSwgZ2VuZXJhdGVkQ2FyZHM6IENhcmRbXSk6IG51bWJlcltdIHtcbiAgICBsZXQgaWRzOiBudW1iZXJbXSA9IFtdO1xuXG4gICAgaWYgKGFua2lDYXJkcykge1xuICAgICAgZm9yIChjb25zdCBmbGFzaGNhcmQgb2YgZ2VuZXJhdGVkQ2FyZHMpIHtcbiAgICAgICAgbGV0IGFua2lDYXJkID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoZmxhc2hjYXJkLmluc2VydGVkKSB7XG4gICAgICAgICAgYW5raUNhcmQgPSBhbmtpQ2FyZHMuZmlsdGVyKFxuICAgICAgICAgICAgKGNhcmQ6IGFueSkgPT4gTnVtYmVyKGNhcmQubm90ZUlkKSA9PT0gZmxhc2hjYXJkLmlkLFxuICAgICAgICAgIClbMF07XG4gICAgICAgICAgaWYgKGFua2lDYXJkKSB7XG4gICAgICAgICAgICBpZHMgPSBpZHMuY29uY2F0KGFua2lDYXJkLmNhcmRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaWRzO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hdGNoIGZpbGUgcGF0aCBhZ2FpbnN0IHRlbXBsYXRlIGNvbmZpZyBwYXR0ZXJucy5cbiAgICogUGF0dGVybiBzdXBwb3J0cyBiYXNpYyBnbG9iOiAqKiBmb3Igd2lsZGNhcmRcbiAgICovXG4gIHB1YmxpYyBtYXRjaFRlbXBsYXRlQ29uZmlnKGZpbGVQYXRoOiBzdHJpbmcpOiBJVGVtcGxhdGVDb25maWcgfCBudWxsIHtcbiAgICBmb3IgKGNvbnN0IHRjIG9mIHRoaXMuc2V0dGluZ3MudGVtcGxhdGVDb25maWdzKSB7XG4gICAgICBpZiAoIXRjLmVuYWJsZWQpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgcGF0dGVybiA9IHRjLmZpbGVQYXRoUGF0dGVybjtcbiAgICAgIC8vIENvbnZlcnQgc2ltcGxlIGdsb2IgdG8gcmVnZXg6ICoqIOKGkiAuKiwgKiDihpIgW14vXSpcbiAgICAgIGxldCByZWdleFN0ciA9IHBhdHRlcm5cbiAgICAgICAgLnJlcGxhY2UoL1xcKlxcKi9nLCAnX19fRE9VQkxFX1NUQVJfX18nKVxuICAgICAgICAucmVwbGFjZSgvXFwqL2csICdbXi9dKicpXG4gICAgICAgIC5yZXBsYWNlKC9fX19ET1VCTEVfU1RBUl9fXy9nLCAnLionKTtcbiAgICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cCgnXicgKyByZWdleFN0ciArICckJyk7XG4gICAgICBpZiAocmUudGVzdChmaWxlUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIHRjO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZUdsb2JhbFRhZ3MoZmlsZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIGxldCBnbG9iYWxUYWdzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgY29uc3QgdGFncyA9IGZpbGUubWF0Y2goLyg/OmNhcmRzLSk/dGFnczogPyguKikvaW0pO1xuICAgIGdsb2JhbFRhZ3MgPSB0YWdzID8gdGFnc1sxXS5tYXRjaCh0aGlzLnJlZ2V4Lmdsb2JhbFRhZ3NTcGxpdHRlcikgOiBbXTtcblxuICAgIGlmIChnbG9iYWxUYWdzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdsb2JhbFRhZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZ2xvYmFsVGFnc1tpXSA9IGdsb2JhbFRhZ3NbaV0ucmVwbGFjZShcIiNcIiwgXCJcIik7XG4gICAgICAgIGdsb2JhbFRhZ3NbaV0gPSBnbG9iYWxUYWdzW2ldLnJlcGxhY2UoL1xcLy9nLCBcIjo6XCIpO1xuICAgICAgICBnbG9iYWxUYWdzW2ldID0gZ2xvYmFsVGFnc1tpXS5yZXBsYWNlKC9cXFtcXFsoLiopXFxdXFxdLywgXCIkMVwiKTtcbiAgICAgICAgZ2xvYmFsVGFnc1tpXSA9IGdsb2JhbFRhZ3NbaV0udHJpbSgpO1xuICAgICAgICBnbG9iYWxUYWdzW2ldID0gZ2xvYmFsVGFnc1tpXS5yZXBsYWNlKC8gL2csIFwiLVwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGdsb2JhbFRhZ3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG4iXX0=