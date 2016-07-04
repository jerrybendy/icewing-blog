---
title: Sublime Text启动时出现Unable to run package setup的错误的解决方法
tags:
  - SublimeText
id: 1141
categories:
  - 软件
date: 2014-11-05 23:54:14
---

本机安装的Sublime Text一直用着好好的，后来重装系统后把软件整个文件夹移到了C盘的program file(x86)文件夹里面去了，再之后打开软件就会出现一个错误框，基本的内容就是说“Unable to run package setup”。

产生这个问题原因可能有很多，我只说下我遇到的这个问题时的解决方案：

因为程序放在C盘，打开时可能会出现权限的问题，可以尝试下右键“以管理员身份运行”，如果以管理员身份可以运行的话就说明真的是权限的问题了，直接在Sublime Text的文件夹上点击右键->安全，把当前用户的权限添加进去并设置成完全控制，这样就OK了~~