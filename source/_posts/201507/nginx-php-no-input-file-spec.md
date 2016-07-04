---
title: 迁移服务器遇到的蛋疼问题：Nginx PHP “No input file specified”
tags:
  - Nginx
  - PHP
id: 1226
categories:
  - 服务器
date: 2015-07-21 11:28:31
---

昨天因为服务器到期把网站迁移到另一台服务器，使用的LNMP架构，网站各部分迁移完成后发现了一个蛋疼的问题：很多网页打开都提示”No input file specified”，甚至直接404，而且时好时坏。

去网上搜了下资料，大概意思如下：

任何对.php文件的请求，都简单地交给php-cgi去处理，但没有验证该php文件是否存在。PHP文件不存在，没办法返回普通的404错误，它返回 一个404,并带上一句”No input file specified”

另外，还可能跟 路径或者 权限有关系，或者SCRIPT_FILENAME 变量没有被正确的设置(这在nginx是最常见的原因)。

因为Nginx的PATHINFO设置是直接复制的之前服务器的设置，所以这点肯定不会有错，那就检查PHP配置文件。

一、把`cgi.fix_pathinfo=0`改为`cgi.fix_pathinfo=1`

二、把`;cgi.force_redirect=1`改为`cgi.force_redirect=0`

然后重启LNMP，发现还不好，就随便试了下：

```
# cd /home/wwwroot
# chown -R www:www ./*
# chmod -R 755 ./*
# lnmp restart
```
然后。。就好了。。。。搞半天居然是简单的权限的问题，晕了~~~

记录下，以后有朋友遇到同样的问题不访试试看是不是权限不对。（By the way，我用的是网上的LNMP一键安装包1.2版本，所以有lnmp这个命令，自己编译安装LNMP或者是LAMP的自行参考重新Nginx和PHP的命令）
