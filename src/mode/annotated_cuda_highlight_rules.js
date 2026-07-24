"use strict";

var oop = require("../lib/oop");
var deepCopy = require("../lib/deep_copy").deepCopy;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var getSpecBodyRules = require("./spec_highlight_rules").getSpecBodyRules;

var annotated_cudaHighlightRules = function() {
    var CUDAHighlightRules = require("./cuda_highlight_rules").cudaHighlightRules;

    var cudaRules = new CUDAHighlightRules().getRules();
    this.$rules = cudaRules;

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

    var specLineRules = deepCopy(cudaRules);
    this.embedRules(specLineRules, "spec-line-", [{
        token: "text",
        regex: /$/,
        next: "pop"
    }]);

    var specBlockRules = deepCopy(cudaRules);
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

oop.inherits(annotated_cudaHighlightRules, TextHighlightRules);

exports.annotated_cudaHighlightRules = annotated_cudaHighlightRules;
exports.HighlightRules = annotated_cudaHighlightRules;
