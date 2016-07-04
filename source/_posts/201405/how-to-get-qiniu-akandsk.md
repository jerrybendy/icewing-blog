---
title: 如何获取七牛云存储的AccessKey和SecretKey
tags:
  - 云存储
id: 1002
categories:
  - 分享
date: 2014-05-04 23:11:30
updated: 2016-05-22 11:51:58
---

七牛云存储算是博主用过的最好用的一个云存储吧，而且注册就可以获得10GB存储空间和每月10GB的免费流量，这对可以说很多网站来说都已经是用不完的流量了。它的主要优点就是支持所有文件类型的外链，以及可以通过API的方式来上传、下载、管理里面的文件，支持绑定自己的域名，你甚至可以用七牛云存储创建一个静态网站！

七牛在使用API方式管理文件是通过Access Key和Secret Key来认证的，这里只说下如何获取这两个KEY。

首先必须注册一个七牛账号（[注册链接](https://portal.qiniu.com/signup?code=3lptvmay42o2a)），注册完成后创建一个空间（BUCKEY，可以是公开的或私有的），点击导航上的“账号设置”：

![qiniu-1](https://cdn.icewing.cc/wp-content/uploads/2014/05/qiniu-1.jpg)

然后点击左侧的“密钥”，在右边就可以看到你七牛账户对应的AK和SK，所有的使用API操作七牛云存储中的文件的方法都是需要提供这两个参数的：

![qiniu-2](https://cdn.icewing.cc/wp-content/uploads/2014/05/qiniu-2.jpg)

&nbsp;

另外使用“创建新密钥”的方法还可以再创建一组AK和SK，这样就可以同时使用这两组参数；或者创建一个新密钥，再把旧密钥停用后删除，这样就可以起到定期更换密钥的功能，安全性大有保障。
