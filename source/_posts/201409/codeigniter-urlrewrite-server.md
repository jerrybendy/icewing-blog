---
title: CodeIgniter在IIS、Apache、SAE和NginX上的伪静态设置方法
tags:
  - htaccess
  - IIS
  - NginX
  - 伪静态
  - CodeIgniter
id: 1118
categories:
  - PHP
date: 2014-09-25 15:57:56
---

[CodeIginter](http://blog.icewingcc.com/category/php/codeigniter)是一个很不错的轻量级PHP框架，文档也比较全面。关于CI去除“index.php”的伪静态设置在官方的文档中却只提及了一点，而且给出的方法对于静态文件还会出现错误。

以下的内容并非是原创，而是整理了CI在不同服务器下的伪静态设置方法放在一起，供有需要的朋友复制、使用。

### Apache服务器

Apache服务在打开URLRewrite模块后使用`.htaceess`文件处理伪静态规则。使用方法很简单，在网站根目录创建一个文本文件并命名为`.htaccess`，复制下面的内容进去保存就好了。（Windows的电脑上不允许这种以点号开头的文件，不过可以使用命令提示符重命名，或者先随便用什么名字，上传到服务器后再改回成.htaccess）。

```
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond $1 !^(index\.php|images|robots\.txt)
RewriteRule ^(.*)$ /index.php/$1 [L]
```

### IIS服务器

IIS从IIS7版本开始开始使用新的URLRewrite机制，并使用`web.config`文件处理伪静态规则，IIS7以上版本URLRewrite插件的安装及`.htaccess`文件转`web.config`的方法请参见我的另一篇博文《[IIS 7及IIS 7.5下面.htaccess转为web.config的方法](http://blog.icewingcc.com/iis-htaccess-to-webconfig.html "IIS 7及IIS 7.5下面.htaccess转为web.config的方法")》，另外贴出一份转换好的文件。在网站根目录创建文本文件并命名为`web.config`，把以下内容复制进去即可：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="CodeIginiterRewrite" stopProcessing="true">
                    <match url="^(.*)$" ignoreCase="false" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" ignoreCase="false" negate="true" />
                        <add input="{R:1}" pattern="^(index\.php|images|robots\.txt)" ignoreCase="false" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/index.php/{R:1}" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

### NginX服务器

NginX是一个轻量级的WEB服务器，具有高并发等优势，NginX的配置可能会有些麻烦，在path_info开启的情况下修改`nginx.conf`文件，在对应网站的server段加入以下内容：

```
location / {
    if (!-e $request_filename) {
        rewrite ^/(.+)$ /index.php/$1 last;
    }
}
```

### SAE新浪云服务

SAE有专为SAE修改的CI版本可用，对应的伪静态文件也一起贴出来吧。SAE需要在网站根目录下建立`config.yaml`文件，并输入以下内容：

```yaml
handle:
- compress:  if ( out_header["Content-type"]=="text/css" ) compress
- compress:  if ( out_header["Content-type"]=="text/javascript" ) compress
- compress:  if ( out_header["Content-type"]=="application/javascript" ) compress
- rewrite: if(!is_dir() &amp;&amp; !is_file() &amp;&amp; path~"/") goto "/index.php/%{QUERY_STRING}"
```

如果文件中已有“handle”段可以在后面追加这部分内容。代码中的三行以“compress”结尾的内容是静态文件压缩，不使用压缩的话可以删除它们。
