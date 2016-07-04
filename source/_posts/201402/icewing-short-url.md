---
title: 冰翼短网址程序改版上线，开放API
tags:
  - API
  - CodeIgniter
  - PHP
  - 短网址
id: 926
categories:
  - PHP
date: 2014-02-21 11:57:18
updated: 2016-05-22 11:48:10
---

> 2016-05-22更新：phurl的算法由于会产生被遍历的安全问题目前已停止使用，新的方案和接口正在开发中。

我曾在2013年5月18日发分享过一个网站软件叫PhUrl（参见《[免费短网址程序：phurl](http://blog.icewingcc.com/phurl.html)》），PhUrl的源码是逐过程的，功能简单、难以扩展并且难以移植。刚好我最近在学习PHP面向对象，本着代码重用并且易于扩展的原则，对PhUrl的全部源代码进行了改造（准确的说两者之间已经没什么相似性了，除了前台界面暂时还未修改）。

这次修改主要是向着面向对象和面向切面两个方向，在过程式执行的同时引入Hook机制，在数据校验、Query执行、数据插入等过程创建Hook并提供扩展支持。修改后的程序使用我常用的CI（CodeIgnter ）框架，目前程序功能已完善，各接口均可使用，只是后台还在建设，安装程序还没做，所以在完善之前暂不开放源代码下载。

服务地址：[http://u.byi.pw](http://u.byi.pw)

使用方法很简单，输入要缩短的长网址并点击“缩短”即可，别名是可选的自定义后缀，如别名是“blog”，就可以使用http://u.byi.pw/blog的形式访问。

程序支持以AJAX或CURL方式获取和还原短网址，也可以从其它站点POST数据到下面给出的网址。

## API列表

### 生成短网址

```
请求地址： http://u.byi.pw/api/create

请求方式： POST

参数：
      url = 长网址
      alias = 别名  （可选）

返回数据： JSON
```

向上面的地址发送POST请求，发送数据包含必选参数url=长网址，别名为可选参数。

执行成功服务器返回一个JSON字符串，其中包含以下数据：
```
time     请求发生的时间

status   返回状态码，大于0时表示发生一个错误，可从err_msg查看，0表示成功，-1表示网址已经存在于数据库中（此时tinyurl可用）

err_msg   错误描述，status为0时返回空字符串

tinyurl   生成的短网址
```

###  还原短网址

```
请求地址： http://u.byi.pw/api/query

请求方式： POST 或 GET

参数：
      tinyurl = 短网址（可以是整个的短网址或仅代码）

返回数据： JSON
```
向上面的地址发送POST或GET请求，发送数据包含必选参数tinyurl=短网址。

执行成功服务器返回一个JSON字符串，其中包含以下数据：
```
time     请求发生的时间

status   返回状态码，大于0时表示发生一个错误，可从err_msg查看，0表示成功

err_msg   错误描述，status为0时返回空字符串

longurl   原网址
```

###  代码示例

```php
//初始化CURL环境
$ch=curl_init();

//设置CURL参数
curl_setopt($ch,CURLOPT_URL,"http://u.byi.pw/api/create");
curl_setopt($ch,CURLOPT_POST,true);
curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);

//发送数据参数
$data=array('url'=>'blog.icewingcc.com', 'alias'=>'blog');

curl_setopt($ch,CURLOPT_POSTFIELDS,$data);
$strRes=curl_exec($ch);
curl_close($ch);

//解析服务器返回的JSON字符串
$arrResponse=json_decode($strRes,true);

if($arrResponse['status'] > 0)
{
	echo iconv('UTF-8','GBK',$arrResponse['err_msg'])."\n";
} else {
	//生成的短网址
	echo$arrResponse['tinyurl']."\n";
}
```
