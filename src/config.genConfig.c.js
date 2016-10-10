'use strict';

var fs = require('fs');
var path = require('path');

var libs = require('node-mod-load')('SHPS4Node-config').libs;
var defer = require('promise-defer');


var sym = libs['config-symbols.h'];

//TODO: maybe carve out the template reader so that it can be re-used for the "template -> DB" part?

var getSettings = function* ($type, $offsetGroup, $offsetSetting) {

    const template = this[sym.template[$type]];
    if (!template) {

        throw new Error('No template available for type ' + $type + '!');
    }

    const confGroups = Object.keys(template);
    var i = $offsetGroup || 0;
    const l = confGroups.length;
    var settings;
    var j;
    var sl;
    var r;
    var offSet = $offsetSetting;
    while (i < l) {

        if (confGroups[i] === '_info' || ['database', 'master'].indexOf($type) >= 0) {

            r = template[confGroups[i]];
            r.group = confGroups[i];
            yield r;

            i++;
            continue;
        }

        settings = Object.keys(template[confGroups[i]]);
        sl = settings.length;
        j = offSet || 0;
        offSet = 0;
        while (j < sl) {

            if (settings[j] === '_info') {

                j++;
                continue;
            }

            r = template[confGroups[i]][settings[j]];
            r.group = confGroups[i];
            r.key = settings[j];
            yield r;

            j++;
        }

        i++;
    }
};


libs['config.h'].prototype.genConfig = function($type, $fileName, $onValue, $offsetGroup, $offsetSetting) {

    const d = defer();
    const conf = {

        configHeader: {},
    };

    const setting = getSettings.apply(this, [$type, $offsetGroup, $offsetSetting]);

    const addValue = ($setting, $group, $key, $value) => {

        if ($setting.type === 'integer') {

            $setting.type = 'number';
        }

        if (typeof $value !== $setting.type) {

            if (!$key) {

                throw new Error(`The value \`${$value}\` for ${$group} is not of type ${$setting.type}`);
            }
            else {

                throw new Error(`The value \`${$value}\` for ${$group}::${$key} is not of type ${$setting.type}`);
            }
        }

        if (!conf[$group]) {

            conf[$group] = {};
        }

        if ($key) {
            conf[$group][$key] = $setting;
            conf[$group][$key].value = $value;

            // Strip everything we do not need
            delete conf[$group][$key].reference;
            delete conf[$group][$key].group;
            delete conf[$group][$key].key;
        }
        else {
            conf[$group] = $setting;
            conf[$group].value = $value;

            // Strip everything we do not need
            delete conf[$group].reference;
            delete conf[$group].group;
        }
    };

    const writeFile = ($conf) => {

        var fn = $fileName;
        if (path.extname(fn) !== '.json') {

            fn += '.json';
        }

        //TODO: Check if filename exists

        fs.writeFile(this._libs.main.getDir(SHPS_DIR_CONFIGS) + fn, JSON.stringify($conf, null, 2) + '\n', $err => {

            if ($err) {

                d.reject($err);
            }
            else {

                d.resolve(fn);
            }
        });
    };

    const processSetting = $setting => {

        if ($setting.group === '_info') {

            //TODO: Make this more generic
            if ($type === 'database') {

                const s = $setting;
                s.group = 'configHeader';
                s.description = 'The domain of VHost which should be able to use this DB config';
                s.default = 'localhost';
                s.type = 'string';

                return $onValue(s);
            }
            else {

                const s = $setting;
                delete s.group;
                conf.configHeader = s;

                return {

                    skip: true,
                }
            }
        }
        else {

            return $onValue($setting);
        }
    };

    const postProcess = () => {

        if ($type !== 'database') {

            return;
        }

        conf.configHeader.vhost = conf.configHeader.value;
        delete conf.configHeader.value;
        conf.configHeader.type = 'database';
        delete conf.configHeader.default;
    };

    const processValue = ($setting, $value) => {

        //TODO: implement dependency parser for config-dependencies

        var s = setting.next();
        if (s) {

            s = s.value;
        }

        if ($value.then) {

            $value.then($v => {

                try {

                    addValue($setting, $setting.group, $setting.key, $v);
                }
                catch ($e) {

                    d.reject($e);
                    return;
                }

                if (s) {

                    if (s.group == '_info') {

                        s.skip = true;
                        process.nextTick(processValue.bind(this, 'configHeader', s));
                    }
                    else {

                        process.nextTick(processValue.bind(this, s, $onValue(s)));
                    }
                }
                else {

                    postProcess();
                    writeFile(conf);
                }
            }, d.reject);
        }
        else {

            if (!$value.skip) {

                try {

                    addValue($setting, $setting.group, $setting.key, $value);
                }
                catch ($e) {

                    d.reject($e);
                    return;
                }
            }

            if (s) {

                process.nextTick(processValue.bind(this, s, $onValue(s)));
            }
            else {

                postProcess();
                writeFile(conf);
            }
        }
    };

    const s = setting.next().value;
    processValue(s, processSetting(s));

    return d.promise;
};
