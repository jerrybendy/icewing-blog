---
title: BAE3.0如何在更新代码时保留本地写入的文件
tags:
  - SVN
id: 799
categories:
  - 网站
date: 2013-12-23 11:56:22
updated: 2016-05-22 11:34:40
---

BAE3.0在更新代码时会删除程序运行时在本地写的文件，本文介绍如何解决此类问题

### 1.   BAE3.0更新代码的机制

BAE3.0更新代码时会将执行单元中存在而svn中不存在的文件或目录删除。因此如果代码在运行过程中写了本地文件，那么再下次更新代码时本地文件就会本删掉。

### 2.   增加配置文件保留本地文件

BAE3.0在更新代码时同时首先会读取syncreserve.txt文件，会将此文件中的文件或者目录排除掉

### 3.   编辑syncreserve.txt文件

syncreserve.txt每一行代表一个目录或者一个文件，也可以是一个正则表达式

BAE在同步代码目录的过程中会排除syncreserve.txt每一行的内容

示例：

(1)     不同步upload和应用根目录的所有php文件目录

在syncreserve.txt中写入两行

upload

*.php

(2)     不同步upload目录下所有的jpg文件

upload/*.jpg

转自：[http://godbae.duapp.com/?p=293](http://godbae.duapp.com/?p=293)