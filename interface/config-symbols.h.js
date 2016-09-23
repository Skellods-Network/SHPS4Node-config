'use strict';

var me = module.exports;

me.template = {};
me.cfg = {};

me.domains = Symbol();
me.templates = Symbol();

me.cfg.master = Symbol();
me.cfg.vhosts = Symbol();

me.template.database = Symbol();
me.template.vhost = Symbol();
me.template.master = Symbol();
