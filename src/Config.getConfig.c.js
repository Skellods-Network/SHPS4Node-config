'use strict';

const libs = require('node-mod-load')('SHPS4Node-config').libs;
const sym = libs['config-symbols.h'];

libs.meth.getConfig = function ($uri) {

    return this[sym.cfg.vhosts].get($uri.toString());
};
