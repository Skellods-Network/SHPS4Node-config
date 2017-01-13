'use strict';

const nml = require('node-mod-load')('SHPS4Node-config');
const sym = nml.libs['config-symbols.h'];

nml.libs['config.h'].prototype.getConfig = function ($uri) {

    return this[sym.cfg.vhosts].get($uri.toString());
};
