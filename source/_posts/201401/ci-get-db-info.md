---
title: CI获取当前连接数据库信息的方法
tags:
  - 数据库
  - CodeIgniter
id: 836
categories:
  - PHP
date: 2014-01-09 22:28:58
---

用过CI（CodeIgnter）的都知道CI有一个内置的Config系统，用来获取设置项，但这个设置只对 $config['xxx']这样的操作有效，对数据库是无效的。在数据库操作中为了使程序更具灵活性往往会给数据表设置一个前缀，如“wp_”，为了程序的扩展性我们不可能在SQL中把数据表前缀写死，CI的数据库选项有这样一行：

```php
$db['default']['dbprefix'] = 'test_';
```

因为不是$config['xxx']这样的变量，再使用 $this->config->item('dbprefix');这样的形式就无法取得前缀，查阅CI的文档也没找到解决方法。无奈只得翻看源代码。

在“system/database/DB_dirver.php”中可以发现里面好多和数据库相关的变量都是用“var”定义的，“var”和“public”相同，就意味着可以直接从外部读取甚至修改这些变量，于是乎解决了以上问题：

```php
echo $this->db->dbprefix;  //数据表前缀
echo $this->db->database;  //数据表名
echo $this->db->query_count; //查询次数
// ……
```


