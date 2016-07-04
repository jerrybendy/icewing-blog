---
title: Wordpress中more标签的作用
tags:
  - more
  - wordpress
id: 551
categories:
  - PHP
date: 2013-09-08 22:27:08
---

只要熟悉[WordPress](http://blog.icewingcc.com/category/wordpress)的用户都应该知道<!--more-->标签。在撰写文章时，你可以在文章的正文中插入<!--more--> 标签来创建文章摘要。这样文章里默认就会显示 “more…” 链接，读者点击它就可以阅读整篇文章。使用more标签时，在所有的非单篇文章浏览形式（如分类、标签和存档）下只会显示文章摘要，而只有在单片文章浏览形式下才会显示整篇文章内容。接下来我们就来看看下面的例子。

假设你有一篇文章内容如下:
> Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio.
>
> Quisque volutpat mattis eros. Nullam malesuada erat ut turpis mattis.
>
> Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.
>
> <!---more--->
>
> Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer
>
> ligula vulputate sem tristique cursus. Nam nulla quam, gravida non dolor,
>
> commodo a semper suscipit, sodales sit amet, nisi adipiscing.

那么在非单篇文章浏览形式下，你的文章将会这样显示:

> Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio.
>
> Quisque volutpat mattis eros. Nullam malesuada erat ut turpis mattis.
>
> Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.
>
> more…

而浏览单篇文章时，显示的内容如下:

> Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio.
>
> Quisque volutpat mattis eros. Nullam malesuada erat ut turpis mattis.
>
> Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.
>
> Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer
>
> ligula vulputate sem tristique cursus. Nam nulla quam, gravida non dolor,
>
> commodo a semper suscipit, sodales sit amet, nisi adipiscing.
全文显示了这篇文章并且没有more链接。

**为何要使用more标签?**

主要是因为摘要显示很实用，你可以在主页上显示多篇文章摘要，这样读者不需要往下拉动页面太多就可以快速地浏览所有文章的大概内容。如果你的摘要吸引了读者的注意力，他们就会想接着阅读整篇文章，那么只要点击“more”标签创建的链接就可以了。因此，这里就给大家介绍几种自定义more链接的文本内容的方法。

来源：[http://www.wordpress.la/WordPress-more-tag-tips.html](http://www.wordpress.la/WordPress-more-tag-tips.html)
