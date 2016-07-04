---
title: 'mysqli使用localhost问题 Warning: mysqli::mysqli(): (HY000/2002): No such file or directory'
tags:
  - MySQL
  - PHP
id: 1268
categories:
  - PHP
date: 2015-11-28 14:01:50
updated: 2016-05-22 12:08:43
---

今天在使用PHP的CLI方式访问mysql数据库时出现了一个 No such file or directory的错误，查找资料并在最终解决后记录一下。

这个问题应该也会存在于非CLI方式访问，简单的代码是这样的：

```php
<?php
$mysqli = new mysqli('localhost', 'root', 'root', 'test');
```

如果上面的连接地址是 localhost 就会报此错误，改成 127.0.0.1 后正常。

当主机填写为localhost时MySQL会采用 unix domain socket连接，当主机填写为127.0.0.1时MySQL会采用TCP/IP的方式连接。使用Unix socket的连接比TCP/IP的连接更加快速与安全。这是MySQL连接的特性，可以参考官方文档的说明[4.2.2\. Connecting to the MySQL Server](https://dev.mysql.com/doc/refman/5.6/en/connecting.html#id471316)。

这个问题有以下几种解决方法：

使用TCP/IP代替Unix socket。即在连接的时候将localhost换成127.0.0.1。
修改MySQL的配置文件my.cnf，指定mysql.socket的位置：

/var/lib/mysql/mysql.sock (你的mysql.socket路径)。

直接在php建立连接的时候指定my.socket的位置（官方文档：[mysqli_connect](http://php.net/manual/zh/mysqli.construct.php)）。比如：

```php
$db = new MySQLi('localhost', 'root', 'root', 'my_db', '3306', '/var/run/mysqld/mysqld.sock')
```

通常意义上localhost和127.0.0.1是等价的，只是mysql在处理这个名词的问题上有一些不同，是根据不同的地址来采取的不同的通信手段。

问题的最终解决方案是在连接的时候手动指定了 sock 文件的路径

原因呢，我猜大概是为了本地应用能获得更好的性能。而且localhost这个地址在mysql中也不会做匹配。即user@'%'不能匹配到user@'localhost'
