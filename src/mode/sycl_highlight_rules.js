"use strict";

var oop = require("../lib/oop");
var c_cppHighlightRules = require("./c_cpp_highlight_rules").c_cppHighlightRules;

var syclHighlightRules = function() {
    c_cppHighlightRules.call(this, {
        "storage.modifier": "kernel_single_task|kernel_parallel_for"
    });

    this.$rules.start.unshift({
        token: "storage.type",
        regex: "\\b(?:sycl::)?(?:queue|handler|event|device|context|" +
            "platform|range|id|item|nd_item|group|sub_group|nd_range|" +
            "accessor|local_accessor|host_accessor|buffer|multi_ptr|" +
            "usm_allocator|vec)\\b"
    },{
        token: "support.function.sycl",
        regex: "\\b(?:parallel_for|single_task|parallel_for_work_group|" +
            "parallel_for_work_item|submit|wait|wait_and_throw|memcpy|" +
            "memset|prefetch|malloc_device|malloc_shared|malloc_host|" +
            "free|get_global_id|get_local_id|get_group_id|get_sub_group|" + 
            "get_id|get_range|get_offset|get_linear_id)\\b"
    }, {
        token: "constant.language",
        regex: "\\b(?:sycl::)?(?:access_mode::)?(?:read_only|write_only|read_write|discard_write|" +
            "read|write|no_init)\\b"
    });
};

oop.inherits(syclHighlightRules, c_cppHighlightRules);

exports.syclHighlightRules = syclHighlightRules;