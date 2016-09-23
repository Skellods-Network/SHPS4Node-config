'use strict';

var sym = require('node-mod-load')('SHPS4Node-config').libs['config-symbols.h'];

require('node-mod-load')('SHPS4Node-config').libs['config.h'].prototype.getTemplate = function ($type) {

    if (!this[sym.templates][$type]) {

        throw new Error(`Template of type "${$type}" not available!`);
    }

    return this[sym.templates][$type];
};
