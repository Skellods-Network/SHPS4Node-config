'use strict';

const nml = require('node-mod-load')('SHPS4Node-config');

const sym = nml.libs['config-symbols.h'];


nml.libs['config.h'].prototype.getHPConfig = function ($group, $key, $domain) {

    let cv = this[sym.cfg.vhosts].get($domain);

    if (typeof $domain !== 'undefined' &&
        typeof cv !== 'undefined' &&
        typeof cv[$group] !== 'undefined' &&
        typeof cv[$group][$key] !== 'undefined') {

        return cv[$group][$key].value;
    }

    let cm = this[sym.cfg.master][$group];

    if (typeof cm !== 'undefined') {

        if (typeof $key !== 'undefined' &&
            (typeof cm !== 'undefined' && typeof cm[$key] !== 'undefined')) {

            return cm[$key].value || cm[$key].default;
        }
    }
    else if ($group === 'config') {

        let cmk = this[sym.cfg.master][$key];
        return typeof cmk.value !== 'undefined' ? cmk.value : cmk.default;
    }
    else {

        let cmc = this[sym.cfg.master]['config'];
        if (typeof cmc !== 'undefined' && typeof cmc[$group] !== 'undefined') {

            return typeof cmc[$group].value !== 'undefined' ? cmc[$group].value : cmc[$group].default;
        }
    }
};
