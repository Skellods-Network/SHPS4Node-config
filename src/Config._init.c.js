'use strict';

const nml = require('node-mod-load')('SHPS4Node-config');
const sym = nml.libs['config-symbols.h'];


nml.libs['config.h'].prototype._init = function ($libs) {

    this._libs = $libs;

    this[sym.templates] = new Map();

    this[sym.cfg.master] = {};
    this[sym.cfg.vhosts] = new Map();

    this[sym.template.database] = {};
    this[sym.template.vhost] = {};
    this[sym.template.master] = {};
};
