'use strict';

const mix = require('mics').mix;
const nml = require('node-mod-load');

const meth = nml('SHPS4Node-plugin').libs.meth;
const mixins = nml('SHPS4Node').libs.main.mixins;

module.exports = mix(mixins.base, mixins.init, superclass => class Config extends superclass {

    /**
     * Constructor
     */
    constructor() { super(); meth._init.call(this); };

    /**
     * Generate a config file from a template
     *
     * @param {string} $type
     * @param {string} $fileName
     * @param {function} $onValue callable(SettingsObject)->value|Promise
     *   The first parameter of the callable will receive an object which contains all information about the setting
     *   available in the template, for example
     *   {
     *     default: "localhost",
     *     description: "XXXX",
     *     examples: [
     *       "localhost",
     *       "node.example.com",
     *     ],
     *     group: "generalConfig",
     *     key: "URL",
     *     type: "string",
     *   }
     *
     *   The resolver will have one parameter, which contains the final function name
     *   The rejector will have one parameter, which contains an Error Object
     * @param {number} $offsetGroup OPTIONAL
     * @param {number} $offsetSetting OPTIONAL
     */
    genConfig($type, $fileName, $onValue, $offsetGroup = 0, $offsetSetting = 0)
        { throw new Error('Not implemented: Config.genConfig'); };

    /**
     * Get whole configuration by name
     *
     * @param {string} $name
     * @result {object} without header
     */
    getConfig($name) { throw new Error('Not implemented: Config.getConfig'); };

    /**
     * Get the names of all loaded configs
     *
     * @return {Array<string>}
     */
    getConfigNames() { throw new Error('Not implemented: Config.getConfigNames'); };

    /**
     * Get a certain template by name
     *
     * @throws when template not available
     * @param $name string Name of template type
     * @return {object}
     */
    getTemplate($name) { throw new Error('Not implemented: Config.getTemplate!'); };

    /**
     * Get the names of all loaded templates
     *
     * @return {Array<string>}
     */
    getTemplateNames() { throw new Error('Not implemented: Config.getTemplateNames!'); };

    /**
     * Drop all loaded configs and read all config files at a path
     *
     * @param {string} $path
     * @result {Promise}
     */
    loadConfigs($path) { throw new Error('Not implemented: Config.loadConfigs'); };

    /**
     * Drop all loaded templates and read all template files at a path
     *
     * @param {string} $path
     */
    loadTemplates($path) { throw new Error('Not implemented: Config.loadTemplates'); };
});
