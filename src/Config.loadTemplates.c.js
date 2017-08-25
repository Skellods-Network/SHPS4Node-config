'use strict';

const defer = require('promise-defer');
const fs = require('fs');
const nml = require('node-mod-load');
const path = require('path');

const libs = nml('SHPS4Node-config').libs;
const SHPS = nml('SHPS4Node').libs;
const sym = libs['Config-sym.h'];

libs.meth.loadTemplates = function configloadTemplates($path) {
    const d = defer();
    const task = SHPS.coml.startTask('Load templates');
    const templates = this[sym.templates];

    const silent = (() => {
        if (typeof $silent === 'undefined') {
            return SHPS._options.prod
                ? SHPS._options.prod
                : false
            ;
        }

        return !!$silent;
    })();

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
        let i = 0;
        $files.forEach($file => {
            if (path.extname($file) !== '.json') {
                i++;
                if (i >= numFiles) {
                    task.end(warn ? task.result.warning : task.result.ok);
                    d.resolve(r);
                }

                return;
            }

            task.interim(task.result.ok, `Found file "${$file}"`);
            fs.readFile(path.join($path, $file), {}, ($err, $data) => {
                i++;

                if ($err) {
                    task.interim(task.result.error, `${$file}: ${$err.message}`);
                    r.error.push({ name: $file, error: $err });
                    warn = true;
                    if (i >= numFiles) {
                        task.end(task.result.warning);
                        d.resolve(r);
                    }

                    return;
                }

                try {
                    const t = JSON.parse($data);

                    // todo: check signature
                    SHPS.main.writeLog(SHPS.main.logLevels.warning, { mod: 'CONFIG', msg: 'fixme: check template signature' });

                    // for now, all templates of v5 or later are compatible
                    if (t.configHeader.SHPSVERSION_MA < 5) {
                        const upgradeResult = this.upgradeTemplate(path.join($path, $file), Some(t));
                        if (upgradeResult.isOk()) {
                            task.interim(task.result.ok, upgradeResult.unwrap());
                        }
                        else {
                            task.interim(task.result.error, upgradeResult.unwrapErr());
                            task.interim(task.result.error, `Template incompatible: "${$file}" ` +
                                `@v${t.configHeader.SHPSVERSION_MA}.${t.configHeader.SHPSVERSION_MI}`);

                            return;
                        }
                    }

                    // todo: check if template name has already been registered
                    SHPS.main.writeLog(SHPS.main.logLevels.warning, { mod: 'CONFIG', msg: 'fixme: check if template name already exists' });

                    task.interim(task.result.ok, `Loaded template "${t.configHeader.name}"`);
                    templates.set(t.configHeader.name, t);
                    r.success.push(t.configHeader.name);
                }
                catch ($err) {
                    warn = true;
                    task.interim(task.result.error, `${$file}: ${$err.message}`);
                    r.error.push({ name: $file, error: $err });
                }

                if (i >= numFiles) {
                    task.end(warn ? task.result.warning : task.result.ok);
                    d.resolve(r);
                }
            });
        });
    });

    return d.promise;
};
