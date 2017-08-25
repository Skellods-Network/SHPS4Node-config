'use strict';

const libs = require('node-mod-load')('SHPS4Node-config').libs;

const sym = libs['Config-sym.h'];

libs.meth.getTemplateNames = function configGetTemplateNames() {
    return Array.from(this[sym.templates].keys());
};
