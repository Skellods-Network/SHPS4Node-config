'use strict';

const fs = require('fs');
const nml = require('node-mod-load');
const Option = require('rustify-js').Option;
const path = require('path');
const Result = require('rustify-js').Result;

const libs = nml('SHPS4Node-config').libs;
const SHPS = nml('SHPS4Node').libs;


libs.meth.upgradeTemplate = function upgradeTemplate($path, $obj = Option.None()) {
    SHPS.main.writeLog(SHPS.main.logLevels.warning, { mod: 'CONFIG', msg: 'fixme: upgradeTemplate() not implemented' });
    return Result.fromError('Not implemented');
};
