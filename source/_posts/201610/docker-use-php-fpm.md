---
title: 如何在 docker 中使用 PHP FPM
date: 2016-10-19 21:36:56
updated: 2016-10-19 21:36:56
tags:
  - docker
  - PHP
categories:
  - 服务器
---

已经有段时间没写过东西了，最近在着手把之前的 PHP 服务 docker 化，以方便在两台服务器之间部署。整个学习和使用 docker 的过程还算顺利吧，但在部署 PHP FPM 的过程中遇到了一些问题，以下作为记录供遇到同样问题的人参考吧。

## 系统架构

因为我可能会经常修改 Nginx 配置，加上我是自己编译的最新版的 Nginx + Openssl （为了启用 HTTP/2），所以就懒得把 Nginx 打包成 docker 镜像了，而是直接将 Nginx 装在了宿主机，并开放 80 和 443 端口。

系统所需的除 Nginx 以外的其它服务全部由 docker 提供服务，如 PHP 和 Redis。每一个服务使用一个容器，均为官方镜像。Redis 的使用就不说了，比较简单，说下在使用 PHP 时遇到的一些问题吧，主要是 Nginx 与 PHP 通信的问题。

附上 docker hub 官方的 PHP 首页地址：[https://hub.docker.com/_/php/](https://hub.docker.com/_/php/)

失败的就不多说了，说下成功的两种方式：

## 方法一：Nginx 反向代理 + php-apache

这种方式使用 docker hub 官方提供的 php-apache 镜像。

```
$ docker pull 
```

因为镜像内已经安装好了 PHP 和 Apache，所以只需在容器上开放端口，使用 Nginx 反向代理就可以了，比较简单。

例如下面的将容器内的 80 端口映射到宿主机的 9090 端口：

```
$ docker run -d -p 9090:80 -v /home/www/:/var/www/html  php:7.0-apache
```

Nginx 配置下反向代理即可：

```
location / {
    proxy_pass   127.0.0.1:9090;
}
```

## 方法二：Nginx + php-fpm

这种方式只使用 PHP 的容器提供 FPM 服务供宿主机的 Nginx 调用，会比多一个 Apache 来得更轻量一些。只是这种方式一直比较困扰我的是如何在 Nginx 里面调用容器内的 FPM 服务，毕竟容器内外的环境是不一样的，和直接宿主机安装 LNMP 还是有不少差距的。更纠结的是，docker hub 官方文档中并没有说 php-fpm 怎么用。

经过多次尝试最终发现 Nginx 调用 fpm 服务是通过 fastcgi 参数进行的。如通过 `SCRIPT_FILENAME` 参数指定要加载的文件路径。

一般 LNMP 环境 Nginx 的配置可能是这样的（部分）：

```
location ~ [^/]\.php(/|$) {
   try_files $uri =404;
   fastcgi_pass   127.0.0.1:9000;
   fastcgi_index  index.php;
   fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
   include        fastcgi_params;
}
```

`fastcgi_pass` 倒是很好理解，指定 fpm 服务的调用地址，只需要把容器中的 9000 端口映射到宿主机的 9000 端口上就可以了。

`fastcgi_index` 也好理解，就是默认文件嘛。

重点在 `fastcgi_param`，每一个 `fastcgi_param` 指令都定义了一个会发送给 cgi 进程的参数，打开 Nginx 配置目录中的 `fastcgi_params` 文件可以看到里面定义了很多参数。其中，`SCRIPT_FILENAME` 对我们来说算是最重要的。

`SCRIPT_FILENAME` 指令指定了 cgi 进程需要加载的文件路径。例如用户访问 `http://xxx.com/a.php`，Nginx 中将会处理此次请求。Nginx 判断后缀名是 `.php` 的请求后将会把此次请求转发给 cgi 进程处理，即 `fastcgi_pass`；转发的过程中会携带一些和访问相关的参数或其它预设的参数（`fastcgi_param`），然而这个 cgi 进程（PHP FPM）并不知道要加载的文件在哪里，这便是 `SCRIPT_FILENAME` 的作用了。

简单的说，配置 `SCRIPT_FILENAME` 的值就是要做到 FPM 进程能找到这个文件就可以了。例如代码目录存放在宿主机的 `/home/www` 目录下，我们使用 `-v` 命令启动 docker 时把代码目录映射到了容器内部的 `/var/www/html` 目录下：

```
$ docker run -d -p 9000:9000 -v /home/www:/var/www/html php:7.0-fpm
```

因为 fpm 进程是运行在容器里面的，所以 `SCRIPT_FILENAME` 查找的路径一定是在容器内能找到的，即：

```
fastcgi_param  SCRIPT_FILENAME  /var/www/html/$fastcgi_script_name;
```

至此应该全明白了吧，Nginx 配置中的 `SCRIPT_FILENAME` 要和容器中保持一致才行。当然也可以让容器中的目录结构保持与宿主机中一致，即 `-v /home/www:/home/www`，这样配置的时候可能会方便一些，不会出现因目录不一致而出错的机率。

## 总结

学习就是踩坑的过程，踩着踩着就学会了。。。


