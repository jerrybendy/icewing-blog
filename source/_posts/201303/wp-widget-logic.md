---
title: WordPress插件：Widget Logic，轻松实现不同页面显示不同侧边栏
tags:
  - wordpress
  - 插件
id: 88
comment: false
categories:
  - PHP
date: 2013-03-27 00:03:45
updated: 2016-05-22 10:55:00
---

<span class="wp_keywordlink">WordPress</span> 本身的侧栏显示效果是全站的，这样显示不是非常合理的。如何让不同的页面显示不同的侧边栏，可以说是让不懂代码的童鞋们非常头痛的事。就拿童鞋们做友情链接吧，如果你不懂代码，只能全站侧边栏显示对方的链接，而对方却只在首页显示你的链接，让自己感觉心里不是很平衡。

不懂代码没关系，只要懂得使用插件，一样可以做到。[Widget Logic](http://wordpress.org/extend/plugins/widget-logic)侧边栏管理插件就很好的实现了这一功能，让你的博客不同的页面显示不同的侧边栏。

[Widget Logic](http://wordpress.org/extend/plugins/widget-logic) 侧边栏管理插件给每个 widget 一个扩展控制 [Widget logic](http://wordpress.org/extend/plugins/widget-logic)，你可以通过它根据不同页面自定义你的侧边栏内，只需要在 widget 新增的 Widget logic 选项里加入相应的标记代码，就可以轻松实现博客侧边栏的管理，实现你的个性化设置。

&nbsp;
<div align="center">[点击下载](http://wordpress.org/extend/plugins/widget-logic)</div>
&nbsp;

### Widget Logic 插件使用方法

1.下载 Widget Logic 插件，你可以在后台下载，如果你的后台不能直接下载，可以去官网下载（点击下载）。

2.安装好 Widget Logic 插件，然后再启用。

3.进入外观里的小工具管理栏，你会发现下面多了一个 Widget Logic options 的设置选择项，钩选 Use 'widget_content' filter 选项，并点击 Save 保存，如下图：

![](https://cdn.icewing.cc/wp-content/uploads/2013/03/1.jpg)

4.再查看 widget ，会发现每个里都多了一个 Widget logic 选择项。只要在 Widget logic 选项里填上相应的标记代码，就能实现不同的页面侧栏显示效果。如下图：

![](https://cdn.icewing.cc/wp-content/uploads/2013/03/21.jpg)

### Widget Logic 插件设置方法

如果你只需要某个 widget 只在首页显示，只要在 widget 的 Widget logic 选项里填上 `is_home()` 这个标记代码就可以了。更多详细设置方法[点击这里](http://wordpress.org/extend/plugins/widget-logic/other_notes)查看。

### Widget Logic 常用的标记

is_home() 主页

is_single() 文章页

is_page() 页面

is_category() 文章分类页

is_tag() 文章标签页

is_archive() 归档页

is_404() 404页

is_search() 搜索结果页

&nbsp;

is_home() 仅主页显示

!is_home() 除主页以外的页面显示

!is_category(5) 仅在ID非5的分类显示

is_home() || is_category('baked-goods')在主页或名称为baked-goods的分类显示

is_page('about')仅在关于页显示

&nbsp;

&nbsp;

文章转自：http://www.chenguangblog.com/archives/wordpress-widget-logic

有改动
