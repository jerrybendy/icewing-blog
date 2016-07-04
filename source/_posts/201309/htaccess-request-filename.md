---
title: htaccess中REQUEST_FILENAME的常用判断参数
tags:
  - htaccess
  - 伪静态
  - 参数
  - 文件
  - 重定向
id: 545
categories:
  - 服务器
date: 2013-09-08 21:26:46
---

在网站做伪静态时经常会用到.htaccess文件（或web.config），在进行URL重写时又经常会看到这样一行代码：`RewriteCond %{REQUEST_FILENAME} !-f`，都知道这段代码的意思是匹配文件名，今天要说的就后后面的那个`!-f`。

<!--more-->

我们可以这样简单地理解REQUEST_FILENAME的参数：我们在根目录内有`index.php`、`abc.html`两个文件和一个admin文件夹，伪静态规则是把所有的请求重定向到`index.php?alias=XXX`，即`example.com/aaa.html`会被重定向到`example.com/index.php?alias=aaa.html`，这样就会直接导致根目录下的abc.html文件和admin文件无法正常访问（访问的网址被重定向了），这样便体现了这几个参数的作用了。

`REQUEST_FILENAME`的格式是： `RewriteCond %{REQUEST_FILENAME} _TestString_`，其中`TestString`是要检测的格式或参数。

常用的参数如下：

**-d 是否是一个目录**

-d参数判断请求的文件是否是一个存在的文件夹，判断TestString是否不是一个文件夹可以这样：`!-d`

**-f 是否是一个文件**

-f参数判断请求的文件是否是一个存在的文件，判断TestString是否不是一个文件可以用：`!-f`

**-s 是否是一个正常的有大小的文件**

-s判断请求的文件是否是一个存在的非空文件；判断不是可以用：`!-s`

**-l 是否是一个快捷方式**

此参数在Windows主机下无效，IIS7.5以上重写模块也不支持此参数。它判断请求的文件是否是一个Liunx/Uinx下的文件快捷方式（软链接）；判断不是用：`!-l`

**-x 是否是一个具有执行权限的文件**

判断不是用：`!-x`

**-F 检查TestString是还是是一个合法的文件**

-F检查请求的文件是还是是一个合法的文件，而且通过服务器范围内的当前设置的访问控制进行访问。这个检查是通过一个内部的SubRequest完成的，因此需要小心使用这个功能以免降低服务器的性能。

**-U 检查TestString是否是一个合法的URL**

-U检查请求的文件是否是一个合法的URL，而且通过服务器范围内的当前设置的访问控制进行访问。这个检查是通过一个内部的SubRequest完成的，因此需要小心使用这个功能以免降低服务器的性能。



其中最常用的是!-f、!-d和!-l三个参数，同时使用这三个参数就可以完美解决上面的问题。下面附上一个示例，把所有网址为example.com/abcd.html这样的请求重定向到example.com/alias=abde

```
RewriteEngine on
   RewriteBase /
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteCond %{REQUEST_FILENAME} !-l
   RewriteRule ^([a-zA-Z0-9_-]+)\.html$ index.php?alias=$1 [L]
```
