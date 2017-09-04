'use strict';

const defer = require('promise-defer');
const fs = require('fs');
const nml = require('node-mod-load');
const path = require('path');

const libs = nml('SHPS4Node-config').libs;
const sym = libs['Config-sym.h'];


libs.meth.loadTemplates = function configloadTemplates($path, {
    fileFoundHandler = () => {},
    fileLoadedHandler = () => {},
    errorHandler = () => {},
} = {}) {
    const d = defer();
    //const task = SHPS.coml.startTask('Load templates');
    /**
     * @type {Map.<String, object>}
     */
    const templates = this[sym.templates];

    templates.clear();
    this
        ._loadFiles($path.toString(), async ($path, $fileName) => {
            //task.interim(task.result.ok, `Found file "${$fileName}"`);
            fileFoundHandler($fileName);
            let data = await new Promise(($res, $rej) => {
                fs.readFile($path, {}, ($err, $data) => {
                    if ($err) {
                        task.interim(task.result.error, `${$fileName}: ${$err.message}`);
                        $rej($err);
                        return;
                    }

                    $res($data);
                });
            });

            // no error catching required - will propagate automatically (magically?)
            data = JSON.parse(data);

            // todo: check signature
            //SHPS.main.writeLog(SHPS.main.logLevels.warning, {
            //    mod: 'CONFIG',
            //    msg: 'fixme: check template signature'
            //});
            // await this._checkTemplateSignature(data);

            // check version and upgrade if necessary
            const versionMajor = data.configHeader.SHPSVERSION_MA;

            // for now, all templates of v5 or later are compatible
            if (versionMajor < 5) {
                await this.upgradeTemplate(path.join($path, $fileName), Some(data));
            }

            // todo: check if template name has already been registered
            //SHPS.main.writeLog(SHPS.main.logLevels.warning, {
            //    mod: 'CONFIG',
            //    msg: 'fixme: check if template name already exists'
            //});

            // store template
            //task.interim(task.result.ok, `Loaded template "${t.configHeader.name}"`);
            fileLoadedHandler(data.configHeader.name);
            templates.set(data.configHeader.name, data);

            return data;
        }, ($fileName, $err) => {
            //task.interim(task.result.error, `${$fileName}: ${$err.message}`);
            errorHandler($fileName, $err);
        })
        .then(d.resolve)
        .catch(d.reject);

    return d.promise;
};



/*


libs.meth.loadTemplates = function configloadTemplates($path) {
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
                    const versionMajor = t.configHeader.SHPSVERSION_MA;
                    const versionMinor = t.configHeader.SHPSVERSION_MI;

                    // todo: check signature
                    SHPS.main.writeLog(SHPS.main.logLevels.warning, { mod: 'CONFIG', msg: 'fixme: check template signature' });

                    let upgradeSuccessful = true;

                    // for now, all templates of v5 or later are compatible
                    if (versionMajor < 5) {
                        const upgradeResult = this.upgradeTemplate(path.join($path, $file), Some(t));
                        if (upgradeResult.isOk()) {
                            task.interim(task.result.ok, upgradeResult.unwrap());
                        }
                        else {
                            const errMsg = upgradeResult.unwrapErr();
                            task.interim(task.result.error, `Template cannot be upgraded: ${errMsg}`);
                            SHPS.main.writeLog(SHPS.main.logLevels.error, {
                                mod: 'CONFIG',
                                msg: `Cannot upgrade template "${$file}"@v${versionMajor}.${versionMinor}: ${errMsg}`
                            });

                            task.interim(task.result.error, `Template incompatible: "${$file}" ` +
                                `@v${versionMajor}.${versionMinor}`);

                            upgradeSuccessful = false;
                        }
                    }

                    if (upgradeSuccessful) {
                        // todo: check if template name has already been registered
                        SHPS.main.writeLog(SHPS.main.logLevels.warning, {
                            mod: 'CONFIG',
                            msg: 'fixme: check if template name already exists'
                        });

                        task.interim(task.result.ok, `Loaded template "${t.configHeader.name}"`);
                        templates.set(t.configHeader.name, t);
                        r.success.push(t.configHeader.name);
                    }
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
*/
