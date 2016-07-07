---
title: PHP单一入口的特有作用
tags:
  - PHP
id: 283
categories:
  - PHP
date: 2013-05-24 22:39:46
---

在说单一入口之前，先说说多入口。Discuz!, PHPCMS 2008, DedeCMS 都是采用多入口的结构。

多入口，即通过访问不同的 php 文件运行对应的功能。如：

* /index.php - 网站首页
* /show.php?id=1 - 内容页
* /list.php?page=2 - 列表页
* /login.php - 用户登录页
* ……

多入口都是通过包含头文件统一运行环境，即初始化系统。如：

`/include/common.inc.php` - 头文件，PHP 文件 include 它后便完成了初始化工作，例如可以使用系统的基础函数。

```php /index.php
<?php
include './include/common.inc.php' // 包含头文件，基本是每个入口 php 文件的首行代码。
……
?>
```

拿 PHPCMS 2008 的头文件来举例， PHPCMS 2008 在头文件中完成了基础函数的加载，常量的定义，系统配置的载入，POST,GET 数据的过滤，数据库类的实例化，保持用户登录等等等等一系列操作。
反正就是个 php 文件嘛，想做什么直接往里加就是了。

所以，所谓的安全检查，统一检查，权限控制等，用头文件同样可以实现，所谓“单一入口”只不过是换了一种形式，并无实质性的变化。

以前我就是这样认为的。

现在，假设用 CMS 为客户建一个站（ CMS 是多入口的）：建栏目，配网站，卡拉卡拉一段忙碌后，网站可以上线了，放在这个地址下：

`localhost/gz/`

没错，这次建的是 gz 这个地区的地区站，客户认为网站做得不错，希望做多一个 bj 地区的地区站。 bj 站的栏目结构，内容，功能模块等都与 gz 站有所不同。

好，现在问题来了，上面提到的三个多入口的系统，都设计成一套程序一个环境，即一套程序只对应一个数据库。对于上面的需求（ bj 站），除非修改整套程序的结构（这是不切实际的），否则就只能复制多一份源代码，指向另一个数据库。

于是，我便复制多一份源代码，指向 bj 数据库（ gz 站则指向 gz 数据库），建栏目，配网站，卡拉卡拉一优忙碌后，网站又可以上线了，放在这个地址下：

`localhost/bj/`

所以，现在有两套一样的程序在运行。

然后，客户想改一改 gz 站的功能，于是我修改了 gz 的代码。然后，客户想改一改 bj 站的功能，于是我修改了 bj 的代码。然后，客户想在 bj 站上做与 gz 同样的修改，于是我得把 gz 的修改复制到 bj 中，然后……

于是，我不得不维护两份实际上是“一样”的代码。
假如网站运营得不错，客户又建了若干个地区站，我维护的便是若干份“一样”的代码——这根本就是恶梦。

现在到单一入口登场了。

单一入口，就是访问同一个文件加不同参数运行不同的功能。如：

* /index.php - 单一入口，默认显示首页
* /index.php?action=show&id=1 - 用 action 参数指明显示内容页
* /index.php?action=list&page=2 - 显示列表页
* /index.php?action=login - 用户登录页
* ……

index.php 这个入口做的便是头文件做的初始化操作（外加一些调度），包括加载网站的配置。

现在我们来假设建站用的 CMS 是单一入口的设计，在完成 gz 站后，面对同样的需求（ bj 站），我只需要在 /bj/ 目录入多建一个入口文件，加载指向 bj 数据库的配置，再配配数据卡拉卡拉什么的，就完事了！

于是，我只需要维护一份源代码。

这便是单一入口特有的作用——构造环境。
使用哪个数据库就是环境的一种，类似的还有：用内存缓存还是文件缓存，用 mysql 还是 mssql 等。

除非在设计阶段特别留意，否则，头文件的结构都会被写成“一套程序一个环境”的结构。而采用单一入口结构，无论是否留意，都可以轻易实现“一套程序多个环境”。这才是使用单一入口的真正理由。

转自：朱健强的博客http://blog.csdn.net/gevolution90/article/details/7179631