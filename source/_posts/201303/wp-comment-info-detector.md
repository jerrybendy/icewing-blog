---
title: WordPress插件：Comment Info Detector/Show UserAgent，评论中显示国旗、操作系统、浏览器图标
tags:
  - wordpress
  - 插件
  - 美化
id: 99
comment: false
categories:
  - PHP
date: 2013-03-27 21:55:58
updated: 2016-05-22 10:55:00
---

WordPress自带的评论功能虽然很实用、易用，但是千篇一律的评论看多了也会视觉疲劳， 试想如果能在评论中显示评论者的一些信息，例如操作系统、浏览器等，岂不是很酷？顺便也可以小小地统计一下读者的状况（呵呵，目前也就只有这3个功能吧）

也许大家已经在别人的博客上见到了这个小工具的样貌，还在苦于查找是什么工具，或许能实现这个功能的插件有很多，在这里我向大家推荐一款我自己在用的插件 ： Comment Info Detector.还有一款插件与其功能相同，叫Show UserAgent，设置方法基本相同。

<!--下载图形部分-->
<div style="margin: 15px 0px 25px 0px;" align="center">[点击下载](http://wordpress.org/extend/plugins/comment-info-detector)</div>
<!--下载图形部分结束-->

### 主要功能

1、发现并且显示评论者的国旗、浏览器和操作系统标志；

2、支持多种浏览器和操作系统；

3、返回的字符串配置成适合您主题的格式。

### 安装方法

1、通过上面的链接转到WP的官网下载并上传，或者直接在WP后台插件处搜索并安装；

2、安装后直接启用，OK！

3、启用后并不能起到作用，还需要手动配置一下：单击控制台左侧的“设置”-->“Comment Info Detector”；

### 使用方法

设置界面比较简单，就不再截图了，就随便翻译一下吧：

**_Country Flag Icons Base URL:_** 用于查找国旗的目录，指向存放国旗图标的文件夹（默认即可）；

**_Restore Default URL:_** 还原成默认的URL，后面几个Restore按钮就不说了，还原默认；

**_Country Flag Template:_** 国旗模板，主要是定义图标的文件名及路径、图片标题和注释的格式；

**_Web Browser and OS Icons Base URL:_**和第一个国旗的目录一样，这个是浏览器和操作系统图标存储的路径；

**_Web Browser and OS Template:_**与Country Flag Tempate相同，是浏览器和操作系统的格式；

**_Display Country Flags Automatically:_**是否显示国旗，看个人需要吧，如果阅读者都是中国人的话可以不用显示（明显都是中国嘛，呵呵）；

**_Display Web Browsers and OS Automatically:_**同上，这个是问你是否要显示浏览器和操作系统图标（这个是我们安装此插件的目的，自然不用说），选Yes就行了。

最后不要忘记单击下面的_**Save Changes**_保存所有的设置。

最下面的_**Uinstall**_按钮是卸除插件用的。

&nbsp;

此时插件已经可以使用了，去看看你的评论有什么变化吧^_^

（另外可以通过修改插件目录下的comment-info-detector.css来改变显示的方式，因本人对CSS不太了解就不班门弄斧了，有兴趣的可以试试）

&nbsp;