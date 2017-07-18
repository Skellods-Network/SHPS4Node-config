'use strict';

const nml = require('node-mod-load')('SHPS4Node-config');

const sym = nml.libs['config-symbols.h'];

nml.libs['config.h'].prototype.getTemplate = function ($type) {

    const t = {};
    for (let entry of this[sym.templates]) {

        t[entry[0]] = entry[1];
    }

    const templates = Object.assign({}, this[sym.template], t);

    if (!templates[$type.toString()]) {

        throw new Error(`Template of type "${$type.toString()}" not available!`);
    }

    if (templates[$type.toString()] instanceof Map) {

        let r = {};
        for (let entry of templates[$type.toString()]) {

            r[entry[0]] = entry[1];
        }

        return r;
    }

    return templates[$type.toString()];
};
