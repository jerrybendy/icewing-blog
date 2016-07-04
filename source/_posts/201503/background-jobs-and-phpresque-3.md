---
title: 后台任务和PHP-Resque的使用（三） 安装
tags:
  - PHP
  - php-resque
  - 队列
id: 1207
categories:
  - PHP
date: 2015-03-31 15:20:08
updated: 2016-05-22 12:03:43
---

在{% post_link "background-jobs-and-phpresque-2" "第二部分" %}我们使用php-resque作为队列系统，这一节讲如何安装php-resque。

PHP-Resque是依赖Redis的，所以需要先安装Redis及PHP的Redis扩展。以下是所有需要安装的组件：

*   Redis
*   PHP的Redis扩展（php-redis）
*   php-resque
*   PHP的PCNTL扩展

### Redis

Redis是一个开源的KV数据库，数据是保存在电脑RAM中的，速度非常快，所以通常可以使用Redis来做缓存，或保存Session等。可以在Redis的[官方网站](http://redis.io/)下载最新稳定版本。Redis的安装方法本文不再赘述，安装完成后不要忘记启动。

### PHP-Resque

[php-resque](https://github.com/chrisboulton/php-resque)是resque的PHP版本，很多特性都和原版相似或相同。

[下载](https://github.com/chrisboulton/php-resque/zipball/master)最新版本的zip压缩包，或克隆它的仓库：

```bash
git clone git://github.com/chrisboulton/php-resque.git
```

以上下载的只是php-resque的库，只需要把文件夹放在任何你项目需要的位置即可。也可以使用Composer安装php-resque。

### PHPredis

[PHPredis扩展](https://github.com/nicolasff/phpredis)相当于是Redis的PHP API，但它不是PHP使用Redis的唯一接口，类似的库还有[redisent](https://github.com/jdp/redisent)、[rediska](http://rediska.geometria-lab.net/)、[predis](https://github.com/nrk/predis)、redisentwrap等。但phpredis是其中最快也是最流行的。关于phpredis扩展的安装方法网上也有很多，也就不再赘述了。

### PHP PCNTL扩展

PCNTL（进程控制扩展）依赖于Unix系列系统的进程管理，所以php-resque只能运行在UNIX架构的电脑上，如Linux。

一般可以通过编译安装PHP的时候启用PCNTL扩展，如果没有安装也可以：

*   [下载](http://www.php.net/downloads.php)对应版本的PHP源码
*   解压文件
	`tar -zxvf php-x.x.x.tar.gz`
*   进入ext/pcntl目录
	`cd php-x.x.x/ext/pcntl/`
*   配置、编译、安装
		`sudo phpize && ./configure && make install`
*   添加`extension=pcntl.so`到php.ini
*   重新启动Apache/Nginx

本文由冰翼翻译自[Kamisama.me](http://www.kamisama.me/2012/10/09/background-jobs-with-php-and-resque-part-3-installation)
