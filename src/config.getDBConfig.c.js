'use strict';

const nml = require('node-mod-load')('SHPS4Node-config');
const sym = nml.libs['config-symbols.h'];

nml.libs['config.h'].prototype.getDBConfig = function ($uri, $alias, $key) {

    let c = this[sym.cfg.vhosts].get($uri.toString());
    if (typeof $alias === 'undefined') {

        return c
            ? c.databaseConfig
            : undefined;
    }
    
    if (typeof $key === 'undefined') {

        return c && c.databaseConfig
            ? c.databaseConfig[$alias.toString()]
            : undefined;
    }


    return c && c.databaseConfig && c.databaseConfig[$alias.toString()]
        ? c.databaseConfig[$alias.toString()][$key.toString()]
        : undefined;
};
