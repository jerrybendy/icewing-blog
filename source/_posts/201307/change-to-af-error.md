---
title: '硬盘写入助手出现Change partition type to AF: not a HFS partition错误的解决方法'
tags:
  - MAC
id: 405
categories:
  - MAC
date: 2013-07-13 16:04:48
---

安装黑苹果时使用硬盘写入助手写入系统镜像到分区时出现Change partition type to AF: not a HFS partition的错误

```
Image file:D:\QQDownload\OS_X_Lion\OS_X_Lion.iso
Type: iso/hfs.
File size:4144381952 Bytes
Image size:4101210111 Bytes
To driver:e
Driver size:6447693824 Bytes
Dump image file to driver,please wait...
Change partition type to AF: not a HFS partition
Load boot1h: not a HFS partition
Load startupfile: not a HFS partition
All done, have fun!
Dump image file to driver,please wait...
Change partition type to AF: Faild
All done, have fun!
```

###  解决方法

1、使用管理员权限运行；

2、论坛有种说法是把目标分区切换成另一个分区，然后再切换回来；

3、似乎这款软件和DiskGenius有冲突，关掉DiskGenius后再次以管理员权限运行即可。