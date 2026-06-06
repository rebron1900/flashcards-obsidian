import { __extends } from "tslib";
import { codeDeckExtension, sourceDeckExtension } from "src/conf/constants";
import { Card } from "src/entities/card";
var Spacedcard = /** @class */ (function (_super) {
    __extends(Spacedcard, _super);
    function Spacedcard(id, deckName, initialContent, fields, reversed, initialOffset, endOffset, tags, inserted, mediaNames, containsCode) {
        if (id === void 0) { id = -1; }
        if (tags === void 0) { tags = []; }
        if (inserted === void 0) { inserted = false; }
        var _this = _super.call(this, id, deckName, initialContent, fields, reversed, initialOffset, endOffset, tags, inserted, mediaNames, containsCode) || this;
        _this.toString = function () {
            return "Prompt: ".concat(_this.fields[0]);
        };
        _this.modelName = "Obsidian-spaced";
        if (fields["Source"]) {
            _this.modelName += sourceDeckExtension;
        }
        if (containsCode) {
            _this.modelName += codeDeckExtension;
        }
        return _this;
    }
    Spacedcard.prototype.getCard = function (update) {
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
    Spacedcard.prototype.getMedias = function () {
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
    Spacedcard.prototype.getIdFormat = function () {
        return "^" + this.id.toString() + "\n";
    };
    return Spacedcard;
}(Card));
export { Spacedcard };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BhY2VkY2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNwYWNlZGNhcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzVFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUV6QztJQUFnQyw4QkFBSTtJQUNsQyxvQkFDRSxFQUFPLEVBQ1AsUUFBZ0IsRUFDaEIsY0FBc0IsRUFDdEIsTUFBOEIsRUFDOUIsUUFBaUIsRUFDakIsYUFBcUIsRUFDckIsU0FBaUIsRUFDakIsSUFBbUIsRUFDbkIsUUFBZ0IsRUFDaEIsVUFBb0IsRUFDcEIsWUFBcUI7UUFWckIsbUJBQUEsRUFBQSxNQUFNLENBQUM7UUFPUCxxQkFBQSxFQUFBLFNBQW1CO1FBQ25CLHlCQUFBLEVBQUEsZ0JBQWdCO1FBVGxCLFlBYUUsa0JBQ0UsRUFBRSxFQUNGLFFBQVEsRUFDUixjQUFjLEVBQ2QsTUFBTSxFQUNOLFFBQVEsRUFDUixhQUFhLEVBQ2IsU0FBUyxFQUNULElBQUksRUFDSixRQUFRLEVBQ1IsVUFBVSxFQUNWLFlBQVksQ0FDYixTQVFGO1FBNkJNLGNBQVEsR0FBRztZQUNoQixPQUFPLGtCQUFXLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztRQUNyQyxDQUFDLENBQUM7UUF0Q0EsS0FBSSxDQUFDLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQztRQUNuQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNwQixLQUFJLENBQUMsU0FBUyxJQUFJLG1CQUFtQixDQUFDO1NBQ3ZDO1FBQ0QsSUFBSSxZQUFZLEVBQUU7WUFDaEIsS0FBSSxDQUFDLFNBQVMsSUFBSSxpQkFBaUIsQ0FBQztTQUNyQzs7SUFDSCxDQUFDO0lBRU0sNEJBQU8sR0FBZCxVQUFlLE1BQWM7UUFBZCx1QkFBQSxFQUFBLGNBQWM7UUFDM0IsSUFBTSxJQUFJLEdBQVE7WUFDaEIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2hCLENBQUM7UUFFRixJQUFJLE1BQU0sRUFBRTtZQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1NBQ3RCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sOEJBQVMsR0FBaEI7UUFBQSxpQkFVQztRQVRDLElBQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFFLEtBQUs7WUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDVixRQUFRLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7Z0JBQ2hDLElBQUksRUFBRSxJQUFJO2FBQ1gsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBTU0sZ0NBQVcsR0FBbEI7UUFDRSxPQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQztJQUN6QyxDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBdEVELENBQWdDLElBQUksR0FzRW5DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29kZURlY2tFeHRlbnNpb24sIHNvdXJjZURlY2tFeHRlbnNpb24gfSBmcm9tIFwic3JjL2NvbmYvY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBDYXJkIH0gZnJvbSBcInNyYy9lbnRpdGllcy9jYXJkXCI7XG5cbmV4cG9ydCBjbGFzcyBTcGFjZWRjYXJkIGV4dGVuZHMgQ2FyZCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIGlkID0gLTEsXG4gICAgZGVja05hbWU6IHN0cmluZyxcbiAgICBpbml0aWFsQ29udGVudDogc3RyaW5nLFxuICAgIGZpZWxkczogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgICByZXZlcnNlZDogYm9vbGVhbixcbiAgICBpbml0aWFsT2Zmc2V0OiBudW1iZXIsXG4gICAgZW5kT2Zmc2V0OiBudW1iZXIsXG4gICAgdGFnczogc3RyaW5nW10gPSBbXSxcbiAgICBpbnNlcnRlZCA9IGZhbHNlLFxuICAgIG1lZGlhTmFtZXM6IHN0cmluZ1tdLFxuICAgIGNvbnRhaW5zQ29kZTogYm9vbGVhblxuICApIHtcbiAgICBzdXBlcihcbiAgICAgIGlkLFxuICAgICAgZGVja05hbWUsXG4gICAgICBpbml0aWFsQ29udGVudCxcbiAgICAgIGZpZWxkcyxcbiAgICAgIHJldmVyc2VkLFxuICAgICAgaW5pdGlhbE9mZnNldCxcbiAgICAgIGVuZE9mZnNldCxcbiAgICAgIHRhZ3MsXG4gICAgICBpbnNlcnRlZCxcbiAgICAgIG1lZGlhTmFtZXMsXG4gICAgICBjb250YWluc0NvZGVcbiAgICApO1xuICAgIHRoaXMubW9kZWxOYW1lID0gYE9ic2lkaWFuLXNwYWNlZGA7XG4gICAgaWYgKGZpZWxkc1tcIlNvdXJjZVwiXSkge1xuICAgICAgdGhpcy5tb2RlbE5hbWUgKz0gc291cmNlRGVja0V4dGVuc2lvbjtcbiAgICB9XG4gICAgaWYgKGNvbnRhaW5zQ29kZSkge1xuICAgICAgdGhpcy5tb2RlbE5hbWUgKz0gY29kZURlY2tFeHRlbnNpb247XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldENhcmQodXBkYXRlID0gZmFsc2UpOiBvYmplY3Qge1xuICAgIGNvbnN0IGNhcmQ6IGFueSA9IHtcbiAgICAgIGRlY2tOYW1lOiB0aGlzLmRlY2tOYW1lLFxuICAgICAgbW9kZWxOYW1lOiB0aGlzLm1vZGVsTmFtZSxcbiAgICAgIGZpZWxkczogdGhpcy5maWVsZHMsXG4gICAgICB0YWdzOiB0aGlzLnRhZ3MsXG4gICAgfTtcblxuICAgIGlmICh1cGRhdGUpIHtcbiAgICAgIGNhcmRbXCJpZFwiXSA9IHRoaXMuaWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhcmQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0TWVkaWFzKCk6IG9iamVjdFtdIHtcbiAgICBjb25zdCBtZWRpYXM6IG9iamVjdFtdID0gW107XG4gICAgdGhpcy5tZWRpYUJhc2U2NEVuY29kZWQuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgIG1lZGlhcy5wdXNoKHtcbiAgICAgICAgZmlsZW5hbWU6IHRoaXMubWVkaWFOYW1lc1tpbmRleF0sXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBtZWRpYXM7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcgPSAoKTogc3RyaW5nID0+IHtcbiAgICByZXR1cm4gYFByb21wdDogJHt0aGlzLmZpZWxkc1swXX1gO1xuICB9O1xuXG4gIHB1YmxpYyBnZXRJZEZvcm1hdCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBcIl5cIiArIHRoaXMuaWQudG9TdHJpbmcoKSArIFwiXFxuXCI7XG4gIH1cbn1cbiJdfQ==