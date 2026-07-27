"use strict";

var oop = require("../lib/oop");
var JavaScriptMode = require("./javascript").Mode;
var HighlightRules = require("./annotated_java_highlight_rules").annotated_javaHighlightRules;
var JavaFoldMode = require("./folding/annotated_java").FoldMode;

var Mode = function() {
    JavaScriptMode.call(this);
    this.HighlightRules = HighlightRules;
    this.foldingRules = new JavaFoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, JavaScriptMode);

(function() {
    this.lineCommentStart = "//";
    this.blockComment = {start: "/*", end: "*/"};

    this.createWorker = function(session) {
        return null;
    };

    this.$id = "ace/mode/annotated_java";
    this.snippetFileId = "ace/snippets/java";
}).call(Mode.prototype);

exports.Mode = Mode;
