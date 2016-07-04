---
title: 如何查看解析域名的的DNS服务器
tags:
  - DNS
id: 450
categories:
  - 服务器
date: 2013-08-03 09:50:31
updated: 2016-05-22 11:24:13
---

有时候您的网站长时间没有管理或者已经多次更换DNS服务器导致不知道现在网站由哪个DNS来解析、不知道在哪里管理域名解析，那么您可以通过下面的方法来查看DNS服务器。

方法一、可以通过WHOIS查询，查询结果里面会显示当前使用的DNS服务器地址。

方法二、（转自：[站长天空](http://www.zzsky.cn/build/content/1532.htm)），使用Windows的命令提示符完成：

单击“开始”->“运行”，输入 cmd 进入命令提示符窗口，输入：

```
nslookup -qt=ns 您的域名
```

如，输入`nslookup -qt=ns icewingcc.com`会出现以下结果：

```
icewingcc.com   nameserver = ns3.ns365.net
icewingcc.com   nameserver = ns4.gzidc.com
icewingcc.com   nameserver = ns3.gzidc.com
icewingcc.com   nameserver = ns4.ns365.net

ns3.gzidc.com   internet address = 124.173.145.90
ns3.ns365.net   internet address = 124.172.157.28
ns3.ns365.net   internet address = 124.172.157.27
ns4.gzidc.com   internet address = 124.173.65.90
ns4.ns365.net   internet address = 124.173.65.28
ns4.ns365.net   internet address = 124.173.65.27
```

上半部分是解析这个域名的DNS服务器，下半部分是对应的IP地址。