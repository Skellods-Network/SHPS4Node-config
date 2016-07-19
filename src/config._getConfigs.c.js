'use strict';

var sym = require('node-mod-load')('SHPS4Node-config').libs['config-symbols.h']; //'../interface/config-symbols.h.js');

require('node-mod-load')('SHPS4Node-config').libs['config.h'].prototype._getConfigs = function () {

    return this[sym.cfg.vhosts];
};
