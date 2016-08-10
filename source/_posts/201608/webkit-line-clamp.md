---
title: CSS 限制文本的行数 —— -webkit-line-clamp 简介
date: 2016-08-10 19:01:36
updated: 2016-08-10 19:01:36
tags:
  - CSS
categories:
  - 前端
---

在写网页的时候经常会有需要限制某段文字不能超过多少行的需求, 尤其是在列表中。例如一般标题不应该超过一行、图文混排的区域文本一般不应超过图片的高度(如 5 行)等。

关于只限制一行, 多出来部分显示成省略号的方式可以参考 {% post_link css-text-overflow CSS使行内多出的文字显示成省略号 %}。 这里的主题是 `-webkit-line-clamp`, 可以限制文本为指定的行数, 超出部分显示为省略号。

先看下效果:

![效果](https://cdn.icewing.cc/201608/webkit-line-clamp-2.png)


`-webkit-line-clamp` 目前仍然是一个不规范的属性, 它并没有出现在 CSS 规范草案中。作用是限制一个块级元素显示的文本行数。

为了实现此效果还需要和其它的 CSS 属性组合使用, 如下:

* `display: -webkit-box;` **必须结合的属性**, 用于将对象作为弹性盒模型显示。
* `-webkit-box-orient` **必须结合的属性**, 设置或检索弹性盒模型的子元素的排列方式。
* `text-overflow`  可以隐藏多出的文本并用省略号代替。

### 基本语法

```css
-webkit-line-clamp: <number>;
```

其中, `<number>` 是块元素显示的文本的行数。

### 兼容性

来自 [CanIUse](http://caniuse.com/#feat=css-line-clamp) 的数据显示目前仅有 webkit 内核的浏览器支持此属性, 如 Chrome 、 Safari 、 Opera 、 安卓自带浏览器(安卓2.3以上)、 iOS 自带浏览器(5.1以上) 等。 **IE 和火狐并不支持此属性**。

![兼容性](https://cdn.icewing.cc/201608/webkit-line-clamp.png)


### 演示

{% jsfiddle ymb3qbcv result,css,html light 100% 400 %}


```css CSS
.line-clamp-2 {
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.line-clamp-3 {
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
```

```html HTML
<h3>
限制两行
</h3>

<p class="line-clamp-2">
Promise是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6将其写进了语言标准，统一了用法，原生提供了Promise对象。所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise是一个对象，从它可以获取异步操作的消息。Promise提供统一的API，各种异步操作都可以用同样的方法进行处理。Promise对象有以下两个特点。
（1）对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：Pending（进行中）、Resolved（已完成，又称Fulfilled）和Rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从Pending变为Resolved和从Pending变为Rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果。就算改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。
</p>


<h3>
限制三行
</h3>
<p class="line-clamp-3">
Promise是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6将其写进了语言标准，统一了用法，原生提供了Promise对象。所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise是一个对象，从它可以获取异步操作的消息。Promise提供统一的API，各种异步操作都可以用同样的方法进行处理。Promise对象有以下两个特点。
（1）对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：Pending（进行中）、Resolved（已完成，又称Fulfilled）和Rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从Pending变为Resolved和从Pending变为Rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果。就算改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。
</p>

<p><small>注* 文本内容摘自阮一峰老师的 《<a href="http://es6.ruanyifeng.com/#docs/promise" target="_blank">ECMAScript 6 入门</a>》</small></p>

```
