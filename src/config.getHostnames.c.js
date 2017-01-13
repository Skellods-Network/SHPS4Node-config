'use strict';

const nml = require('node-mod-load')('SHPS4Node-config');
const sym = nml.libs['config-symbols.h'];

nml.libs['config.h'].prototype.getHostnames = function() {

    const keyIter = this[sym.cfg.vhosts].keys();
    let r = [];

    for (let key of keyIter) {

        r.push(key);
    }

    return r;
};
