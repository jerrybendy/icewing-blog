---
title: CSS3圆圈加载效果
tags:
  - CSS3
  - HTML/CSS
id: 484
categories:
  - 前端
date: 2013-08-31 18:37:32
updated: 2016-05-22 11:23:54
---

本效果需要浏览器支持CSS3，如果您的浏览器属于远古浏览器（IE6等），那么是无法看到这个效果的。

<!--more-->

<iframe scrolling="no" width="100%" height="300" src="https://jsfiddle.net/sogtz65p/embedded/result,js,html,css/light" frameborder="0" allowfullscreen=""></iframe>

```css
#circle {
	background-color: rgba(0,0,0,0);
	border:5px solid rgba(10,10,10,0.9);
	opacity:.9;
	border-right:5px solid rgba(0,0,0,0);
	border-left:5px solid rgba(0,0,0,0);
	border-radius:50px;
	box-shadow: 0 0 35px #808080;
	width:50px;
	height:50px;
        margin:0 auto;
	position:fixed;
        left:30px;
        bottom:30px;
	-moz-animation:spinPulse 1s infinite ease-in-out;
	-webkit-animation:spinPulse 1s infinite ease-in-out;
	-o-animation:spinPulse 1s infinite ease-in-out;
	-ms-animation:spinPulse 1s infinite ease-in-out;

}
#circle1 {
	background-color: rgba(0,0,0,0);
	border:5px solid rgba(20,20,20,0.9);
	opacity:.9;
	border-left:5px solid rgba(0,0,0,0);
	border-right:5px solid rgba(0,0,0,0);
	border-radius:50px;
	box-shadow: 0 0 15px #202020;
	width:30px;
	height:30px;
        margin:0 auto;
        position:fixed;
        left:40px;
        bottom:40px;
	-moz-animation:spinoffPulse 1s infinite linear;
	-webkit-animation:spinoffPulse 1s infinite linear;
	-o-animation:spinoffPulse 1s infinite linear;
	-ms-animation:spinoffPulse 1s infinite linear;
}
@-moz-keyframes spinPulse {
	0% { -moz-transform:rotate(160deg); opacity:0; box-shadow:0 0 1px #505050;}
	50% { -moz-transform:rotate(145deg); opacity:1; }
	100% { -moz-transform:rotate(-320deg); opacity:0; }
}
@-moz-keyframes spinoffPulse {
	0% { -moz-transform:rotate(0deg); }
	100% { -moz-transform:rotate(360deg);  }
}
@-webkit-keyframes spinPulse {
	0% { -webkit-transform:rotate(160deg); opacity:0; box-shadow:0 0 1px #505050; }
	50% { -webkit-transform:rotate(145deg); opacity:1;}
	100% { -webkit-transform:rotate(-320deg); opacity:0; }
}
@-webkit-keyframes spinoffPulse {
	0% { -webkit-transform:rotate(0deg); }
	100% { -webkit-transform:rotate(360deg); }
}
@-o-keyframes spinPulse {
	0% { -o-transform:rotate(160deg); opacity:0; box-shadow:0 0 1px #505050; }
	50% { -o-transform:rotate(145deg); opacity:1;}
	100% { -o-transform:rotate(-320deg); opacity:0; }
}
@-o-keyframes spinoffPulse {
	0% { -o-transform:rotate(0deg); }
	100% { -o-transform:rotate(360deg); }
}
@-ms-keyframes spinPulse {
	0% { -ms-transform:rotate(160deg); opacity:0; box-shadow:0 0 1px #505050; }
	50% { -ms-transform:rotate(145deg); opacity:1;}
	100% { -ms-transform:rotate(-320deg); opacity:0; }
}
@-ms-keyframes spinoffPulse {
	0% { -ms-transform:rotate(0deg); }
	100% { -ms-transform:rotate(360deg); }
}
```

在需要加载的位置添加

```html
<div id="circle"></div>
<div id="circle1"></div>
```

最后加入淡入淡出的Javascript代码

```js
$(window).load(function() {
    $("#circle").fadeOut(500);
    $("#circle1").fadeOut(700);
});
```
&nbsp;

内容来自：[小董博客](http://303i.com/article/2013/08/08/1082.html)

