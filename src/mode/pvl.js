"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var PVLHighlightRules = require("./pvl_highlight_rules").PVLHighlightRules;
var FoldMode = require("./folding/annotated_cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = PVLHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
  this.lineCommentStart = "//";
  this.blockComment = {start: "/*", end: "*/"};
    this.$id = "ace/mode/pvl";
}).call(Mode.prototype);

exports.Mode = Mode;