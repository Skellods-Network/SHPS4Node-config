# SHPS4Node-config
Config module of SHPS4Node

```javascript
class Config {

    constructor() { this._init(); };

    /**
     * Get setting from config file
     *
     * @deprecated
     *   use getVHostConfig(), getDBConfig() or getMasterConfig() instead
     *   scheduled for removal in v2.0.0
     * @param $group
     * @param $key
     * @param $domain
     * @return void|string|int|boolean
     */
    getHPConfig($group, $key, $domain) { throw 'Not implemented'; };

    /**
     * Get settings from config file
     * $section and $key are optional. If no $key is set, all config options will be returned as an Object.
     * If additionally $section is not set either, all sections will be returned as a map with maps of their respective keys as values
     *
     * @param $url string URL for which the config should be retrived
     * @param $section string OPTIONAL
     * @param $key string OPTIONAL
     * @return mixed
     */
    getVHostConfig($url, $section, $key) { throw 'Not implemented'; };

    /**
     * Get settings from config file
     * $alias and $key are optional. If no $key is set, all config options will be returned as an Object.
     * If additionally $alias is not set either, all databases will be returned as a map with maps of their respective keys as values
     * Each vhost will have at least the aliases default, logging, usermanagemet
     *
     * @param $url string URL for which the config should be retrived
     * @param $alias string OPTIONAL
     * @param $key string OPTIONAL
     * @return mixed
     */
    getDBConfig($url, $alias, $key) { throw 'Not implemented'; };

    /**
     * Get settings from config file
     * $key is optional. If no $key is set, all config options will be returned as an Object.
     *
     * @param $key string OPTIONAL
     * @return mixed
     */
    getMasterConfig($key) { throw 'Not implemented'; };

    /**
     * Read all config files and store them
     *
     * @todo: if no config available: ask user to input config step-by-step and write config file
     * @return
     *  Promise()
     */
    readConfig() { throw 'Not implemented'; };

    /**
     * Get whole configuration of certain homepage
     * 
     * @deprecated scheduled for removal in v2.0.0
     * @param string $uri
     * @return array|null
     */
    getConfig($uri) { throw 'Not implemented'; };
};
```
