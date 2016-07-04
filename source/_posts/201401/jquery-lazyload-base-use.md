---
title: JQuery Lazyload的基本用法
tags:
  - JQuery
id: 821
categories:
  - 前端
date: 2014-01-03 21:36:24
updated: 2016-05-22 11:41:59
---

由于最近做的一个小网页需要用到懒加载的效果于是便研究了下JQuery的Lazyload插件。本文不深入讲解，只说下此插件的基本用法（也许只有不到10%的人会用到其它的复杂的方法，我就挑90%的人会用到的说）。

JQuery Lazyload Github地址：[https://github.com/tuupola/jquery_lazyload](https://github.com/tuupola/jquery_lazyload)

~~我就不单独做示例了，在我做的Tab页（[http://tab.byi.pw](http://tab.byi.pw)）里面也能看到效果。~~ （该网站目前已改成 React，不再使用jQuery）

首先需要载入JQuery库和Lazyload插件：

```html
<script src="jquery.js" type="text/javascript"></script>
<script src="jquery.lazyload.js" type="text/javascript"></script>
```

在需要应用Lazyload效果的“img”标签上作如下修改：

```html
<img class="lazy" data-original="img/example.jpg" width="640" height="480">
```

其中只有data-original属性是必须的，它取代原来的src属性而指向实际要显示的图片，img的src属性可以省略，也可以指向一个简单的图片或载入动画。

JS部分：

```js
$("img.lazy").lazyload();
```

可以看出来，插件的使用非常简单。

&nbsp;

另外，JQuery Lazyload有几个常用的参数。

```js
$("img.lazy").lazyload({
    effect:"fadeIn",  //图片加载时的动画
    placeholder : "img/grey.gif", //图片载入前的默认图片
    load:function(){    //图片载入完成后执行的回调函数
        console.log('image loaded');
     }
});
```

关于JQuery Lazyload的参数及使用方法网上有很多，不过关于这个load的回调函数却很少有提及（官网也没有提到这个回调函数），在这里重点提一下，这个回调是在一张图片加载完成时执行的，例如在图片加载完成后计算图片的宽高等都是在这里。

```js
$('img').lazyload({
    load:function(){
        console.log($(this).height());
    }
});
```
