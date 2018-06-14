'use strict';

function activate(context) {
    context.subscriptions.push(vscode.commands.registerTextEditorCommand("sort-selection-concentrically.sortSelectionConcentrically", function (editor, edit, args) {
        try {
            var { morph = null, case_sensitive = false } = args || {};
            run(editor, edit, getMorph(morph, case_sensitive));
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }));
}

function getMorph(morph, caseSensitive) {
    var morphFunction = morph && compileMorph(morph) || (function (s) { return s; });

    return caseSensitive ? morphFunction : function (s) { return morphFunction(s.toLowerCase()); };
}

function compileMorph(morph) {
    try {
        return eval("s => " + morph);
    }
    catch (e) {
        return null;
    }
}

function run(editor, edit, morph) {
    var selections = unique(sort(editor.selections.map(function (selection) { return getSelectionData(editor.document, selection, morph); })));
    var texts = sortTexts(selections);
    for (var i = selections.length - 1; i >= 0; --i)
        edit.replace(selections[i].line, texts[i]);
}

function getSelectionData(document, selection, morph) {
    var line = lineFromSelection(document, selection);
    return {
        selection: selection,
        comparisonText: morph(document.getText(selection)),
        line: line,
        lineText: document.getText(line),
    };
}

function lineFromSelection(document, selection) {
    var pos = selection.start;
    var lineStart = pos.with({ character: 0 });
    var lineEnd = document.lineAt(pos).range.end;
    return new vscode.Range(lineStart, lineEnd);
}

function sort(selections) {
    return selections
        .slice() // clone
        .sort(function (a, b) {
        var aStart = a.line.start;
        var bStart = b.line.start;
        return aStart.compareTo(bStart);
    });
}

function unique(selections) {
    var unique = [];
    var prev = null;
    for (var _i = 0, selections_1 = selections; _i < selections_1.length; _i++) {
        var selection = selections_1[_i];
        var current = selection.line.start;
        if (prev != null && current.isEqual(prev))
            continue;
        unique.push(selection);
        prev = current;
    }
    return unique;
}

function sortTexts(selections) {
    var sortOrder = [];

    return selections
        .slice() // clone
        .sort(function (a, b) { return sortOrder.indexOf(a.comparisonText) - sortOrder.indexOf(b.comparisonText); })
        .map(function (selection) { return selection.lineText; });
}
