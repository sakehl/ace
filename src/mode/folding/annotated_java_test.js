"use strict";

var AnnotatedJavaMode = require("../annotated_java").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");

module.exports = {

    "test: fold multiline annotation ending with @*/": function() {
        var session = new EditSession([
            "class A {",
            "    /*@",
            "      requires true;",
            "    @*/",
            "    void m() {}",
            "}"
        ]);

        var mode = new AnnotatedJavaMode();
        session.setFoldStyle("markbeginend");
        session.setMode(mode);

        assert.equal(session.getFoldWidget(1), "start");
        assert.equal(session.getFoldWidget(3), "end");
        assert.range(session.getFoldWidgetRange(1), 1, 7, 3, 4);
        assert.range(session.getFoldWidgetRange(3), 1, 7, 3, 4);
    },

    "test: fold multiline annotation ending with */": function() {
        var session = new EditSession([
            "class A {",
            "    /*@",
            "      requires true;",
            "    */",
            "    void m() {}",
            "}"
        ]);

        var mode = new AnnotatedJavaMode();
        session.setFoldStyle("markbeginend");
        session.setMode(mode);

        assert.equal(session.getFoldWidget(1), "start");
        assert.equal(session.getFoldWidget(3), "end");
        assert.range(session.getFoldWidgetRange(1), 1, 7, 3, 4);
        assert.range(session.getFoldWidgetRange(3), 1, 7, 3, 4);
    }
};

require("../../test/run")(module);
