---
title: Nginx/Apache 日志分析工具 GoAccess 的安装和基本用法
date: 2016-10-12 21:57:03
updated: 2016-10-12 21:57:03
tags:
  - Nginx
  - Apache
  - 日志
categories:
  - 服务器
---

![goAccess](https://cdn.icewing.cc/201610/goaccess.png)

GoAccess 是一款轻量、快速的日志分析工具，可以很方便的用于 Nginx/Apache/IIS 等的日志分析上，可以直接在控制台中方便的查看分析结果，也可以将结果导出成 html、csv、json 等格式，甚至还可以支持控制台和 html 的实时刷新！可谓是非常之强大。

## 安装

GoAccess 的安装非常之简单，CentOS/Fedore 下直接执行 `yum install goaccess` 即可，Debian/Ubuntu 下使用 `apt-get install goaccess`，OS X 可以用 `brew install goaccess` 安装。

## 源码编译安装

如果需要最新版本可以直接使用源码编译安装。[官网下载页面](https://goaccess.io/download) 有源码的下载地址和安装方式，以 CentOS 和当前版本的 GoAccess 为例：

### 1、安装依赖包。

如果需要启用 IP 解析支持需要安装 `geoip` 库。CentOS 下执行：

```code
$ yum install geoip-devel
```

GeoIP 在 Ubuntu 下的包名为 `libgeoip-dev`，其它系统详见官网下载页最后面的 `Distribution Packages`。

### 2、下载源码并解压

```code
$ cd /usr/local/src
$ wget http://tar.goaccess.io/goaccess-1.0.2.tar.gz 
$ tar -xzvf goaccess-1.0.2.tar.gz
$ cd goaccess-1.0.2/ 
```

### 3、配置并安装

```code
$ ./configure --enable-geoip --enable-utf8 
$ make 
# make install
```


## 基本用法

### 直接在控制台查看日志分析结果

```shell
$ goaccess -f xxxx.log
```

会弹出来一个窗口选择日志格式，如果是 Nginx 标准的日志格式直接选择第一项即可（空格选中，回车确认）。

### 输出分析结果到 html 文件

下面的命令会使用默认的配置文件导出到 HTML，如果需要使用自己的配置文件，请添加 `-p` 参数。

```shell
$ goaccess -f xxxx.log -o xxxxx.html
```

## 配置文件

默认的配置文件位于 `/usr/local/etc/goaccess.conf`，可以直接修改此文件，或者根据不同的配置需要创建不同的副本。在没有指定 `-p` 参数时会默认使用这个配置文件。

一般来说在配置文件中指定一下日期时间以及日志的格式即可。如果配置文件中不指定也可以在命令中通过参数指定日志的格式。


## 常用选项

### 文件选项

* `-f` `--log-file=<logfile>`  指定日志文件的路径
* `-p` `--config-file=<configfile>`  指定配置文件的路径

### 解析选项

* `-d` `--with-output-resolver`  在导出成 HTML 或 JSON 格式时启用 IP 地址解析
* `-e` `--exclude-ip <IP|IP-range>` 排除的 IP 或 IP 段
* `-o` `--output=<json|csv|html>`  指定输出的文件路径，根据后缀判定输出格式
* `-q` `--no-query-string`  忽略 URL 后的面查询字符串
* `--ignore-crawlers`  忽略爬虫

## 配置 HTML 实时刷新

[演示地址](http://rt.goaccess.io/?20161005202141)

> 未完成

