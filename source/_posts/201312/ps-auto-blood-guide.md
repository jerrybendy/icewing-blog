---
title: Photoshop自动添加3mm出血线的方法（脚本方法）
tags:
  - Photoshop
id: 801
categories:
  - 设计
date: 2013-12-24 16:55:54
updated: 2016-05-22 11:35:11
---

在使用Photoshop做平面设计的时候，尤其是做像名片、单页等印刷品需要加出血时，拉出血线总是一个麻烦而又不得不多次重复的问题，使用PS的动作虽然可以添加参考线，但只能按照设定好的位置添加，一旦改变图形的尺寸动作就不再有用了。

所以我有一个设想：就是可以用某种方法自动根据图片的尺寸、分辨率来计算出血线的位置，并且自动添加参考线。经过多方查找资料并没有找到这样的工具，却发现PS可以自己写脚本，于是又是查资料、查SDK，最终还是没能实现自动拉参考线的方法……

转而求其次：虽然不能自动创建参考线，那么如果能把需要的区域建立一个选区，然后再往矩形选区的四个边上拉参考线不就很方便了吗？！于是便有了以下代码（VBS代码）：

```vb
Dim appRef, startRulerUnits, startDisplayDialogs

Set appRef = CreateObject("Photoshop.Application")
' 保存现有设置
startRulerUnits = appRef.Preferences.RulerUnits
startDisplayDialogs = appRef.DisplayDialogs

' 判断是否有文档打开
if appRef.Documents.Count=0 then
  msgbox "没有打开任何文档",0,"错误"
else

' 设置单位和对话框
appRef.Preferences.RulerUnits = 1 '以像素为单位
appRef.DisplayDialogs = 3 '不显示对话框

' 计算3mm占多少个像素，如果需要建立的参考线的位置不是3mm的话只需要修改下面的0.3就可以了
dim dblResolution ,intPixs
dblResolution =appRef.ActiveDocument.Resolution
intPixs =0.3/2.54*dblResolution

'选择选区
selRegion = Array(Array(intPixs, intPixs), _
      Array(appRef.ActiveDocument.Width-intPixs, intPixs), _
  Array(appRef.ActiveDocument.Width-intPixs, appRef.ActiveDocument.Height-intPixs), _
  Array(intPixs, appRef.ActiveDocument.Height-intPixs), _
  Array(intPixs,intPixs))

  appRef.ActiveDocument.Selection.Select selRegion

' 还原设置
appRef.Preferences.RulerUnits = startRulerUnits
appRef.DisplayDialogs =  startDisplayDialogs

end if
```

把以上代码复制到词本，并且保存为“PS自动出血.vbs”，在PS中需要创建参考线的时候直接双击这个VBS文件即可创建出血位对应的选区，接着向选区的边缘拉参考线即可。

由于其它什么脚本语言也不会用，所以就弄了个VBS版的，高手有需要的可以自己改成需要的脚本语言。

![ps_guide](https://cdn.icewing.cc/wp-content/uploads/2013/12/ps_guide-600x376.jpg)

如上图，只需要把参考线拖到选区的边上就OK了。

（代码在PS CS5和CS6版本测试通过，其它版本没有测试）

&nbsp;

VBS文件下载地址：

[下载地址](https://share.icewing.cc/download/NTQyM2QxZDViMzc4Mg.html)

&nbsp;
