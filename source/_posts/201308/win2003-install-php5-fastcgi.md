---
title: Windows2003用FastCGI方式安装PHP5方法
tags:
  - IIS
  - PHP
  - Windows
id: 461
categories:
  - 服务器
date: 2013-08-19 19:53:46
updated: 2016-05-22 11:24:44
---

以下内容来源于网络，亲测可用。

&nbsp;

**1、下载PHP5**
[http://www.php.net/downloads.php](http://www.php.net/downloads.php)

也可以使用独立安装包安装PHP5，使用FastCGI模式。

**2、下载 FastCGI for IIS  **

[http://www.iis.net/download/fastcgi](http://www.iis.net/download/fastcgi)

** 3、解压缩php5**到C:\php  （自行定义）

这个比较简单，只需要到官网上下载最新的PHP安装到一个文件夹即可。网上说要把PHP目录下的所有.dll复制到C:\WINDOWS\system32下，我经过测试发现没有必要，反正我是一个dll文件都没有复制。因为php.ini中已经指定了dll在php安装目录的位置。

接下来就是修改php.ini配置文件了。

找到 ;fastcgi.impersonate = 1 ,记得把前面的";"去掉。去掉常用扩展前面的分号。

修改extension_dir = "./" , 把这个修改成extension_dir = "D:/PHP/ext/" 。

开启相应的dll文件。注意要开启这个扩展： extension=php_xmlrpc.dll

搜索;date.timezone = 去掉前面的分号，将其设置为 date.timezone = "Asia/Shanghai" 。这一步看起来是必须的，否则就会报错
**4、配置php.ini（开发环境）：**

将php.ini-development更名为php.ini后修改内容如下：

```
fastcgi.impersonate = 1

fastcgi.logging = 0

cgi.fix_pathinfo=1

cgi.force_redirect = 0

extension_dir = "C:\php\ext\"

log_errors = On
```

**5、安装并配置FastCGI**

将C:\WINDOWS\system32\inetsrv\fcgiext.ini中[Types]配置如下：

```
[Types]

php=PHP

[PHP]

ExePath=F:\soft_dev\php\php-cgi.exe
```

**6、配置IIS**

“Internet 信息服务(IIS)管理器->网站”。然后在“默认网站”项目上单击鼠标右键选择“属性”，打开“默认网站属性”对话框。

切换到“主目录”选项卡，点击“配置”按钮，打开“应用程序配置”对话框。再点击“添加”按钮，打开“添加/编辑应用程序扩展名映射”对话框。点击“浏览”按钮，选中 C:\WINDOWS\system32\inetsrv\fcgiext.dll，扩展名里面填入.php。然后一路“确定”返回“默认网站属性”对话框，切换到“文档”选项卡，点击“添加”按钮将index.php 添加到默认内容文档列表中。

注意：将 默认网站的 主目录 指向你存放PHP文件的目录，并勾选“脚本资源访问”、“读取”、“目录浏览”、“记录访问”和“索引资源”。

最后确认并关闭对话框。

注意：对IIS启动帐户赋予该目录（C:\php\）的读取和运行权限

**7、 重新启动IIS。**

**8、测试PHP**

在主目录下新建一文件test.php，内容如下：

```php
<?php
echo phpinfo();
?>
```

如果出现PHP信息页则表示安装成功。

&nbsp;

转自：[http://www.3qsoft.com/Article/50.html](http://www.3qsoft.com/Article/50.html)