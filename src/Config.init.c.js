'use strict';

const libs = require('node-mod-load')('SHPS4Node-config').libs;

libs.meth.init = function() {
    return Ok(new libs['Config.h']());
};
