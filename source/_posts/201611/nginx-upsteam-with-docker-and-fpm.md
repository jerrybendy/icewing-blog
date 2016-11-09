---
title: docker 启动多个 PHP-FPM 容器并配置 nginx 负载均衡
date: 2016-11-09 20:23:51
updated: 2016-11-09 20:23:51
tags:
  - docker
  - PHP
  - Nginx
  - 负载均衡
categories:
  - 服务器
---

我的 API 服务已经迁到 docker 以及美国服务器有一周的时间了，不知道是网络的问题还是 docker 的问题，迁到美国的服务器后明显感觉并发时不如之前在阿里云时稳定。之前在阿里云部署时一个页面 40 个请求毫无压力（之前也没用 docker，直接 LNMP 架构部署），但在迁移之后只要并发数量一高，FPM 进程准会挂掉。我自己使用的一个工具页面上有四十多个小图标需要调用这个 API 服务，只要一刷新 FPM 必挂。

尝试过调整 docker 内 FPM 进程的子进程数量，效果并不明显，加上服务器配置低，单个 FPM 进程子进程数不能调太高，否则容易影响其它服务（我猜的）。于是乎想到一个办法：启动两个 FPM 容器，两个容器拥有相同的配置以及子进程数，两者共同承担后端的请求。

一般来说单台服务器上都是配置一个 nginx 进程以及一个 FPM 进程分别处理静态及动态请求，但单台机器上多个 upstream 后端比单个后端进程能够带来更高的吞吐量。例如你想支持最大 1000 个 PHP-FPM 子进程，可以将这 1000 个子进程平均分配到两个 upstream 后端，各自处理 500 个子进程。

修改之前的 Nginx 配置是这样的：

```code
server
{
    # .....

    location ~ [^/]\.php(/|$)
    {
        try_files $uri =404;
        fastcgi_pass  127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

现在只需要修改 `docker-compose.yml` 文件，添加一个 PHP-FPM 进去，并将容器内的 9000 端口分别映射到宿主机不同的端口上（9000 和 9001）。Nginx 的设置比较简单，在配置的 `http` 段中添加一个 upstream，并把原来的 `fastcgi_pass` 地址改到这个 upstream 即可。

Nginx 的 `http` 段添加：

```code
upstream phpFpm
{
    server 127.0.0.1:9000;
    server 127.0.0.1:9001;
}
```

网站配置稍微修改一下：

```code
server
{
    # .....

    location ~ [^/]\.php(/|$)
    {
        try_files $uri =404;
        fastcgi_pass  phpFpm;
        fastcgi_index index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

修改完成后重启 `docker-compose` 和 Nginx 即可生效。至于效果嘛～～亲测果然有很大的提升，修改之前四十多个并发的请求一般会挂掉一大半，现在最多就挂七八个。。。下不步要不要考虑分配三个 FPM 容器做负载处理 ^_^  当然最主要还是赶快把国内的服务器搞定，两台机器来做负载，而不是两个容器，毕竟大部分请求是在国内。