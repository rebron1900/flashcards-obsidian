import { __extends } from "tslib";
import { codeDeckExtension, sourceDeckExtension } from "src/conf/constants";
import { Card } from "src/entities/card";
var Inlinecard = /** @class */ (function (_super) {
    __extends(Inlinecard, _super);
    function Inlinecard(id, deckName, initialContent, fields, reversed, initialOffset, endOffset, tags, inserted, mediaNames, containsCode) {
        if (id === void 0) { id = -1; }
        if (tags === void 0) { tags = []; }
        if (inserted === void 0) { inserted = false; }
        var _this = _super.call(this, id, deckName, initialContent, fields, reversed, initialOffset, endOffset, tags, inserted, mediaNames, containsCode) || this;
        _this.toString = function () {
            return "Q: ".concat(_this.fields[0], " \nA: ").concat(_this.fields[1], " ");
        };
        _this.modelName = _this.reversed
            ? "Obsidian-basic-reversed"
            : "Obsidian-basic";
        if (fields["Source"]) {
            _this.modelName += sourceDeckExtension;
        }
        if (containsCode) {
            _this.modelName += codeDeckExtension;
        }
        return _this;
    }
    Inlinecard.prototype.getCard = function (update) {
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
    Inlinecard.prototype.getMedias = function () {
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
    Inlinecard.prototype.getIdFormat = function () {
        return "^" + this.id.toString();
    };
    return Inlinecard;
}(Card));
export { Inlinecard };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5saW5lY2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlubGluZWNhcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzVFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUV6QztJQUFnQyw4QkFBSTtJQUNsQyxvQkFDRSxFQUFPLEVBQ1AsUUFBZ0IsRUFDaEIsY0FBc0IsRUFDdEIsTUFBOEIsRUFDOUIsUUFBaUIsRUFDakIsYUFBcUIsRUFDckIsU0FBaUIsRUFDakIsSUFBbUIsRUFDbkIsUUFBZ0IsRUFDaEIsVUFBb0IsRUFDcEIsWUFBcUI7UUFWckIsbUJBQUEsRUFBQSxNQUFNLENBQUM7UUFPUCxxQkFBQSxFQUFBLFNBQW1CO1FBQ25CLHlCQUFBLEVBQUEsZ0JBQWdCO1FBVGxCLFlBYUUsa0JBQ0UsRUFBRSxFQUNGLFFBQVEsRUFDUixjQUFjLEVBQ2QsTUFBTSxFQUNOLFFBQVEsRUFDUixhQUFhLEVBQ2IsU0FBUyxFQUNULElBQUksRUFDSixRQUFRLEVBQ1IsVUFBVSxFQUNWLFlBQVksQ0FDYixTQVdGO1FBNkJNLGNBQVEsR0FBRztZQUNoQixPQUFPLGFBQU0sS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsbUJBQVMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBRyxDQUFDO1FBQ3hELENBQUMsQ0FBQztRQXhDQSxLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUksQ0FBQyxRQUFRO1lBQzVCLENBQUMsQ0FBQyx5QkFBeUI7WUFDM0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDO1FBQ3JCLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3BCLEtBQUksQ0FBQyxTQUFTLElBQUksbUJBQW1CLENBQUM7U0FDdkM7UUFDRCxJQUFJLFlBQVksRUFBRTtZQUNoQixLQUFJLENBQUMsU0FBUyxJQUFJLGlCQUFpQixDQUFDO1NBQ3JDOztJQUNILENBQUM7SUFFTSw0QkFBTyxHQUFkLFVBQWUsTUFBYztRQUFkLHVCQUFBLEVBQUEsY0FBYztRQUMzQixJQUFNLElBQUksR0FBUTtZQUNoQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNuQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7U0FDaEIsQ0FBQztRQUVGLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7U0FDdEI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSw4QkFBUyxHQUFoQjtRQUFBLGlCQVVDO1FBVEMsSUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSztZQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNWLFFBQVEsRUFBRSxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztnQkFDaEMsSUFBSSxFQUFFLElBQUk7YUFDWCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFNTSxnQ0FBVyxHQUFsQjtRQUNFLE9BQU8sR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQXpFRCxDQUFnQyxJQUFJLEdBeUVuQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvZGVEZWNrRXh0ZW5zaW9uLCBzb3VyY2VEZWNrRXh0ZW5zaW9uIH0gZnJvbSBcInNyYy9jb25mL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgQ2FyZCB9IGZyb20gXCJzcmMvZW50aXRpZXMvY2FyZFwiO1xuXG5leHBvcnQgY2xhc3MgSW5saW5lY2FyZCBleHRlbmRzIENhcmQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBpZCA9IC0xLFxuICAgIGRlY2tOYW1lOiBzdHJpbmcsXG4gICAgaW5pdGlhbENvbnRlbnQ6IHN0cmluZyxcbiAgICBmaWVsZHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgcmV2ZXJzZWQ6IGJvb2xlYW4sXG4gICAgaW5pdGlhbE9mZnNldDogbnVtYmVyLFxuICAgIGVuZE9mZnNldDogbnVtYmVyLFxuICAgIHRhZ3M6IHN0cmluZ1tdID0gW10sXG4gICAgaW5zZXJ0ZWQgPSBmYWxzZSxcbiAgICBtZWRpYU5hbWVzOiBzdHJpbmdbXSxcbiAgICBjb250YWluc0NvZGU6IGJvb2xlYW5cbiAgKSB7XG4gICAgc3VwZXIoXG4gICAgICBpZCxcbiAgICAgIGRlY2tOYW1lLFxuICAgICAgaW5pdGlhbENvbnRlbnQsXG4gICAgICBmaWVsZHMsXG4gICAgICByZXZlcnNlZCxcbiAgICAgIGluaXRpYWxPZmZzZXQsXG4gICAgICBlbmRPZmZzZXQsXG4gICAgICB0YWdzLFxuICAgICAgaW5zZXJ0ZWQsXG4gICAgICBtZWRpYU5hbWVzLFxuICAgICAgY29udGFpbnNDb2RlXG4gICAgKTsgLy8gISBDSEFOR0UgW11cblxuICAgIHRoaXMubW9kZWxOYW1lID0gdGhpcy5yZXZlcnNlZFxuICAgICAgPyBgT2JzaWRpYW4tYmFzaWMtcmV2ZXJzZWRgXG4gICAgICA6IGBPYnNpZGlhbi1iYXNpY2A7XG4gICAgaWYgKGZpZWxkc1tcIlNvdXJjZVwiXSkge1xuICAgICAgdGhpcy5tb2RlbE5hbWUgKz0gc291cmNlRGVja0V4dGVuc2lvbjtcbiAgICB9XG4gICAgaWYgKGNvbnRhaW5zQ29kZSkge1xuICAgICAgdGhpcy5tb2RlbE5hbWUgKz0gY29kZURlY2tFeHRlbnNpb247XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldENhcmQodXBkYXRlID0gZmFsc2UpOiBvYmplY3Qge1xuICAgIGNvbnN0IGNhcmQ6IGFueSA9IHtcbiAgICAgIGRlY2tOYW1lOiB0aGlzLmRlY2tOYW1lLFxuICAgICAgbW9kZWxOYW1lOiB0aGlzLm1vZGVsTmFtZSxcbiAgICAgIGZpZWxkczogdGhpcy5maWVsZHMsXG4gICAgICB0YWdzOiB0aGlzLnRhZ3MsXG4gICAgfTtcblxuICAgIGlmICh1cGRhdGUpIHtcbiAgICAgIGNhcmRbXCJpZFwiXSA9IHRoaXMuaWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhcmQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0TWVkaWFzKCk6IG9iamVjdFtdIHtcbiAgICBjb25zdCBtZWRpYXM6IG9iamVjdFtdID0gW107XG4gICAgdGhpcy5tZWRpYUJhc2U2NEVuY29kZWQuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgIG1lZGlhcy5wdXNoKHtcbiAgICAgICAgZmlsZW5hbWU6IHRoaXMubWVkaWFOYW1lc1tpbmRleF0sXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBtZWRpYXM7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcgPSAoKTogc3RyaW5nID0+IHtcbiAgICByZXR1cm4gYFE6ICR7dGhpcy5maWVsZHNbMF19IFxcbkE6ICR7dGhpcy5maWVsZHNbMV19IGA7XG4gIH07XG5cbiAgcHVibGljIGdldElkRm9ybWF0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwiXlwiICsgdGhpcy5pZC50b1N0cmluZygpO1xuICB9XG59XG4iXX0=