'use strict';

import Base from './base.js';
import * as fs from 'fs';
import * as path from 'path';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */

    init(http) {
        super.init(http);
        // this._terms = this.model('terms');
        this.dao = this.model('posts');
        this.tactive = "article";
    }

    async indexAction() {
        return this.display();
    }


    async _update(data) {
        await this.dao.where({id: data.id}).update(data);
    }


    /**
     * 添加内容
     *
     * @returns {Promise<PreventPromise>}
     */
    async addAction() {
        // console.log("add action");
        let type = this.get('type');
        let ID = this.get('id');

        if (this.isPost()) {
            let data = this.post();
            let _id = data.id;

            data.modified = !think.isEmpty(data.modified) ? new Date(data.modified).valueOf() : new Date().getTime();
            data.date = !think.isEmpty(data.date) ? new Date(data.date).valueOf() : new Date().getTime();

            // console.log();
            // Update
            if (!think.isEmpty(_id)) {
                let rows = await this.dao.update(data);

                return this.json({_id: _id});

            } else {

                let insertId = await this.dao.add(data);

                return this.json({_id: insertId});
            }
        }

        if (!think.isEmpty(type)) {
            // if (!think.isEmpty(ID)) {
            //     console.log("查询出内容草稿和当前内容")
            // }
            return this.display(`${type}_${this.http.action}`)

        } else {
            // return 404
        }
    }

    /**
     * 简历管理
     *
     * @returns {Promise.<void>}
     */
    async resumeAction() {

        if (this.isPost()) {
            let data = this.post();

            data.type = 'resume';
            if (think.isEmpty(data.meta)) {
                data.meta = {
                    _resume_section: [
                        {
                            "name": "profiles",
                            "active": true
                        },
                        {
                            "name": "education",
                            "active": true
                        },
                        {
                            "name": "work",
                            "active": true
                        },
                        {
                            "name": "additionalWork",
                            "active": true
                        },
                        {
                            "name": "skills",
                            "active": true
                        },
                        {
                            "name": "languages",
                            "active": true
                        },
                        {
                            "name": "interests",
                            "active": true
                        },
                        {
                            "name": "awards",
                            "active": false
                        },
                        {
                            "name": "references",
                            "active": false
                        },
                        {
                            "name": "publications",
                            "active": false
                        }
                    ]
                }
            }
            await this._post(data);
        }

        if (this.isGet()) {
            let _id = this.get('id');
            if (!think.isEmpty(_id)) {
                // let resumeModel = this.model('resumes');
                let _resume = await this.dao.where({id: _id}).find();

                _resume = await this._format(_resume);

                // 处理 JSON 字符数据为 Object 数据
                _resume['content_json'] = JSON.parse(_resume['content_json']);
                _resume['meta']['_resume_section'] = JSON.parse(_resume['meta']['_resume_section']);

                // console.log(JSON.stringify( _resume.meta._resume_section))
                if (!think.isEmpty(_resume)) {
                    this.assign("_id", _id);
                    this.assign("_title", _resume.title);
                    this.assign("resume", _resume.content_json.resume);
                    this.assign("_resume_section", _resume.meta._resume_section);

                } else {
                    this.assign("resume", [])

                }
                return this.display();


            } else {
                let _model = this.model('resume_template');

                let _template_id = this.get('template');
                let _resume = {};
                if (!think.isEmpty(_template_id)) {
                    _resume = await _model.where({"id": _template_id}).find();
                }
                else {
                    //TODO: 默认模板待考量
                    _resume = await _model.where({"id": 1}).find();

                }

                this.assign("_id", 0);
                this.assign("_title", '');
                this.assign("_type", '');
                this.assign("resume", JSON.parse(_resume.content).template);
                this.assign("_resume_section", JSON.parse(_resume.content).meta.sections);

                return this.display();

            }

        }

    }

    async _format(post) {
        if (post.metas.length > 0) {
            post.meta = {};

            for (let meta of post.metas) {

                // console.log(meta.meta_key + ":" + meta.meta_value);
                post.meta[meta.meta_key] = meta.meta_value;
            }
        }
        delete post.metas;

        return post;
    }


    async _post(data) {

        let _id = data.id;
        data.author = this.userInfo.id;
        // console.log(_id + "-------")
        data.modified = !think.isEmpty(data.modified) ? new Date(data.modified).valueOf() : new Date().getTime();
        data.date = !think.isEmpty(data.date) ? new Date(data.date).valueOf() : new Date().getTime();
        // if (!think.isEmpty(data.content_json)){
        //     data.content_json = JSON.stringify(data.content_json);
        // }

        // Update
        if (!think.isEmpty(_id)) {
            let rows = await this.dao.update(data);
            await this._resume_meta(data);
            return this.json({_id: _id});

        } else {

            let insertId = await this.dao.add(data);
            data.id = insertId;
            await this._resume_meta(data);

            return this.json({_id: insertId});
        }
    }

    async _resume_meta(data) {
        let _menu_metas = await this.model('postmeta').where({post_id: data.id}).select();
        let _meta_data = data.meta;

        if (!think.isEmpty(_meta_data)) {
            for (let key of Object.keys(_meta_data)) {

                let _meta_item = think._.find(_menu_metas, {meta_key: key});

                // if meta 存在
                if (!think.isEmpty(_meta_item)) {

                    // console.log(JSON.stringify(find_meta) + "*****");
                    // Update meta
                    _meta_item['meta_value'] = JSON.stringify(_meta_data[key]);

                    // console.log(JSON.stringify(find_meta) + "======")

                    let rows = await this.model('postmeta').where({
                        post_id: data.id,
                        meta_key: key
                    }).update(_meta_item);

                    if (rows > 0) {
                        // await this.infoMsg('菜单项更新成功')

                    } else {
                        await this.infoMsg('未能更新信息!')

                    }

                } else {
                    // Insert meta
                    let insert = await this.model('postmeta').add({
                        post_id: data.id,
                        meta_key: key,
                        meta_value: JSON.stringify(_meta_data[key])
                    });

                    if (insert > 0) {
                        // await this.infoMsg('成功添加菜单项')
                    }
                }
            }
        }
    }


    async pictureAction() {

        let file = think.extend({}, this.file('file'));

        let filepath = file.path;
        let basename = path.basename(filepath);

        let ret = {'status': 1, 'info': '上传成功', 'data': ""}
        let res;

        let $upload = this.option.upload;

        //加入七牛接口
        if ($upload.type === "qiniu") {

            let qiniu = think.service("qiniu");
            let instance = new qiniu();
            let uppic = await instance.upload(filepath, basename);

            if (!think.isEmpty(uppic)) {

                let data = {
                    author: this.userInfo.id,
                    title: file.originalFilename,
                    name: uppic.hash,
                    // path: '/upload/picture/' + dateformat(new Date().getTime(), "Y-m-d") + '/' + basename,
                    type: 'attachment',
                    mime_type: file.headers['content-type'],
                    guid: "http://" + $upload.option.domain + "/" + uppic.key,
                    create_time: new Date().getTime(),
                    status: 1,

                };

                // const _attachment_metadata = await sharp(file.path).metadata();
                // delete _attachment_metadata.exif;

                let _post_id = await this.dao.add(data);

                if (!think.isEmpty(_post_id)) {
                    // this.dao.addPostMeta(_post_id, "_attachment_metadata", _attachment_metadata);
                    await this.dao.addPostMeta(_post_id, "_attachment_file", uppic.key);
                }

                ret['data'] = data;

            }


        } else {
            let uploadPath = think.RESOURCE_PATH + '/upload/picture/' + dateformat(new Date().getTime(), "Y-m-d");

            think.mkdir(uploadPath);

            if (think.isFile(filepath)) {
                fs.renameSync(filepath, uploadPath + '/' + basename);

            } else {
                console.log("文件不存在！")

            }
            file.path = uploadPath + '/' + basename;


            if (think.isFile(file.path)) {
                let _path = '/upload/picture/' + dateformat(new Date().getTime(), "Y-m-d") + '/' + basename;

                let data = {
                    author: this.userInfo.id,
                    title: file.originalFilename,
                    name: basename,
                    // path: '/upload/picture/' + dateformat(new Date().getTime(), "Y-m-d") + '/' + basename,
                    type: 'attachment',
                    mime_type: file.headers['content-type'],
                    guid: this.options.site_url + _path,
                    create_time: new Date().getTime(),
                    status: 1,

                }
                // const _attachment_metadata = await sharp(file.path).metadata();
                // delete _attachment_metadata.exif;

                let _post_id = await this.dao.add(data);
                // this.dao.addPostMeta(_post_id, "_attachment_metadata", _attachment_metadata);
                await this.dao.addPostMeta(_post_id, "_attachment_file", _path);


                ret['data'] = data;
            } else {
                console.log('not exist')
            }
        }
        return this.json(ret);
    }

    async deleteAction() {
        if (this.isGet()) {
            let _id = this.get('id');

            let rows = await this.dao.update({id: _id, status: 'trash'});
            if (rows > 0) {
                await this.successMsg('已删除至回收站')

                return this.success("操作成功!  ")

            }
        }

        if (this.isPost()) {
            let ids = this.get('ids');

            if (!think.isEmpty(ids)) {
                let id_arr = [];
                if (ids.search(/,/ig) > -1) {
                    id_arr = ids.split(",");
                } else {
                    id_arr = [ids]
                }

                for (let _id of id_arr) {
                    let rows = await this.dao.update({id: _id, status: 'trash'});
                    if (rows > 0) {
                        await this.successMsg(_id + ': 已删除至回收站')

                    } else {
                        await this.errorMsg(_id + ': 删除失败！')

                    }
                }

                return this.success("操作成功!  ")
            }
            return this.fail('操作失败或未找到要更新的数据!');
        }

        return this.fail('操作失败或未找到要更新的数据!');

    }

    /**
     * 修改内容
     *
     * @returns {Promise.<void>}
     */
    async editAction() {
        let post = await this.dao.find(id);

        this.assign("post", post);
        // console.log()
        return this.display();
    }

    async pendingAction() {
        let query = {};
        query.type = "article";
        // query.status = ['NOT IN', 'trash']
        // query.status = ['IN', 'auto-draft,draft'];
        // query.status = ['IN', 'auto-draft,draft'];
        query.status = 'pending';
        // if (!think.isEmpty(type)) {
        //     query.type = type;
        // }

        let fields = [];
        // 文档模型列表始终要获取的数据字段 用于其他用途
        fields.push('id');
        fields.push('author');
        fields.push('status');
        fields.push('type');
        fields.push('title');
        fields.push('name');
        // fields.push('content');
        fields.push('excerpt');
        fields.push('date');
        fields.push('modified');
        fields.push('parent');
        // fields.push('uid');
        // fields.push('conter_id');
        // fields.push('type');
        // fields.push('cover_id');
        //过滤重复字段
        fields = unique(fields);

        let list = await this.dao.where(query).field(fields.join(",")).order('modified DESC').page(this.get("page"), 10).countSelect();

        let _taxonomy = this.model('taxonomy');

        for (let item of list.data) {
            item.terms = await _taxonomy.getTermsByObject(item.id);
        }
        let treeList = await arr_to_tree(list.data, 0);

        list.data = treeList;

        return this.json(list);
    }


    async trashedAction() {

        let query = {};
        query.type = "article";
        // query.status = ['NOT IN', 'trash']
        query.status = "trash";

        // if (!think.isEmpty(type)) {
        //     query.type = type;
        // }

        let fields = [];
        // 文档模型列表始终要获取的数据字段 用于其他用途
        fields.push('id');
        fields.push('author');
        fields.push('status');
        fields.push('type');
        fields.push('title');
        fields.push('name');
        // fields.push('content');
        fields.push('excerpt');
        fields.push('date');
        fields.push('modified');
        fields.push('parent');
        // fields.push('uid');
        // fields.push('conter_id');
        // fields.push('type');
        // fields.push('cover_id');
        //过滤重复字段
        fields = unique(fields);

        let list = await this.dao.where(query).field(fields.join(",")).order('modified DESC').page(this.get("page"), 10).countSelect();

        let _taxonomy = this.model('taxonomy');

        for (let item of list.data) {
            item.terms = await _taxonomy.getTermsByObject(item.id);
        }
        let treeList = await arr_to_tree(list.data, 0);

        list.data = treeList;

        return this.json(list);
    }

    /**
     * 根据分类类别，查询全部分类
     *
     * @param string taxonomy 传入分类类别名称, 如果没有值默认值为 category.
     * @returns {Promise.<void>}
     */
    async listAction() {
        let type = this.get('type');

        console.log(type + "--------")

        let query = {};
        query.type = "article";
        query.status = ['NOT IN', 'trash']
        if (!think.isEmpty(type)) {
            query.type = type;
        }

        let fields = [];
        // 文档模型列表始终要获取的数据字段 用于其他用途
        fields.push('id');
        fields.push('author');
        fields.push('status');
        fields.push('type');
        fields.push('title');
        fields.push('name');
        // fields.push('content');
        fields.push('excerpt');
        fields.push('date');
        fields.push('modified');
        fields.push('parent');
        // fields.push('uid');
        // fields.push('conter_id');
        // fields.push('type');
        // fields.push('cover_id');
        if (type === 'resume') {
            fields.push('content_json')
        }
        //过滤重复字段
        fields = unique(fields);

        let list = await this.dao.where(query).field(fields.join(",")).order('modified DESC').page(this.get("page"), 10).countSelect();

        let _taxonomy = this.model('taxonomy');

        for (let item of list.data) {
            item.terms = await _taxonomy.getTermsByObject(item.id);
        }

        let treeList = await arr_to_tree(list.data, 0);

        list.data = treeList;
        /**
         * 处理内容为　JSON 对象
         */
        for (let item of list.data) {
            item.content_json = JSON.parse(item.content_json);
        }
        return this.json(list);
    }

}
