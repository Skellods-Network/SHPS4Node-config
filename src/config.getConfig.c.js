'use strict';

var sym = require('node-mod-load')('SHPS4Node-config').libs['config-symbols.h']; //('../interface/config-symbols.h.js');

require('node-mod-load')('SHPS4Node-config').libs['config.h'].prototype.getConfig = function ($uri) {

    return this[sym.cfg.vhosts][$uri];
};
