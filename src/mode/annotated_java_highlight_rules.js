"use strict";

var oop = require("../lib/oop");
var deepCopy = require("../lib/deep_copy").deepCopy;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var getSpecBodyRules = require("./spec_highlight_rules").getSpecBodyRules;

var annotated_javaHighlightRules = function() {
    var JavaHighlightRules = require("./java_highlight_rules").JavaHighlightRules;

    var javaRules = new JavaHighlightRules().getRules();
    this.$rules = javaRules;

    var specBodyRules = getSpecBodyRules();

    this.$rules.start.unshift({
        token: "support.constant",
        regex: "//@",
        push: "spec-line-start"
    }, {
        token: "support.constant",
        regex: "/\\*@",
        push: "spec-block-start"
    });

    var specLineRules = deepCopy(javaRules);
    this.embedRules(specLineRules, "spec-line-", [{
        token: "text",
        regex: /$/,
        next: "pop"
    }]);

    var specBlockRules = deepCopy(javaRules);
    this.embedRules(specBlockRules, "spec-block-");

    this.$rules["spec-block-start"].unshift({
        token: "support.constant",
        regex: "\\s*@?\\*\\/",
        next: "pop"
    });

    this.$rules["spec-line-start"] = [this.$rules["spec-line-start"][0]].concat(
        specBodyRules,
        this.$rules["spec-line-start"].slice(1)
    );
    this.$rules["spec-block-start"] = [this.$rules["spec-block-start"][0]].concat(
        specBodyRules,
        this.$rules["spec-block-start"].slice(1)
    );

    this.normalizeRules();
};

oop.inherits(annotated_javaHighlightRules, TextHighlightRules);

exports.annotated_javaHighlightRules = annotated_javaHighlightRules;
exports.HighlightRules = annotated_javaHighlightRules;
