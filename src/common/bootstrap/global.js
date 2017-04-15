/**
 * this file will be loaded before server started
 * you can define global functions used in controllers, models, templates
 */

/**
 * use global.xxx to define global functions
 *
 * global.fn1 = function(){
 *
 * }
 */

/**
 * ip转数字
 * @param ip
 * @returns {number}
 * @private
 */
/* global _ip2int(ip)*/
global._ip2int = function (ip) {
    var num = 0;
    ip = ip.split(".");
    num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
    num = num >>> 0;
    return num;
}
/**
 * 数字转ip
 * @param num
 * @returns {string|*}
 * @private
 */
/*global _int2ip(num: number) */
global._int2iP = function (num) {
    var str;
    var tt = new Array();
    tt[0] = (num >>> 24) >>> 0;
    tt[1] = ((num << 8) >>> 24) >>> 0;
    tt[2] = (num << 16) >>> 24;
    tt[3] = (num << 24) >>> 24;
    str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
    return str;
}


/**
 * 密码加密
 * @param password 加密的密码
 * @param md5encoded true-密码不加密，默认加密
 * @returns {*}
 */
/*global encryptPassword */
global.encryptPassword = function (password, md5encoded) {
    md5encoded = md5encoded || false;
    password = md5encoded ? password : think.md5(password);
    return think.md5(think.md5('picker.cc') + password + think.md5('Caixie'));
}


global.isURL = function (str_url) {
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
        + "[a-z]{2,6})" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);
    //re.test()
    if (re.test(str_url)) {
        return (true);
    } else {
        return (false);
    }
}

//时间格式
/* global time_format */
global.time_format = (time) => {
    return dateformat('Y-m-d H:i:s', time);
}
/* global str_replace()
 * str_replace(条件[]，替换内容[],被替换的内容)
 * @param search
 * @param replace
 * @param subject
 * @param count
 * @returns {*}
 */
/* global str_replace */
global.str_replace = function (search, replace, subject, count) {
    var i = 0, j = 0, temp = '', repl = '', sl = 0, fl = 0,
        f = [].concat(search),
        r = [].concat(replace),
        s = subject,
        ra = r instanceof Array, sa = s instanceof Array;
    s = [].concat(s);
    if (count) {
        this.window[count] = 0;
    }

    for (i = 0, sl = s.length; i < sl; i++) {
        if (s[i] === '') {
            continue;
        }
        for (j = 0, fl = f.length; j < fl; j++) {
            temp = s[i] + '';
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
            s[i] = (temp).split(f[j]).join(repl);
            if (count && s[i] !== temp) {
                this.window[count] += (temp.length - s[i].length) / f[j].length;
            }
        }
    }
    return sa ? s : s[0];
}
/**
 * 时间戳格式化 dateformat()
 * @param extra 'Y-m-d H:i:s'
 * @param date  时间戳
 * @return  '2015-12-17 15:39:44'
 */
/* global dateformat */
global.dateformat = function (date, extra) {
    let D = new Date(date);
    let time = {
        "Y": D.getFullYear(),
        'm': D.getMonth() + 1,
        'd': D.getDate(),
        'H': D.getHours(),
        'i': D.getMinutes(),
        's': D.getSeconds()
    }
    let key = extra.split(/\W/);
    let _date;
    for (let k of key) {
        time[k] = time[k] < 10 ? "0" + time[k] : time[k]
        _date = extra.replace(k, time[k])
        extra = _date;
    }
    return _date;
}

/**
 * 数组去重
 * @param arr
 * @returns {Array}
 */
/* global unique */
global.unique = function (arr) {
    // var result = [], hash = {};
    // for (var i = 0, elem; (elem = arr[i]) != null; i++) {
    //     if (!hash[elem]) {
    //         result.push(elem);
    //         hash[elem] = true;
    //     }
    // }
    // return result;
    return Array.from(new Set(arr));
}

global.sub_cate = function (data, pid) {
    var result = [],
        temp;
    var length = data.length;
    for (var i = 0; i < length; i++) {
        if (data[i].pid == pid) {
            //console.log(data[i]);
            result.push(data[i].id);
            temp = sub_cate(data, data[i].id);
            if (temp.length > 0) {
                result.push(temp.join(','));
            }
        }
    }
    return result;
};


/**
 * 排序函数
 */
function sort_node(v, w) {
    return v["sort"] - w["sort"];
}
function sort_node1(v, w) {
    return w["sort"] - v["sort"];
}
/**
 * global get_children
 * 获取子集分类 （这里是获取所有子集）
 */
global.get_children = function (nodes, parent, sn = 0) {
    // console.log(11);
    var children = [];
    var last = [];
    /* 未访问的节点 */
    /*
     * 获取根分类列表。
     * 创建一个虚拟父级分类亦可
     **/
    var node = null;
    for (var i in nodes) {
        node = nodes[i];
        if (node["pid"] == parent) {
            node["deep"] = 0;
            children.push(node);
        } else {
            last.push(node);
        }
    }
    if (sn == 0) {
        children.sort(sort_node);
    } else {
        children.sort(sort_node1);
    }


    /* 同级排序 */
    var jumper = 0;
    var stack = children.slice(0);
    /* easy clone */

    while (stack.length > 0
    /* just in case */ && jumper++ < 1000) {
        var shift_node = stack.shift();
        var list = [];
        /* 当前子节点列表 */
        var last_static = last.slice(0);
        last = [];
        for (var i in last_static) {
            node = last_static[i];
            if (node["pid"] == shift_node["id"]) {
                node["deep"] = shift_node["deep"] + 1;
                list.push(node);
            } else {
                last.push(node);
            }
        }
        if (sn == 0) {
            list.sort(sort_node);
        } else {
            list.sort(sort_node1);
        }


        for (var i in list) {
            node = list[i];
            stack.push(node);
            children.push(node);
        }
    }
    /*
     * 有序树非递归前序遍历
     *
     * */
    var stack = [];
    /* 前序操作栈 - 分类编号 */
    var top = null;
    /* 操作栈顶 */
    var tree = children.slice(0);
    /* 未在前序操作栈内弹出的节点 */
    var has_child = false;
    /* 是否有子节点，如无子节点则弹出栈顶 */
    var children = [];
    /* 清空结果集 */
    var jumper = 0;
    last = [];
    /* 未遍历的节点 */
    var current = null;
    /* 当前节点 */
    stack.push(parent);
    /* 建立根节点 */

    while (stack.length > 0) {
        if (jumper++ > 1000) {
            break;
        }
        top = stack[stack.length - 1];
        has_child = false;
        last = [];

        for (var i in tree) {
            current = tree[i];
            if (current["pid"] == top) {
                top = current["id"];
                stack.push(top);
                children.push(current);
                has_child = true;
            } else {
                last.push(current);
            }
        }
        tree = last.slice(0);
        if (!has_child) {
            stack.pop();
            top = stack[stack.length - 1];
        }
    }
    return children;
}


/**
 * in_array
 * @param stringToSearch
 * @param arrayToSearch
 * @returns {boolean}
 */
/* global in_array */
global.in_array = function (stringToSearch, arrayToSearch) {
    for (let s = 0; s < arrayToSearch.length; s++) {
        let thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch) {
            return true;
        }
    }
    return false;
}


/**
 * 分析枚举类型配置值 格式 a:名称1,b:名称2
 * @param str
 * @returns {*}
 */
/* global parse_config_attr */
global.parse_config_attr = function (str) {
    let strs;
    if (str.search(/\r\n/ig) > -1) {
        strs = str.split("\r\n");
    } else if (str.search(/,/ig) > -1) {
        strs = str.split(",");
    } else if (str.search(/\n/ig) > -1) {
        strs = str.split("\n");
    } else {
        strs = [str];
    }
    if (think.isArray(strs)) {
        let obj = {}
        strs.forEach(n => {
            n = n.split(":");
            obj[n[0]] = n[1];
        })
        return obj;
    }

}
/**
 * 把返回的数据集转换成Tree
 * @param array data 要转换的数据集
 * @param string pid parent标记字段
 * @return array
 */
/* global arr_to_tree */
global.arr_to_tree = function (data, parent) {
    var result = [], temp;
    var length = data.length;

    // console.log(length + "======")

    for (var i = 0; i < length; i++) {

        if (data[i].parent === parent) {
            result.push(data[i]);
            temp = arr_to_tree(data, data[i].id);
            if (temp.length > 0) {
                data[i].expanded = true;
                data[i].children = temp;
                data[i].chnum = data[i].children.length
            }
        }
    }
    return result;
}

global.menu_tree = function(data, parent){
    var result = [], temp;
    var length = data.length;

    for (var i = 0; i < length; i++) {
        if (!think.isEmpty(data[i].meta) && data[i].meta['_menu_item_menu_item_parent'] != null){
            if (data[i].meta['_menu_item_menu_item_parent'] == parent) {

                result.push(data[i]);
                temp = menu_tree(data, data[i].id);

                if (temp.length > 0) {
                    data[i].expanded = true;
                    data[i].children = temp;
                    data[i].chnum = data[i].children.length
                }
            }
        }
    }
    return result;
}



/* global arr_to_tree */
global.sub_cate = function (data, pid) {
    var result = [], temp;
    var length = data.length;
    for (var i = 0; i < length; i++) {
        if (data[i].pid == pid) {
            //console.log(data[i]);
            result.push(data[i].id);
            temp = sub_cate(data, data[i].id);
            if (temp.length > 0) {
                result.push(temp.join(','));
            }
        }
    }
    return result;
}

global.parse_type_attr = function (str) {
    let strs;
    if (str.search(/\r\n/ig) > -1) {
        strs = str.split("\r\n");
    } else if (str.search(/,/ig) > -1) {
        strs = str.split(",");
    } else if (str.search(/\n/ig) > -1) {
        strs = str.split("\n");
    } else {
        strs = [str];
    }
    if (think.isArray(strs)) {
        let arr = [];
        for (let v of strs) {
            let obj = {};
            v = v.split(":");
            if (!think.isEmpty(v[0]) && !think.isEmpty(v[1])) {
                obj.id = v[0];
                obj.name = v[1];
                if (obj.id.split(".").length == 1) {
                    obj.pid = 0
                } else {
                    obj.pid = obj.id.split(".").splice(0, obj.id.split(".").length - 1).join(".");
                }
                arr.push(obj);
            }
        }
        //console.log(arr);
        let tree = arr_to_tree(arr, 0)
        //think.log(tree);
        return tree;
    }

}


