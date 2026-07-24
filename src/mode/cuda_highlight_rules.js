"use strict";

var oop = require("../lib/oop");
var c_cppHighlightRules = require("./c_cpp_highlight_rules").c_cppHighlightRules;

var cudaHighlightRules = function() {
    c_cppHighlightRules.call(this);

    this.$rules.start.unshift({
        token: "keyword.operator",
        regex: /<<<|>>>/
    }, {
        token: "storage.modifier",
        regex: "\\b(?:__global__|__device__|__host__|__shared__|" +
            "__constant__|__managed__|__restrict__|__forceinline__|" +
            "__noinline__|__launch_bounds__)\\b"
    }, {
        token: "storage.type",
        regex: "\\b(?:dim3|uint3|float2|float3|float4|double2|double3|" +
            "double4|int2|int3|int4|cudaError_t|cudaStream_t|cudaEvent_t)\\b"
    }, {
        token: "support.function.cuda",
        regex: "(?:\\b(?:threadIdx|blockIdx|blockDim|gridDim)\\.(?:x|y|z|w)" +
            "\\b|\\b(?:warpSize|__syncthreads|__threadfence|" +
            "__threadfence_block|__threadfence_system|__syncwarp|" +
            "atomicAdd|atomicSub|atomicExch|atomicMin|atomicMax|atomicInc|" +
            "atomicDec|atomicCAS|atomicAnd|atomicOr|atomicXor)\\b)"
    });
};

oop.inherits(cudaHighlightRules, c_cppHighlightRules);

exports.cudaHighlightRules = cudaHighlightRules;
