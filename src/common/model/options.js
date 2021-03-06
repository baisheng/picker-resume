'use strict';
/**
 * model
 */
export default class extends think.model.base {
    /**
     * options cache key
     * @type {String}
     */
    cacheKey = 'website_options';
    /**
     * cache options
     * @type {Object}
     */
    cacheOptions = {
        timeout: 30 * 24 * 3600 * 1000,
        type: !think.isMaster ? 'file' : 'memory'
    };
    //
    async getOption(name) {
        let options = await this.getOptions(true);

        return await think._.find(options, name);
    }

    async list() {
        let data = await this.select();
        return data;
    }

    //
    /**
     * get options
     * @return {} []
     */
    async getOptions(flag) {
        if (flag === true) {
            await think.cache(this.cacheKey, null);
        }
        let ret = await think.cache(this.cacheKey, async () => {
            let data = await this.select();

            let result = {};
            data.forEach(item => {
                result[item.key] = item.value;
            });
            return result;
        }, this.cacheOptions);

        //comment type
        if (ret) {
            if (ret.comment && think.isString(ret.comment)) {
                ret.comment = JSON.parse(ret.comment);
            }
            if (!ret.comment) {
                ret.comment = {type: 'disqus'};
            }
            // upload settings
            if (ret.upload && think.isString(ret.upload)) {
                ret.upload = JSON.parse(ret.upload);
            }
            if (!ret.upload) {
                ret.upload = {type: 'local'};
            }
            if (ret.push_sites && think.isString(ret.push_sites)) {
                ret.push_sites = JSON.parse(ret.push_sites);
            }
            if (!ret.push_sites) {
                ret.push_sites = {};
            }
        }

        return ret;
    }

    /**
     * update options
     * @return {} []
     */
    async updateOptions(key, value) {

        console.log(key + ": " + value);


        let data = think.isObject(key) ? think.extend({}, key) : {[key]: value};
        let cacheData = await think.cache(this.cacheKey, undefined, this.cacheOptions);

        if (think.isEmpty(cacheData)) {
            cacheData = await this.getOptions();
        }
        let changedData = {};
        for (let key in data) {
            if (data[key] !== cacheData[key]) {
                changedData[key] = data[key];
            }
        }
        //data is not changed
        if (think.isEmpty(changedData)) {
            return;
        }
        let p1 = think.cache(this.cacheKey, think.extend(cacheData, changedData), this.cacheOptions);

        let promises = [p1];
        for (let key in changedData) {
            let value = changedData[key];
            let exist = await this.where({key: key}).count('key');
            let p;
            if (exist) {
                p = this.where({key: key}).update({value: value});
            } else {
                p = this.add({key, value});
            }
            promises.push(p);
        }
        await Promise.all(promises);

        let ret = await this.getOptions(true);

        return ret;
    }

    /**
     * 获取当前模板模块
     * @returns {Promise.<*>}
     */
    async getThemeMods() {

        // console.log('theme_mods');
        // let theme_slug = await this.getOption('stylesheet');
        let options = await this.getOptions(true);

        let theme_slug = options['stylesheet'];

        // console.log(JSON.stringify(theme_slug))
        let mods = options['theme_mods_' + theme_slug];
        console.log(JSON.stringify(mods));
        if (!think.isEmpty(mods)) {
            return mods;
        }
        else {
            return null;
        }
        // if (!think.isEmpty(mods)){
        //     let theme_name = options['current_theme'];
        //
        // }
        //  $mods = get_option( "theme_mods_$theme_slug" );
        //  if ( false === $mods ) {
        //      $theme_name = get_option( 'current_theme' );
        //      if ( false === $theme_name )
        //          $theme_name = wp_get_theme()->get('Name');
        //      $mods = get_option( "mods_$theme_name" ); // Deprecated location.
        //      if ( is_admin() && false !== $mods ) {
        //          update_option( "theme_mods_$theme_slug", $mods );
        //          delete_option( "mods_$theme_name" );
        //      }
        //  }
    }
}