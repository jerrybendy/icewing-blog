---
title: YouHosting系列教程：实现在线下载和在线解压
id: 275
categories:
  - 网站
date: 2013-05-18 17:44:14
tags:
---

在使用YouHosting的过程当中，其实最恶心的就是他们的文件管理系统是废的（至少我这样认为）。使用自带的文件管理系统吧，点击文件删除-提示删除失败、点击文件移动-提示失败、点击解压缩-提示失……失你妹啊。就没有一个功能可以用的。

在去年YouHosting官方是有说过会完善文件管理系统，不知道现在做的怎么样了。

还有一个就是使用FTP上传的时候，不知道大家有没有这样一种情况：上传到99%的时候卡住了，过一会上传文件成功，再把文件下载下来，结果文件损坏。当然最重要的一点就是国内上传到服务器去贼慢，特别是国内的小水管。

这边分享一下我使用的方法，通过SSH控制台命令实现在线下载和在线解压。

### YouHosting实现在线下载和在线解压：使用wget命令实现在线下载

1、所谓的SSH命令其实跟linux命令就是一样的，在linux中实现下载的命令就是使用wget这个命令。

2、使用这个命令，你需要知道的是，文件的直链下载地址（如http://sharebar.org/xxx.zip）。

3、首先在YouHosting的管理面板找到“SSH Console”点进去，能看到下图这样的，那就对了。

![YouHosting1](https://cdn.icewing.cc/wp-content/uploads/2013/05/YouHosting1-600x312.png)

4、比如我要下载WordPress安装包，已知下载直链是：http://cn.wordpress.org/wordpress-3.5.1-zh_CN.zip，那么就在命令输入栏里输入“wget http://cn.wordpress.org/wordpress-3.5.1-zh_CN.zip”（不带引号）

![YouHosting2](https://cdn.icewing.cc/wp-content/uploads/2013/05/YouHosting2-600x290.png)

5、看看下载还是挺快的吧，当然这是因为文件比较小，且资源是在美国，如果是国内的资源那么下载就不一定咯。

![YouHosting3](https://cdn.icewing.cc/wp-content/uploads/2013/05/YouHosting3-600x285.png)

小提示：下载默认保存的文件是原文件的原名称，如果需要在下载的时候，想更改文件名，只要在上面的命令后面加上“-O sharebar.org.zip”xxx.zip是你自己想要的。比如“wget http://cn.wordpress.org/wordpress-3.5.1-zh_CN.zip –O sharebar.org.zip”这意思就是保存的文件名为sharebar.org.zip。

### YouHosting实现在线下载和在线解压：使用unzip命令实现在线解压

1、上面有说到YH空间的文件管理系统是废的，不然功能看着也很强大。

2、空间面板有自带导入网站功能，其实就是上传之后自动解压到网站根目录。

3、在SSH控制面板可以只用unzip命令实现在线解压，这边关于unzip的命令，就不多介绍了，自己搜索一下很多解释的。

4、我这边就做个演示可以直接使用unzip加文件名即可解压至根目录，例子：“unzip wordpress-3.5.1-zh_CN.zip”。

![YouHosting4](https://cdn.icewing.cc/wp-content/uploads/2013/05/YouHosting4-600x318.png)

小提示：上面有一点没有说到，那就是SSH控制台默认是在空间根目录下操作的，而网站根目录是在空间根目录中的“public_html”目录。

其实上传wordpress到网站根目录只要几个步骤就可以了，虽然使用FTP也很简单，就是速度上传太慢了。

执行完以上的命令（下载-解压），再执行“mv wordpress/* public_html/”就可以了。

&nbsp;

来源： 分享吧   [http://sharebar.org/tutorials/362.html](http://sharebar.org/tutorials/362.html)