---
title: windows7下安装ubuntu做出双系统后，单独卸载ubuntu的实际经验（转）
tags:
  - linux
  - ubuntu
  - Windows7
id: 53
categories:
  - 系统
date: 2013-03-21 22:20:53
---

本人在windows 7 基础上安装了ubuntu双系统

使用一段时间的ubuntu后，虽然感觉不错，但是为了回收划分给ubuntu的10G硬盘空间（总共才120G），需要 <u>单独卸载ubuntu</u>

由于双系统是grub引导，所以单独在PE下格式化linux的硬盘分区，会造成grub无法引导windows 7 的情况——————也就是开机进不去系统，只有黑色grub画面了

卸载ubuntu的方法，百度可以出来，但是我实际操作了，所以分享一下，<u>供大家研讨</u>

卸载方法很多，说明以下其中的两种：

1、<u>有windows7安装盘的</u>，可以pe环境格式化linux分区后，利用windows7盘修复mbr主引导记录，进去windows7        -----------------不详细讲，有安装盘了就上网随便百度，简单

2、身边<u>什么盘都没有的朋友</u>，我就是这种情况，因为假期在家没工具

可以下载fixmbr工具，在windows7系统环境下操作，重建修复mbr引导，具体如下      ----------------------------好处，windows7环境操作，重启即可

示例：

1.我要修复C盘的xp引导（NT），下载fixmbr工具，放在c盘，利用命令提示符，进入软件所在目录，cd c:fixmbr    （cd后面一个空格）

2.输入 `MBRFix /drive 0 fixmbr /yes`         （即  MBRFix空格/drive空格0空格fixmbr空格/yes  ）

3.重启，发现可以直接进入windows7画面了，没有grub画面了

4.然后可以格式化linux分区了（应该会吧）

5.ubuntu单独卸载成功

这样做的好处就是可以<u>在windows7环境下操作</u>，因为我没有系统盘，<u>无需任何复杂工具</u>

<u>我的是windows7 亲自操作，xp  vista理论可以，请自测</u>

刚刚卸载成功，很高兴，留给需要的朋友

来自：[http://www.ylmf.net/read.php?tid=1507962](http://www.ylmf.net/read.php?tid=1507962)
