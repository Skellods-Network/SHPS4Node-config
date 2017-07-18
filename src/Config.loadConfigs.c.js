'use strict';

const fs = require('fs');

const async = require('vasync');
const colors = require('colors');
const defer = require('promise-defer');
const semver = require('semver');
const q = require('q');
const nml = require('node-mod-load')('SHPS4Node-config');

const sym = nml.libs['config-symbols.h'];


const readDir = function (dir, type, task, regex) {

    const d = defer();

    fs.readdir(dir, ($err, $files) => {

        if ($err) {

            d.reject($err);
            return;
        }

        let i = 0;
        const l = $files.length;
        const files = {};
        while (i < l) {

            let file = $files[i];
            i++;

            if (!regex.test(file)) {

                this._libs.schedule.sendSignal('onFilePollution', dir, type, file);
                continue;
            }

            task.interim(TASK_RESULT_OK, 'Found ' + type + ': ' + file);

            let fc = '';
            try {

                fc = fs.readFileSync(dir + file);
            }
            catch (err) {

                task.interim(TASK_RESULT_ERROR, 'Could not open ' + type + ' ' + file);
                this._libs.coml.writeError(err);
                continue;
            }

            let content = null;
            try {

                content = JSON.parse(fc);
            }
            catch (err) {

                task.interim(TASK_RESULT_ERROR, 'Could not read ' + type + ' ' + file);
                this._libs.coml.writeError(err);
                continue;
            }

            files[file] = content;
        }

        d.resolve(files);
    });

    return d.promise;
};

const readTemplates = function (co, cb) {

    const dir = this._libs.main.getDir(SHPS_DIR_TEMPLATES);
    readDir.apply(this, [dir, 'template', co.task, /\.json$/]).then($files => {

        co.templates = $files;
        cb(null, co);
    }, cb);
};

const evalTemplates = function (co, cb) {

    let i = 0;
    const keys = Object.keys(co.templates);
    const l = keys.length;
    let tCheck = 0b000;
    while (i < l) {

        let f = keys[i];
        let t = co.templates[f];
        i++;

        if (!t.configHeader || !t.configHeader.type || t.configHeader.type !== 'template') {

            co.task.interim(TASK_RESULT_ERROR, 'File is not a template: ' + f.toString().red);
        }

        //TODO check template version
        //TODO check config version

        switch (t.template._info.type) {

            case 'master': {

                this[sym.cfg.master] = t.template;
                this[sym.template.master] = t.template;
                tCheck += 0b100;
                co.task.interim(TASK_RESULT_OK, 'Master template loaded: ' + f.toString().green);
                break;
            }

            case 'database': {

                this[sym.template.database] = t.template;
                tCheck += 0b010;
                co.task.interim(TASK_RESULT_OK, 'Database template loaded: ' + f.toString().green);
                break;
            }

            case 'vhost': {

                this[sym.template.vhost] = t.template;
                tCheck += 0b001;
                co.task.interim(TASK_RESULT_OK, 'VHost template loaded: ' + f.toString().green);
                break;
            }

            default: {

                this[sym.templates].set(t.template._info.type, t.template);
                co.task.interim(TASK_RESULT_OK, 'Unknown template loaded: ' + f.toString().green);
            }
        }
    }

    if (tCheck != 0b111) {

        cb(new Error('Could not find all necessary config templates!'), co);
    }
    else {

        cb(null, co);
    }
};

const readConfigs = function (co, cb) {

    const dir = this._libs.main.getDir(SHPS_DIR_CONFIGS);
    readDir.apply(this, [dir, 'config', co.task, /\.json$/]).then($files => {

        co.configs = $files;
        cb(null, co);
    }, cb);
};

const evalConfigs = function (co, cb) {

    const matchTemplate = ($template, config, $parentPath) => {

        const template = Object.assign({}, $template);
        const tKeys = Object.keys(template);
        const cKeys = Object.keys(config);
        let i = 0;
        const l = cKeys.length;
        while (i < l) {

            if (config[cKeys[i]] instanceof Object) {

                if (['_info', 'configHeader'].indexOf(cKeys[i]) < 0 && typeof template[cKeys[i]] !== 'undefined') {

                    let parentPath = cKeys[i];
                    if ($parentPath) {
                        
                        parentPath = $parentPath + '->' + parentPath;
                    }
                    
                    template[cKeys[i]] = matchTemplate(template[cKeys[i]], config[cKeys[i]], parentPath);
                }
            }
            else if (cKeys[i] !== 'value' && typeof template[cKeys[i]] === 'undefined') {

                let optionName = cKeys[i];
                if ($parentPath) {
                    
                    optionName = $parentPath + '->' + cKeys[i];
                }
            
                co.task.interim(TASK_RESULT_WARNING, 'Config option not in template: ' + optionName);
            }
            else if (cKeys[i] !== 'value' && typeof template[cKeys[i]] !== typeof config[cKeys[i]]) {

                co.task.interim(TASK_RESULT_ERROR, 'Config option type deviates from template option type: ' + cKeys[i]);
            }
            else {

                template[cKeys[i]] = config[cKeys[i]];
            }

            i++;
        }

        i = tKeys.length - 1;
        while (i >= 0) {

            if (typeof template[tKeys[i]] !== 'undefined'
                && typeof template[tKeys[i]].default !== 'undefined'
                && typeof template[tKeys[i]] !== 'undefined'
                && typeof template[tKeys[i]].value === 'undefined'
            ) {

                template[tKeys[i]].value = template[tKeys[i]].default;
            }

            i--;
        }
        
        return template;
    };

    let i = 0;
    const keys = Object.keys(co.configs);
    const l = keys.length;
    while (i < l) {

        let f = keys[i];
        let c = co.configs[f];
        i++;

        if (!c.configHeader || !c.configHeader.type || ['database', 'master', 'vhost', 'hp'].indexOf(c.configHeader.type) < 0) {

            co.task.interim(TASK_RESULT_ERROR, 'Config type cannot be recognized: ' + f.toString().red);
        }

        //TODO check config version

        switch (c.configHeader.type) {

            case 'master': {

                if (semver.lt(c.configHeader.SHPSVERSION_MA + '.' + c.configHeader.SHPSVERSION_MI + '.0', '4.2.0')) {

                    co.task.interim(TASK_RESULT_WARNING, 'This config file uses a deprecated format: ' + f.toString().yellow.bold);
                    co.warnings++;
                    c = c.config;
                }

                this[sym.cfg.master] = matchTemplate(this[sym.template.master], c);
                co.task.interim(TASK_RESULT_OK, 'Master config loaded: ' + f.toString().green);
                break;
            }

            case 'database': {

                //TODO: use one database config for several vhosts

                let cfg = this[sym.cfg.vhosts].get(c.configHeader.vhost);

                if (typeof cfg === 'undefined') {

                    this[sym.cfg.vhosts].set(c.configHeader.vhost, {});
                    cfg = this[sym.cfg.vhosts].get(c.configHeader.vhost);
                }

                if (typeof cfg.databaseConfig === 'undefined') {

                    cfg.databaseConfig = {};
                }

                cfg.databaseConfig[c.alias.value] = matchTemplate(this[sym.template.database], c);
                co.task.interim(TASK_RESULT_OK, 'Database config loaded: ' + (c.configHeader.vhost + '::' + c.alias.value).green);
                break;
            }

            case 'hp': {

                this[sym.cfg.vhosts].set(c.generalConfig.URL.value, c);
                co.task.interim(TASK_RESULT_WARNING, 'This config file uses a deprecated format: ' + f.toString().yellow.bold);
                co.task.interim(TASK_RESULT_OK, 'Config loaded: ' + f.toString().green);
                co.warnings++;
                break;
            }

            case 'vhost': {

                const url = c.generalConfig.URL.value || c.generalConfig.URL.default;

                const cfg = this[sym.cfg.vhosts].get(url);

                if (cfg) {

                    Object.assign(cfg, matchTemplate(this[sym.template.vhost], c));
                }
                else {

                    this[sym.cfg.vhosts].set(url, matchTemplate(this[sym.template.vhost], c));
                }
                
                co.task.interim(TASK_RESULT_OK, 'VHost config loaded: ' + f.toString().green);
                break;
            }
        }
    }

    cb(null, co);
};

nml.libs['config.h'].prototype.readConfig = function () {

    const d = q.defer();

    const task = this._libs.coml.newTask('Detecting Configurations');

    async.waterfall([

        cb => {

            cb(null, {
                task: task,
                templates: {},
                configs: {},
                warnings: 0,
            });
        },
        readTemplates.bind(this),
        evalTemplates.bind(this),
        readConfigs.bind(this),
        evalConfigs.bind(this),
    ], ($err, $res) => {

        if ($err) {

            task.end(TASK_RESULT_ERROR);
            d.reject($err);
        }
        else {

            if ($res.warnings > 0) {

                task.end(TASK_RESULT_WARNING);
            }
            else {

                task.end(TASK_RESULT_OK);
            }

            d.resolve();
        }
    });

    return d.promise;
};
