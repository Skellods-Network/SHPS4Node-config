'use strict';

var sym = require('node-mod-load')('SHPS4Node-config').libs['config-symbols.h']; //'../interface/config-symbols.h.js');


require('node-mod-load')('SHPS4Node-config').libs['config.h'].prototype._init = function ($libs) {

    this._libs = $libs;

    this[sym.domains] = [];
    this[sym.templates] = [];

    this[sym.cfg.master] = {};
    this[sym.cfg.vhosts] = {};

    this[sym.template.database] = {};
    this[sym.template.vhost] = {};
    this[sym.template.master] = {};
};
