---
title: Linux服务器安装使用PhantomJS
tags:
  - PhantomJS
id: 1195
categories:
  - Linux
date: 2015-03-19 13:57:10
updated: 2016-05-22 12:04:03
---

![phantomjs](https://cdn.icewing.cc/wp-content/uploads/2015/03/phantomjs.jpg)

PhantomJS（[http://phantomjs.org/](http://phantomjs.org/)）是一个服务器端的 JavaScript API 的 WebKit。其支持各种Web标准： DOM 处理, CSS 选择器, JSON, Canvas, 和 SVG等，可方便的应用于各种自动化的测试、屏幕捕获、网络监控等环境。

Windows版的PhantomJS安装比较简单，下面就说一个Linux版本的PhantomJS的安装及简单用法。

Linux版本安装有两种方法，一是下载对应系统的编译好的可执行文件使用，但可能会出现不能用的情况，这时就需要使用第二种，源码编译安装。

### 一、直接下载编译好的文件

直接到Bitbucket下载对应的压缩包（链接：[https://bitbucket.org/ariya/phantomjs/downloads](https://bitbucket.org/ariya/phantomjs/downloads)），例如我的是CentOS6.5 64位系统，下载的是phantomjs-1.9.8-linux-x86_64.tar.bz2，下载完成后解压，在 bin 目录内有编译好的 phantomjs 文件，直接用FTP等工具上传到服务器。

使用SSH登入服务器，给phantomjs加上执行权限`chmod +x phantomjs`，运行`./phantomjs -h`看能否显示帮助文档，报错的话可能就需要使用源码编译来安装了。

### 二、源码编译

首先去官网下载最新稳定版本的源码（链接：[http://phantomjs.org/download.html](http://phantomjs.org/download.html)），找到Linux下的Source Code下载，目前最新版本是2.1 [直接下载](https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2)

以下操作以CentOS为例，其它发行版大同小异

```bash
cd /usr/local/src
# 下载源码
wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.0.0-source.zip
# 解压源码，没有unzip命令的请使用yum install unzip 安装
unzip phantomjs-2.0.0-source.zip
# 安装编译环境
yum -y install gcc gcc-c++ make flex bison gperf ruby \
  openssl-devel freetype-devel fontconfig-devel libicu-devel sqlite-devel \
  libpng-devel libjpeg-devel
# 开始编译
cd phantomjs-2.0.0
./build.sh
```

编译操作耗时会比较长（可以大于半个小时），耐心等待完成。编译完成后会多出一个 bin 目录，里面有编译完成的 phantomjs 文件。

### 简单使用

如果是下载的源码，里面会有个example文件夹，我们使用其中的rasterize.js创建一个网站截图。没有这个文件的可以复制下载的代码并保存为rasterize.js。

```js
var page = require('webpage').create(),
    system = require('system'),
    address, output, size;

if (system.args.length < 3 || system.args.length > 5) {
    console.log('Usage: rasterize.js URL filename [paperwidth*paperheight|paperformat] [zoom]');
    console.log('  paper (pdf output) examples: "5in*7.5in", "10cm*20cm", "A4", "Letter"');
    console.log('  image (png/jpg output) examples: "1920px" entire page, window width 1920px');
    console.log('                                   "800px*600px" window, clipped to 800x600');
    phantom.exit(1);
} else {
    address = system.args[1];
    output = system.args[2];
    page.viewportSize = { width: 600, height: 600 };
    if (system.args.length > 3 &amp;&amp; system.args[2].substr(-4) === ".pdf") {
        size = system.args[3].split('*');
        page.paperSize = size.length === 2 ? { width: size[0], height: size[1], margin: '0px' }
                                           : { format: system.args[3], orientation: 'portrait', margin: '1cm' };
    } else if (system.args.length > 3 &amp;&amp; system.args[3].substr(-2) === "px") {
        size = system.args[3].split('*');
        if (size.length === 2) {
            pageWidth = parseInt(size[0], 10);
            pageHeight = parseInt(size[1], 10);
            page.viewportSize = { width: pageWidth, height: pageHeight };
            page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };
        } else {
            console.log("size:", system.args[3]);
            pageWidth = parseInt(system.args[3], 10);
            pageHeight = parseInt(pageWidth * 3/4, 10); // it's as good an assumption as any
            console.log ("pageHeight:",pageHeight);
            page.viewportSize = { width: pageWidth, height: pageHeight };
        }
    }
    if (system.args.length > 4) {
        page.zoomFactor = system.args[4];
    }
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
            phantom.exit(1);
        } else {
            window.setTimeout(function () {
                page.render(output);
                phantom.exit();
            }, 200);
        }
    });
}
```

使用以下命令创建网站截图（注意其中的文件路径，请自行修改为你的phantomjs和rasterize.js的路径

```bash
./phantomjs ../example/rasterize.js http://blog.icewingcc.com ./icewingcc.png
```

PhantomJS还可以用于网络监控、自动化等功能，而且JS文件的内容还可以根据需要自行修改。具体的使用方法请参考[官方网站](http://phantomjs.org/api/)的介绍，以及example文件夹内示例的说明。
