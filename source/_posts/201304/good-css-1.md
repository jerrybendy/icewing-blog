---
title: 编写高效的CSS提高CSS渲染效率的一些技巧
tags:
  - HTML/CSS
  - 技巧
  - 效率
id: 186
categories:
  - 前端
date: 2013-04-03 23:52:44
---

最近忙着找工作,面试的时候有这样一道题目:列举至少10条CSS影响页面渲染效率的写法.
虽然写了将近一年的CSS了,但这个问题还真没详细总结过,当时回答的不完整,回来后赶紧查找相关资料.
经过查阅资料以及跟朋友们的交流,大致总结出以下几点:

### 1.尽量避免使用IE滤镜

滤镜是IE私有属性,而非W3C标准,因此只在IE下有效,其他标准浏览器都不支持,滤镜会明显降低页面的渲染效率,既耗资源兼容性又差,所以要尽量避免使用

### 2.尽量少使用`*`号选择符

例:
```css
*{…}, #id *{…}
```

`*`在CSS中作为通配符 选择所有的元素 建议尽量避免使用`*`选择符.

原因有2:

1. 使用`*`会遍历全部的标签 所以会降低渲染效率
2. `*`号作为通配符会对所有的样式进行重新定义

### 3.不宜使用过小的背景图片进行大面积平铺

一张宽高1px的背景图片，虽然文件体积非常之小，但渲染宽高500px的板块需要重复平铺2500次。提高背景图片渲染效率跟图片尺寸及体积有关，最大的图片文件体积保持约70KB。

* 不赞成 – 宽高8px以下的平铺背景图片
* 建议用 – 衡量适中体积及尺寸的背景图片

### 4.少使用绝对(相对)定位

一行代码搞死IE6

```html
<style>*{position:relative}</style><table><input></table>
```

### 5.颜色值的写法

编写十六进制颜色值时你可能会用小写字母或省略成3位数，关于这写法没找到确实的数据证明对浏览器的渲染效率是否有影响，但十六进制的颜色值默认标准是大写及6位数标注。在未知情况下不希望冒险而降低了渲染的效率。

* 不赞成 – `color:#f3a;`

* 建议用 – `color:#FF33AA;`

### 6.善于利用属性继承

避免编写冗余代码的另外一个办法就是注意子元素从父元素那里继承下来的属性。可以继承的属性着实不多，可其中很多还是不常用到的属性，像voice-family。常用的可继承属性的列出来也没几个(按字母顺序):

* color — 颜色
* font (and related properties) — 字体及相关属性
* letter-spacing — 字距
* line-height — 行高
* list-style (and related properties) — 列表样式及相关属性
* text-align — 文本对齐
* text-indent — 文本缩进
* text-transform — 文本转换
* white-space — 空白
* word-spacing — 词距

### 7.CSS选择符的使用

CSS书写的时候我们经常会采用简写(shorthand),当简写与效率冲突的时候应该首先考虑效率.比如:上面提到的第5条.

另外CSS中expression也是非常消耗资源的,这是绝对应该避免使用的.

&nbsp;

转自：[http://www.yiyifly.com/blog/archives/317 | 吹衣轻飏](http://www.yiyifly.com/blog/archives/317)