---
title: 推荐一个WP代码高亮插件SyntaxHighlighter
tags:
  - wordpress
  - 插件
id: 1069
categories:
  - PHP
date: 2014-09-09 00:38:51
updated: 2016-05-22 11:56:46
---

网络关于Wordpress代码高亮插件有很多，我之前使用的是一款叫做<span style="color: #000000;">Crayon Syntax Highlighter的插件，界面比较漂亮，而且设置项丰富。在使用Crayon Syntax Highlighter一段时间后发现此插件占用系统资源比较高，容易导致网页打开速度变慢，而且此插件似乎还与我用的主题有些冲突，以致于前台的复制、小窗打开等功能不能用，无奈之下去寻求别的插件。</span>

在各WP论坛上见除了<span style="color: #000000;">Crayon Syntax Highlighter之外被讨论最多的就属SyntaxHighlighter了，网上关于此插件的说明多如牛毛，我也就带过了，挑一些有用的说下。</span>

SyntaxHighlighter Evolved基于开源的JS核心库：SyntaxHighlighter JavaScript package by Alex Gorbatchev二次开发扩展的。安装后只需简单设置一下，不用修改任何代码即可达到很好的效果。

插件效果可以参见我的另一篇文章中的代码部分：[WordPress文章和评论中自动应用短网址](http://blog.icewingcc.com/wordpress-shorturl.html "WordPress文章和评论中自动应用短网址")

### 特点

1.  代码高亮
2.  支持Eclips、Emacs等多种样式，可搭配不同风格的主题
3.  特色——显示工具条。右上角显示工具条，可以”查看源代码”、”复制源代码”、”打印源代码”。（只有第2版支持）
4.  显示行号
5.  长代码自动换行（只有第2版支持）
6.  可以点击代码中的超文本链接
7.  可以收缩代码框
8.  高亮显示模式—某一行高亮
9.  设置开始行号
10.  自定义样式

### 插件安装

直接在WP后台安装插件处搜索`SyntaxHighlighter Evolved`安装即可，或者从[Wordpress官网下载](http://wordpress.org/plugins/syntaxhighlighter)后安装到plugins目录下。

### 使用方法

这款插件不像<span style="color: #000000;">Crayon Syntax Highlighter在后台编辑页面直接有可用的按钮，它需要在文本模式下编辑标签才可以使用，如（注意：请把前面的@去掉）：</span>

```
 [@php]这里写你的代码[/php]

 [@css autolinks="false" classname="myclass" collapse="false" firstline="1" gutter="true" highlight="1-3,6,9" htmlscript="false" light="false" padlinenumbers="false" smarttabs="true" tabsize="4" toolbar="true" title="example-filename.php"]这里写你的代码[/css]

 [@code lang="js"]这里写你的代码[/code]

 [@sourcecode language="plain"]这里写你的代码[/sourcecode]
 ```

方括号里面是语言标签，也可以添加一些属性，像代码高亮的行、是否显示工具条等。可用的语言标签还有很多，如：bash、shell、cli、cpp、c、css、delphi、diff、patch、java、js、javascript、text、perl、php、powershell、py、python、ruby、sql、vb、vbnet、xml、html等等数十种（完整的支持列表请参见官网文档）。

### 需要注意的地方

1、设置中提供了Highlighter Version的两个版本，即Version2.X和Version3.X，推荐使用Version2.X，因为像代码自动换行功能以及右上角的源码/打印工具条只有在2.X版本下才能显示。

2、编辑代码时最好在源代码模式下，即WP的“文本”模式下编辑，以避免“可视化”编辑中出现的代码转义。

3、像HTML实体中的大于号、小于号等在文本模式下不需要转义书写，直接粘贴源代码进去就可以了，而这种转义字符在“预览”时会被显示成转义后的，不用管它，直接发布（或更新）文章，发布后文章可以正常显示。
