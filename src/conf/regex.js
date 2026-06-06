var Regex = /** @class */ (function () {
    function Regex(settings) {
        this.update(settings);
    }
    Regex.prototype.update = function (settings) {
        // https://regex101.com/r/BOieWh/1
        this.headingsRegex = /^ {0,3}(#{1,6}) +([^\n]+?) ?((?: *#\S+)*) *$/gim;
        // Supported images https://publish.obsidian.md/help/How+to/Embed+files
        this.wikiImageLinks =
            /!\[\[(.*\.(?:png|jpg|jpeg|gif|bmp|svg|tiff)).*?\]\]/gim;
        this.markdownImageLinks =
            /!\[\]\((.*\.(?:png|jpg|jpeg|gif|bmp|svg|tiff)).*?\)/gim;
        this.wikiAudioLinks =
            /!\[\[(.*\.(?:mp3|webm|wav|m4a|ogg|3gp|flac)).*?\]\]/gim;
        // https://regex101.com/r/eqnJeW/1
        this.obsidianCodeBlock = /(?:```(?:.*?\n?)+?```)(?:\n|$)/gim;
        this.codeBlock = /<code\b[^>]*>(.*?)<\/code>/gims;
        this.mathBlock = /(\$\$)(.*?)(\$\$)/gis;
        this.mathInline = /(\$)(.*?)(\$)/gi;
        this.cardsDeckLine = /cards-deck: [\p{L}]+/giu;
        this.cardsToDelete = /^\s*(?:\n)(?:\^(\d{13}))(?:\n\s*?)?/gm;
        // https://regex101.com/r/WxuFI2/1
        this.globalTagsSplitter =
            /\[\[(.*?)\]\]|#([\p{L}\d:\-_/]+)|([\p{L}\d:\-_/]+)/gimu;
        this.tagHierarchy = /\//gm;
        // Cards
        var flags = "gimu";
        // https://regex101.com/r/p3yQwY/2
        var str = "( {0,3}[#]*)((?:[^\\n]\\n?)+?)(#" +
            settings.flashcardsTag +
            "(?:[/-]reverse)?)((?: *#[\\p{Number}\\p{Letter}\\-\\/_]+)*) *?\\n+((?:[^\\n]\\n?)*?(?=\\^\\d{13}|$))(?:\\^(\\d{13}))?";
        this.flashscardsWithTag = new RegExp(str, flags);
        // https://regex101.com/r/8wmOo8/1
        var sepLongest = settings.inlineSeparator.length >= settings.inlineSeparatorReverse.length ? settings.inlineSeparator : settings.inlineSeparatorReverse;
        var sepShortest = settings.inlineSeparator.length < settings.inlineSeparatorReverse.length ? settings.inlineSeparator : settings.inlineSeparatorReverse;
        // sepLongest is the longest between the inlineSeparator and the inlineSeparatorReverse because if the order is ::|::: then always the first will be matched
        // sepShortest is the shortest
        if (settings.inlineID) {
            str =
                "( {0,3}[#]{0,6})?(?:(?:[\\t ]*)(?:\\d.|[-+*]|#{1,6}))?(.+?) ?(" + sepLongest + "|" + sepShortest + ") ?(.+?)((?: *#[\\p{Letter}\\-\\/_]+)+)?(?:\\s+\\^(\\d{13})|$)";
        }
        else {
            str =
                "( {0,3}[#]{0,6})?(?:(?:[\\t ]*)(?:\\d.|[-+*]|#{1,6}))?(.+?) ?(" + sepLongest + "|" + sepShortest + ") ?(.+?)((?: *#[\\p{Letter}\\-\\/_]+)+|$)(?:\\n\\^(\\d{13}))?";
        }
        this.cardsInlineStyle = new RegExp(str, flags);
        // https://regex101.com/r/HOXF5E/1
        str =
            "( {0,3}[#]*)((?:[^\\n]\\n?)+?)(#" +
                settings.flashcardsTag +
                "[/-]spaced)((?: *#[\\p{Letter}-]+)*) *\\n?(?:\\^(\\d{13}))?";
        this.cardsSpacedStyle = new RegExp(str, flags);
        // https://regex101.com/r/cgtnLf/1
        str = "( {0,3}[#]{0,6})?(?:(?:[\\t ]*)(?:\\d.|[-+*]|#{1,6}))?(.*?(==.+?==|\\{.+?\\}).*?)((?: *#[\\w\\-\\/_]+)+|$)(?:\n\\^(\\d{13}))?";
        this.cardsClozeWholeLine = new RegExp(str, flags);
        this.singleClozeCurly = /((?:{)(?:(\d):?)?(.+?)(?:}))/g;
        this.singleClozeHighlight = /((?:==)(.+?)(?:==))/g;
        // Matches any embedded block but the one with an used extension from the wikilinks
        this.embedBlock = /!\[\[(.*?)(?<!\.(?:png|jpg|jpeg|gif|bmp|svg|tiff|mp3|webm|wav|m4a|ogg|3gp|flac))\]\]/g;
    };
    return Regex;
}());
export { Regex };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWdleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtJQXdCRSxlQUFZLFFBQW1CO1FBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVNLHNCQUFNLEdBQWIsVUFBYyxRQUFtQjtRQUMvQixrQ0FBa0M7UUFDbEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxpREFBaUQsQ0FBQztRQUV2RSx1RUFBdUU7UUFDdkUsSUFBSSxDQUFDLGNBQWM7WUFDakIsd0RBQXdELENBQUM7UUFDM0QsSUFBSSxDQUFDLGtCQUFrQjtZQUNyQix3REFBd0QsQ0FBQztRQUUzRCxJQUFJLENBQUMsY0FBYztZQUNqQix3REFBd0QsQ0FBQztRQUUzRCxrQ0FBa0M7UUFDbEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLG1DQUFtQyxDQUFDO1FBRTdELElBQUksQ0FBQyxTQUFTLEdBQUcsZ0NBQWdDLENBQUM7UUFFbEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxzQkFBc0IsQ0FBQztRQUN4QyxJQUFJLENBQUMsVUFBVSxHQUFHLGlCQUFpQixDQUFDO1FBRXBDLElBQUksQ0FBQyxhQUFhLEdBQUcseUJBQXlCLENBQUM7UUFDL0MsSUFBSSxDQUFDLGFBQWEsR0FBRyx1Q0FBdUMsQ0FBQztRQUU3RCxrQ0FBa0M7UUFDbEMsSUFBSSxDQUFDLGtCQUFrQjtZQUNyQix3REFBd0QsQ0FBQztRQUMzRCxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztRQUUzQixRQUFRO1FBQ1IsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLGtDQUFrQztRQUNsQyxJQUFJLEdBQUcsR0FDTCxrQ0FBa0M7WUFDbEMsUUFBUSxDQUFDLGFBQWE7WUFDdEIsdUhBQXVILENBQUM7UUFDMUgsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVqRCxrQ0FBa0M7UUFDbEMsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDO1FBQzFKLElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQztRQUMxSiw0SkFBNEo7UUFDNUosOEJBQThCO1FBQzlCLElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUNyQixHQUFHO2dCQUNELGdFQUFnRSxHQUFHLFVBQVUsR0FBRyxHQUFHLEdBQUcsV0FBVyxHQUFHLGdFQUFnRSxDQUFDO1NBQ3hLO2FBQU07WUFDTCxHQUFHO2dCQUNELGdFQUFnRSxHQUFHLFVBQVUsR0FBRyxHQUFHLEdBQUcsV0FBVyxHQUFHLCtEQUErRCxDQUFDO1NBQ3ZLO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUvQyxrQ0FBa0M7UUFDbEMsR0FBRztZQUNELGtDQUFrQztnQkFDbEMsUUFBUSxDQUFDLGFBQWE7Z0JBQ3RCLDZEQUE2RCxDQUFDO1FBQ2hFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFL0Msa0NBQWtDO1FBRWxDLEdBQUcsR0FBRywrSEFBK0gsQ0FBQTtRQUNySSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWxELElBQUksQ0FBQyxnQkFBZ0IsR0FBRywrQkFBK0IsQ0FBQztRQUN4RCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsc0JBQXNCLENBQUM7UUFFbkQsbUZBQW1GO1FBQ25GLElBQUksQ0FBQyxVQUFVLEdBQUcsdUZBQXVGLENBQUM7SUFDNUcsQ0FBQztJQUNILFlBQUM7QUFBRCxDQUFDLEFBbEdELElBa0dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVNldHRpbmdzIH0gZnJvbSBcInNyYy9jb25mL3NldHRpbmdzXCI7XG5cbmV4cG9ydCBjbGFzcyBSZWdleCB7XG4gIGhlYWRpbmdzUmVnZXg6IFJlZ0V4cDtcbiAgd2lraUltYWdlTGlua3M6IFJlZ0V4cDtcbiAgbWFya2Rvd25JbWFnZUxpbmtzOiBSZWdFeHA7XG4gIHdpa2lBdWRpb0xpbmtzOiBSZWdFeHA7XG4gIG9ic2lkaWFuQ29kZUJsb2NrOiBSZWdFeHA7IC8vIGBgYGNvZGUgYmxvY2tgYFxuICBjb2RlQmxvY2s6IFJlZ0V4cDtcbiAgbWF0aEJsb2NrOiBSZWdFeHA7IC8vICQkIGxhdGV4ICQkXG4gIG1hdGhJbmxpbmU6IFJlZ0V4cDsgLy8gJCBsYXRleCAkXG4gIGNhcmRzRGVja0xpbmU6IFJlZ0V4cDtcbiAgY2FyZHNUb0RlbGV0ZTogUmVnRXhwO1xuICBnbG9iYWxUYWdzU3BsaXR0ZXI6IFJlZ0V4cDtcbiAgdGFnSGllcmFyY2h5OiBSZWdFeHA7XG5cbiAgZmxhc2hzY2FyZHNXaXRoVGFnOiBSZWdFeHA7XG4gIGNhcmRzSW5saW5lU3R5bGU6IFJlZ0V4cDtcbiAgY2FyZHNTcGFjZWRTdHlsZTogUmVnRXhwO1xuICBjYXJkc0Nsb3plV2hvbGVMaW5lOiBSZWdFeHA7XG4gIHNpbmdsZUNsb3plQ3VybHk6IFJlZ0V4cDtcbiAgc2luZ2xlQ2xvemVIaWdobGlnaHQ6IFJlZ0V4cDtcbiAgY2xvemVIaWdobGlnaHQ6IFJlZ0V4cDtcblxuICBlbWJlZEJsb2NrOiBSZWdFeHA7XG5cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IElTZXR0aW5ncykge1xuICAgIHRoaXMudXBkYXRlKHNldHRpbmdzKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGUoc2V0dGluZ3M6IElTZXR0aW5ncykge1xuICAgIC8vIGh0dHBzOi8vcmVnZXgxMDEuY29tL3IvQk9pZVdoLzFcbiAgICB0aGlzLmhlYWRpbmdzUmVnZXggPSAvXiB7MCwzfSgjezEsNn0pICsoW15cXG5dKz8pID8oKD86ICojXFxTKykqKSAqJC9naW07XG5cbiAgICAvLyBTdXBwb3J0ZWQgaW1hZ2VzIGh0dHBzOi8vcHVibGlzaC5vYnNpZGlhbi5tZC9oZWxwL0hvdyt0by9FbWJlZCtmaWxlc1xuICAgIHRoaXMud2lraUltYWdlTGlua3MgPVxuICAgICAgLyFcXFtcXFsoLipcXC4oPzpwbmd8anBnfGpwZWd8Z2lmfGJtcHxzdmd8dGlmZikpLio/XFxdXFxdL2dpbTtcbiAgICB0aGlzLm1hcmtkb3duSW1hZ2VMaW5rcyA9XG4gICAgICAvIVxcW1xcXVxcKCguKlxcLig/OnBuZ3xqcGd8anBlZ3xnaWZ8Ym1wfHN2Z3x0aWZmKSkuKj9cXCkvZ2ltO1xuXG4gICAgdGhpcy53aWtpQXVkaW9MaW5rcyA9XG4gICAgICAvIVxcW1xcWyguKlxcLig/Om1wM3x3ZWJtfHdhdnxtNGF8b2dnfDNncHxmbGFjKSkuKj9cXF1cXF0vZ2ltO1xuXG4gICAgLy8gaHR0cHM6Ly9yZWdleDEwMS5jb20vci9lcW5KZVcvMVxuICAgIHRoaXMub2JzaWRpYW5Db2RlQmxvY2sgPSAvKD86YGBgKD86Lio/XFxuPykrP2BgYCkoPzpcXG58JCkvZ2ltO1xuXG4gICAgdGhpcy5jb2RlQmxvY2sgPSAvPGNvZGVcXGJbXj5dKj4oLio/KTxcXC9jb2RlPi9naW1zO1xuXG4gICAgdGhpcy5tYXRoQmxvY2sgPSAvKFxcJFxcJCkoLio/KShcXCRcXCQpL2dpcztcbiAgICB0aGlzLm1hdGhJbmxpbmUgPSAvKFxcJCkoLio/KShcXCQpL2dpO1xuXG4gICAgdGhpcy5jYXJkc0RlY2tMaW5lID0gL2NhcmRzLWRlY2s6IFtcXHB7TH1dKy9naXU7XG4gICAgdGhpcy5jYXJkc1RvRGVsZXRlID0gL15cXHMqKD86XFxuKSg/OlxcXihcXGR7MTN9KSkoPzpcXG5cXHMqPyk/L2dtO1xuXG4gICAgLy8gaHR0cHM6Ly9yZWdleDEwMS5jb20vci9XeHVGSTIvMVxuICAgIHRoaXMuZ2xvYmFsVGFnc1NwbGl0dGVyID1cbiAgICAgIC9cXFtcXFsoLio/KVxcXVxcXXwjKFtcXHB7TH1cXGQ6XFwtXy9dKyl8KFtcXHB7TH1cXGQ6XFwtXy9dKykvZ2ltdTtcbiAgICB0aGlzLnRhZ0hpZXJhcmNoeSA9IC9cXC8vZ207XG5cbiAgICAvLyBDYXJkc1xuICAgIGNvbnN0IGZsYWdzID0gXCJnaW11XCI7XG4gICAgLy8gaHR0cHM6Ly9yZWdleDEwMS5jb20vci9wM3lRd1kvMlxuICAgIGxldCBzdHIgPVxuICAgICAgXCIoIHswLDN9WyNdKikoKD86W15cXFxcbl1cXFxcbj8pKz8pKCNcIiArXG4gICAgICBzZXR0aW5ncy5mbGFzaGNhcmRzVGFnICtcbiAgICAgIFwiKD86Wy8tXXJldmVyc2UpPykoKD86ICojW1xcXFxwe051bWJlcn1cXFxccHtMZXR0ZXJ9XFxcXC1cXFxcL19dKykqKSAqP1xcXFxuKygoPzpbXlxcXFxuXVxcXFxuPykqPyg/PVxcXFxeXFxcXGR7MTN9fCQpKSg/OlxcXFxeKFxcXFxkezEzfSkpP1wiO1xuICAgIHRoaXMuZmxhc2hzY2FyZHNXaXRoVGFnID0gbmV3IFJlZ0V4cChzdHIsIGZsYWdzKTtcblxuICAgIC8vIGh0dHBzOi8vcmVnZXgxMDEuY29tL3IvOHdtT284LzFcbiAgICBjb25zdCBzZXBMb25nZXN0ID0gc2V0dGluZ3MuaW5saW5lU2VwYXJhdG9yLmxlbmd0aCA+PSBzZXR0aW5ncy5pbmxpbmVTZXBhcmF0b3JSZXZlcnNlLmxlbmd0aCA/IHNldHRpbmdzLmlubGluZVNlcGFyYXRvciA6IHNldHRpbmdzLmlubGluZVNlcGFyYXRvclJldmVyc2U7XG4gICAgY29uc3Qgc2VwU2hvcnRlc3QgPSBzZXR0aW5ncy5pbmxpbmVTZXBhcmF0b3IubGVuZ3RoIDwgc2V0dGluZ3MuaW5saW5lU2VwYXJhdG9yUmV2ZXJzZS5sZW5ndGggPyBzZXR0aW5ncy5pbmxpbmVTZXBhcmF0b3IgOiBzZXR0aW5ncy5pbmxpbmVTZXBhcmF0b3JSZXZlcnNlO1xuICAgIC8vIHNlcExvbmdlc3QgaXMgdGhlIGxvbmdlc3QgYmV0d2VlbiB0aGUgaW5saW5lU2VwYXJhdG9yIGFuZCB0aGUgaW5saW5lU2VwYXJhdG9yUmV2ZXJzZSBiZWNhdXNlIGlmIHRoZSBvcmRlciBpcyA6Onw6OjogdGhlbiBhbHdheXMgdGhlIGZpcnN0IHdpbGwgYmUgbWF0Y2hlZFxuICAgIC8vIHNlcFNob3J0ZXN0IGlzIHRoZSBzaG9ydGVzdFxuICAgIGlmIChzZXR0aW5ncy5pbmxpbmVJRCkge1xuICAgICAgc3RyID1cbiAgICAgICAgXCIoIHswLDN9WyNdezAsNn0pPyg/Oig/OltcXFxcdCBdKikoPzpcXFxcZC58Wy0rKl18I3sxLDZ9KSk/KC4rPykgPyhcIiArIHNlcExvbmdlc3QgKyBcInxcIiArIHNlcFNob3J0ZXN0ICsgXCIpID8oLis/KSgoPzogKiNbXFxcXHB7TGV0dGVyfVxcXFwtXFxcXC9fXSspKyk/KD86XFxcXHMrXFxcXF4oXFxcXGR7MTN9KXwkKVwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPVxuICAgICAgICBcIiggezAsM31bI117MCw2fSk/KD86KD86W1xcXFx0IF0qKSg/OlxcXFxkLnxbLSsqXXwjezEsNn0pKT8oLis/KSA/KFwiICsgc2VwTG9uZ2VzdCArIFwifFwiICsgc2VwU2hvcnRlc3QgKyBcIikgPyguKz8pKCg/OiAqI1tcXFxccHtMZXR0ZXJ9XFxcXC1cXFxcL19dKykrfCQpKD86XFxcXG5cXFxcXihcXFxcZHsxM30pKT9cIjtcbiAgICB9XG4gICAgdGhpcy5jYXJkc0lubGluZVN0eWxlID0gbmV3IFJlZ0V4cChzdHIsIGZsYWdzKTtcblxuICAgIC8vIGh0dHBzOi8vcmVnZXgxMDEuY29tL3IvSE9YRjVFLzFcbiAgICBzdHIgPVxuICAgICAgXCIoIHswLDN9WyNdKikoKD86W15cXFxcbl1cXFxcbj8pKz8pKCNcIiArXG4gICAgICBzZXR0aW5ncy5mbGFzaGNhcmRzVGFnICtcbiAgICAgIFwiWy8tXXNwYWNlZCkoKD86ICojW1xcXFxwe0xldHRlcn0tXSspKikgKlxcXFxuPyg/OlxcXFxeKFxcXFxkezEzfSkpP1wiO1xuICAgIHRoaXMuY2FyZHNTcGFjZWRTdHlsZSA9IG5ldyBSZWdFeHAoc3RyLCBmbGFncyk7XG5cbiAgICAvLyBodHRwczovL3JlZ2V4MTAxLmNvbS9yL2NndG5MZi8xXG5cbiAgICBzdHIgPSBcIiggezAsM31bI117MCw2fSk/KD86KD86W1xcXFx0IF0qKSg/OlxcXFxkLnxbLSsqXXwjezEsNn0pKT8oLio/KD09Lis/PT18XFxcXHsuKz9cXFxcfSkuKj8pKCg/OiAqI1tcXFxcd1xcXFwtXFxcXC9fXSspK3wkKSg/OlxcblxcXFxeKFxcXFxkezEzfSkpP1wiXG4gICAgdGhpcy5jYXJkc0Nsb3plV2hvbGVMaW5lID0gbmV3IFJlZ0V4cChzdHIsIGZsYWdzKTtcbiAgICBcbiAgICB0aGlzLnNpbmdsZUNsb3plQ3VybHkgPSAvKCg/OnspKD86KFxcZCk6Pyk/KC4rPykoPzp9KSkvZztcbiAgICB0aGlzLnNpbmdsZUNsb3plSGlnaGxpZ2h0ID0gLygoPzo9PSkoLis/KSg/Oj09KSkvZztcblxuICAgIC8vIE1hdGNoZXMgYW55IGVtYmVkZGVkIGJsb2NrIGJ1dCB0aGUgb25lIHdpdGggYW4gdXNlZCBleHRlbnNpb24gZnJvbSB0aGUgd2lraWxpbmtzXG4gICAgdGhpcy5lbWJlZEJsb2NrID0gLyFcXFtcXFsoLio/KSg/PCFcXC4oPzpwbmd8anBnfGpwZWd8Z2lmfGJtcHxzdmd8dGlmZnxtcDN8d2VibXx3YXZ8bTRhfG9nZ3wzZ3B8ZmxhYykpXFxdXFxdL2c7XG4gIH1cbn1cbiJdfQ==