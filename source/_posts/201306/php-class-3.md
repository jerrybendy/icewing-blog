---
title: PHP类实例教程（三）：PHP5类中的属性
tags:
  - OOP
  - PHP
id: 371
comment: false
categories:
  - PHP
date: 2013-06-23 21:10:57
---

属性：用来描述对象的数据元素称为对象的属性（也称为数据/状态），在PHP5中，属性指在class中声明的变量。在声明变量时，必须使用 public private protected 之一进行修饰，定义变量的访问权限。（public private protected三者的区别将在以后讲解）

属性的使用：通过引用变量的-> 符号调用变量指向对象的属性。

在方法内部通过 $this-> 符号调用同一对象的属性。

```php
<?php
class Person
{
   public $name = "NoName"; //定义public属性$name
   public $age = 20; //定义public属性$age
}
$p = new Person(); //创建对象
echo " " . $p->name; //输出对象$p的属性$name
echo "<br />";
echo " " . $p->age; //输出$age属性
?>
```

我们还可以改变属性的值，当然要注意的改变属性的值是通过public来修饰的

我们修改一下这个例子：

```php
<?php
class Person
{
   public $name = "NoName"; //公共变量$name
   public $age = 20; //公共变量$age
}
$p = new Person();
$p->name = "Tom"; //我是Tom
$p->age = 25 ; //年龄25
echo " " . $p->name; //输出名字
echo "<br />";
echo " " . $p->age; //年龄
?>
```

创建一个Person的对象，改变这个对象的属性。为它命名，查看它的名字。你就是机器里面这个Person对象的上帝，按照你定义的规则，这个实实在在内存中的Person对象被创建了，而且它有了可以改变的属性。

### 属性的初值

在PHP5中，在属性定义可以不设置初值，或者赋予以下类型的初值。

PHP中简单类型有8种，分别是：

**四种标量类型：**

布尔型（boolean）

整型（integer）

浮点型（float）（浮点数，也作“double”）

字符串（string）

**两种复合类型：**

数组（array）

对象（object）

**最后是两种特殊类型：**

资源（resource）

NULL