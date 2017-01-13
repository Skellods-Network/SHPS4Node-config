'use strict';

const nml = require('node-mod-load')('SHPS4Node-config');

const sym = nml.libs['config-symbols.h'];


nml.libs['config.h'].prototype.getMasterConfig = function ($key) {

    if (typeof $key === 'undefined') {

        return this[sym.cfg.master];
    }

    return this[sym.cfg.master][$key];
};
