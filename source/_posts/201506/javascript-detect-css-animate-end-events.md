---
title: 使用JavaScript检测浏览器支持哪种CSS动画完成事件
tags:
  - CSS3
  - javascript
  - 动画
id: 1221
categories:
  - 前端
date: 2015-06-05 10:50:09
---

以前或许我们在做前端效果时都是在使用JS来，如JQuery的animate，而如今在前端效果中，CSS3占据越来越重要的作用，如何检测一个CSS3的动画是否结束并在结束后执行下一个动画呢？

用jQuery的时候可能是这样：

```js
$('.element').animate({left: '100px'}, function(){
    alert('动画执行结束');
});
```

下面以一个简单的例子演示下使用CSS3的动画如何响应这种操作：

```css
/* 一个简单的CSS3动画（这里不再写 -webkit- 之类的前缀了 */
@keyframes fade{
    from {left: 0;}
    to {left: 200px;}
}

.animate-fade{
    animation: fade 2s ease both;
}
```

使用 jQuery 操作（假设浏览器是webkit内核）

```js
$('.element').addClass('animate-fade').on('webkitAnimationEnd', function(){
    alert('动画执行结束');
});
```

好吧，其实上面代码中的`webkitAnimationEnd`部分才是本文要说的重点。因为目前不同的浏览器对HTML5和CSS3的支持不尽相同，很多CSS3样式不同内核的浏览器也有不同的前缀，同样，不同浏览器也支持不同的动画结束事件。

下面的代码演示了如何判断用户的浏览器支持哪一种动画结束事件，并返回。其基本原理是创建一个简单的DOM对象，并判断事件是否在DOM对象内存在。

```js
// 判断animationEnd事件
function detectAnimationEndEvents(){
    var t;
    var el = document.createElement('fakeelement');
    var animEndEventNames = {
      'WebkitAnimation' : 'webkitAnimationEnd',
      'OAnimation' : 'oAnimationEnd',
      'msAnimation' : 'MSAnimationEnd',
      'animation' : 'animationend'
    };

    for(t in animEndEventNames){
        if( el.style[t] !== undefined ){
            return animEndEventNames[t];
        }
    }
}

var animEndEventName = detectAnimationEndEvents();

// 判断transitionEnd事件
function detectTransitionEvents(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

var transitionEventName = detectTransitionEvents();
```

以上代码返回支持的动画结束事件的名称，直接用`on`就OK啦
