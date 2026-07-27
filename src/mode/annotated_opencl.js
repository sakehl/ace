"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var HighlightRules = require("./annotated_opencl_highlight_rules").annotated_openclHighlightRules;
var FoldMode = require("./folding/annotated_cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = HighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "//";
    this.blockComment = {start: "/*", end: "*/"};
    this.$id = "ace/mode/annotated_opencl";
}).call(Mode.prototype);

exports.Mode = Mode;
