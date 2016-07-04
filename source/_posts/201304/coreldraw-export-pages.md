---
title: CorelDraw批量导出多页
tags:
  - CorelDraw
  - 技巧
  - 设计
  - 软件
id: 234
categories:
  - 设计
date: 2013-04-13 21:34:16
---

在使用CorelDraw时经常需要导出具有多页的文档，例如一本画册、一批版面等，少则几十页，多则上百页，虽然可以使用一页一页导出的办法，但数量一多也会显得很浪费时间。

在AI里面可以直接使用“导出”把具有多页的文件导出成其它格式，如JPG，并且保持页面；而在CorelDraw里面却没有发现这样的功能，今天突然想到这个问题，遂查了下资料，发现CorelDraw可以利用插件（宏）来实现类似的同时导出多页的功能。与AI不同的是CorelDraw里面的这个功能是导出页面上的对象，而不管这个对象是否大于页面（AI会按页面截剪图像），并且CorelDraw支持同时导出多个CDR文件里的多个页面。

### How To Do

这个方法已经在CorelDraw 12和CorelDraw X6上测试通过（理论上中间的版本也会支持）。

1、把你需要导出的一个或多个文件保存起来，打开CorelDraw。单击“工具”—>“宏”—>“运行宏…”，会显示如下对话框；

![运行宏](https://cdn.icewing.cc/wp-content/uploads/2013/04/1.gif)

2、在“宏的位置”下拉菜单中选择“FileConverter(FileConverter.gms)”，此时“宏名称”下会出现“Converter.Start”，选中它，单击“运行”（如果没有这个选项可以到我的百度云盘下载FileConverter.gms，文档的最后有下载地址，下载完成后把它放在 “CorelDraw的安装目录\Draw\GMS”文件夹里面），打开文件转换对话框；

![主界面](https://cdn.icewing.cc/wp-content/uploads/2013/04/2-448x500.gif)

3、第一行Source是“源”，就是要被转换的CDR文件，单击右边的小图标：

![选择文件](https://cdn.icewing.cc/wp-content/uploads/2013/04/3-378x500.gif)

4、如上图，单击第一行“Source”右边的小图标，选择CDR文件保存的文件夹。如果文件夹里有很多文件的话可以用“File Type”筛选你需要的文件类型（当然是CDR了），“Source Files”里面显示所有匹配的文件，找到需要导出的文件，并单击“Add”添加文件。这里可以多选，允许一次性选择多个文件并添加；被选择的文件将会显示在“Selected Files”里面，点击“OK”回到之前的“File Converter”对话框。

5、在“Destination”里选择要导出到的文件夹；“Convert To”是要导出的格式，根据需要选择（一般是选择JPG、TIF等格式，以JPG为例），右边“Advanced”是导出的高级选项，和一个个导出时的对话框是一样的，就不再解释了。

6、我们是要把每个页面都导出到单独的JPG中去，所以第一个复选框“Save each page as a separate file”必选，其它选项上面都有翻译，可以根据需要选择。

7、“Bitmap Options”里面的“Resolution”是分辨率，根据需要设置对打勾，宽高不用设，默认即可。“Color Mode”是颜色模式，根据需要设成CMYK或RGB。

8、最后，单击Convert，稍等片刻，提示转换完成时大功告成（低版本的在完成时不提示）。

&nbsp;

FileConverter.gms的下载地址：[http://pan.baidu.com/share/link?shareid=474228&amp;uk=1610990884](http://pan.baidu.com/share/link?shareid=474228&amp;uk=1610990884)