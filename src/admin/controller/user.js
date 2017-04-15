'use strict';

import Base from './base.js';

/**
 * 用户登录控制
 */
export default class extends Base {

    /**
     * login
     * @return {} []
     */
    async loginAction(){
        let is_login = await this.islogin();

        if(this.isPost()) {

            //校验帐号和密码
            let username = this.post('username');
            let userModel = this.model('users');
            let userInfo = await userModel.where({name: username}).find();
            if (think.isEmpty(userInfo)) {
                return this.fail('ACCOUNT_ERROR');
            }

            //帐号是否被禁用，且投稿者不允许登录
            if ((userInfo.status | 0) !== 1 || userInfo.type === 3) {
                return this.fail('ACCOUNT_FORBIDDEN');
            }

            //校验密码
            let password = this.post('password');
            if (!userModel.checkPassword(userInfo, password)) {
                return this.fail('ACCOUNT_ERROR');
            }

            await this.session('userInfo', userInfo);

            return this.success();
        }

        // TODO 添加管理用户的测试数据
/*

        let data = {
            password : 'deadline-123',
            username: 'baisheng',
            email: 'baisheng@outlook.com',
            display_name: '佰晟',
            type: 1,
            status: 1
        }
        await this.model('users').addUser(data)
 */
        else {
            if (is_login) {
                return this.redirect('/admin');

            } else {
                return this.display();
            }
        }
    }
    /**
     * logout
     * @return {}
     */
    async logoutAction(){
        await this.session('userInfo', '');
        return this.redirect('/admin');
    }

    /**
     * update user password
     */
    async passwordAction() {
        let userInfo = await this.session('userInfo') || {};
        if(think.isEmpty(userInfo)){
            return this.fail('USER_NOT_LOGIN');
        }

        let rows = await this.model('users').saveUser({
            password: this.post('password'),
            id: userInfo.id

        }, this.ip());

        return this.success(rows);
    }

    async islogin() {
        let user = await this.session('userInfo');

        return !think.isEmpty(user);
    }
}