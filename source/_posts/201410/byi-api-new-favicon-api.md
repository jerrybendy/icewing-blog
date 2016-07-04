---
title: 【BYI_API】新版网站Favicon接口上线，快速获取网站Favicon图标
tags:
  - API
  - favicon
id: 1129
categories:
  - 网站
date: 2014-10-19 11:49:17
updated: 2016-05-22 11:57:12
---

![Favicon API](https://cdn.icewing.cc/wp-content/uploads/2014/10/favicon1.jpg)

每个网站都应该有一个favicon图片，就是显示在浏览器标题栏上面的小图标，当打开网页或将网页加入收藏时都会显示这个图标。而对于WEB设计或站长来说，可能会希望把某个网站的图标加入到站点名字或链接的前面以为页面增添色彩，同时增加链接的可读性和易用性。

这个接口便是为此功能而生的。通过一种简单、稳定的方式获取网站的Favicon图标。

继今年年初发表的《{% post_link "icewing-blog-support-favicon-server" "冰翼博客开始提供Favicon获取服务" %}》之后陆续收到一些朋友的邮件，对接口的不足和改进提出了一些有用的建议。

新版的Favicon API主要针对上一版本的兼容性不好、获取速度慢等问题进行改进，由原来的单一文件发展为基于[CodeIgniter](http://blog.icewingcc.com/category/php/codeigniter)框架的完整应用程序，摒弃文件缓存改用Memcache作为缓存介质，用Opcache加速程序运行，并针对国外被墙网站做了特殊的缓存处理以避免无法访问。（详见Favicon[更新历史](http://u.byi.pw/adM)）

新版Favicon接口的调用方式：

```html
<img width="16" height="16" src="http://api.byi.pw/favicon/?url=网址" />
```

url参数支持HTTP/HTTPS协议，可以是一个HOST地址，也可以是完整的URL字符串。因为好多网站的Favicon图标仍然采用16px*16px的ico图片，并未提供高清的格式，所以在img标签上限制图片尺寸为16x16可以获取最大限度的兼容性（否则可能会造成不同网站的图标大的大小的大~），也要吧使用接口的size参数控制输出的图片大小（截止至发表此博文时该功能还未正式上线）。

具体的参数和使用方法请移步：[http://api.byi.pw/favicon](http://api.byi.pw/favicon)

如果在使用过程中有任何问题、意见或建议，欢迎在下面留言或直接邮件/QQ联系我，同时欢迎提供被墙网站或打开速度较慢的网站地址，我会针对这些网站重新建下缓存，以提高响应速度，谢谢！

PS：因为当前接口程序文件和其它接口有交集，并且针对CI框架做出的修改比较多，目前暂时无法开源，后续待当前版本修改稳定后重新整理出来一个版本开源在Github或Coding上，到时会另写一篇文章发布地址。
