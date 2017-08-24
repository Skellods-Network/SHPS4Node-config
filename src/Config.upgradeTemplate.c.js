'use strict';

const fs = require('fs');
const nml = require('node-mod-load');
const Option = require('rusty-js').Option;
const path = require('path');
const Result = require('rusty-js').Result;

const SHPS = nml('SHPS4Node').libs;


libs.meth.upgradeTemplate = function upgradeTemplate($path, $obj = Option.None()) {
    SHPS.main.writeLog(SHPS.main.logLevels.trace, { mod: 'CONFIG', msg: `upgradeTemplate(${$path}, ${$obj.and('Some').or('None').unwrap()})`});

    SHPS.main.writeLog(SHPS.main.logLevels.warning, { mod: 'CONFIG', msg: 'fixme: upgradeTemplate() not implemented' });

    SHPS.main.writeLog(SHPS.main.logLevels.trace, { mod: 'CONFIG', msg: `\\\\ upgradeTemplate(${$path})`});
    return Result.fromError('Not implemented');
};
