'use strict';

const nml = require('node-mod-load')('SHPS4Node-config');

const libs = nml('SHPS4Node-config').libs;
const sym = nml.libs['config-symbols.h'];

libs.meth._getConfigs = function () {

    const r = {};
    for (let entry of this[sym.cfg.vhosts]) {

        r[entry[0]] = entry[1];
    }

    return r;
};
