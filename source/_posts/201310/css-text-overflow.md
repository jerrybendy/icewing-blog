---
title: CSS使行内多出的文字显示成省略号
tags:
  - HTML/CSS
id: 724
categories:
  - 前端
date: 2013-10-19 01:51:31
---

在使用HTML+CSS排版的时候经常出遇到一个问题：某一行内容的长度无法确定，而网页上留的空间就那么大，如果字符过多就会影响排版；单纯的使用`overflow:hidden`来截断字符串又会给人一种段落（或标题）已经结束的错觉。

最好的方法就是如上图那样，在将要超出区域的前几个字符变成省略号，后面的全隐藏了。下面就说一下用CSS的实现方法，只需要三行，上代码：

```css
p {
   white-space:nowrap;
   text-overflow:ellipsis;
   overflow:hidden;
}
```

其中，`wite-space:nowrap`规定当文本内容一行显示不完时不换行；

`text-overflow:ellipsis`规定当文本超出时显示省略号而不是简单的裁切；

`overflow:hidden`规定内容超出区域时裁切。