---
title: 解决Discuz签到插件《DSU每日签到》贴子已关闭无法回复的问题
tags:
  - PHP
  - SQL
  - 论坛
id: 573
categories:
  - PHP
date: 2013-09-15 15:13:26
---

好多站长朋友都应该知道在Discuz中有一个很实用的签到插件叫做DSU每日签到，该插件使用方便功能又比较丰富，所以很受用户好评。但使用这个插件签到发布的贴子却是无法回复的，我打开论坛“广播”功能，所有的签到都会同步到“广播”里面，而对于好友的一些签到信息却眼看着又不能评论，这似乎完全违备了“广播”这个SNS的概念，无交流何论坛呢？

那好吧，那就想办法不让它发布新贴的时候自动关闭，根源肯定是要在DSU每日签到的源代码中去找了。我们知道，在论坛文章页管理员查看时可以看到标题上面关于加精、置顶、高亮等的操作栏，里面有一个“打开”或“关闭”的链接，就是控制打开或者关闭贴子回复的，当然我们不可能一个个去设置。找Discuz的官方帮助可以看到这个论坛贴子的打开或关闭是保存在数据库“pre_forum_thread”里面的，其中有一个字段叫做“closed”用于存储是否关闭的信息，“0”是开启，“1”是关闭，既然知道了这个，下面只需要查找每日签到的源代码里面有没有“closed”这几个字母就可以了。

用FTP把每日签到的所有代码文件全部下载到本地，用文本工具（如Notepad++、UltraEdit等）批量打开，然后在所有已打开文件中查找字符串“closed”，最终在一个名为“sign.inc.php”的文件中找到的搜索结果，打开文件在第241行和第294行可以看到如下内容：

```php
//第241行
DB::query(“INSERT INTO “.DB::table(‘forum_thread’).” (fid, posttableid, readperm, price, typeid, sortid, author, authorid, subject, dateline, lastpost, lastposter, displayorder, digest, special, attachment, moderated, highlight, closed, status, isgroup) VALUES (‘$tofid’, ‘0’, ‘0’, ‘0’, ‘0’, ‘0’, ‘$_G[username]’, ‘$_G[uid]’, ‘$todaysay’, ‘$_G[timestamp]’, ‘$_G[timestamp]’, ‘$_G[username]’, ‘0’, ‘0’, ‘0’, ‘0’, ‘1’, ‘1’, ‘1‘, ‘512’, ‘0’)”);
```

```php
//第294行
DB::query(“INSERT INTO “.DB::table(‘forum_thread’).” (fid, posttableid, readperm, price, typeid, sortid, author, authorid, subject, dateline, lastpost, lastposter, displayorder, digest, special, attachment, moderated, highlight, closed, status, isgroup) VALUES (‘$var[fidnumber]’, ‘0’, ‘0’, ‘0’, ‘$var[qdtypeid]’, ‘0’, ‘$_G[username]’, ‘$_G[uid]’, ‘$subject’, ‘$_G[timestamp]’, ‘$_G[timestamp]’, ‘$_G[username]’, ‘0’, ‘0’, ‘0’, ‘0’, ‘1’, ‘1’, ‘1‘, ‘0’, ‘0’)”);
```

很明显这是在执行向数据库中插入记录的SQL语句，语句中设置的倒数第3个字段就是“closed”，而且值是“1”，所以就直接导致了每次发布的新主题都是默认关闭的。在这里只需要把值里面对应的位置（也是倒数第3个）的“1”改成“0”就可以了。
