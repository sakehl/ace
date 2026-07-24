"use strict";

var oop = require("../lib/oop");
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var PVLHighlightRules = function() {
    var identifierRe = "[a-zA-Z_$][a-zA-Z0-9_$]*";

    var keywords = (
        "class|kernel|global|local|static|thread_local|inline|" +
        "in|id|new|unfolding|return|lock|unlock|wait|notify|" +
        "fork|join|if|else|barrier|par|and|vec|while|for|goto|void|atomic|invariant"
    );

    var specTypeKeywords = ("int|boolean|resource|process|frac|zfrac|bool|ref|" +
        "rational|seq|set|vector|bag|pointer|map|option|either|tuple|type|" +
        "any|nothing|string" +
        "axiom|model|adt|prover_type|prover_function"
        );
        
    var specTypeModifiers = ("pure|thread_local|bip_annotation|opaque|unique|" +
        "unique_pointer_field");

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
    )
    
    var specOperators = (
        "\\?\\.|\\\\|\\*\\*|==>|-\\*|\\.\\.|<-|:\\|"
    );

    var specKeywords = (
        specTypeKeywords + "|" + specStatementKeywords + "|" 
        // +
        // "null|exists|Perm|HPerm|empty|write|false|true|Future|" +
        // "AbstractState|to|from|PointsTo|Value|read|write"
    );

    var builtinConstants = "true|false|null|this";

    var keywordMapper = this.createKeywordMapper({
        "variable.language": "this",
        "constant.language": builtinConstants,
        "storage.type": specTypeKeywords
    }, "identifier");

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used
    this.$rules = {
        "start": [
            {include: "specs"},
            {include: "spec-body"},
            {include: "comments"},
            {include: "strings"},
            {include: "constants"},
            {include: "statements"}
        ],
        "comments": [
            {
                token: "comment",
                regex: "\\/\\/(?!@).*$"
            },
            {
                token: "comment.doc",
                regex: /\/\*\*(?![\/@])/,
                push: "doc-start"
            },
            {
                token: "comment",
                regex: "\\/\\*(?!@)",
                push: [
                    {
                        token: "comment",
                        regex: "\\*\\/",
                        next: "pop"
                    }, {
                        defaultToken: "comment"
                    }
                ]
            }
        ],
        "specs": [
            {
                token: "meta.annotation.spec",
                regex: "\\/\\/@",
                push: [
                    {
                        token: "text",
                        regex: /$/,
                        next: "pop"
                    },
                    {include: "spec-body"},
                    {include: "comments"},
                    {include: "strings"},
                    {include: "constants"},
                    {include: "statements"}
                ]
            }, {
                token: "meta.annotation.spec",
                regex: "\\/\\*@",
                push: [
                    {
                        token: "meta.annotation.spec",
                        regex: /@?\*\//,
                        next: "pop"
                    },
                    {include: "spec-body"},
                    {include: "comments"},
                    {include: "strings"},
                    {include: "constants"},
                    {include: "statements"}
                ]
            }
        ],
        "spec-body": [
            {
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
                regex: "\\\\(?:" + specSlashKeywords + ")\\b"
            }, {
                token: "keyword.operator",
                regex: specOperators
            }
        ],
        "strings": [
            {
                token: "string",
                regex: '"(?:(?:\\\\.)|(?:[^"\\\\]))*?"'
            }, {
                token: "string",
                regex: "'(?:\\\\.|[^'\\\\])*?'"
            }
        ],
        "constants": [
            {
                token: "constant.numeric",
                regex: /\b(?:0|[1-9][0-9]*)\b/
            }, {
                token: "constant.language.boolean",
                regex: "(?:true|false)\\b"
            }, {
                token: "constant.language",
                regex: "(?:null|this)\\b"
            }
        ],
        "statements": [{
                token: "keyword",
                regex: "\\b(?:" + specExpressionKeywords + ")\\b"
            },
            {
                token: "keyword",
                regex: "\\b(?:" + keywords + ")\\b"
            }, {
                token: "storage.type",
                regex: "\\b(?:" + specTypeKeywords + ")\\b"
            }, {
                token: "storage.type.annotation",
                regex: "@" + identifierRe + "\\b"
            }, {
                token: "entity.name.function",
                regex: identifierRe + "(?=\\()"
            }, {
                token: keywordMapper,
                regex: identifierRe + "\\b"
            }, {
                token: "keyword.operator",
                regex: "&&|\\*\\*|!|%|&|\\||\\^|\\*|\\/|\\-|\\+|~|==|=|!=|<=|>=|<|>|\\?|\\:|\\*=|\\/=|%=|\\+=|\\-=|&=|\\|=|\\^=|:\\|"
            }, {
                token: "lparen",
                regex: "[[({]"
            }, {
                token: "rparens",
                regex: "[\\])}]"
            }, {
                token: "texts",
                regex: "\\s+"
            }
        ]
    };

    this.embedRules(DocCommentHighlightRules, "doc-",
        [DocCommentHighlightRules.getEndRule("pop")]);
    this.normalizeRules();
};

oop.inherits(PVLHighlightRules, TextHighlightRules);

exports.PVLHighlightRules = PVLHighlightRules;