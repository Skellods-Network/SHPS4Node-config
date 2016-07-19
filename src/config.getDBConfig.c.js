'use strict';

var sym = require('node-mod-load')('SHPS4Node-config').libs['config-symbols.h']; //('../interface/config-symbols.h.js');

require('node-mod-load')('SHPS4Node-config').libs['config.h'].prototype.getDBConfig = function ($uri, $alias, $key) {

    if (typeof $alias === 'undefined') {

        return this[sym.cfg.vhosts][$uri].databaseConfig;
    }
    
    if (typeof $key === 'undefined') {

        return this[sym.cfg.vhosts][$uri].databaseConfig[$alias];
    }

    return this[sym.cfg.vhosts][$uri].databaseConfig[$alias][$key];
};
