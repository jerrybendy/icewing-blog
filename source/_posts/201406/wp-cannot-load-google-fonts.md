---
title: 解决Wordpress无法加载Google字体服务问题
tags:
  - API
  - google
  - wordpress
  - 字体
id: 1014
categories:
  - PHP
date: 2014-06-12 09:06:51
updated: 2016-05-22 11:52:28
---

![google_logo](https://cdn.icewing.cc/wp-content/uploads/2014/06/google_logo.jpg)

由于一个众所周知的原因，Google的服务这次在中国挂的很彻底，包括来自Google的Chrome应用商店、Gmail邮件服务等全部受到影响。由于Wordpress 3.9的后台（以及AdminBar）里面采用了Google的Open-Sans字体，这就导致在登录Wordpress后，包括登录后进入到前台都会有一个漫长的“正在连接fonts.googleapis.com”的过程，无奈只得想办法去掉这项服务了。

综合一下网上的方法，大致就是两种，即插件解决和修改源代码。插件解决的话可以避免因WP更新带来的麻烦，但过多的插件势必会造成WP的加载速度变慢；修改WP的源代码虽然高效，但会因WP程序的更新而覆盖掉自己的修改，所以二者权衡，自己选择吧。

### 使用插件禁止Google字体服务

可以下载一个名叫 disable-google-fonts 的插件（类似的插件有很多，可以自己找下）。

[下载Disable-Google-Fonts](http://wordpress.org/plugins/disable-google-fonts)

&nbsp;

### 修改Wordpress源代码

找到文件“wp-includes/script-loadeer.php”，搜索“fonts.googleapi”即可找到（大约是在第602行），里面有这么一行代码：

```php
$open_sans_font_url = "//fonts.useso.com/css?family=Open+Sans:300italic,400italic,600italic,300,400,600&amp;amp;subset=$subsets";
```

可以看出来这行代码加载了Google的字体服务，对应的修改方法有两种：一是把服务加载的CSS文件和字体文件下载到本地并修改加载的地址为你自己的本地地址（麻烦，不推荐）；另一种方法就是把Google的服务换成360的镜像服务，即把其中的`fonts.googleapi.com`改成 `fonts.useso.com`，这样就从Google的API改成了360遍布全国的CDN节点，加载速度杠杠的~博主强烈推荐~

另外有兴趣的朋友也可以去看下360的这项服务，地址：[http://libs.useso.com/](http://libs.useso.com/)
