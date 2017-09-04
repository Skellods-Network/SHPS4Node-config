'use strict';

const defer = require('promise-defer');
const fs = require('fs');
const nml = require('node-mod-load');
const path = require('path');

const libs = nml('SHPS4Node-config').libs;
const SHPS = nml('SHPS4Node').libs;


/**
 * Load all .json files from a directory
 *
 * @param $path {String}
 * @param $onFile {function(string,string): Promise.<(),Error>}
 * @param $onError {function(string,Error)}
 * @return {Promise.<Array.<*>,Error>}
 * @private
 */
libs.meth._loadFiles = function config_loadFiles($path, $onFile, $onError) {
    const d = defer();
    /**
     * @type {Promise.<Array.<String>>}
     */
    const readDir = new Promise(($res, $rej) => {
        fs.readdir($path, { encoding: 'utf8' }, ($err, $files) => {
            if ($err) {
                $rej($err);
                return;
            }

            $res($files);
        });
    });

    readDir
        .then($files => {
            const results = [];

            $files.forEach($file => {
                if (path.extname($file) !== '.json') {
                    return;
                }

                // Promise.all() will reject immediately if one promise rejects. We don't want that.
                // Hence we will resolve the Error instead,
                // which means the calling code will have to check for Errors itself.
                // Oh deer. Well, this is an internal method, so it's not that wild.
                const d = defer();
                results.push(d.promise);
                $onFile(path.join($path, $file), $file)
                    .then(d.resolve)
                    .catch($err => {
                        $onError($file, $err);
                        d.resolve($err);
                    })
                ;
            });

            Promise
                .all(results)
                .then($res => d.resolve($res))
                .catch($err => d.reject($err))
            ;
        })
        .catch($err => d.reject($err))
    ;


    return d.promise;
};
