---
title: 【分享】手机淘宝的flexible设计与实现
date: 2016-09-07 20:34:15
updated: 2016-09-07 20:34:15
tags:
  - 分享
  - 淘宝
  - flexible
categories:
  - 前端
---


看到小黑的文章 [关于webapp中的文字单位的一些捣腾](http://www.html-js.com/article/2400) 感觉很赞。尤其是，他提到了手机淘宝的meta，所以觉得要讲讲我们这方面的一些实践。

手机淘宝从2014年中开始，全面推行flexible设计。什么叫flexible呢？其实flexible就是responsive的低端形态和基础。对我们来说，最直观的感受就是，在超宽屏幕上，网页显示不会两边留白。以前pc时代大家经常讲的流体布局，其实就是一种flexible design。只不过，流体的表述角度是实现，flexible的表述角度是结果，为了跟高大上的responsive保持一致，我们这里使用了flexible这个说法。

讨论方案之前，需要先了解三个关键概念：

* 单位英寸像素数（Pixel Per Inch，PPI）：现实世界的一英寸内像素数，决定了屏幕的显示质量
* 设备像素比率（Device Pixel Ratio，DPR）：物理像素与逻辑像素（px）的对应关系
* 分辨率（Resolution）：屏幕区域的宽高所占像素数

当我们决定不同屏幕的字体和尺寸的单位时，屏幕的这几个参数非常重要。

## 场景1——Resolution适配

一张banner图片，当你面对不同的屏幕时你希望它的行为是怎样的？

在这个场景中，我们主要需要面对的是分辨率适配问题，考虑到多数网页都是纵向滚动的，在不同的屏幕尺寸下，banner的行为应该是**总是铺满屏幕宽度**以及**总是保持宽高比**。

最自然的思路是使用百分比宽度，但是假如使用百分比宽度，即width:100%，我们又有两种思路来实现固定宽高比：一是利用img标签的特性，只设宽度等图片加载完，这种方法**会导致大量的重排**，并且非固定高度会导致懒加载等功能难以实现，所以果断放弃；二是使用before伪元素的margin撑开高度，这种方法是比较干净的纯css实现，但是**不具备任何复用性**而且**要求特定html结构**，所以也只好放弃了。

于是，剩下最合适的办法是使用其它相对单位，本来最合适的单位是vw，它的含义是视口宽度，但是这个单位**存在严重的兼容问题**，所以也只好放弃。

最后我们只好配合js来做，硬算也是一条路，但是同样不具备任何可复用性，最终我们选择了rem，我们用js给html设置一个跟屏幕宽度成正比的font-size，然后把元素宽高都用rem作为单位。

这是我们目前的线上方案了，它是一个近乎Hack的用法，已知的问题包括：

* 某些Android机型会丢掉rem小数部分
* 占用了rem单位
* 不是纯css方案

## 场景2——PPI适配

一段文字，当你面对不同的屏幕时你希望它的行为是怎样的？

显然，我们在iPhone3G和iPhone4的Retina屏下面，希望看到的文字尺寸是相同的，也就是说，我们**不希望文字在Retina屏尺寸变小**，此外，我们在**大屏手机上，希望看到更多文字**，以及，现在绝大多数的字体文件，是自带一些点阵尺寸的，通常是16px和24px，所以我们**不希望出现13px、15px这样的奇葩尺寸**。

这样的特征决定了，场景1中的rem方案，不适合用到段落文字上。所以段落文字应该使用px作为单位，考虑到Retina，我们利用media query来指定不同的字体，考虑到dpr判定的兼容性，我们用宽度替换来代替：

```css
.a {
    font-size:12px
}
@media (min-width: 401px){
    .a {
        font-size:24px
    }
}
```

另一种场景，一些标题性文字，希望随着屏幕宽而增大的，我们可以仍然使用rem作为单位。超过35px（个人直观感受）的文字，已经不用太考虑点阵信息了，靠字体的矢量信息也能渲染的很好。

## 场景3——DPR匹配

一个区块，设计稿上有1像素边框，当你面对不同的屏幕时你希望它的行为是怎样的？

这个场景，需求很简单，设计师**希望在任何屏幕上这条线都是1物理像素**。

好吧，当然这个问题的答案不是写1px那么简单。在retina屏下面，如果你写了这样的meta


```html
<meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
```

你将永远无法写出1px宽度的东西，除此之外，inline的SVG等元素，也会按照逻辑像素来渲染，整个页面的清晰度会打折。

所以，手机淘宝用JS来动态写meta标签，代码类似这样：


```js
var metaEl = doc.createElement('meta');
var scale = isRetina ? 0.5:1;
metaEl.setAttribute('name', 'viewport');
metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
if (docEl.firstElementChild) {
    document.documentElement.firstElementChild.appendChild(metaEl);
} else {
    var wrap = doc.createElement('div');
    wrap.appendChild(metaEl);
    documen.write(wrap.innerHTML);
}
```

## 结语

总的来说，手机淘宝的flexible方案是综合运用rem和px两种单位+js设置scale和html字体。

这些JS的内容，可以在我们开源的库ml中找到：

[https://github.com/amfe/lib.flexible](https://github.com/amfe/lib.flexible)

---

分享自：前端乱炖（[http://www.html-js.com/article/Like-the-winter-flexible-design-and-implementation-of-the-mobile-phone-Taobao-cold](http://www.html-js.com/article/Like-the-winter-flexible-design-and-implementation-of-the-mobile-phone-Taobao-cold)）


