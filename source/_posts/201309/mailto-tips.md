---
title: HTML中关于mailto链接的一些使用技巧
tags:
  - HTML/CSS
id: 621
categories:
  - 前端
date: 2013-09-25 15:22:54
---

大家知道HTML里面的超链接（a）可以指向一个网址或书签，孰不知a标签还可以用来发送邮件。很多网站都会在醒目的位置上写上自己的电子邮件地址，使用户点击这个链接后就可以打开电脑上默认的电子邮件客户端发送邮件，如Foxmail等，这需要用到一个mailto标签，如`<a href="mailto:jerry@icewingcc.com">给我发邮件</a>`。当然，这只是mailto最基本的用法，它还可以像一般网址一样添加参数。

网址的参数格式想必大家都知道，就是形如“http://aaa.abc.com/index.php?cc=xxx&amp;dd=xxx&amp;ee=xxx”这样的格式，问号前面是网址，后面是以“&amp;”分隔的多个参数，我们重点来说下这些参数和mailto的基本用法。

**同时发送邮件给多个收件人**

这个比较简单，只要多个收件人之间以英文半角的分号（;）分隔就可以了如 mailto:aaa@abc.com;bbb@abc.com  就可以同时发送邮件给aaa@abc.com和bbb@abc.com了。

**mailto的参数**

mailto有几个常用参数，如cc、body等。

<table>
<tbody>
<tr>
<th style="width:30%">参数</th>
<th style="width:40%">作用</th>
</tr>
<tr>
<td>cc</td>
<td>抄送</td>
</tr>
<tr>
<td>bcc</td>
<td>密送</td>
</tr>
<tr>
<td>subject</td>
<td>主题</td>
</tr>
<tr>
<td>body</td>
<td>正文</td>
</tr>
</tbody>
</table>

以上几个参数可以随意组合。其中抄送、密送也可以使用分号隔开多个收件人。举例说明：

要发送邮件给aaa@abc.com，同时抄送到bbb@abc.com和ccc@abc.com:

mailto:aaa@abc.com?cc=bbb@abc.com;ccc@abc.com

要发送邮件给aaa@abc.com，同时密送到ddd@abc.com，邮件主题是My Subject，邮件内容是Hello _World：_

mailto:aaa@abc.com?bcc=ddd@abc.com&amp;subject=My Subject&amp;body=Hello <i>World</i>

Body里面可以添加HTML标签。

当然，这一切能工作需要用户电脑上有安装邮件客户端，如Outlook、Foxmail、闪电邮、iMail、Gmail等，有的浏览器也可以在配置后使用网页版的邮箱发送邮件。

不过由于安全问题（容易被邮件机器人识别到邮箱地址并频繁发送垃圾邮件）很多站长也会选择把邮件地址中的“@”改成“#”，这样就不会被识别为超链接，继而可以防止垃圾邮件机器将我们的邮件地址作为目标。
