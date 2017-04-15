'use strict';

import Base from './base.js';

export default class extends Base {

    async indexAction(){

        this.assign("user_info", this.userInfo)

        return this.display();
    }
}