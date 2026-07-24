"use strict";

var oop = require("../lib/oop");
var deepCopy = require("../lib/deep_copy").deepCopy;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var getSpecBodyRules = require("./spec_highlight_rules").getSpecBodyRules;



var annotated_cHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used
    var CHighlightRules = require("./c_cpp_highlight_rules").c_cppHighlightRules;
    
    var CRules = new CHighlightRules().getRules();

    this.$rules = CRules;

    var specBodyRules = getSpecBodyRules();

    this.$rules["start"].unshift({
        token: "support.constant",
        regex: "//@",
        push: "spec-line-start"
    }, {
        token: "support.constant",
        regex: "/\\*@",
        push: "spec-block-start"
    });

    var specLineRules = deepCopy(CRules);
    this.embedRules(specLineRules, "spec-line-", [{
        token: "text",
        regex: /$/,
        next: "pop"
    }]);

    var specBlockRules = deepCopy(CRules);
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

// annotated_cHighlightRules.metaData = 


oop.inherits(annotated_cHighlightRules, TextHighlightRules);

exports.annotated_cHighlightRules = annotated_cHighlightRules;
exports.HighlightRules = annotated_cHighlightRules;