---
title: 使用PHP发送邮件的两种方法
tags:
  - PHP
  - 邮件
id: 279
categories:
  - PHP
date: 2013-05-24 22:25:56
---

今天研究了一下使用PHP来发送电子邮件，总结了一下，有这么两种方法：

### 一、使用PHP内置的mail()函数

看了一下手册，就直接开始写代码了，如下

```php
$to = "test@163.com";
$subject = "Test";
$message = "This is a test mail!";
mail($to,$subject,$message);
```

结果就直接报错，如下：

> **Warning**: mail() [[function.mail](http://blog.csdn.net/rainday0310/article/details/function.mail)]: Failed to connect to mailserver at "localhost" port 25, verify your "SMTP" and "smtp_port" setting in php.ini or use ini_set() in **D:/www/Zend/email/email.php** on line **10**

看来本地需要有SMTP服务器，那就使用别人的试试吧，又改了下代码

```php
$to = "test@163.com";
$subject = "Test";
$message = "This is a test mail!";
ini_set('SMTP','smtp.163.com');
ini_set('smtp_port',25);
ini_set('sendmail_from',"admin@163.com");
mail($to,$subject,$message);
```

结果还是错误：

> **Warning**: mail() [[function.mail](http://blog.csdn.net/rainday0310/article/details/function.mail)]: SMTP server response: 553 authentication is required,smtp2,DNGowKD7v5BTDo9NnplVBA--.1171S2 1301220947 in **D:/www/Zend/email/email.php** on line **9**

看来是需要验证信息，怎么写验证信息呢？在哪里配置呢？上网找了半天也没找出个所以然，最后看了别人一些技术文章后得出结论（由于对SMTP邮件什么的不是非常了解，所以也不知道这个结论是否是正确的）：使用mail()函数发送邮件就必须要有一台无需SMTP验证就可以发信的邮件服务器。但现在的SMTP邮件服务器基本上都是需要验证的，所以要想使用它发邮件就只能自己在本地搭一个不需要验证的SMTP服务器。这就比较麻烦了，我是不想整，有兴趣的同学可以自己试试搭一个，用windows自带的IIS就可以，或者从网上下载其他的SMTP服务器软件，我就不多说。

**结论：**使用mail()函数发送邮件，就必须要有一台不需要验证的SMTP服务器。

这样的话配置工作会多一点，但是使用的时候就比较省事了，几行代码就可以。

&nbsp;

### 二、使用SMTP邮件类

这种方法就比较常见了，尤其对于广大自己没有服务器，从网上购买虚拟主机的同学，第一种方法不现实，所以还是自己使用SMTP协议来发送邮件吧。不过要完成这项工作的话，就需要你对SMTP协议有一定的了解，喜欢事必躬亲的同学可以自己动手写一个，喜欢拿来主义的同学就可以从网上下载了，有很多，自己找吧。

下面我举例说明一下在CodeIgniter里面如何使用它内置的邮件类发送邮件吧

```php
$this->load->library('email');
$to = "aa@bb.cc";
$subject = "test";
$message = "hello!";

$config["protocol"]     = "smtp";
$config["smtp_host"]    = "smtp.163.com";
$config["smtp_user"]    = "username@163.com";
$config["smtp_pass"]    = "password";
$config["mailtype"]     = "html";
$config["validate"]     = true;
$config["priority"]     = 3;
$config["crlf"]         = "/r/n";
$config["smtp_port"]    = 25;
$config["charset"]      = "utf-8";
$config["wordwrap"]     = TRUE;
$this->email->initialize($config);
$this->email->from('xxxx@163.com', 'xxxx');
$this->email->to($to);
$this->email->subject($subject);
$this->email->message($message);
$this->email->send();
```

由于这些类都是高度封装的，所以使用起来也很简单。

**结论：**这种方式发送邮件无需装任何软件，但是需要你写更多的代码，而且要对SMTP比较熟悉。

但是如果你不自己写，而是直接使用别人写好的现成的代码的话，那这种方法无疑是最省事的：

不需要自己搭建SMTP服务器，也不需要写很多的代码。

&nbsp;

转自：苗雨顺的专栏[http://blog.csdn.net/rainday0310/article/details/6281936](http://blog.csdn.net/rainday0310/article/details/6281936)