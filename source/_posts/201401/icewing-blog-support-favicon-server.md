---
title: 冰翼博客开始提供Favicon获取服务
tags:
  - favicon
id: 823
categories:
  - 网站
date: 2014-01-08 22:08:08
updated: 2016-05-22 11:39:32
---

注：新版Favicon接口已正式上线，针对不同网站的兼容性更好，获取成功率更高，响应速度也大幅提升。此版本（指favicon.byi.pw）的接口虽仍然有效但已停止更新。

{% post_link "byi-api-new-favicon-api" "新版接口传送门>>" %}



引用前几天写的《{% post_link "php-get-favicon" "使用PHP获取网站Favicon的方法" %}》，本来做这个东西是自己用的，后来又对程序做了一些改善，添加了缓存等功能，将接口公开，大家可以随意使用。

程序只能获取16*16px的图标，并且在所请求的网址不包含图标文件时返回默认图标（默认图标暂不支持自定义），不会报任何错误。

调用网址：

**http://favicon.byi.pw/?url=网址**

访问接受一个必选的参数 url 和一个可选的参数 expire。

**url **支持Http/Https，也可以传入一个网址作为参数，如“ [http://favicon.byi.pw/?url=http://www.icewingcc.com](http://favicon.byi.pw/?url=http://www.icewingcc.com) ”。

**expire **默认情况下所有请求过的图标都会被缓存，并且缓存期限为10天，10天后的任何下一次请求都会重建图标。通过传入参数expire（单位为秒）来重设缓存期限，最大不超过30天。也可以通过设置expire为0的方式强制刷新某网址的图标缓存，但不建议每次都这么做，因为这会延长获取图标的时间。如：

**http://favicon.byi.pw/?url=blog.icewingcc.com&amp;expire=1296000**

图标一旦被缓存便永久存在，expire只刷新缓存文件而不会删除文件。所以仍可通过以下方式在缓存后获取图标文件：

**http://favicon.byi.pw/cache/www.icewingcc.com.png**

如上：把www.icewingcc.com换成自己需要的网址，不加http://或https://，后缀统一为png。但是**并不建议这样做**，原因有二：一、如果缓存没有正确创建将会得不到正确的图像，并且如果网站的图标有变化也得不到更新；二、后续如果缓存文件过多可能会进一步修改程序加入对不使用的缓存文件的自动清理功能，可能会误删某些文件。所以建议通过上面的参数形式进行调用。

目前网站还是第一版本，算是测试版吧，只提供了接口，网站什么都没有。但后续也会加入更多的可选参数，例如获取32*32px的图像甚至Gravater头像服务（可能会换个二级域名），主要还是为解决某些网站服务器被墙（如Google）导致国内无法访问一些网页元素创造解决方案。

&nbsp;
