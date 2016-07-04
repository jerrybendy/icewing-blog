---
title: MAMP PRO安装PHP扩展的方法
tags:
  - MAMP
id: 1241
categories:
  - PHP
date: 2015-09-10 13:21:14
---

这几天因为需要使用MAC做PHP开发，安装了一个MAMP PRO的试用版，整体感觉非常好用，还可以自由选择PHP版本、Apache扩展、很方便的创建网站并自动修改系统hosts文件等。

MAMP和MAMP PRO是两个独立软件，MAMP可以单独运行，支持简单的操作如PHP版本切换、Apache/Nginx切换、启动/停止服务等。MAMP PRO不能独立运行，它需要依赖MAMP软件，其实MAMP PRO就是MAMP的一个功能强大的控制面板，并提供了一些MAMP本身不支持的功能（如修改hosts、DDNS、方便的修改PHP运行方式以及Apache模块、方便的添加和管理虚拟网站等），售价不到400元，你值得拥有～

![2015-09-10 13.19.26](https://cdn.icewing.cc/wp-content/uploads/2015/09/2015-09-10-13.19.26.png)

因为我的项目很多都依赖Redis做缓存和队列，偶尔也有使用MongoDB的需求，或者安装Phalcon框架等，而MAMP不支持这些扩展，也没有提供任何安装这些扩展的方法，只能去折腾～～ 各种查资料，各种看文档 。。。。

以下以安装Redis为例，其它扩展方法一样。

首先需要先安装Redis，我比较懒，直接使用brew安装的

```bash
brew install redis
```

接下来安装php-redis扩展，这个可以自己下载源码编译，或者寻找对应自己所用PHP版本的redis.so。

因为MAMP里面集成的PHP版本都没有包含头文件，自己下载编译的话肯定会出错，具体解决方法可自行去查找资料。当然，我比较懒，于是：

```bash
brew install homebrew/php/php56-redis
```

因为我用的是PHP5.6，所以是php56-redis，用这种方法非常方便、简单，但带来的问题是brew会自动安装一个PHP5.6.19到/usr/local/Cellar目录下。

而安装好的redis扩展被放到了/usr/local/Cellar/php56-redis/2.2.7_1/redis.so

接下来就是修改PHP配置文件的问题了。前面说到MAMP里面每个PHP版本对应的目录下面都有一个 conf/php.ini 文件，自然就是PHP的配置文件了，于是修改这个文件，在扩展的部分添加以下代码

```
extension=/usr/local/Cellar/php56-redis/2.2.7_1/redis.so
```

完后后经测试，php -m 表示已加载redis扩展，并且使用MAMP启动服务能正常加载redis扩展，但使用MAMP PRO却无法加载扩展。

这个总是着实头疼了一阵，最后想到phpinfo查看加载的是哪个配置文件，最终定位到配置文件的位置在/Library/Application Support/appsolute/MAMP PRO/conf/php.ini。而且发现使用module方式和使用CGI方式加载的配置文件也不一样，但都在这个目录下面。于是尝试去修改这个文件添加redis扩展的路径。

问题出现了，还是没能加载redis扩展，再去查看刚刚修改的那个php.ini文件，发现修改全部都不见了（可见MAMP PRO每次启动服务时都会重新生成这个配置文件，所以刚才的修改不见了）。

实在没办法，只能去官网上面找出路，英文文档各种翻，甚至基本的操作都看了一遍，终于还是找到方法了～～ —— 模板～

虽然官网没说这个模板能干什么用，但显而易见这是每次启动服务的时候用来重新生成php.ini和httpd.conf文件的模板。

修改方法：

点击菜单 --> File --> Edit Template --> PHP --> PHP 5.6.10 php.ini

![2015-09-10 13.05.02](https://cdn.icewing.cc/wp-content/uploads/2015/09/2015-09-10-13.05.02.png)

接下来会弹出一个警告并打开一个php.ini这样的文件，可以看到这个文件里面很多关键的地方都被换成了MAMP的变量。直接和前面一样在扩展的部分加上加载redis扩展的内容，保存并重启MAMP服务。

再次phpinfo发现终于成功加载了redis扩展。。。真是一路折腾，不过也算是对MAMP PRO这个软件有了更深一层的了解，以后在使用的时候也会方便很多。

安装MongoDB等基它扩展的方法也与此相似，简单总结一下：

*   如果不使用MAMP PRO的话可以直接在 /Application/MAMP/bin/php/php-x.x.x/conf 目录下修改php.ini，并且会生效
*   如果使用MAMP PRO必须要修改模板才能生效

一版来说是如下几个过程：

1.  下载或编译扩展（一般是.so文件）
2.  修改MAMP PRO的php.ini模板
3.  没了

知道了模板这个东西，以后有需要也可以很方便的个性Apache的模板啦～
