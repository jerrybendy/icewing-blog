---
title: PHP类实例教程（五）：对象的比较
tags:
  - OOP
  - PHP
id: 376
categories:
  - PHP
date: 2013-06-25 18:48:19
---

在PHP中有 = 赋值符号、== 等于符号和 === 全等于符号, 这些符号代表什么意思？当使用比较操作符（==）时，对象以一种很简单的规则比较：当两个对象有相同的属性和值，属于同一个类且被定义在相同的命名空间中，则两个对象相等。等于符号比较对象时，比较对象是否有相同的属性和值。注意：== 比较两个不同的对象的时候，可能相等也可能不等。

```php
<?php
class Person
{
    public $name = "NickName";
}
//分别创建两个对象
$p = new Person();
$p1 = new Person();
//比较对象
if ($p == $p1) {
    echo "/$p和/$p1内容一致";
} else {
    echo "/$p和/$p1内容不一致";
}
echo "<br />";
$p->name = "Tom";
if ($p == $p1) {
    echo "/$p和/$p1内容一致";
} else {
    echo "/$p和/$p1内容不一致";
}
?>
```

使用 == 符号比较两个对象，比较的仅仅是两个对象的内容是否一致。当使用全等符（===）时，当且仅当两个对象指向相同类（在某一特定的命名空间中）的同一个对象时才相等。是否在是同一个对象，两边指向的对象是否有同样的内存地址。

```php
<?php
class Person
{
    public $name = "NickName";
}
//分别创建两个对象
$p = new Person();
$p1 = new Person();
//比较两个对象
if ($p === $p1) {
    echo "/$p和/$p1是一个对象";
} else {
    echo "/$p和/$p1不是一个对象";
}
echo "<br />";
$p->name = "Tom";
if ($p === $p1) {
    echo "/$p和/$p1是一个对象";
} else {
    echo "/$p和/$p1不是一个对象";
}
?>
```

结果 === 比较的是两个变量是否一个对象。

一个等于符号（=）表示赋值，是赋值计算。如果将对象赋予变量，是指变量将指向这个对象。

```php
<?php
class Person
{
    public $name = "NickName";
}
$p = new Person();
$p1 = new Person();
$p2 = $p1; //变量$p2指向$p1指向的对象
if ($p2 === $p1) {
    echo "/$p2和/$p1指向一个对象";
} else {
    echo "/$p2和/$p1不指向一个对象";
}
echo "<br />";
$p = $p1; //变量$p指向$p1指向的对象
if ($p === $p1) {
    echo "/$p和/$p1指向一个对象";
} else {
    echo "/$p2和/$p1不指向一个对象";
}
?>
```

&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/4489218

作者不详