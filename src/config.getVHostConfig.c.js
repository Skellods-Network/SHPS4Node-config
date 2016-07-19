'use strict';

var sym = require('node-mod-load')('SHPS4Node-config').libs['config-symbols.h']; //('../interface/config-symbols.h.js');

require('node-mod-load')('SHPS4Node-config').libs['config.h'].prototype.getVHostConfig = function ($uri, $section, $key) {

    if (typeof $section === 'undefined') {

        return this[sym.cfg.vhosts][$uri];
    }

    if (typeof $key === 'undefined') {

        return this[sym.cfg.vhosts][$uri][$section][$alias];
    }

    return this[sym.cfg.vhosts][$uri][$section][$alias][$key];
};
