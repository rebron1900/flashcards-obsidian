import { __values } from "tslib";
import { codeDeckExtension } from "src/conf/constants";
import { arraysEqual } from "src/utils";
var Card = /** @class */ (function () {
    function Card(id, deckName, initialContent, fields, reversed, initialOffset, endOffset, tags, inserted, mediaNames, containsCode) {
        if (containsCode === void 0) { containsCode = false; }
        this.id = id;
        this.deckName = deckName;
        this.initialContent = initialContent;
        this.fields = fields;
        this.reversed = reversed;
        this.initialOffset = initialOffset;
        this.endOffset = endOffset;
        this.tags = tags;
        this.inserted = inserted;
        this.mediaNames = mediaNames;
        this.mediaBase64Encoded = [];
        this.oldTags = [];
        this.containsCode = containsCode;
        this.modelName = "";
    }
    Card.prototype.match = function (card) {
        // TODO not supported currently
        // if (this.modelName !== card.modelName) {
        //     return false
        // }
        var e_1, _a;
        var fields = Object.entries(card.fields);
        // This is the case of a switch from a model to another one. It cannot be handeled
        if (fields.length !== Object.entries(this.fields).length) {
            return true;
        }
        try {
            for (var fields_1 = __values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                var field = fields_1_1.value;
                var fieldName = field[0];
                if (fieldName === "Source") {
                    // For source field, compare the actual content but allow for block ID updates
                    var ankiSource = field[1].value;
                    var currentSource = this.fields[fieldName];
                    // If source support is enabled, we need to properly compare the source
                    if (currentSource && ankiSource) {
                        // Replace placeholder with actual ID for comparison if this card has an ID
                        var currentSourceForComparison = this.id !== -1
                            ? currentSource.replace("__BLOCK_ID__", String(this.id))
                            : currentSource;
                        // For comparison, we need to handle the case where the source format might have changed
                        // Strip the actual block IDs for comparison to focus on the file reference
                        var ankiSourceNormalized = ankiSource.replace(/#\^(\d{13})/, "");
                        var currentSourceNormalized = currentSourceForComparison.replace(/#\^(\d{13})/, "").replace("__BLOCK_ID__", "");
                        // If the normalized sources are different, the card needs updating
                        if (ankiSourceNormalized !== currentSourceNormalized) {
                            return false;
                        }
                    }
                    continue;
                }
                if (field[1].value !== this.fields[fieldName]) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (fields_1_1 && !fields_1_1.done && (_a = fields_1.return)) _a.call(fields_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return arraysEqual(card.tags, this.tags);
    };
    Card.prototype.extractFilenameFromSource = function (source) {
        // Extract filename from obsidian link format: [[filename]] or from URL
        var wikiMatch = source.match(/\[\[([^\]]+)\]\]/);
        if (wikiMatch) {
            return wikiMatch[1].replace("#^__BLOCK_ID__", "").replace(/#\^(\d{13})/, ""); // Remove block ID placeholders and actual IDs
        }
        // Extract from obsidian URL format
        var urlMatch = source.match(/file=([^#&]+)/);
        if (urlMatch) {
            return decodeURIComponent(urlMatch[1]).replace("#^__BLOCK_ID__", "").replace(/#\^(\d{13})/, "");
        }
        return source;
    };
    Card.prototype.getCodeDeckNameExtension = function () {
        return this.containsCode ? codeDeckExtension : "";
    };
    return Card;
}());
export { Card };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFeEM7SUFnQkUsY0FDRSxFQUFVLEVBQ1YsUUFBZ0IsRUFDaEIsY0FBc0IsRUFDdEIsTUFBOEIsRUFDOUIsUUFBaUIsRUFDakIsYUFBcUIsRUFDckIsU0FBaUIsRUFDakIsSUFBYyxFQUNkLFFBQWlCLEVBQ2pCLFVBQW9CLEVBQ3BCLFlBQW9CO1FBQXBCLDZCQUFBLEVBQUEsb0JBQW9CO1FBRXBCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDckMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBT0Qsb0JBQUssR0FBTCxVQUFNLElBQVM7UUFDYiwrQkFBK0I7UUFDL0IsMkNBQTJDO1FBQzNDLG1CQUFtQjtRQUNuQixJQUFJOztRQUVKLElBQU0sTUFBTSxHQUFRLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELGtGQUFrRjtRQUNsRixJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ3hELE9BQU8sSUFBSSxDQUFDO1NBQ2I7O1lBRUQsS0FBb0IsSUFBQSxXQUFBLFNBQUEsTUFBTSxDQUFBLDhCQUFBLGtEQUFFO2dCQUF2QixJQUFNLEtBQUssbUJBQUE7Z0JBQ2QsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLFNBQVMsS0FBSyxRQUFRLEVBQUU7b0JBQzFCLDhFQUE4RTtvQkFDOUUsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDbEMsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFFN0MsdUVBQXVFO29CQUN2RSxJQUFJLGFBQWEsSUFBSSxVQUFVLEVBQUU7d0JBQy9CLDJFQUEyRTt3QkFDM0UsSUFBTSwwQkFBMEIsR0FBRyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzs0QkFDL0MsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7NEJBQ3hELENBQUMsQ0FBQyxhQUFhLENBQUM7d0JBRWxCLHdGQUF3Rjt3QkFDeEYsMkVBQTJFO3dCQUMzRSxJQUFNLG9CQUFvQixHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUNuRSxJQUFNLHVCQUF1QixHQUFHLDBCQUEwQixDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFFbEgsbUVBQW1FO3dCQUNuRSxJQUFJLG9CQUFvQixLQUFLLHVCQUF1QixFQUFFOzRCQUNwRCxPQUFPLEtBQUssQ0FBQzt5QkFDZDtxQkFDRjtvQkFDRCxTQUFTO2lCQUNWO2dCQUNELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFO29CQUM3QyxPQUFPLEtBQUssQ0FBQztpQkFDZDthQUNGOzs7Ozs7Ozs7UUFFRCxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU8sd0NBQXlCLEdBQWpDLFVBQWtDLE1BQWM7UUFDOUMsdUVBQXVFO1FBQ3ZFLElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNuRCxJQUFJLFNBQVMsRUFBRTtZQUNiLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsOENBQThDO1NBQzdIO1FBRUQsbUNBQW1DO1FBQ25DLElBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0MsSUFBSSxRQUFRLEVBQUU7WUFDWixPQUFPLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ2pHO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELHVDQUF3QixHQUF4QjtRQUNFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNwRCxDQUFDO0lBQ0gsV0FBQztBQUFELENBQUMsQUFuSEQsSUFtSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb2RlRGVja0V4dGVuc2lvbiB9IGZyb20gXCJzcmMvY29uZi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGFycmF5c0VxdWFsIH0gZnJvbSBcInNyYy91dGlsc1wiO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2FyZCB7XG4gIGlkOiBudW1iZXI7XG4gIGRlY2tOYW1lOiBzdHJpbmc7XG4gIGluaXRpYWxDb250ZW50OiBzdHJpbmc7XG4gIGZpZWxkczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgcmV2ZXJzZWQ6IGJvb2xlYW47XG4gIGluaXRpYWxPZmZzZXQ6IG51bWJlcjtcbiAgZW5kT2Zmc2V0OiBudW1iZXI7XG4gIHRhZ3M6IHN0cmluZ1tdO1xuICBpbnNlcnRlZDogYm9vbGVhbjtcbiAgbWVkaWFOYW1lczogc3RyaW5nW107XG4gIG1lZGlhQmFzZTY0RW5jb2RlZDogc3RyaW5nW107XG4gIG9sZFRhZ3M6IHN0cmluZ1tdO1xuICBjb250YWluc0NvZGU6IGJvb2xlYW47XG4gIG1vZGVsTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGlkOiBudW1iZXIsXG4gICAgZGVja05hbWU6IHN0cmluZyxcbiAgICBpbml0aWFsQ29udGVudDogc3RyaW5nLFxuICAgIGZpZWxkczogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgICByZXZlcnNlZDogYm9vbGVhbixcbiAgICBpbml0aWFsT2Zmc2V0OiBudW1iZXIsXG4gICAgZW5kT2Zmc2V0OiBudW1iZXIsXG4gICAgdGFnczogc3RyaW5nW10sXG4gICAgaW5zZXJ0ZWQ6IGJvb2xlYW4sXG4gICAgbWVkaWFOYW1lczogc3RyaW5nW10sXG4gICAgY29udGFpbnNDb2RlID0gZmFsc2UsXG4gICkge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLmRlY2tOYW1lID0gZGVja05hbWU7XG4gICAgdGhpcy5pbml0aWFsQ29udGVudCA9IGluaXRpYWxDb250ZW50O1xuICAgIHRoaXMuZmllbGRzID0gZmllbGRzO1xuICAgIHRoaXMucmV2ZXJzZWQgPSByZXZlcnNlZDtcbiAgICB0aGlzLmluaXRpYWxPZmZzZXQgPSBpbml0aWFsT2Zmc2V0O1xuICAgIHRoaXMuZW5kT2Zmc2V0ID0gZW5kT2Zmc2V0O1xuICAgIHRoaXMudGFncyA9IHRhZ3M7XG4gICAgdGhpcy5pbnNlcnRlZCA9IGluc2VydGVkO1xuICAgIHRoaXMubWVkaWFOYW1lcyA9IG1lZGlhTmFtZXM7XG4gICAgdGhpcy5tZWRpYUJhc2U2NEVuY29kZWQgPSBbXTtcbiAgICB0aGlzLm9sZFRhZ3MgPSBbXTtcbiAgICB0aGlzLmNvbnRhaW5zQ29kZSA9IGNvbnRhaW5zQ29kZTtcbiAgICB0aGlzLm1vZGVsTmFtZSA9IFwiXCI7XG4gIH1cblxuICBhYnN0cmFjdCB0b1N0cmluZygpOiBzdHJpbmc7XG4gIGFic3RyYWN0IGdldENhcmQodXBkYXRlOiBib29sZWFuKTogb2JqZWN0O1xuICBhYnN0cmFjdCBnZXRNZWRpYXMoKTogb2JqZWN0W107XG4gIGFic3RyYWN0IGdldElkRm9ybWF0KCk6IHN0cmluZztcblxuICBtYXRjaChjYXJkOiBhbnkpOiBib29sZWFuIHtcbiAgICAvLyBUT0RPIG5vdCBzdXBwb3J0ZWQgY3VycmVudGx5XG4gICAgLy8gaWYgKHRoaXMubW9kZWxOYW1lICE9PSBjYXJkLm1vZGVsTmFtZSkge1xuICAgIC8vICAgICByZXR1cm4gZmFsc2VcbiAgICAvLyB9XG5cbiAgICBjb25zdCBmaWVsZHM6IGFueSA9IE9iamVjdC5lbnRyaWVzKGNhcmQuZmllbGRzKTtcbiAgICAvLyBUaGlzIGlzIHRoZSBjYXNlIG9mIGEgc3dpdGNoIGZyb20gYSBtb2RlbCB0byBhbm90aGVyIG9uZS4gSXQgY2Fubm90IGJlIGhhbmRlbGVkXG4gICAgaWYgKGZpZWxkcy5sZW5ndGggIT09IE9iamVjdC5lbnRyaWVzKHRoaXMuZmllbGRzKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgZmllbGQgb2YgZmllbGRzKSB7XG4gICAgICBjb25zdCBmaWVsZE5hbWUgPSBmaWVsZFswXTtcbiAgICAgIGlmIChmaWVsZE5hbWUgPT09IFwiU291cmNlXCIpIHtcbiAgICAgICAgLy8gRm9yIHNvdXJjZSBmaWVsZCwgY29tcGFyZSB0aGUgYWN0dWFsIGNvbnRlbnQgYnV0IGFsbG93IGZvciBibG9jayBJRCB1cGRhdGVzXG4gICAgICAgIGNvbnN0IGFua2lTb3VyY2UgPSBmaWVsZFsxXS52YWx1ZTtcbiAgICAgICAgY29uc3QgY3VycmVudFNvdXJjZSA9IHRoaXMuZmllbGRzW2ZpZWxkTmFtZV07XG4gICAgICAgIFxuICAgICAgICAvLyBJZiBzb3VyY2Ugc3VwcG9ydCBpcyBlbmFibGVkLCB3ZSBuZWVkIHRvIHByb3Blcmx5IGNvbXBhcmUgdGhlIHNvdXJjZVxuICAgICAgICBpZiAoY3VycmVudFNvdXJjZSAmJiBhbmtpU291cmNlKSB7XG4gICAgICAgICAgLy8gUmVwbGFjZSBwbGFjZWhvbGRlciB3aXRoIGFjdHVhbCBJRCBmb3IgY29tcGFyaXNvbiBpZiB0aGlzIGNhcmQgaGFzIGFuIElEXG4gICAgICAgICAgY29uc3QgY3VycmVudFNvdXJjZUZvckNvbXBhcmlzb24gPSB0aGlzLmlkICE9PSAtMSBcbiAgICAgICAgICAgID8gY3VycmVudFNvdXJjZS5yZXBsYWNlKFwiX19CTE9DS19JRF9fXCIsIFN0cmluZyh0aGlzLmlkKSlcbiAgICAgICAgICAgIDogY3VycmVudFNvdXJjZTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBGb3IgY29tcGFyaXNvbiwgd2UgbmVlZCB0byBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgdGhlIHNvdXJjZSBmb3JtYXQgbWlnaHQgaGF2ZSBjaGFuZ2VkXG4gICAgICAgICAgLy8gU3RyaXAgdGhlIGFjdHVhbCBibG9jayBJRHMgZm9yIGNvbXBhcmlzb24gdG8gZm9jdXMgb24gdGhlIGZpbGUgcmVmZXJlbmNlXG4gICAgICAgICAgY29uc3QgYW5raVNvdXJjZU5vcm1hbGl6ZWQgPSBhbmtpU291cmNlLnJlcGxhY2UoLyNcXF4oXFxkezEzfSkvLCBcIlwiKTtcbiAgICAgICAgICBjb25zdCBjdXJyZW50U291cmNlTm9ybWFsaXplZCA9IGN1cnJlbnRTb3VyY2VGb3JDb21wYXJpc29uLnJlcGxhY2UoLyNcXF4oXFxkezEzfSkvLCBcIlwiKS5yZXBsYWNlKFwiX19CTE9DS19JRF9fXCIsIFwiXCIpO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vIElmIHRoZSBub3JtYWxpemVkIHNvdXJjZXMgYXJlIGRpZmZlcmVudCwgdGhlIGNhcmQgbmVlZHMgdXBkYXRpbmdcbiAgICAgICAgICBpZiAoYW5raVNvdXJjZU5vcm1hbGl6ZWQgIT09IGN1cnJlbnRTb3VyY2VOb3JtYWxpemVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGZpZWxkWzFdLnZhbHVlICE9PSB0aGlzLmZpZWxkc1tmaWVsZE5hbWVdKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXlzRXF1YWwoY2FyZC50YWdzLCB0aGlzLnRhZ3MpO1xuICB9XG5cbiAgcHJpdmF0ZSBleHRyYWN0RmlsZW5hbWVGcm9tU291cmNlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBFeHRyYWN0IGZpbGVuYW1lIGZyb20gb2JzaWRpYW4gbGluayBmb3JtYXQ6IFtbZmlsZW5hbWVdXSBvciBmcm9tIFVSTFxuICAgIGNvbnN0IHdpa2lNYXRjaCA9IHNvdXJjZS5tYXRjaCgvXFxbXFxbKFteXFxdXSspXFxdXFxdLyk7XG4gICAgaWYgKHdpa2lNYXRjaCkge1xuICAgICAgcmV0dXJuIHdpa2lNYXRjaFsxXS5yZXBsYWNlKFwiI15fX0JMT0NLX0lEX19cIiwgXCJcIikucmVwbGFjZSgvI1xcXihcXGR7MTN9KS8sIFwiXCIpOyAvLyBSZW1vdmUgYmxvY2sgSUQgcGxhY2Vob2xkZXJzIGFuZCBhY3R1YWwgSURzXG4gICAgfVxuICAgIFxuICAgIC8vIEV4dHJhY3QgZnJvbSBvYnNpZGlhbiBVUkwgZm9ybWF0XG4gICAgY29uc3QgdXJsTWF0Y2ggPSBzb3VyY2UubWF0Y2goL2ZpbGU9KFteIyZdKykvKTtcbiAgICBpZiAodXJsTWF0Y2gpIHtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQodXJsTWF0Y2hbMV0pLnJlcGxhY2UoXCIjXl9fQkxPQ0tfSURfX1wiLCBcIlwiKS5yZXBsYWNlKC8jXFxeKFxcZHsxM30pLywgXCJcIik7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBnZXRDb2RlRGVja05hbWVFeHRlbnNpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGFpbnNDb2RlID8gY29kZURlY2tFeHRlbnNpb24gOiBcIlwiO1xuICB9XG59XG4iXX0=