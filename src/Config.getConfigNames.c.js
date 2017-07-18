'use strict';

const libs = require('node-mod-load')('SHPS4Node-config').libs;

libs.meth.getConfigNames = function configGetConfigNames() {
    return Array.from(libs['Config-sym.h'].configs.keys());
};
