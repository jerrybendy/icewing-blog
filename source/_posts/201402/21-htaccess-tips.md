---
title: 21个非常有用的 .htaccess 提示和技巧
tags:
  - htaccess
  - linux
  - 伪静态
id: 923
categories:
  - 服务器
date: 2014-02-18 10:48:06
updated: 2016-05-22 11:43:41
---

Apache Web 服务器可以通过 .htaccess 文件来操作各种信息，这是一个目录级配置文件的默认名称，允许去中央化的 Web 服务器配置管理。可用来重写服务器的全局配置。该文件的目的就是为了允许单独目录的访问控制配置，例如密码和内容访问。

下面是 21 个非常有用的 .htaccess 配置的提示和技巧：

### 1\. 定制目录的 Index 文件

```
DirectoryIndex index.html index.php index.htm
```

你可以使用上面的配置来更改目录的默认页面，例如你将这个脚本放在 foo 目录，则用户请求 /foo/ 时候就会访问 /foo/index.html。

### 2\. 自定义错误页
```
ErrorDocument 404 errors/404.html
```
当用户访问页面报错时，例如页面找不到你希望显示自定义的错误页面，你可以通过这种方法来实现。或者是动态的页面：
```
ErrorDocument 404 /psych/cgi-bin/error/error?404
```

###  3\. 控制访问文件和目录的级别

.htaccess 经常用来限制和拒绝访问某个文件和目录，例如我们有一个 includes 文件夹，这里存放一些脚本，我们不希望用户直接访问这个文件夹，那么通过下面的脚本可以实现：
```
# no one gets in here!  #号开头的都是注释
deny from all[/code]
上述脚本是拒绝所有的访问，你也可以根据IP段来拒绝：
[code]# no nasty crackers in here!
order deny,allow
deny from all
allow from 192.168.0.0/24
# this would do the same thing..
#allow from 192.168.0
```
一般这些方法是通过防火墙来处理，但在一个生产环境中的服务器来说，这样的调整非常方便。

有时候你只是想禁止某个ip访问：
```
# someone else giving the ruskies a bad name..
order allow,deny
deny from 83.222.23.219
allow from all
```

###  4\. 修改环境变量

环境变量包含了服务器端 CGI 的一些扩展信息，可使用 SetEnv 和 UnSetEnv 进行设置以及取消设置.
```
SetEnv SITE_WEBMASTER "Jack Sprat"
SetEnv SITE_WEBMASTER_URI mailto:Jack.Sprat@characterology.com

UnSetEnv REMOTE_ADDR
```

###  5\. 301 重定向

如果你希望某个页面跳转到新的页面：
```
Redirect 301 /old/file.html http://yourdomain.com/new/file.html
```
下面可以实现对整个路径的重定向
```
RedirectMatch 301 /blog(.*) http://yourdomain.com/$1
```

###  6\. 通过 .htaccess 实现缓存策略

通过设置在浏览器上缓存静态文件可以提升网站的性能：
```
# year
<FilesMatch "\.(ico|pdf|flv|jpg|jpeg|png|gif|swf|mp3|mp4)$">
Header set Cache-Control "public"
Header set Expires "Thu, 15 Apr 2010 20:00:00 GMT"
Header unset Last-Modified
</FilesMatch>
#2 hours
<FilesMatch "\.(html|htm|xml|txt|xsl)$">
Header set Cache-Control "max-age=7200, must-revalidate"
</FilesMatch>
<FilesMatch "\.(js|css)$">
SetOutputFilter DEFLATE
Header set Expires "Thu, 15 Apr 2010 20:00:00 GMT"
</FilesMatch>
```

###  7\. 使用 GZIP 对输出进行压缩

在 .htaccess 中添加下面的代码可以将所有的 css、js 和 html 使用 GZIP 算法压缩：
```
<IfModule mod_gzip.c>
     mod_gzip_on       Yes
     mod_gzip_dechunk  Yes
     mod_gzip_item_include file      \.(html?|txt|css|js|php|pl)$
     mod_gzip_item_include handler   ^cgi-script$
     mod_gzip_item_include mime      ^text/.*
     mod_gzip_item_include mime      ^application/x-javascript.*
     mod_gzip_item_exclude mime      ^image/.*
     mod_gzip_item_exclude rspheader ^Content-Encoding:.*gzip.*
 </IfModule>
 ```
使用上面代码的前提是启用 mod_gzip 模块，你可以使用下面脚本来判断 Web 服务器是否提供 mod_deflate 支持：
```
<Location>
     SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI  \
         \.(?:gif|jpe?g|png)$ no-gzip dont-vary
     SetEnvIfNoCase Request_URI  \
         \.(?:exe|t?gz|zip|gz2|sit|rar)$ no-gzip dont-vary
 </Location>
```
如果 Web 服务器不支持 mod_deflate ，那么可使用下面方法：
```
<FilesMatch "\.(txt|html|htm|php)">
    php_value output_handler ob_gzhandler
</FilesMatch>
```

###  8\. 强制要求使用 HTTPS 访问

通过以下脚本可以强制整个网站必须使用 https 方式访问：
```
RewriteEngine On
RewriteCond %{HTTPS} !on
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI}
```

###  9\. URL 重写

例如要将 product.php?id=12 重写为 product-12.html
```
RewriteEngine on
RewriteRule ^product-([0-9]+)\.html$ product.php?id=$1
```
将 product.php?id=12 重写为 product/ipod-nano/12.html
```
RewriteEngine on
RewriteRule ^product/([a-zA-Z0-9_-]+)/([0-9]+)\.html$ product.php?id=$2
```
重定向没有 www 到有 www 的 URL 地址：
```
RewriteEngine On
RewriteCond %{HTTP_HOST} ^icewingcc\.com$
RewriteRule (.*) http://www.icewingcc.com/$1 [R=301,L]
```
重写 yoursite.com/user.php?username=xyz 到 yoursite.com/xyz
```
RewriteEngine On
RewriteRule ^([a-zA-Z0-9_-]+)$ user.php?username=$1
RewriteRule ^([a-zA-Z0-9_-]+)/$ user.php?username=$1
```
重定向某个域名到一个 public_html 里新的子文件夹：
```
RewriteEngine On
RewriteCond %{HTTP_HOST} ^test\.com$ [OR]
RewriteCond %{HTTP_HOST} ^www\.test\.com$
RewriteCond %{REQUEST_URI} !^/new/
RewriteRule (.*) /new/$1
```

###  10\. 阻止列出目录文件

使用下面代码可以防止列表目录里的所有文件：
```
Options -Indexes
# 或者
IndexIgnore *
```

###  11\. 添加新的 MIME-Types

MIME-types 依赖于文件的扩展名，未能被识别的文件扩展名会当成文本数据传输
```
AddType application/x-endnote-connection enz
AddType application/x-endnote-filter enf
AddType application/x-spss-savefile sav
```

###  12\. 防盗链

你不希望别人网站引用你站内的图片、css 等静态文件，也就是传说中的防盗链，可以使用如下脚本：
```
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{REQUEST_URI} !^/(wp-login.php|wp-admin/|wp-content/plugins/|wp-includes/).* [NC]
RewriteCond %{HTTP_REFERER} !^http://www.askapache.com.*$ [NC]
RewriteRule \.(ico|pdf|flv|jpg|jpeg|mp3|mpg|mp4|mov|wav|wmv|png|gif|swf|css|js)$ - [F,NS,L]
```

###  13\. 指定上传文件的大小限制，适用于 PHP

```
php_value upload_max_filesize 20M
php_value post_max_size 20M
php_value max_execution_time 200
php_value max_input_time 200
```
上述脚本中，通过四个参数来设置上传文件的限制，第一个参数是文件的大小，第二个是 POST 数据的大小，第三个是传输的时间（单位秒），最后一个是解析上传数据最多花费的时间（单位秒）

### 14\. 禁止脚本执行
```
Options -ExecCGI
AddHandler cgi-script .php .pl .py .jsp .asp .htm .shtml .sh .cgi
```

###  15\. 修改字符集和语言头
```
AddDefaultCharset UTF-8
DefaultLanguage en-US
```

###  16\. 设置服务器时区(GMT)
```
SetEnv TZ America/Indianapolis
```

###  17\. 强制 “File Save As” 提示
```
AddType application/octet-stream .avi .mpg .mov .pdf .xls .mp4
```

###  18\. 保护单个文件

正常情况下 .htaccess 可用于限制整个目录的访问，但也可以只限制某个文件：
```
<Files quiz.html>
order deny,allow
deny from all
AuthType Basic
AuthName "Characterology Student Authcate"
AuthLDAP on
AuthLDAPServer ldap://directory.characterology.com/
AuthLDAPBase "ou=Student, o=Characterology University, c=au"
require valid-user
satisfy any
</Files>
```

###  19\. 设置 Cookie

通过环境变量来设置 Cookie
```
Header set Set-Cookie "language=%{lang}e; path=/;" env=lang
```
基于请求设置 Cookie，该代码发送 Set-Cookie 头用于设置 Cookie 值为第二个括号里的匹配项
```
RewriteEngine On
RewriteBase /
RewriteRule ^(.*)(de|es|fr|it|ja|ru|en)/$ - [co=lang:$2:.yourserver.com:7200:/]
```

###  20\. 设置自定义的响应 Headers
```
Header set P3P "policyref=\"http://www.askapache.com/w3c/p3p.xml\""
Header set X-Pingback "http://www.askapache.com/xmlrpc.php"
Header set Content-Language "en-US"
Header set Vary "Accept-Encoding"
```

###  21\. 根据 User-Agent 来阻止请求
```
SetEnvIfNoCase ^User-Agent$ .*(craftbot|download|extract|stripper|sucker|ninja|clshttp|webspider|leacher|collector|grabber|webpictures) HTTP_SAFE_BADBOT
SetEnvIfNoCase ^User-Agent$ .*(libwww-perl|aesop_com_spiderman) HTTP_SAFE_BADBOT
Deny from env=HTTP_SAFE_BADBOT
```

转自：[http://www.lonery.com/article-view-35.html](http://www.lonery.com/article-view-35.html)
