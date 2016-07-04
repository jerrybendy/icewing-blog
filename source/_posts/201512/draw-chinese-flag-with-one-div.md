---
title: 仅用一个DIV和CSS绘制中国国旗
tags:
  - CSS3
  - 国旗
id: 1275
categories:
  - 前端
date: 2015-12-20 19:09:12
updated: 2016-05-17 23:09:00
---

看了国外一个网站使用一个DIV绘制图形的例子，想到也试着用一个DIV画一面中国国旗吧，于是便动手试了下。当然因为文字投影没办法旋转的原因，四颗小星星不能做到指向中心的大星星，还是有些BUG的。以下是实现效果：

{% jsfiddle 4fk29rth result,html,css light 100% 470 %}


&nbsp;

下面是使用的HTML代码，外层的DIV仅仅是后面的背景，请无视。

```html
    <div id="flag">
        <div></div>
    </div>
```

CSS代码：

```css
#flag {
    width: 600px;
    height: 400px;
    background: #898989;
    margin: 0 auto;
    position: relative;
}

#flag div {
    position: absolute;
    left: 75px;
    top: 50px;
    background: #f00;
    background: -webkit-linear-gradient(-45deg, #ff0000 0%,#d60000 18%,#ff0000 41%,#d30000 68%,#ff0000 100%);
    background: linear-gradient(135deg, #ff0000 0%,#d60000 18%,#ff0000 41%,#d30000 68%,#ff0000 100%);
    width: 450px;
    height: 300px;
    box-shadow: 4px 4px 8px rgba(0,0,0,.4);
}

#flag div:before {
    content: "★";
    position: absolute;
    color: #ffff37;
    font-size: 90px;
    left: 33px;
    top: 37px;
}

#flag div:after {
    content: "★";
    position: absolute;
    color: #ffff37;
    font-size: 33px;
    left: 140px;
    top: 18px;
    text-shadow: 33px 36px 0 #ffff37,
                33px 82px 0 #ffff37,
                0 115px 0 #ffff37;
}

```

目前使用`text-shadow`的方案似乎是解决不了星星旋转角度的问题的，如果抛开仅用一个DIV的限制，倒可以轻轻松松的使用`transform`完成旋转。
