"use strict";

var AnnotatedCMode = require("../annotated_c").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");

module.exports = {

    "test: fold multiline annotation ending with @*/": function() {
        var session = new EditSession([
            "int main() {",
            "    /*@",
            "      requires true;",
            "    @*/",
            "    return 0;",
            "}"
        ]);

        var mode = new AnnotatedCMode();
        session.setFoldStyle("markbeginend");
        session.setMode(mode);

        assert.equal(session.getFoldWidget(1), "start");
        assert.equal(session.getFoldWidget(3), "end");
        assert.range(session.getFoldWidgetRange(1), 1, 7, 3, 4);
        assert.range(session.getFoldWidgetRange(3), 1, 7, 3, 4);
    },

    "test: fold multiline annotation ending with */": function() {
        var session = new EditSession([
            "int main() {",
            "    /*@",
            "      requires true;",
            "    */",
            "    return 0;",
            "}"
        ]);

        var mode = new AnnotatedCMode();
        session.setFoldStyle("markbeginend");
        session.setMode(mode);

        assert.equal(session.getFoldWidget(1), "start");
        assert.equal(session.getFoldWidget(3), "end");
        assert.range(session.getFoldWidgetRange(1), 1, 7, 3, 4);
        assert.range(session.getFoldWidgetRange(3), 1, 7, 3, 4);
    }
};

require("../../test/run")(module);
