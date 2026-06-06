import { __extends } from "tslib";
import { codeDeckExtension, sourceDeckExtension } from "src/conf/constants";
import { Card } from "src/entities/card";
var Flashcard = /** @class */ (function (_super) {
    __extends(Flashcard, _super);
    function Flashcard(id, deckName, initialContent, fields, reversed, initialOffset, endOffset, tags, inserted, mediaNames, containsCode, 
    /** 自定义模型名，传此参数时覆盖默认 Obsidian-basic */
    customModelName) {
        if (id === void 0) { id = -1; }
        if (tags === void 0) { tags = []; }
        if (inserted === void 0) { inserted = false; }
        var _this = _super.call(this, id, deckName, initialContent, fields, reversed, initialOffset, endOffset, tags, inserted, mediaNames, containsCode) || this;
        _this.toString = function () {
            return "Q: ".concat(_this.fields[0], "\nA: ").concat(_this.fields[1]);
        };
        if (customModelName) {
            _this.modelName = customModelName;
        }
        else {
            _this.modelName = _this.reversed
                ? "Obsidian-basic-reversed"
                : "Obsidian-basic";
            if (fields["Source"]) {
                _this.modelName += sourceDeckExtension;
            }
            if (containsCode) {
                _this.modelName += codeDeckExtension;
            }
        }
        return _this;
    }
    Flashcard.prototype.getCard = function (update) {
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
    Flashcard.prototype.getMedias = function () {
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
    Flashcard.prototype.getIdFormat = function () {
        return "^" + this.id.toString() + "\n";
    };
    return Flashcard;
}(Card));
export { Flashcard };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhc2hjYXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmxhc2hjYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM1RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFekM7SUFBK0IsNkJBQUk7SUFDakMsbUJBQ0UsRUFBTyxFQUNQLFFBQWdCLEVBQ2hCLGNBQXNCLEVBQ3RCLE1BQThCLEVBQzlCLFFBQWlCLEVBQ2pCLGFBQXFCLEVBQ3JCLFNBQWlCLEVBQ2pCLElBQW1CLEVBQ25CLFFBQWdCLEVBQ2hCLFVBQW9CLEVBQ3BCLFlBQXFCO0lBQ3JCLHNDQUFzQztJQUN0QyxlQUF3QjtRQVp4QixtQkFBQSxFQUFBLE1BQU0sQ0FBQztRQU9QLHFCQUFBLEVBQUEsU0FBbUI7UUFDbkIseUJBQUEsRUFBQSxnQkFBZ0I7UUFUbEIsWUFlRSxrQkFDRSxFQUFFLEVBQ0YsUUFBUSxFQUNSLGNBQWMsRUFDZCxNQUFNLEVBQ04sUUFBUSxFQUNSLGFBQWEsRUFDYixTQUFTLEVBQ1QsSUFBSSxFQUNKLFFBQVEsRUFDUixVQUFVLEVBQ1YsWUFBWSxDQUNiLFNBY0Y7UUE2Qk0sY0FBUSxHQUFHO1lBQ2hCLE9BQU8sYUFBTSxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBUSxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7UUFDdEQsQ0FBQyxDQUFDO1FBNUNBLElBQUksZUFBZSxFQUFFO1lBQ25CLEtBQUksQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDO1NBQ2xDO2FBQU07WUFDTCxLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUksQ0FBQyxRQUFRO2dCQUM1QixDQUFDLENBQUMseUJBQXlCO2dCQUMzQixDQUFDLENBQUMsZ0JBQWdCLENBQUM7WUFDckIsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3BCLEtBQUksQ0FBQyxTQUFTLElBQUksbUJBQW1CLENBQUM7YUFDdkM7WUFDRCxJQUFJLFlBQVksRUFBRTtnQkFDaEIsS0FBSSxDQUFDLFNBQVMsSUFBSSxpQkFBaUIsQ0FBQzthQUNyQztTQUNGOztJQUNILENBQUM7SUFFTSwyQkFBTyxHQUFkLFVBQWUsTUFBYztRQUFkLHVCQUFBLEVBQUEsY0FBYztRQUMzQixJQUFNLElBQUksR0FBUTtZQUNoQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNuQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7U0FDaEIsQ0FBQztRQUVGLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7U0FDdEI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSw2QkFBUyxHQUFoQjtRQUFBLGlCQVVDO1FBVEMsSUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSztZQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNWLFFBQVEsRUFBRSxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztnQkFDaEMsSUFBSSxFQUFFLElBQUk7YUFDWCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFNTSwrQkFBVyxHQUFsQjtRQUNFLE9BQU8sR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQ3pDLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUE5RUQsQ0FBK0IsSUFBSSxHQThFbEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb2RlRGVja0V4dGVuc2lvbiwgc291cmNlRGVja0V4dGVuc2lvbiB9IGZyb20gXCJzcmMvY29uZi9jb25zdGFudHNcIjtcbmltcG9ydCB7IENhcmQgfSBmcm9tIFwic3JjL2VudGl0aWVzL2NhcmRcIjtcblxuZXhwb3J0IGNsYXNzIEZsYXNoY2FyZCBleHRlbmRzIENhcmQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBpZCA9IC0xLFxuICAgIGRlY2tOYW1lOiBzdHJpbmcsXG4gICAgaW5pdGlhbENvbnRlbnQ6IHN0cmluZyxcbiAgICBmaWVsZHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgcmV2ZXJzZWQ6IGJvb2xlYW4sXG4gICAgaW5pdGlhbE9mZnNldDogbnVtYmVyLFxuICAgIGVuZE9mZnNldDogbnVtYmVyLFxuICAgIHRhZ3M6IHN0cmluZ1tdID0gW10sXG4gICAgaW5zZXJ0ZWQgPSBmYWxzZSxcbiAgICBtZWRpYU5hbWVzOiBzdHJpbmdbXSxcbiAgICBjb250YWluc0NvZGU6IGJvb2xlYW4sXG4gICAgLyoqIOiHquWumuS5ieaooeWei+WQje+8jOS8oOatpOWPguaVsOaXtuimhueblum7mOiupCBPYnNpZGlhbi1iYXNpYyAqL1xuICAgIGN1c3RvbU1vZGVsTmFtZT86IHN0cmluZ1xuICApIHtcbiAgICBzdXBlcihcbiAgICAgIGlkLFxuICAgICAgZGVja05hbWUsXG4gICAgICBpbml0aWFsQ29udGVudCxcbiAgICAgIGZpZWxkcyxcbiAgICAgIHJldmVyc2VkLFxuICAgICAgaW5pdGlhbE9mZnNldCxcbiAgICAgIGVuZE9mZnNldCxcbiAgICAgIHRhZ3MsXG4gICAgICBpbnNlcnRlZCxcbiAgICAgIG1lZGlhTmFtZXMsXG4gICAgICBjb250YWluc0NvZGVcbiAgICApO1xuICAgIGlmIChjdXN0b21Nb2RlbE5hbWUpIHtcbiAgICAgIHRoaXMubW9kZWxOYW1lID0gY3VzdG9tTW9kZWxOYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vZGVsTmFtZSA9IHRoaXMucmV2ZXJzZWRcbiAgICAgICAgPyBgT2JzaWRpYW4tYmFzaWMtcmV2ZXJzZWRgXG4gICAgICAgIDogYE9ic2lkaWFuLWJhc2ljYDtcbiAgICAgIGlmIChmaWVsZHNbXCJTb3VyY2VcIl0pIHtcbiAgICAgICAgdGhpcy5tb2RlbE5hbWUgKz0gc291cmNlRGVja0V4dGVuc2lvbjtcbiAgICAgIH1cbiAgICAgIGlmIChjb250YWluc0NvZGUpIHtcbiAgICAgICAgdGhpcy5tb2RlbE5hbWUgKz0gY29kZURlY2tFeHRlbnNpb247XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldENhcmQodXBkYXRlID0gZmFsc2UpOiBvYmplY3Qge1xuICAgIGNvbnN0IGNhcmQ6IGFueSA9IHtcbiAgICAgIGRlY2tOYW1lOiB0aGlzLmRlY2tOYW1lLFxuICAgICAgbW9kZWxOYW1lOiB0aGlzLm1vZGVsTmFtZSxcbiAgICAgIGZpZWxkczogdGhpcy5maWVsZHMsXG4gICAgICB0YWdzOiB0aGlzLnRhZ3MsXG4gICAgfTtcblxuICAgIGlmICh1cGRhdGUpIHtcbiAgICAgIGNhcmRbXCJpZFwiXSA9IHRoaXMuaWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhcmQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0TWVkaWFzKCk6IG9iamVjdFtdIHtcbiAgICBjb25zdCBtZWRpYXM6IG9iamVjdFtdID0gW107XG4gICAgdGhpcy5tZWRpYUJhc2U2NEVuY29kZWQuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgIG1lZGlhcy5wdXNoKHtcbiAgICAgICAgZmlsZW5hbWU6IHRoaXMubWVkaWFOYW1lc1tpbmRleF0sXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBtZWRpYXM7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcgPSAoKTogc3RyaW5nID0+IHtcbiAgICByZXR1cm4gYFE6ICR7dGhpcy5maWVsZHNbMF19XFxuQTogJHt0aGlzLmZpZWxkc1sxXX1gO1xuICB9O1xuXG4gIHB1YmxpYyBnZXRJZEZvcm1hdCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBcIl5cIiArIHRoaXMuaWQudG9TdHJpbmcoKSArIFwiXFxuXCI7XG4gIH1cbn1cbiJdfQ==