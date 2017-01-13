'use strict';

const nml = require('node-mod-load')('SHPS4Node-config');

const sym = nml.libs['config-symbols.h'];


nml.libs['config.h'].prototype.getVHostConfig = function ($uri, $section, $key) {

    let c = this[sym.cfg.vhosts].get($uri.toString());

    if (typeof $section === 'undefined') {

        return c;
    }

    if (typeof $key === 'undefined') {

        return c[$section.toString()];
    }

    return c[$section.toString()][$key.toString()];
};
