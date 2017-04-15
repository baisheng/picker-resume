'use strict';

import Base from './base.js';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {

        // 获取默认应用
        // resumes - index
        let default_app = this.options['default_app'];

        if (default_app) {
            let controllerInstance = this.controller(default_app, 'admin');
            await this.action(controllerInstance, 'index')
        }
        return this.display();
    }
}