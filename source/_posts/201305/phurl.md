---
title: 免费短网址程序：phurl
tags:
  - PHP
  - 源码
  - 网址
  - 软件
id: 269
categories:
  - PHP
date: 2013-05-18 17:34:21
---

在个人网站中有时候要发一些链接，如果想把链接换成自己的域名，又要能跳转到该链接的话改怎么办呢？

一些外链发在文章中，是否觉的太长，不太美观呢？

很久没分享网站程序了，这边分享一个免费开源的短网站程序：phurl

~~演示地址：[http://u.byi.pw](http://u.byi.pw "http://u.byi.pw")~~ 演示地址已停用

### 免费短网址程序phurl：安装

1、将下载下来的压缩包解压之后上传到空间（下载地址在下方）

2、上传之后，访问 http://youdomain/install 进行安装

3、填写网站标题，域名后台账号密码等。

4、“**delete the install directory**”删除安装目录即“install”目录，建议只修改目录名。

后台登陆地址为：http://youdomain/admin，账号密码为自己设置的。

该程序为网上淘的，原先好像是移植到SAE上面用的。后来稍微修改了一下就能正常使用了，好像低版本的数据库不能安装，还是版本太高了安装不了。不过都能正常使用，如果无法安装的话直接导入数据库文件(压缩包内phurl.sql)，修改一下”config.php”文件即可。

对了空间必须支持”.htaccess”文件，如果上传空间之后发现”500”，请先删除”.htaccess”文件，然后登陆ftp，新建文件”.htaccess”将以下内容输入进去保存一下即可，应该是文件编码问题。

&nbsp;
<div>

### .htaccess文件内容

```
<IfModule mod_rewrite.c>
RewriteEngine on
RewriteOptions MaxRedirects=1
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule ^([a-zA-Z0-9_-]+)$ redirect.php?alias=$1 [L]
</IfModule>
```

[网盘下载](https://share.icewing.cc/download/NTNkM2MxYWU3NjI0Zg.html)