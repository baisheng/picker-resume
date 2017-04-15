'use strict';

import Base from './base.js';

export default class extends Base {

    init(http){
        super.init(http);
    }
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        let default_index = this.options.default_index;

        let resumeModel = this.model('posts');

        if (!think.isEmpty(default_index)){
            let data = await resumeModel.where({id: default_index}).find();

            data = await this._format(data);

            if (!think.isEmpty(data)) {

                let jsonResume = JSON.parse(data.content_json).resume;

                this.assign('resume', jsonResume);
                this.assign('_section', JSON.parse(data.meta._resume_section));
            }

        }
        return this.displayView('index');

    }

    /**
     * 处理 meta 信息
     * @param post
     * @returns {Promise.<*>}
     * @private
     */
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