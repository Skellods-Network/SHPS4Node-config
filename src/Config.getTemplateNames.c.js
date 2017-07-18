'use strict';

const libs = require('node-mod-load')('SHPS4Node-config').libs;

libs.meth.getTemplateNames = function configGetTemplateNames() {
    return Array.from(libs['Config-sym.h'].templates.keys());
};
