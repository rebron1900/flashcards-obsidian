// const sum = require('./sum');
import * as fs from 'fs';
import * as path from 'path';
describe("Parse single flashcard in one file, default deck", function () {
    test("Flashcard with tag on the line of the question", function () {
        // Read file from test directory
        var file = fs.readFileSync(path.join(__dirname, 'obsidian_vault', 'test_flashcard_1.md'), 'utf8');
        // print file
        console.log(file);
        // test that 2 == 1 +1
        expect(2).toBe(1 + 1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdW0udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxnQ0FBZ0M7QUFDaEMsT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFDekIsT0FBTyxLQUFLLElBQUksTUFBTSxNQUFNLENBQUM7QUFHN0IsUUFBUSxDQUFDLGtEQUFrRCxFQUFFO0lBQ3pELElBQUksQ0FBQyxnREFBZ0QsRUFBRTtRQUNuRCxnQ0FBZ0M7UUFDaEMsSUFBTSxJQUFJLEdBQVcsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxxQkFBcUIsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVHLGFBQWE7UUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLHNCQUFzQjtRQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gY29uc3Qgc3VtID0gcmVxdWlyZSgnLi9zdW0nKTtcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cblxuZGVzY3JpYmUoXCJQYXJzZSBzaW5nbGUgZmxhc2hjYXJkIGluIG9uZSBmaWxlLCBkZWZhdWx0IGRlY2tcIiwgKCkgPT4ge1xuICAgIHRlc3QoXCJGbGFzaGNhcmQgd2l0aCB0YWcgb24gdGhlIGxpbmUgb2YgdGhlIHF1ZXN0aW9uXCIsICgpID0+IHtcbiAgICAgICAgLy8gUmVhZCBmaWxlIGZyb20gdGVzdCBkaXJlY3RvcnlcbiAgICAgICAgY29uc3QgZmlsZTogc3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsICdvYnNpZGlhbl92YXVsdCcsICd0ZXN0X2ZsYXNoY2FyZF8xLm1kJyksICd1dGY4Jyk7XG4gICAgICAgIC8vIHByaW50IGZpbGVcbiAgICAgICAgY29uc29sZS5sb2coZmlsZSk7XG4gICAgICAgIC8vIHRlc3QgdGhhdCAyID09IDEgKzFcbiAgICAgICAgZXhwZWN0KDIpLnRvQmUoMSArIDEpO1xuICAgIH0pO1xufSk7XG4iXX0=