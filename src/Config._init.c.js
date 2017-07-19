'use strict';

const nml = require('node-mod-load')('SHPS4Node-config');

const sym = nml.libs['Config-sym.h'];

nml.libs.meth._init = function () {
    this[sym.configs] = new Map();
    this[sym.templates] = new Map();

    Object.assign(this, nml.libs.meth);
};
