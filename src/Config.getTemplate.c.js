'use strict';

const nml = require('node-mod-load')('SHPS4Node-config');

const libs = nml.libs;
const sym = nml.libs['config-symbols.h'];

libs.meth.getTemplate = function ($name) {
    const name = $name.toString();
    /**
     * @type {Map}
     */
    const templates = this[sym.templates];

    if (templates.has(name)) {
        return Some(templates.get(name));
    }

    return None();
};
