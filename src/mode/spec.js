"use strict";

var oop = require("../lib/oop");
var deepCopy = require("../lib/deep_copy").deepCopy;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var specTypeModifiers = (
    "pure|thread_local|bip_annotation|opaque|unique|" +
    "unique_pointer_field"
);

var specStatementKeywords = (
    "modifies|accessible|decreases|signals|" +
    "requires|ensures|context|context_everywhere|loop_invariant|" +
    "kernel_invariant|lock_invariant|" +
    "with|then|given|yields|reveal|" +
    "apply|fold|unfold|open|close|assert|assume|inhale|exhale|label|" +
    "extract|extract_body|frame|outline|refute|witness|ghost|send|recv|" +
    "transfer|csl_subject|spec_ignore|action|" +
    "atomic|commit"
);

var specSlashKeywords = (
    "replacing_done|replacing" +
    "unfolding|Unfolding|in|memberof|current_thread|forall|exists|" +
    "forperm|forpermwithvalue|let|sum|choose|choose_fresh|length|old|" +
    "asserting|assuming|typeof|type|matrix|array|pointer|pointer_index|" +
    "pointer_block|pointer_block_length|pointer_block_offset|" +
    "pointer_length|shared_mem_size|values|vcmp|vrep|msum|mcmp|mrep|result|" +
    "ltid|gtid|nd_index|nd_length|nd_partial_index|polarity_dependent|" +
    "smtlib|boogie|euclidean_div|euclidean_mod|pow|is_int|"
);

var specExpressionKeywords = (
    "Reducible|AddsTo|APerm|ArrayPerm|Contribution|held|committed|HPerm|" +
    "idle|perm|Perm|PointsTo|running|Some|Left|Right|Value|AutoValue|" +
    "false|true|" +
    "none|None|write|read|empty"
);

var specOperators = (
    "\\?\\.|\\\\|\\*\\*|==>|-\\*|\\.\\.|<-|:\\|{:|:}"
);

function createSpecBodyRules() {
    return [{
        token: "support.constant",
        regex: "\\b(?:" + specStatementKeywords + ")\\b"
    }, {
        token: "constant.language",
        regex: "\\b(?:" + specExpressionKeywords + ")\\b"
    }, {
        token: "storage.modifier",
        regex: "\\b(?:" + specTypeModifiers + ")\\b"
    }, {
        token: "keyword.other",
        regex: "\\\\forall\\*|\\\\(?:" + specSlashKeywords + ")\\b|∀\\*|∀|∃"
    }, {
        token: "keyword.operator",
        regex: specOperators
    }];
}

function createSpecRules() {
    return {
        "start": [
            {include: "specs"},
            {include: "spec-body"}
        ],
        "specs": [{
            token: "support.constant",
            regex: "\\/\\/@",
            push: [{
                token: "text",
                regex: /$/,
                next: "pop"
            }, {
                include: "spec-body"
            }]
        }, {
            token: "support.constant",
            regex: "\\/\\*@",
            push: [{
                token: "support.constant",
                regex: /@?\*\//,
                next: "pop"
            }, {
                include: "spec-body"
            }]
        }],
        "spec-body": createSpecBodyRules()
    };
}

var SpecHighlightRules = function() {
    this.$rules = createSpecRules();
    this.normalizeRules();
};

oop.inherits(SpecHighlightRules, TextHighlightRules);

exports.SpecHighlightRules = SpecHighlightRules;
exports.createSpecRules = createSpecRules;
exports.getSpecBodyRules = function() {
    return deepCopy(createSpecBodyRules());
};
