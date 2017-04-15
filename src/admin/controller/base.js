'use strict';

export default class extends think.controller.base {
    init(http) {
        super.init(http);
    }
    /**
     * before
     */
    async __before() {

        this.options = await this.model('options').getOptions();

        this.option = await this.model('option').getOptions();


        this.assign("options", this.options);
        this.lang = this.options.lang;
        let http = this.http;


        if (http.controller === 'user' && http.action === 'login') {
            return;
        }
        let userInfo = await this.session('userInfo') || {};

        if (think.isEmpty(userInfo)) {
            if (this.isAjax()) {
                return this.fail('NOT_LOGIN');
            }
            return this.redirect('/admin/user/login');
        }
        this.userInfo = userInfo;

        this.assign('user_info', userInfo);

        if (!this.isAjax()) {
            this.assign('userInfo', {id: userInfo.id, name: userInfo.name, type: userInfo.type});
        }

    }


    /**
     * 异步的消息提示
     *
     * @param message
     * @param style
     * @returns {Promise.<void>}
     */
    async addMessage(message, style) {
        let index = 0, message_arr = [];

        let messages = await this.session('messages');

        if (!think.isEmpty(messages) && think.isArray(messages)) {
            // index = messages.length + 1;
            message_arr = messages;

        }

        message_arr.push( {
            'message': message,
            'class': style
        });

        await this.session('messages', message_arr);
    }

    async infoMsg(message) {
        await this.addMessage(message, 'info');
    }

    async errorMsg(message) {
       await this.addMessage(message, 'error');
    }

    async successMsg(message) {

        await this.addMessage(message, 'success');
    }

    /**
     * call magic method
     * @return {} []
     */
    async __call() {
        if (this.isAjax()) {
            return this.fail('ACTION_NOT_FOUND');
        } else {
            return this.redirect('/admin/login');

        }
        let model = this.model('options');
        let options = await model.getOptions();
        //不显示具体的密钥
        options.two_factor_auth = !!options.two_factor_auth;
        options.analyze_code = escape(options.analyze_code);
        options.comment.name = escape(options.comment.name);
        try {
            options.navigation = JSON.parse(options.navigation);
        } catch (e) {
            options.navigation = [];
        }
        delete options.push_sites; //不显示推送的配置，会有安全问题
        this.assign('options', options);
        return this.display('index/index');
    }

    //跨域设置
    setCorsHeader() {
        this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
        this.header("Access-Control-Allow-Headers", "x-requested-with");
        this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
        this.header("Access-Control-Allow-Credentials", "true");
    }

}