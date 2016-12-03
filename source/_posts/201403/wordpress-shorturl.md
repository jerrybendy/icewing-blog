---
title: Wordpress文章和评论中自动应用短网址
tags:
  - wordpress
  - 短网址
id: 970
categories:
  - PHP
date: 2014-03-11 10:07:50
updated: 2016-05-22 11:51:16
---

前几天冰翼博客推出了自己的短网址程序并且对外开放了调用API（见《[冰翼短网址程序改版上线，开放API](http://blog.icewingcc.com/icewing-short-url.html)》），今天就实战下，讲述如何在Wordpress中应用短网址。

至于在博客中使用短网址的好处我就不多说啦，都是为了SEO。以下代码可单独创建为一个插件，也可以加在主题 functions.php 的后面使用，代码中有两个add_filter函数，如果不需要使用评论或文章中的应用短网址操作直接把对应的add_filter删除（或注释）掉即可：

=======================================
【更新】2014-09-08 Version 1.07
之前的代码使用的PHP的内联函数，而这一特性在低版本的PHP中不支持，就会导致某些虚拟主机服务启用插件是报错

```php WP短网址代码
<?php
/*
Plugin Name: icewingcc_short_url
Plugin URI: http://blog.icewingcc.com
Description: 自动在发表文章和评论中将文中的URL替换成短网址
Version: 1.07
Author: Jerry Bendy
Author URI: http://blog.icewingcc.com
Text Domain: icewingcc_functions
*/

//在发表评论时应用短网址  
add_filter('pre_comment_content', 'icewingcc_comment_short_url');
function icewingcc_comment_short_url($content){
	$text = stripslashes($content);
	$text = icewingcc_short_url($text);
	$text = wp_slash($text);
	return $text;
}

//在发表文章时应用短网址
add_filter('content_save_pre', 'icewingcc_comment_short_url');

function icewingcc_short_url($content){
	$text= preg_replace_callback('/(<a .*?href=\")(.*?)(\".*?>)/i' , 'icewingcc_short_url_callback',
	$content
	);
	return $text;
}

//PHP5.3以下版本不支持内联函数，只能这样做了。。。
function icewingcc_short_url_callback($matches){
	//匹配到的数组，0一般表示完整的匹配，1表示第一个匹配到的子串
	if(isset($matches[0])){
		try{
			//过滤所有链接是u.byi.pw的情况
			if(strpos(strtolower($matches[2]), 'u.byi.pw') !== FALSE){
				return $matches[0];
			}
			//过滤链接是本站地址的情况
			if(strpos(strtolower($matches[2]), parse_url(get_bloginfo('url'), PHP_URL_HOST)) !== FALSE){
				return $matches[0];
			}
			//初始化并设置CURL参数
			$ch = curl_init();
			curl_setopt($ch,CURLOPT_URL,"http://u.byi.pw/api/create");
			curl_setopt($ch,CURLOPT_POST,true);
			curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
			//数据参数
			$data = array('url' => $matches[2]);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
			$strRes = curl_exec($ch);
			curl_close($ch);
			//解析服务器返回的JSON字符串
			$arrRspn = json_decode($strRes, TRUE);

			if($arrRspn['status'] > 0){
				return $matches[0];
			} else {
				return $matches[1] . $arrRspn['tinyurl'] . $matches[3];
			}
		}catch(Exception $e){
			return $matches[0];
		}
	}

}
```

代码打包下载：

[下载地址](https://share.icewing.cc/download/NTQwZGNkZjIyZGNmMQ.html)
