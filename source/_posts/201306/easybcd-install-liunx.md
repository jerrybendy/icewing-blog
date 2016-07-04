---
title: EasyBCD全硬盘安装Liunx的方法
tags:
  - linux
  - ubuntu
  - 系统
id: 335
comment: false
categories:
  - Linux
date: 2013-06-16 10:17:43
---

以前有U盘时都是想着用怎样用U盘安装操作系统，如今U盘失踪了，就只能想着怎样直接利用硬盘安装操作系统了。对Windows7还好说，直接可以启动安装程序。Liunx嘛，之前的Ubuntu可以从Windows上直接启动，不过新版的都取消了这个功能，于是就不得不去寻找别的途径了。

之前看过一篇教程，在哪里记不起来了，是用Grub4DOS全硬盘安装Liunx，因为安装GRUB4DOS有些难度（主要还是C盘根目录里已经存在了grldr这个文件，不知道怎么办了），今天就说说利用EasyBCD安装Liunx的方法。

EasyBCD就不用多说了，是一款Windows7上面的强大的启动项管理软件，可以轻松地利用它增加及删除启动项，包括Windows、Liunx以及MAC的启动项。

（注：此方法本人仅在Ubuntu上测试过，其它Liunx系统未测试，但理论上是可以的）

分区神马的就不再说了，打开EasyBCD，左侧“Add New Entry”，-->“NeoGrub”-->“Install”，这样就添加了一个Grub的启动项（貌似就是Grub4DOS，至于本质上有什么区别就不知道了）。

接下来点“Configure”配置NeoGrub。此时打开一个记事本文档，在下面输入：

```
title Install Ubuntu
root (hd0,0)
kernel (hd0,0)/vmlinuz boot=casper iso-scan/filename=/ubuntu-11.10-i386.iso ro quiet splash locale=zh_CN.UTF-8
initrd (hd0,0)/initrd.lz
```

title是标题，就是要显示在NeoGrub引导界面的标题，这个可以随意。

root就是根目录，后面的(hd0,0)中的hd指硬盘，第一个0是指第一块硬盘，第二个0指第1个分区。如果你把安装Liunx的ISO镜像放在了第一块硬盘的第一个分区的话可以保持这个参数不变，但是Win7因为涉及到一个100MB的保留分区，这个分区不可能放下ISO文件，这时就要放在其它盘里了，如果盘符少的话可以依次从0去数这个分区号，如果不知道分区号的话可以使用DiskGenius查看分区号。下面三行的这个参数也要一块改。

打开Liunx的ISO文件，找到casper文件夹，复制initrd.lz和vmlinuz（也可能是vmlinuz.efi）到存放ISO的文件夹根目录，如果是vmlinuz.efi的话需要修改第三行的vmlinuz以指向正确的文件，然后修改第三行的iso文件名为正确的文件名。

修改第四行的initrd.lz为正确的文件名。

OK，保存，重启。

开机时找到NeoGRUB的启动项，进去，找到Intall Ubuntu，进入。

在安装之前记得，打开终端，输入代码：

```bash
sudo umount -l /isodevice
```

以取消对光盘所在驱动器的挂载，否则可能会找不到分区。

开始安装。。。