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
updated: 2016-12-21 12:03:43
---

在{% post_link "background-jobs-and-phpresque-2" "第二部分" %}我们使用 php-resque 作为队列系统，这一节讲如何安装 php-resque。

PHP-Resque 是依赖 Redis 的，所以需要先安装 Redis 及 PHP 的 Redis 扩展。以下是所有需要安装的组件：

*   Redis
*   PHP 的 Redis 扩展（php-redis）
*   php-resque
*   PHP 的 PCNTL 扩展

### Redis

Redis 是一个开源的 KV 数据库，数据是保存在电脑 RAM 中的，速度非常快，所以通常可以使用 Redis 来做缓存，或保存 Session 等。可以在 Redis 的[官方网站](http://redis.io/)下载最新稳定版本。Redis 的安装方法本文不再赘述，安装完成后不要忘记启动。

### PHP-Resque

[php-resque](https://github.com/chrisboulton/php-resque) 是 resque 的 PHP 版本，很多特性都和原版相似或相同。

[下载](https://github.com/chrisboulton/php-resque/zipball/master) 最新版本的 zip 压缩包，或克隆它的仓库：

```bash
git clone git://github.com/chrisboulton/php-resque.git
```

以上下载的只是 php-resque 的库，只需要把文件夹放在任何你项目需要的位置即可。也可以使用 Composer 安装 php-resque。

```shell
composer require chrisboulton/php-resque
```

### PHPredis

[PHPredis扩展](https://github.com/nicolasff/phpredis) 相当于是 Redis 的 PHP API，但它不是 PHP 使用 Redis 的唯一接口，类似的库还有[redisent](https://github.com/jdp/redisent)、[rediska](http://rediska.geometria-lab.net/)、[predis](https://github.com/nrk/predis)、redisentwrap 等。但 phpredis 是其中最快也是最流行的。关于phpredis 扩展的安装方法网上也有很多，也就不再赘述了。

### PHP PCNTL 扩展

PCNTL（进程控制扩展）依赖于 Unix 系列系统的进程管理，所以 php-resque 只能运行在UNIX架构的电脑上，如 Linux。

一般可以通过编译安装 PHP 的时候启用 PCNTL 扩展，如果没有安装也可以：

*   [下载](http://www.php.net/downloads.php) 对应版本的PHP源码
*   解压文件
	`tar -zxvf php-x.x.x.tar.gz`
*   进入 `ext/pcntl` 目录
	`cd php-x.x.x/ext/pcntl/`
*   配置、编译、安装 
		`sudo phpize && ./configure && make install`
*   添加 `extension=pcntl.so` 到 php.ini
*   重新启动 Apache/Nginx

---

本文由冰翼翻译自[Kamisama.me](http://www.kamisama.me/2012/10/09/background-jobs-with-php-and-resque-part-3-installation)


