'use strict';

import Base from './base.js';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */

    init(http) {
        super.init(http);
        this.dao = this.model('posts');
    }

    async getAction(self){

        if (this.id){
            let _resume = await this.dao.where({id: this.id}).find();
            _resume = await this._format(_resume);
            return this.success(_resume);
        }
    }


    async _format(post){
        if (post.metas.length > 0) {
            post.meta = {};

            for (let meta of post.metas) {
                post.meta[meta.meta_key] = meta.meta_value;
            }
        }
        delete post.metas;

        return post;
    }


}
