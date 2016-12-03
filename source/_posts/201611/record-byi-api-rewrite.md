---
title: 记录 BYI API 站点的一次重写
date: 2016-11-20 18:11:17
updated: 2016-11-20 18:11:17
tags:
  - API
  - favicon
categories:
  - 杂谈
---

[BYI_API](https://api.byi.pw) 上线已经两年多了，总计调用量已经超过千万次。虽然名叫 `API`，但其实和 API 没太大关系，只是一些免费开放使用的辅助接口罢了。两年间共相继开放了 favicon 图标获取、网站首屏截图、短网址、IP 地理位置查询等服务，后来因为维护及服务器原因（个人维护，单台架构，无法承载过多请求，加上被人滥用等）又相继停止了大部分服务，目前仅留了 favicon 获取服务可以正常使用。

网站首屏截图的服务目前没发现国内可用的服务，于是自己写了一套，但这个服务需要抓取目标网站的首页，并在服务器端渲染首页图片，然后再缩小到需要的尺寸，对服务器的开销特别大，于是不得不在开放六个月后关停此项服务。让我决心关停此项服务的最大原因倒不是服务器，而是服务被人滥用。本意是免费开放一项服务可以供一些站长在自己网站中使用，可以在页面中提供更美观的目标网站当前的首页图片。开放六个月一直稳定运行，直到我发现自己想使用自己的服务获取一张图片时被无限期等待。这时登录服务器发现消息队列中有多达六十万条未处理的请求！！

我是没有多少看 Nginx 日志习惯的人，这时也只好去分析下访问日志。结果发现有几十万的请求都是来自固定的几个 IP，而且请求频繁、数量庞大！呵呵，免费的午餐就是这么好吃，国外也有类似的服务，无一例外都是收费的。按照当时服务器中跑五个 resque 服务处理队列，平均每个请求需要花费的时间是 7 秒，队列中六十多万条请求要跑到什么时候？！而且队列中的请求数量还在以远高于请求处理的速度持续增长！

于是我关停了此项服务。

短网址服务本身就是作为一个 demo 在运行，没有太大意义。而且有一个数据可被遍历的严重漏洞，最终也关闭了。

IP 地理位置查询服务基于一个拥有五十多万条地理位置数据的数据库，准确性一般，而且这类的免费服务数量很多，做这个没意义。

Favicon 服务是唯一一个运行至今的服务，虽然这项服务在国内也有很多替代方案，但很多都是比较简单的获取方式，失败率很高。准确率也许是我的这项服务能一直被大量使用的原因吧，高峰的时候一个礼拜的访问量就达到了 97 万次（2016年9月）。

由于服务器负载过大，我又在 Digital Ocean 购买了一台服务器，并改为使用 docker 构建。之前的部署方式很简单，单台机器一套标准的 LNMP 架构，Redis 服务也运行在这台服务器上。国外部署因为使用 docker 更方便了，就学习了一下 docker 的知识。仍然把 Nginx 部署在宿主机上，但把 Redis、MySQL、PHP-FPM 都放到了 docker 容器里面，使用 docker-compose 管理。最终在 DNS 层面上在两台服务器间做一层负载均衡。

这样运行了大约半个月吧，国外的服务器在并发数量稍高一点时就会崩掉，于是又改成了单台服务器运行两个 FPM 容器并在 nginx 层面做负载均衡的方式，效果收益也很明显。

最后要记录的这次重写，是把原来 PHP 的架构改成了 NodeJS。使用 ThinkJS 框架。由于对 NodeJS 不熟，过程中也是遇到了很多麻烦，在重写的同时也简化了之前的结构，并加入了 Google Analytics 后端统计推送的功能，同时也优化了缓存策略，加入了 HTTP/2 的支持（下一步准备强制使用 HTTPS 方式）。新的 NodeJS 的版本上线到目前为止刚好一天时间，运行非常稳定，也减少了之前 PHP 架构在高并发中常出现的 502 的问题，整体来说还是非常满意的。目前 NodeJS 的版本仅在国外的服务器中运行，而且仍有很多地方需要优化，预计在一周内一个更新的版本将会部署在国内服务器上提供更快更稳定的服务。

之前已经关掉的服务不打算再开启了。距离 favicon 的 PHP 版本的核心代码在 GitHub 上面开源至今也有半年时间了，一直有打算把 siteThumb（网站首页截图）的代码开源出去，但一直没真正去做。一方面是懒，另一方面也由于这一块的代码却实比较复杂，很难单独整理出来，而且很难重新部署在一台新机器上面。SiteThumb 依赖第三方的开源程序 [PhantomJS](http://phantomjs.org/)，需要 PHP 有运行程序的权限调用 PhantomJS，需要服务器安装各种语言的字体用于渲染网页中的文本，还需要依赖 Redis 和 [php-resque](https://github.com/chrisboulton/php-resque) 来维护请求队列和执行队列…… 总之就是很复杂，以至于我都不知道该如何把它开源出去。

另外搬过来几个常用的（好吧，也许是我比较常用的）国外开源的工具站，以方便日常开发使用。已经找到了第一个目标—— [autoprefixer](https://github.com/autoprefixer/autoprefixer.github.io) 的 web 版解析器，经常在一些小的站点或页面中写 CSS，项目小到不至于使用任何打包构建工具，但又实在记不住哪些 CSS 属性该加哪些前缀，更记不住不同的 flex 版本该怎么写，于是在线版本的 autoprefixer 就派上用场啦，嘿嘿。

好的，就写到这里吧，为自己的烂文笔感到很羞愧呀，居然语无伦次的写了这么多……
