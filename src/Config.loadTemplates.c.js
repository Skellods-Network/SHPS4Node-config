'use strict';

const defer = require('promise-defer');
const fs = require('fs');
const nml = require('node-mod-load');
const path = require('path');

const libs = nml('SHPS4Node-config').libs;
const SHPS = nml('SHPS4Node').libs;

/**
 * @type {Map}
 */
const templates = libs['Config-sym.h'].templates;

libs.meth.loadTemplates = function configloadTemplates($path) {
    SHPS.main.writeLog(SHPS.main.logLevels.trace, { mod: 'CONFIG', msg: `loadTemplates(${$path})`});

    const d = defer();
    const task = SHPS.coml.startTask('Load templates');
    const templates = this[sym.templates];

    templates.clear();
    fs.readdir($path, { encoding: 'utf8' }, ($err, $files) => {
        if ($err) {
            d.reject($err);
            return;
        }

        const r = {
            success: [],
            error: [],
        };

        const numFiles = $files.length;
        let warn = false;
        $files.forEach(($file, $i) => {
            task.interim(task.result.ok(`Found file "${$file}"`));
            fs.readFile(path.join($path, $file), {}, ($err, $data) => {
                if ($err) {
                    task.interim(task.result.error, `${$file}: ${$err.message}`);
                    r.error.push({ name: $file, error: $err });
                    warn = true;
                    if ($i - 1 >= numFiles) {
                        task.end(task.result.warning);
                    }

                    return;
                }

                try {
                    const t = JSON.parse($data);

                    // todo: check signature
                    main.writeLog(main.logLevels.warning, { mod: 'CONFIG', msg: 'fixme: check template signature' });
                    // todo: check if compatible with this version of SHPS
                    main.writeLog(main.logLevels.warning, { mod: 'CONFIG', msg: 'fixme: check template compatibility' });

                    task.interim(task.result.ok, `Loaded template "${t.configHeader.name}"`);
                    templates.set(t.configHeader.name, t);
                    r.success.push(t.configHeader.name);
                }
                catch ($err) {
                    warn = true;
                    task.interim(task.result.error, `${$file}: ${$err.message}`);
                    r.error.push({ name: $file, error: $err });
                }

                if ($i - 1 >= numFiles) {
                    task.end(warn ? task.result.warning : task.result.ok);
                }
            });
        });
    });

    SHPS.main.writeLog(SHPS.main.logLevels.trace, { mod: 'CONFIG', msg: `\\\\ loadTemplates(${$path})`});
    return d.promise;
};
