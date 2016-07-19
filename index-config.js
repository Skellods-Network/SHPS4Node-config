'use strict';

// There is a bug in NML@2.1.1. Since v3.0.0 is out it's unlikely that the bug will be fixed in v2.x, so we will have to wait for the change to NML@3.x

var nml = require('node-mod-load')('SHPS4Node-config');
nml.addDir(__dirname + '/interface', true);
nml.addDir(__dirname + '/src', true);
module.exports = nml.libs['config.h'];

/*
var c = require('./interface/config.h.js');

require('./src/config.getDBConfig.c.js');
require('./src/config.getHPConfig.c.js');
require('./src/config.getMasterConfig.c.js');
require('./src/config.getVHostConfig.c.js');
require('./src/config.readConfig.c.js');

require('./src/config._init.c.js');

require('./src/config.getConfig.c.js');

// Internal stuff
require('./src/config._getConfigs.c.js');


module.exports = new c();
*/