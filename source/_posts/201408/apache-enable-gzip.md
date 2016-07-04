---
title: Apache中开启Gzip压缩的方法
tags:
  - Apache
  - Gzip
  - linux
id: 1041
categories:
  - 服务器
date: 2014-08-30 16:00:33
updated: 2016-05-22 11:53:19
---

![apache](https://cdn.icewing.cc/wp-content/uploads/2014/08/apache.jpg)

因为开启 Gzip 压缩会消耗额外的 CPU 资源，所以一般安装的Apache默认都没有开启此功能。

在开启 Gzip 之前，需先确认 Apache 的配置文件中有没有加载 mod_deflate 和 mod_headers 模块。
LAMP一键安装脚本的 Apache 配置文件路径是：/usr/local/apache/conf/httpd.conf

打开此文件查找如下两行代码：
```
LoadModule deflate_module modules/mod_deflate.so
LoadModule headers_module modules/mod_headers.so
```

前面没有#符号即为正常的，若是有#符号则表示被注释掉了，删除前面的#符号即可。

在 Apache 配置文件 /usr/local/apache/conf/httpd.conf 的最后添加：

```
<IfModule deflate_module>
    SetOutputFilter DEFLATE
    SetEnvIfNoCase Request_URI .(?:gif|jpe?g|png)$ no-gzip dont-vary
    SetEnvIfNoCase Request_URI .(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    SetEnvIfNoCase Request_URI .(?:pdf|doc|avi|mov|mp3|rm)$ no-gzip dont-vary
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

**注解：**

IfModule deflate_module 是判断如果 deflate_module 模块加载的话，执行里面的配置。
SetOutputFilter DEFLATE 是设置输出为 deflate 压缩算法。
SetEnvIfNoCase Request_URI 是排除一些常见的图片，影音，文档等类型的后缀，不压缩。
AddOutputFilterByType DEFLATE 是对常见的文本类型,如html,txt,xml,css,js做压缩处理。

保存以上修改好的配置文件，重启 Apache 即可。
```
service httpd restart
```
或者
```
/etc/init.d/httpd restart
```


转自：[秋水逸冰](http://teddysun.com/326.html)
