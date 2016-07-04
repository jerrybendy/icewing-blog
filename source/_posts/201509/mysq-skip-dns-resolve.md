---
title: 断网时本地连接MySQL速度慢-MySQL的DNS反向解析
tags:
  - MySQL
id: 1237
categories:
  - 数据库
date: 2015-09-02 10:20:33
---

今天由于意外情况公司断网，测试程序时跑在另一台虚拟机里面的mysql服务发现连接特别慢（在10秒左右），多方查找资料最终定位问题在MySQL的DNS反向解析上面。

MySQL数据库收到一个网络连接后，首先拿到对方的IP地址，然后对这个IP地址进行反向DNS解析从而得到这个IP地址对应的主机名。用主机名在权限系统里面进行权限判断。反向DNS解析是耗费时间的，有可能让用户感觉起来很慢。甚至有的时候，反向解析出来的主机名并没有指向这个IP地址，这时候就无法连接成功了。

想要临时关闭DNS反向解析也比较简单，可以有下面两种方法：

一、命令行方式执行
```bash
/usr/local/mysql/bin/mysqld_safe --skip-name-resolve --user=mysql &amp;
```

二、修改mysql配置文件，打开`my.cnf`，找到`[mysqld]`段，在下面追加（Windows和Linux通用）
```bash
skip-name-resolve
```

退出并重启MySQL服务即可
