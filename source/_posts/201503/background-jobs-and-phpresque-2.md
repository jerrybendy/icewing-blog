---
title: 后台任务和PHP-Resque的使用（二） 队列系统
tags:
  - PHP
  - php-resque
  - 队列
id: 1204
categories:
  - PHP
date: 2015-03-30 00:38:48
updated: 2016-12-21 11:59:23
---

接着{% post_link "background-jobs-and-phpresque-1" "第一部分" %}，Queue 需要保存 Jobs，Worker 需要按照指定的时间间隔在 Queue 中轮循并执行 Jobs。

![queue-system1](https://cdn.icewing.cc/wp-content/uploads/2015/03/queue-system1.jpg)

这个系统包含以下三个部分：

*   推送者：推送任务到 Queue，可以是任何过程，甚至是 Worker；
*   Queue：按顺序保存 Jobs；
*   Worker：从 Queue 中拉取 Jobs 并执行。

注意，这里使用了推送（Push）和拉取（Pull）来代替添加（Add）和获取（Get）。

> **_Push:_** 把数据添加到栈的尾部的操作。
>
> 	**_Pull(or Pop):_**拉取（或弹出）。弹出并删除栈顶部的数据。

Push操作通常会把数据添加到栈的尾部。这种数据类型会保证先添加到队列的项目总是先被读取和删除，即“先进先出”（FIFO, First-in-first-out）的队列。

如果 Jobs 按照1，2，3这样的顺序被加入到Queue，那么它也会按照同样的顺序被执行。

### 什么是 Job

Job 就是准备被执行的任务，它告诉 Worker 应该做什么。Worker在执行前并不会知道 Job 是什么，如果Job 是发送 Email，它也不会知道需要发给谁、为什么要发、发送时的上下文环境是什么等。

如果你从你程序的主流程中执行发送邮件的函数，发送者就是登录的用户。你还需要额外为发送邮件提供更多信息，如收件人、邮件内容等。

就像你需要在家里安装电话线，电信公司就会来给你安装，而他们不需要知道你为什么需要安装电话线，他们要做的仅仅是你要求的（安装电话线）。

### 保存Jobs

任务必须被保存在队列中，这个队列：

*   必须有一个队列类型的数据结构（支持推送和拉取任务）
*   必须非常快
*   可以在多个服务端共享
*   是否持久化

你可以选择满足以上条件的队列系统，或使用第三方的程序，像 RabbitMQ、Gearman、Redis 等。我们将会使用 Redis 存储队列，并且使用 PHP-Resque 作为队列系统。

PHP-Resque 算是 Resque 的 PHP 版本，Resque 是开源在 Github 上的一个使用 Ruby 编写的队列系统。下一节将会讲如何安装 PHP-Resque。

---

本文由冰翼翻译自[Kamisama.me](http://www.kamisama.me/2012/10/09/background-jobs-with-php-and-resque-part-2-queue-system)


