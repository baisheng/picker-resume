'use strict';
/**
 * template config
 */
export default {
    type: 'nunjucks',
    content_type: 'text/html',
    file_ext: '.html',
    file_depr: '/',
    root_path: think.ROOT_PATH + '/view',
    adapter: {
        nunjucks: {
            tags:{
                // blockStart: '<%',
                // blockEnd: '%>',
                variableStart: '<$',
                variableEnd: '$>',
                // variableStart: '<?',
                // variableEnd: '?>'
                // commentStart: '<#',
                // commentEnd: '#>'
            },
            prerender: (nunjucks, env) => {
                /**
                 *分析枚举类型配置值 格式 a:名称1,b:名称2
                 */
                env.addFilter("parse_config_attr", function (str) {
                    return parse_config_attr(str)
                })
                /**
                 * 时间戳格式化 dateformat('Y-m-d H:i:s')
                 * @param extra 'Y-m-d H:i:s'
                 * @param date  时间戳
                 * @return  '2015-12-17 15:39:44'
                 */
                env.addFilter("dateformat", function (date, extra) {
                    let _extra = extra;
                    if (think.isEmpty(_extra)){
                        _extra = 'Y-m-d H:i:s';
                    }
                    return dateformat(date, _extra);
                })

                /**
                 * moment
                 * YYYY-MM-DD HH:mm:ss
                 * lll
                 */
                env.addFilter("moment", function (time, format) {
                    let moment = require('moment');
                    // moment.locale('zh-cn');
                    // if (think.isEmpty(config)) {
                    //     return moment(time).fromNow();
                    // } else {
                    //     return moment(time).format(config);
                    // }
                    moment.locale('zh-cn');
                    if (format === "default") {
                        format = 'YYYY-MM-DD HH:mm:ss';
                        return moment(time).format(format);
                    }

                    return moment(time).fromNow();
                })



                env.addFilter("strToArray", function (str, sn = ",") {
                    if (!think.isEmpty(str)) {
                        let ss = str.split(sn);// 在每个逗号(,)处进行分解。
                        return ss;
                    } else {
                        return str;
                    }
                })

                env.addFilter("in_Array", function (str, arr) {
                    arr = arr || 0;
                    if (!think.isArray(arr)) {
                        if (think.isNumber(arr)) {
                            arr = "'" + arr + "'";
                        }
                        arr = arr.split(",");
                    }
                    //console.log(arr);
                    return in_array(str, arr);
                })



                env.addFilter("language", async(name, callback) => {

                    // let lang = await language(name);
                    let lang = require("./locale/" + name).default;

                    callback(null, lang);

                }, true)

            }
        }
    }
};