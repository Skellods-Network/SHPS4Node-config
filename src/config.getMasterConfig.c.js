'use strict';

var sym = require('node-mod-load')('SHPS4Node-config').libs['config-symbols.h']; //('../interface/config-symbols.h.js');

require('node-mod-load')('SHPS4Node-config').libs['config.h'].prototype.getMasterConfig = function ($key) {

    if (typeof $key === 'undefined') {

        return this[sym.cfg.master];
    }

    return this[sym.cfg.master][$key];
};
