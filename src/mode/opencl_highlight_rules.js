"use strict";

var oop = require("../lib/oop");
var c_cppHighlightRules = require("./c_cpp_highlight_rules").c_cppHighlightRules;

var openclHighlightRules = function() {
    c_cppHighlightRules.call(this, {
        "storage.modifier": "__kernel|kernel|__global|global|__local|local|" +
            "__private|private|__constant|constant|__read_only|read_only|" +
            "__write_only|write_only|__read_write|read_write|__attribute__",
        "storage.type": "sampler_t|event_t|clk_event_t|queue_t|ndrange_t|" +
            "image1d_t|image1d_array_t|image1d_buffer_t|image2d_t|" +
            "image2d_array_t|image3d_t"
    });

    this.$rules.start.unshift({
        token: "support.function.opencl",
        regex: "\\b(?:get_work_dim|get_global_size|get_global_id|" +
            "get_local_size|get_local_id|get_num_groups|get_group_id|" +
            "get_global_offset|get_enqueued_local_size|barrier|" +
            "mem_fence|read_mem_fence|write_mem_fence|async_work_group_copy|" +
            "wait_group_events|prefetch)\\b"
    }, {
        token: "keyword.operator",
        regex: /\b(?:CLK_LOCAL_MEM_FENCE|CLK_GLOBAL_MEM_FENCE|CLK_IMAGE_MEM_FENCE)\b/
    });
};

oop.inherits(openclHighlightRules, c_cppHighlightRules);

exports.openclHighlightRules = openclHighlightRules;
