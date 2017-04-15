
PickerResume
==========
基于 JSON RESUME 格式的在线简历系统，可以在线预览、编辑、生成 WEB 页面，置换主题。

## 简介
一直以来简历最大的用途是以寻找工作为主，近几年自媒体、个人品牌建设的盛行，让我不得不去审视自己的价值还有哪些未能发挥；

这个简历暂只是初步原型，支持简历 **内容** 的标准化建立，以让个人信息发挥更大的价值，比如：人个信息可以生成 **信息卡** 个人信息卡又可以生成为名片，工作信息又可以生成 **案例卡**，等等；

我建设这个初步原型，以期待在接下来的持续更新中增加：
1. 个人信息卡（在线名片、H5信息页）
2. 案例卡（在线 Slides）
3. 技能卡（动态雷达图）
4. 简历交流、投递、友情评价
5. 建设多场景“简历”，演示的海报、团队的介绍、企业的关于我们等
6. 自品牌形象站（WEB、H5）

### 特点
- 可自行搭建，任意修改主题
- 支持多简历、多主题、多内容模板
- 支持 JSON RESUME 标准格式


## 演示地址
> resume.picker.cc [resume](http://resume.picker.cc) 简历展示页
> resume.picker.cc/admin [admin](http://resume.picker.cc/admin) 系统后台


```
账号: demo
密码: abcd1234
```

## 系统部分截图

### 简历页
![img](https://raw.githubusercontent.com/baisheng/picker-resume/master/screenshot/2.png)
### 后台登录页
![img](https://github.com/baisheng/picker-resume/blob/master/screenshot/1.png?raw=true)
### 简历管理页
![img](https://github.com/baisheng/picker-resume/blob/master/screenshot/3.png?raw=true)

## 安装部署
### install dependencies
```
npm install
```
### start server
```
npm start
```

### deploy with pm2

use pm2 to deploy app on production envrioment.

```
pm2 startOrGracefulReload pm2.json
```

### 使用 Dokku 部署

```
git push dokku master
```

## 系统要求
* Nodejs
* MySQL 5.7

## 库依赖
* [Thinkjs](http://thinkjs.org)
* [Vue.js](http://vuejs.org/)

## LICENSE
MIT



