---
title: BAE3.0应用配置文件app.conf的使用
tags:
  - BAE3 配置 伪静态
id: 789
categories:
  - 网站
date: 2013-12-18 14:44:28
updated: 2016-05-22 11:33:50
---

在BAE3.0里面， app.conf 除了兼容 BAE2.0 的 app.conf 的功能外，还会陆续增加新的功能。

### 一、 使用注意事项

1.  千万不要使用中文，否则发布会失败
2.  千万不要使用Tab键，请使用空格，否则可能会发布失败
3.  请严格遵循YAML语法规范（[http://yaml.org/]()），否则可能会发布失败
4.  空格的缩进一定要严格对齐，否则可能会发布失败
5.  BAE3.0对app.conf语法格式进行了更严格的检查，一些在BAE2.0可以通过的app.conf ，在3.0可能会失败； 当你发现发布失败的时候，请注意检查 app.conf

###  二、 兼容BAE2.0的功能

在BAE2.0的app.conf 中，通过 ‘handlers’ 关键字，实现了URL重写和重定向等功能；BAE3.0也继续支持’handlers’关键字，实现了对BAE2.0的兼容；

‘handlers’ 关键字下面支持 ‘url’、‘errordoc’、’expire’、’mime’、’check_exist’、’regex_url’ 等规则； 关于这些规则的使用，可参考文档： [http://developer.baidu.com/wiki/index.php?title=docs/cplat/rt/manage/conf](http://developer.baidu.com/wiki/index.php?title=docs/cplat/rt/manage/conf)

####  1、 ‘url’ 规则

#### 2、  ’errordoc’ 规则

#### 3、  ’expire’ 规则

#### 4、 ‘mime’ 规则

#### 5、 ‘check_exist’ 规则

‘check_exist’ 用来判断指定的文件、目录是否存在，并根据判断结果进行处理；它和 ‘status_code’, “location’, “script” 规则一起配合来完成逻辑。

下面看两个例子：
> 例一：
> 
> handlers:
> 
> - check_exist: not_exist
> 
> status_code : 301
> 
> location: http://www.baidu.com
> 
> 解释：
> 
> 当所访问的文件不存在的时候，就通过301跳转到 http://www.baidu.com；
> 例二：
> 
> handlers:
> 
> - check_exist: file_exist
> 
> script: /index.php
> 
> 
> 解释：
> 
> 当所访问的文件存在的时候，就将URL rewrite 成 /index.php
备注：

*   ‘check_exist’ 可取的值包括：

    *   file_exist: 　文件存在
    *   dir_exist:　目录存在
    *   not_exist:   文件或目录不存在

*   ‘status_code’ 可取的值包括 301, 302, 403, 404； 只有当取值为 301、302的时候，才可以配合使用 ‘location’

#### 6、 ‘regex_url’ 规则

‘regex_url’ 的功能与 ‘url’ 基本一致，区别在于 ‘regex_url’ 采用的是标准正则表达式，并且也支持 ‘status_code’ 和 ‘location’ ； 下面看几个例子：
> 例一：
> 
> handlers :
> 
> - regex_url: ^/[a-z0-9]\.html$
> 
> script : /index.php
> 
> 解释：
> 
> 当访问的URL是形如 xxx.html 的时候，被rewrite到 index.php
> 
> 例二：
> 
> handlers :
> 
> - regex_url: ^/secure_page$
> 
> status_code: 403
> 
> 
> 当访问的 URL 是 secure_page 的时候，直接返回HTTP状态码403
> 
> 例三：
> 
> handlers :
> 
> - regex_url: ^/secure_page$
> 
> status_code: 302
> 
> location: http://example.com/error.html
> 
> 
> 解释：
> 
> 当访问的URL是secure_page 的时候，返回状态码302，并跳转到 http://example.com/error.html

### 三、 新增功能

#### 1、 新增 ‘crond’ 关键字，支持自定义 cron 任务，例如：

> crond:
> 
> service : on
> 
> crontab :
> 
> - "* * * * * sh /home/bae/app/do.sh"
/home/bae/app/do.sh
> echo "$(date)" >> /home/bae/log/cron.log
表示每分钟执行一次 sh /home/bae/app/do.sh 这个命令； do.sh里面，会将当前日期输出到日志文件 cron.log 中； 你可以通过管理界面的“查看日志”， 看到输出结果；

注意：

*   ‘crond’ 是 ‘dict’ 类型
*   ‘service’ 可以是 on 或者 off， 表示开启或关闭cron 服务
*   ‘crontab’ 是 ‘list’ 类型，可以支持多条指令； 每条指令前面加上 ‘-’
*   需要用 “” 将整个 crontab 指令包围起来
*   对于 shell 脚本，最好前面加上 sh， 因为脚本可能没有可执行权限
*   请先查阅 cron 的指令格式； 若指令有错，则cron可能不能按你的预期的方式工作

#### 2、 新增 ‘environment’ 关键字，支持用户自定义环境变量，例如：

> environment :
> 
> USER_ENV1 : 1000
> 
> USER_ENV2 : "hahaha"
这样，在你的程序里面，就可以访问到这两个环境变量了；

注意：

*   ‘environment’ 是 ‘dict’ 类型的，可以支持多个环境变量； key和 value 之间用 ‘:’ 分隔

转自：[http://godbae.duapp.com/?p=654](http://godbae.duapp.com/?p=654)