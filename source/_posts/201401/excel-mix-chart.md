---
title: Excel简易绘制混合图表（Office2007以上）
tags:
  - Excel
id: 853
categories:
  - Office
date: 2014-01-20 00:13:31
---

使用Excel可以很方便地绘制出各种类型的图表，而且美观实用，定制性和实时性都非常强。但有时候我们需要的或许不只是一张简单的图表，例如想把一年的降雨量和温度放在同一张图表上，并且降雨量用柱形，温度变化用折线图来表示呢？或者想把散点图和柱形图放在一张图表上、堆积图和折线图放在一张图表上呢？？

![chart1](https://cdn.icewing.cc/wp-content/uploads/2014/01/chart1-600x370.jpg)

如上图，是我随意填写几个数字制作的混合图表，也许这种图表看起来会比较复杂，待将其拆分之后便会发现其实很简单。

首先，我们需要的每个字段应该有对应的数据，包括你要生成折线和柱形图的所有数据，然后使用这些数据生成一个柱形（或折线图也可），

[![chart2](https://cdn.icewing.cc/wp-content/uploads/2014/01/chart2.jpg)

![chart3](https://cdn.icewing.cc/wp-content/uploads/2014/01/chart3.jpg)

图中因为字段3是百分比，数值总是小于1的，所以在图表中只能看到字段3的位置，却没有色块，对于这样的字段在后面选中数据系列的时候会有些困难，告诉大家一个技巧：可以在图表工具->布局->图表元素里面下拉找到自己需要的字段，

![chart4](https://cdn.icewing.cc/wp-content/uploads/2014/01/chart4-600x241.jpg)

选中之后可以通过右键或者“图表元素”下拉框下面的“设置所选内容格式”来进行设置。

选中字段3后打开设置字段格式，选择次坐标轴并关闭。

![chart5](https://cdn.icewing.cc/wp-content/uploads/2014/01/chart5-525x500.jpg)

&nbsp;

这样就可以把字段3显示在次坐标轴上了，这对柱形和折线使用不同单位时非常有用，例如降水量和温度、具体数值和百分比等。当然，如果没有这方面的需要这一步可以省略。

接下来最重要的一步，选中需要以不同图表类型显示的字段的图形（本例中是将字段3以折线的的形式显示，所以选中字段3），然后点击“设计”->“更改图表类型”（或者或键->“更改系列图表类型”），选择需要的类型即可。

![chart6](https://cdn.icewing.cc/wp-content/uploads/2014/01/chart6-600x364.jpg)

&nbsp;

![chart7](https://cdn.icewing.cc/wp-content/uploads/2014/01/chart7.jpg)

&nbsp;

![chart8](https://cdn.icewing.cc/wp-content/uploads/2014/01/chart8.jpg)

&nbsp;

同样的方法，把字段2也改成折线形式：

![chart9](https://cdn.icewing.cc/wp-content/uploads/2014/01/chart9.jpg)

&nbsp;

完成！同样的道理，不局限于折线和柱形的组合，散点图、堆积图、面积图、条形图等都可以自由组合。

不过目前才找到显示两个纵坐标的方法，不知道具体Excel支不支持3个或以上的纵坐标的显示，如果知道了肯定分享！
