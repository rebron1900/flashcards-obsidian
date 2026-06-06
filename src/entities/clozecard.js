import { __extends } from "tslib";
import { codeDeckExtension, sourceDeckExtension } from "src/conf/constants";
import { Card } from "src/entities/card";
var Clozecard = /** @class */ (function (_super) {
    __extends(Clozecard, _super);
    function Clozecard(id, deckName, initialContent, fields, reversed, initialOffset, endOffset, tags, inserted, mediaNames, containsCode) {
        if (id === void 0) { id = -1; }
        if (tags === void 0) { tags = []; }
        if (inserted === void 0) { inserted = false; }
        var _this = _super.call(this, id, deckName, initialContent, fields, reversed, initialOffset, endOffset, tags, inserted, mediaNames, containsCode) || this;
        _this.toString = function () {
            return "Cloze: ".concat(_this.fields[0]);
        };
        _this.modelName = "Obsidian-cloze";
        if (fields["Source"]) {
            _this.modelName += sourceDeckExtension;
        }
        if (containsCode) {
            _this.modelName += codeDeckExtension;
        }
        return _this;
    }
    Clozecard.prototype.getCard = function (update) {
        if (update === void 0) { update = false; }
        var card = {
            deckName: this.deckName,
            modelName: this.modelName,
            fields: this.fields,
            tags: this.tags,
        };
        if (update) {
            card["id"] = this.id;
        }
        return card;
    };
    Clozecard.prototype.getMedias = function () {
        var _this = this;
        var medias = [];
        this.mediaBase64Encoded.forEach(function (data, index) {
            medias.push({
                filename: _this.mediaNames[index],
                data: data,
            });
        });
        return medias;
    };
    Clozecard.prototype.getIdFormat = function () {
        return "\n^" + this.id.toString();
    };
    return Clozecard;
}(Card));
export { Clozecard };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvemVjYXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xvemVjYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM1RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFekM7SUFBK0IsNkJBQUk7SUFDakMsbUJBQ0UsRUFBTyxFQUNQLFFBQWdCLEVBQ2hCLGNBQXNCLEVBQ3RCLE1BQThCLEVBQzlCLFFBQWlCLEVBQ2pCLGFBQXFCLEVBQ3JCLFNBQWlCLEVBQ2pCLElBQW1CLEVBQ25CLFFBQWdCLEVBQ2hCLFVBQW9CLEVBQ3BCLFlBQXFCO1FBVnJCLG1CQUFBLEVBQUEsTUFBTSxDQUFDO1FBT1AscUJBQUEsRUFBQSxTQUFtQjtRQUNuQix5QkFBQSxFQUFBLGdCQUFnQjtRQVRsQixZQWFFLGtCQUNFLEVBQUUsRUFDRixRQUFRLEVBQ1IsY0FBYyxFQUNkLE1BQU0sRUFDTixRQUFRLEVBQ1IsYUFBYSxFQUNiLFNBQVMsRUFDVCxJQUFJLEVBQ0osUUFBUSxFQUNSLFVBQVUsRUFDVixZQUFZLENBQ2IsU0FRRjtRQTZCTSxjQUFRLEdBQUc7WUFDaEIsT0FBTyxpQkFBVSxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7UUFDcEMsQ0FBQyxDQUFDO1FBdENBLEtBQUksQ0FBQyxTQUFTLEdBQUcsZ0JBQWdCLENBQUM7UUFDbEMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDcEIsS0FBSSxDQUFDLFNBQVMsSUFBSSxtQkFBbUIsQ0FBQztTQUN2QztRQUNELElBQUksWUFBWSxFQUFFO1lBQ2hCLEtBQUksQ0FBQyxTQUFTLElBQUksaUJBQWlCLENBQUM7U0FDckM7O0lBQ0gsQ0FBQztJQUVNLDJCQUFPLEdBQWQsVUFBZSxNQUFjO1FBQWQsdUJBQUEsRUFBQSxjQUFjO1FBQzNCLElBQU0sSUFBSSxHQUFRO1lBQ2hCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNoQixDQUFDO1FBRUYsSUFBSSxNQUFNLEVBQUU7WUFDVixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztTQUN0QjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLDZCQUFTLEdBQWhCO1FBQUEsaUJBVUM7UUFUQyxJQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLO1lBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ1YsUUFBUSxFQUFFLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUNoQyxJQUFJLEVBQUUsSUFBSTthQUNYLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQU1NLCtCQUFXLEdBQWxCO1FBQ0UsT0FBTyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBdEVELENBQStCLElBQUksR0FzRWxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29kZURlY2tFeHRlbnNpb24sIHNvdXJjZURlY2tFeHRlbnNpb24gfSBmcm9tIFwic3JjL2NvbmYvY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBDYXJkIH0gZnJvbSBcInNyYy9lbnRpdGllcy9jYXJkXCI7XG5cbmV4cG9ydCBjbGFzcyBDbG96ZWNhcmQgZXh0ZW5kcyBDYXJkIHtcbiAgY29uc3RydWN0b3IoXG4gICAgaWQgPSAtMSxcbiAgICBkZWNrTmFtZTogc3RyaW5nLFxuICAgIGluaXRpYWxDb250ZW50OiBzdHJpbmcsXG4gICAgZmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICAgIHJldmVyc2VkOiBib29sZWFuLFxuICAgIGluaXRpYWxPZmZzZXQ6IG51bWJlcixcbiAgICBlbmRPZmZzZXQ6IG51bWJlcixcbiAgICB0YWdzOiBzdHJpbmdbXSA9IFtdLFxuICAgIGluc2VydGVkID0gZmFsc2UsXG4gICAgbWVkaWFOYW1lczogc3RyaW5nW10sXG4gICAgY29udGFpbnNDb2RlOiBib29sZWFuXG4gICkge1xuICAgIHN1cGVyKFxuICAgICAgaWQsXG4gICAgICBkZWNrTmFtZSxcbiAgICAgIGluaXRpYWxDb250ZW50LFxuICAgICAgZmllbGRzLFxuICAgICAgcmV2ZXJzZWQsXG4gICAgICBpbml0aWFsT2Zmc2V0LFxuICAgICAgZW5kT2Zmc2V0LFxuICAgICAgdGFncyxcbiAgICAgIGluc2VydGVkLFxuICAgICAgbWVkaWFOYW1lcyxcbiAgICAgIGNvbnRhaW5zQ29kZVxuICAgICk7XG4gICAgdGhpcy5tb2RlbE5hbWUgPSBgT2JzaWRpYW4tY2xvemVgO1xuICAgIGlmIChmaWVsZHNbXCJTb3VyY2VcIl0pIHtcbiAgICAgIHRoaXMubW9kZWxOYW1lICs9IHNvdXJjZURlY2tFeHRlbnNpb247XG4gICAgfVxuICAgIGlmIChjb250YWluc0NvZGUpIHtcbiAgICAgIHRoaXMubW9kZWxOYW1lICs9IGNvZGVEZWNrRXh0ZW5zaW9uO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRDYXJkKHVwZGF0ZSA9IGZhbHNlKTogb2JqZWN0IHtcbiAgICBjb25zdCBjYXJkOiBhbnkgPSB7XG4gICAgICBkZWNrTmFtZTogdGhpcy5kZWNrTmFtZSxcbiAgICAgIG1vZGVsTmFtZTogdGhpcy5tb2RlbE5hbWUsXG4gICAgICBmaWVsZHM6IHRoaXMuZmllbGRzLFxuICAgICAgdGFnczogdGhpcy50YWdzLFxuICAgIH07XG5cbiAgICBpZiAodXBkYXRlKSB7XG4gICAgICBjYXJkW1wiaWRcIl0gPSB0aGlzLmlkO1xuICAgIH1cblxuICAgIHJldHVybiBjYXJkO1xuICB9XG5cbiAgcHVibGljIGdldE1lZGlhcygpOiBvYmplY3RbXSB7XG4gICAgY29uc3QgbWVkaWFzOiBvYmplY3RbXSA9IFtdO1xuICAgIHRoaXMubWVkaWFCYXNlNjRFbmNvZGVkLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICBtZWRpYXMucHVzaCh7XG4gICAgICAgIGZpbGVuYW1lOiB0aGlzLm1lZGlhTmFtZXNbaW5kZXhdLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWVkaWFzO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nID0gKCk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIGBDbG96ZTogJHt0aGlzLmZpZWxkc1swXX1gO1xuICB9O1xuXG4gIHB1YmxpYyBnZXRJZEZvcm1hdCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBcIlxcbl5cIiArIHRoaXMuaWQudG9TdHJpbmcoKTtcbiAgfVxufVxuIl19