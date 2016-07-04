---
title: 高效MySQL分页方法
tags:
  - MySQL
id: 769
categories:
  - 数据库
date: 2013-11-09 09:59:46
updated: 2016-05-22 11:32:14
---

PERCONA PERFORMANCE CONFERENCE 2009上，来自雅虎的几位工程师带来了一篇”[Efficient Pagination Using MySQL](http://www.percona.com/files/presentations/ppc2009/PPC2009_mysql_pagination.pdf)“的报告，有很多亮点，本文是在原文基础上的进一步延伸。

首先看一下分页的基本原理：

```
mysql> explain SELECT * FROM message ORDER BY id DESC LIMIT 10000, 20G
***************** 1\. row **************
id: 1
select_type: SIMPLE
table: message
type: index
possible_keys: NULL
key: PRIMARY
key_len: 4
ref: NULL
rows: 10020
Extra:
1 row in set (0.00 sec)
```

limit 10000,20的意思扫描满足条件的10020行，扔掉前面的10000行，返回最后的20行，问题就在这里，如果是limit 100000,100，需要扫描100100行，在一个高并发的应用里，每次查询需要扫描超过10W行，性能肯定大打折扣。文中还提到limit n性能是没问题的，因为只扫描n行。<a name="more"></a>

文中提到一种”clue”的做法，给翻页提供一些”线索”，比如还是SELECT * FROM message ORDER BY id DESC，按id降序分页，每页20条，当前是第10页，当前页条目id最大的是9527，最小的是9500，如果我们只提供”上一页”、”下一页”这样的跳转（不提供到第N页的跳转），那么在处理”上一页”的时候SQL语句可以是：

```sql
SELECT * FROM message WHERE id > 9527 ORDER BY id ASC LIMIT 20;
```

处理”下一页”的时候SQL语句可以是：

```sql
SELECT * FROM message WHERE id < 9500 ORDER BY id DESC LIMIT 20;
```

不管翻多少页，每次查询只扫描20行。

缺点是只能提供”上一页”、”下一页”的链接形式，但是我们的产品经理非常喜欢”<上一页 1 2 3 4 5 6 7 8 9 下一页>”这样的链接方式，怎么办呢？

如果LIMIT m,n不可避免的话，要优化效率，只有尽可能的让m小一下，我们扩展前面的”clue”做法，还是SELECT * FROM message ORDER BY id DESC，按id降序分页，每页20条，当前是第10页，当前页条目id最大的是9527，最小的是9500，比如要跳到第8页，我看的SQL语句可以这样写：

```sql
SELECT * FROM message WHERE id > 9527 ORDER BY id ASC LIMIT 20,20;
```

跳转到第13页：

```sql
SELECT * FROM message WHERE id < 9500 ORDER BY id DESC LIMIT 40,20;
```

原理还是一样，记录住当前页id的最大值和最小值，计算跳转页面和当前页相对偏移，由于页面相近，这个偏移量不会很大，这样的话m值相对较小，大大减少扫描的行数。其实传统的limit m,n，相对的偏移一直是第一页，这样的话越翻到后面，效率越差，而上面给出的方法就没有这样的问题。

注意SQL语句里面的ASC和DESC，如果是ASC取出来的结果，显示的时候记得倒置一下。

已在60W数据总量的表中测试，效果非常明显。

转载自：[http://www.fuchaoqun.com/2009/04/efficient-pagination-using-mysql/](http://www.fuchaoqun.com/2009/04/efficient-pagination-using-mysql/)
