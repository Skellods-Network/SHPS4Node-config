'use strict';

const path = require('path');

const nml = require('node-mod-load')('SHPS4Node-config');

nml.addMeta('meth', {});
nml.addDir(`${__dirname}${path.sep}interface`, true);
nml.addDir(`${__dirname}${path.sep}src`, true);

module.exports = nml.libs['Config.h'];
