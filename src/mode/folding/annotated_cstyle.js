"use strict";

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var CStyleFoldMode = require("./cstyle").FoldMode;

var FoldMode = exports.FoldMode = function() {
    CStyleFoldMode.call(this, {
        start: "^\\s*(\\/\\*\\@)",
        end: "^[\\s\\*]*(\\@?\\*\\/)"
    });
    this.annotationStartRe = /^\s*\/\*@/;
    this.annotationStopRe = /^\s*@?\*\/\s*$/;
};
oop.inherits(FoldMode, CStyleFoldMode);

(function() {
    this.getCStyleFoldWidgetRange = this.getFoldWidgetRange;

    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);

        if (this.annotationStartRe.test(line))
            return this.getAnnotationFoldRangeFromStart(session, row, foldStyle, forceMultiline);

        if (foldStyle !== "markbegin" && this.annotationStopRe.test(line))
            return this.getAnnotationFoldRangeFromEnd(session, row);

        return this.getCStyleFoldWidgetRange(session, foldStyle, row, forceMultiline);
    };

    this.getAnnotationFoldRangeFromStart = function(session, row, foldStyle, forceMultiline) {
        var line = session.getLine(row);
        var startIndex = line.indexOf("/*@");
        if (startIndex === -1)
            return;

        var startColumn = startIndex + 3;
        var maxRow = session.getLength();

        for (var endRow = row; endRow < maxRow; endRow++) {
            var endLine = session.getLine(endRow);
            var searchFrom = endRow === row ? startColumn : 0;
            var closeIndex = endLine.indexOf("@*/", searchFrom);
            var plainCloseIndex = endLine.indexOf("*/", searchFrom);

            if (plainCloseIndex !== -1 && (closeIndex === -1 || plainCloseIndex < closeIndex))
                closeIndex = plainCloseIndex;

            if (closeIndex === -1)
                continue;

            var range = new Range(row, startColumn, endRow, closeIndex);
            if (!range.isMultiLine()) {
                if (forceMultiline && this.getSectionRange)
                    return this.getSectionRange(session, row);
                if (foldStyle != "all")
                    return null;
            }
            return range;
        }
    };

    this.getAnnotationFoldRangeFromEnd = function(session, row) {
        for (var startRow = row - 1; startRow >= 0; startRow--) {
            if (!this.annotationStartRe.test(session.getLine(startRow)))
                continue;

            var range = this.getAnnotationFoldRangeFromStart(session, startRow, "all", false);
            if (range && range.end.row === row)
                return range;
        }
    };
}).call(FoldMode.prototype);
