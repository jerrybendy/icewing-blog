---
title: 让IE也支持CSS3 Media Query
tags:
  - CSS3
  - 响应式布局
id: 896
categories:
  - 前端
date: 2014-01-29 01:43:16
updated: 2016-05-22 11:40:28
---

做网站都知道IE9以下是不支持CSS3的Media Query的，也就意味着响应式布局在低版本IE中无法实现，这样一来响应式设计的页面在IE下就可能会出现各种排版错误或横向滚动条，十分影响美观。而解决方法除了写CSS的时候以一个默认尺寸（一般为1024或1366）为基础来进行CSS Query，这样当IE识别不了Query的内容时就可以以默认尺寸展示。当然，在这里提供另一个解决方案：使用JS替代的实现Media Query。

这一类的JS有很多，我今天要介绍的是一款叫Respond.js的软件。

Respond.js 是一个快速、轻量的 polyfill，用于为 IE6-8 以及其它不支持 CSS3 Media Queries 的浏览器提供媒体查询的 min-width 和 max-width 特性，实现响应式网页设计（Responsive Web Design）。

[测试页面](http://scottjehl.github.io/Respond/test/test.html)

[Github地址](https://github.com/scottjehl/Respond)

Github源码中的文件会比较多，使用的话只需要下载“dest”目录下的“[respond.min.js](https://github.com/scottjehl/Respond/blob/master/dest/respond.min.js "respond.min.js")”即可。调用时只需在你的HTML的Head部分加入以下代码：

```html
<!--[if lt IE 9]>
    <script src="js/respond.min.js" type="text/javascript"></script>
<![endif]-->
```

剩下的事情就交给Respond来完成啦！

```css
@media (min-width:300px){
    body{background:#000;}
}
@media (min-width:700px){
    body{background:#F00;}
}
@media (min-width:1000px){
    body{background:#0F0;}
}
```

![respond](https://cdn.icewing.cc/wp-content/uploads/2014/01/respond-600x405.jpg)
