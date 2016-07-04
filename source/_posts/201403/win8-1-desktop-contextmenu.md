---
title: 解决Win8.1桌面点右键卡的问题
tags:
  - Windows8
id: 953
categories:
  - Windows
date: 2014-03-03 22:33:15
---

最近没事玩玩Windows8.1，因为要安装到移动硬盘，所以就下载了企业版（因为只有企业版支持Windows To Go）。昨天在公司装好系统、装好软件，一切正常，今天在自家电脑上启动后却出现了在桌面点击鼠标右键卡住的情况，鼠标指针一直转啊转的~而在其它地方都没问题，软件也能正常打开，开始界面也没有问题，只是桌面不能点右键，不巧的是我还有个动不动刷两下的习惯~~

经网上查资料，此故障可能是由显卡设置或别的什么右键菜单项目引起的，可以通过个性注册表来解决此问题。把以下内容复制到记事本，并保存成“a.reg”，双击导入即可：
```
Windows Registry Editor Version 5.00
[-HKEY_CLASSES_ROOT\Directory\Background\shellex\ContextMenuHandlers]
[HKEY_CLASSES_ROOT\Directory\Background\shellex\ContextMenuHandlers\New]
@="{D969A300-E7FF-11d0-A93B-00A0C90F2719}"
```

因为这个第二行的部分涉及的删除注册表键值，为避免错误删除了有用的键值就使用了手动改注册表的方法。按Win+R打开“运行”，输入“regedit”打开注册表编辑器，在左侧窗格中定位到“HKEY_CLASSES_ROOT\Directory\Background\shellex\ContextMenuHandlers”查看它下级的项，发现里面有个NVDIA的项目（公司电脑是NVDIA的显卡，装上驱动后会在桌面右键快捷方式中添加NVDIA的控制面板），家里电脑是I3集成的核显，桌面右键菜单的卡顿很可能就与这个有关系（键值已删，所以我也不记得叫什么名字了），直接删除这个键值，一切OK~

在删除这个键值的时候可以看到还有一些其它的桌面右键菜单项在里面，如果使用上面的导入注册表的方法显然无论这些右键菜单是否有用都将会被删除，当然操作之前先备份一下注册表还是很有必要的。例如我，就不知道自己删除的是什么了~
