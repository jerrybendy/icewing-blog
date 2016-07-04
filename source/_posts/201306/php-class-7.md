---
title: PHP类实例教程（七）：析构函数与PHP的垃圾回收
tags:
  - OOP
  - PHP
id: 385
categories:
  - PHP
date: 2013-06-30 18:25:16
---

析构函数：当某个对象成为垃圾或者当对象被显式销毁时执行。

### GC (Garbage Collector)

在PHP中，没有任何变量指向这个对象时，这个对象就成为垃圾。PHP会将其在内存中销毁。这是PHP的GC (Garbage Collector)垃圾处理机制，防止内存溢出。当一个PHP线程结束时，当前占用的所有内存空间都会被销毁，当前程序中的所有对象同样被销毁。

__destruct() 析构函数，是在垃圾对象被回收时执行。

析构函数也可以被显式调用，但不要这样去做。

析构函数是由系统自动调用的，不要在程序中调用一个对象的析构函数。

析构函数不能带有参数。

程序结束前，所有对象被销毁。析构函数被调用了。

```php
<?php
class Person{
   public function __destruct() {
      echo "<br />析构函数在这里执行";
      echo "<br />这里一般用来放置，关闭数据库，关闭文件等等收尾工作。";
   }
}
$p = new Person();
for ($i = 0; $i < 5; $i++) {
   echo "<br /> $i";
}
//我们在这里看到，在PHP程序结束前，对象被销毁了。
?>
```

当对象没有指向时，对象被销毁。

```php
<?php
class Person {
   public function __destruct() {
      echo "<br />析构函数在这里执行";
      echo "<br />这里一般用来放置，关闭数据库，关闭文件等等收尾工作。";
   }
}
$p = new Person();
$p = null;
//我们在这里看到，析构函数在这里被执行了。
for ($i = 0; $i < 5; $i++) {
   echo "<br /> $i";
}
?>
```

我们将$p设置为空或者第11行赋予$p一个字符串，这样$p之前指向的对象就成为了垃圾对象。PHP将这个对象垃圾销毁。

### unset变量

```php
<?php
class Person {
   public function __destruct() {
      echo "<br />析构函数在这里执行<br />";
   }
}
$p = new Person();
$p1 = $p; //设定新引用变量$p1也指向这个对象
unset($p);
echo "是否看到/$p被销毁，对象也被销毁呢?";
for ($i = 0; $i < 5; $i++) {
   echo "<br /> $i";
}
unset($p1);
echo "我们看到这里，析构函数被执行了";
?>
```

unset一个引用变量时，unset 销毁的是指向对象的变量，而不是这个对象。

&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/5208730