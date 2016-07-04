---
title: PHP函数中任意数量参数的简单用法
tags:
  - PHP
  - 技巧
id: 392
categories:
  - PHP
date: 2013-07-05 23:39:40
---

你可能知道PHP允许你定义一个默认参数的函数。但你可能并不知道PHP还允许你定义一个完全任意的参数的函数

下面是一个示例向你展示了默认参数的函数：

```php
<?php
　// 两个默认参数的函数
　　function foo($arg1 = '', $arg2 = '') {
    　　echo "arg1: $arg1\n";
    　　echo "arg2: $arg2\n";
　　}
　　foo('hello','world');

　　foo();
?>
```

现在我们来看一看一个不定参数的函数，其使用到了func_get_args()方法：

```php
<?php

　　function foo() {
　　// 取得所有的传入参数的数组
　　  $args = func_get_args();
    　　foreach ($args as $k => $v) {
    　　  echo "arg".($k+1).": $v\n";
    　　}
　　}
　　foo();

　　foo('hello');

　　foo('hello', 'world', 'again');
?>
```

func_get_args()方法用于返回function的参数列表，返回值是一个数组。

&nbsp;

来自：http://blog.sina.com.cn/s/blog_5747a69601019lul.html