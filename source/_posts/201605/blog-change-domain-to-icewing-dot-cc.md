---
title: 博客更换域名到 icewing.cc 并启用HTTP/2
date: 2016-05-28 16:30:59
updated: 2016-06-07 09:57:00
tags:
  - 博客
  - HTTP2
categories:
  - 杂谈
---

一直有对博客进行改版的想法。从 2013年最开始搭建时候使用的 [Wordpress](https://cn.wordpress.org/) 博客到现在的 [hexo](https://hexo.io/) 静态博客，中间也有过自行开发的版本，但没有使用多久。

之前自行开发的版本是使用 CodeIgniter 框架，力求做的简单。可能是受 wordpress 影响太深吧，现在想想当初开发的“简单”的版本也还是太过于复杂了，很多功能都是可以抛弃不要的。自己设计的主题也不再符合现在“极简”的审美观念。

主要说下现在吧。几个月前从 wordpress 迁移到 hexo，并且不得不丢弃了所有的评论数据改为使用 [Disqus](https://disqus.com/)。博客使用 [NexT](http://theme-next.iissnan.com/) 主题，并把所有内容生成静态文件。刚开始是部署在自己服务器上，后来改为同时部署到 [Coding Pages](https://coding.net)和阿里云虚拟主机上面，在 DNS 层面分流。几乎同时也把 DNS 从 [DNSPod](https://www.dnspod.cn) 迁移到 [CloudXNS](https://www.cloudxns.net/) 上面。

在此之前就注册了 `icewing.cc` 这个域名。因为我之前的备案信息有变更需要重新备案，再加上新增域名的备案，所以整个备案过程足足花了一个多月的时间。`icewing.cc`虽然也没比之前`icewingcc.com`差多少吧，至少意味着一个全新的开始。其实也是受到了[Jerry Qu](https://imququ.com/)的感染，我也准备把这个博客做为自己新的实验田，向着新技术靠近！

目前服务器已经升级到 Nginx 1.10.0 并重新把博客迁了回来。使用 [Let's Encrypt](https://letsencrypt.org/) 的免费 HTTPS 证书，关于 Let's Encrypt 的一些介绍和申请证书的方法可以参考 Jerry Qu 的一篇文章 [https://imququ.com/post/letsencrypt-certificate.html](https://imququ.com/post/letsencrypt-certificate.html)。升级 Nginx 版本主要是为了使用 HTTP/2，目前博客已经运行在 HTTP/2 下面，具体稳定性和兼容性还有待测试。

CDN 方面使用了[七牛](http://www.qiniu.com/)的存储服务。但七牛的存储服务默认是不支持 HTTPS 的，需要绑定自定义域名和证书才可以。域名就绑定了`cdn.icewing.cc`过去，证书因为需要有效期半年以上的才可以，而`Let's Encrypt`的证书有效期只有90天（`Let's Encrypt`证书需要服务器配置自动更新），所以就选择了之前用过的[沃通免费证书](https://wosign.com/)，有效期是两年。需要注意的是七牛的 HTTPS 服务是没有免费流量的（HTTP下有10G的免费流量）。

---

另外关于我现有的几个域名：`icewingcc.com`会一直使用下去，做一些比较“第三方”的服务和邮箱使用；`icewing.cc`主要用于博客；`byi.pw`将会逐渐弃用，并把现有的内容迁移到`icewingcc.com`上去。因为`icewingcc.com`和`byi.pw`的备案信息是一起的，可能以后又要遇到一次解除备案和重新备案的坑爹过程了。。。。

之前的[API服务](https://api.byi.pw)目前仍然在运行，但会逐渐迁移到`icewing.cc`上面服务。无奈之举，因为涉及到`.pw`域名的归属问题却实有些头疼，RC控制的域名，虽然支持迁出，但没有发现除RC外的任何一家服务器接受迁入，也是醉了。没办法只能弃用了。

OK。废话就先说到这里。这段时间主要会花在对 NexT 主题的调优方面，做一些适应自己博客的修改。同时也会开始构思一套新的博客系统，这次会借鉴 hexo 的一些思路，有可能会继续使用 markdown 写作，并精简掉博客中评论、搜索、阅读次数等等功能并使用第三方服务。具体是使用 PHP7 开发还是 NodeJS 还需要再做打算，语言不是重点，也不是瓶颈。
