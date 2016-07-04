---
title: 使用PHP获取网站Favicon的方法
tags:
  - favicon
  - google
  - PHP
id: 815
categories:
  - PHP
date: 2014-01-02 23:18:08
---

最近做一个Tab需要在网站名旁边显示网站的Favicon以提高显示效果，如图：

![icetab](https://cdn.icewing.cc/wp-content/uploads/2014/01/icetab.jpg)

开始做的时候想到的是利用Google的方式来获取，使用“http://www.google.com/s2/favicons?domain=网址”的方式可以直接获得网站的Favicon图标并以16*16大小图片的形式显示出来，这个方法简单方便，但在有些网络环境下却会出现图片无法显示的问题（需要翻墙），为了解决这个BUG我决定重新写一个获取Favicon的函数，使用自己的服务器以避免翻墙。

实际效果请参见示例：

[http://favicon.byi.pw/?url=blog.icewingcc.com](http://favicon.byi.pw/?url=blog.icewingcc.com)

如果不想自己写方法的话也可以使用我提供的接口，即“http://favicon.byi.pw/?url=网址”，网址可以带http://前缀。

代码（调用Google的方式，这种方式可以减少代码量，并且速度也比较快）：

```php
<?php
if(isset($_GET['url'])){
	$icon = file_get_contents("http://www.google.com/s2/favicons?domain=" . $_GET['url']);
	if($icon){
		header('Content-type:image/png');
		echo $icon;
	}
}
```

没错，就这几行代码搞定一切 ^\_^

这样只要我们使用的服务器能够访问Google就可以正常显示出Favicon，不再受网络环境的影响。

复杂些的方法就是自己写获取函数，这里我只提供思路，就不再写代码了，如果有需要代码可留言，定附上。

一般网站都会把自己的Favicon图标以“favicon.ico”命名并放在网站根目录下，如http://www.baidu.com/favicon.ico。所以可以直接使用PHP函数 file_get_contents()来获取图片内容，设置Header为PNG图片，显示出来即可。

如果根目录没有favicon.ico这个文件的话可以使用file_get_contents或CURL获取网页的内容，使用正则找到“ <link rel="shortcut icon" href=".." />”，href里面便是favicon的文件位置，直接获取它的内容即可。

&nbsp;
