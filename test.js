#!/usr/bin/env node

'use strict';

const mix = require('mics').mix;
const TAP = require('tap');


// Prepare environment to emulate SHPS
const {Result, Option} = require('rustify-js');
const nml = require('node-mod-load');

Option.registerGlobals();
Result.registerGlobals();
nml('SHPS4Node-config').addMeta('meth', {});
nml('SHPS4Node-config').addMeta('Config-sym.h', require('./interface/Config-sym.h'));
nml('SHPS4Node').addMeta('main', {
    mixins: {
        base: mix(superclass => class extends superclass {}),
        init: mix(superclass => class extends superclass {}),
    }
});


TAP.test('Test interface', $t => {

    const _interface = require('./interface/Config.h');
    require('./src/Config._init.c');
    const tmp = new _interface('');

    const funs = Object.getOwnPropertyNames(_interface).concat(Object.getOwnPropertyNames(_interface.prototype));

    $t.plan(funs.length);

    funs.forEach($fun => {

        if ($fun === 'constructor' || $fun === '_init') {

            $t.pass($fun + ' is always defined');
            return;
        }

        if (typeof tmp[$fun] === 'function') {

            $t.throws(tmp[$fun].bind(tmp), 'Check Interface ' + $fun + ' throw');
            return;
        }

        if (typeof _interface[$fun] === 'function') {

            if (['fromSome', 'fromNone'].indexOf(_interface[$fun].name) >= 0) {
                $t.pass('inline implementation');
                return;
            }

            $t.throws(_interface[$fun].bind(tmp), 'Check Interface ' + $fun + ' throw');
            return;
        }

        $t.pass($fun + ' is not a function');
    });

    $t.end();
});


nml('SHPS4Node-config').libs['Config-sym.h'] = undefined;
const Config = require('.');

TAP.test('Create Config Object', $t => {
    $t.plan(1);

    $t.ok(Config.init().unwrap(), 'Create Config');

    $t.end();
});

TAP.test('Read Template', $t => {
    $t.plan(3);

    /**
     * @type {Config}
     */
    const config = Config.init().unwrap();

    config
        .loadTemplates('test/templates')
        .then($r => {
            $t.equal($r.length, 1, 'Load Sample Template');
            $t.equal($r[0].template.foo.default, -1, 'Load Sample Template Content');
            $t.ok(config.getTemplate('sample'), 'Found template');
            $t.end();
        })
        .catch($t.fail)
    ;
});
