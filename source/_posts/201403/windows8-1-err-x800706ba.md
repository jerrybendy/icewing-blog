---
title: 解决Windows8.1应用商店无法安装软件0x800706ba的错误
tags:
  - Windows8
  - 应用商店
id: 967
categories:
  - Windows
date: 2014-03-06 22:47:02
---

最近在使用Win8.1的时候在安装软件时出现了无法购买您的应用，错误代码为0x800706ba的情况。

![无法购买您的应用](https://cdn.icewing.cc/wp-content/uploads/2014/03/ea81a88f8c5494eed7de02902cf5e0fe98257e1d-600x293.jpg)

&nbsp;

百度无果，最后Google搜了下，发现对于这个问题微软已经给出了解释，是由于软件冲突造成的。已知的软件如Adobe系列的软件，如Photoshop、Illustrater、Indesign等可能会与应用商店发生冲突从而导致应用无法下载安装。可以尝试把和Adobe相关的所有的启动项和服务项全部禁止掉（禁用后不会影响使用），然后重启，问题完美解决。
