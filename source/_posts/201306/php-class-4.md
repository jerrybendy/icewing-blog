---
title: PHP类实例教程（四）：PHP5类中的方法
tags:
  - OOP
  - PHP
id: 374
categories:
  - PHP
date: 2013-06-25 18:42:01
---

方法：对对象的属性进行的操作称为对象的方法（也称为行为/操作）。

### 过程 函数 方法

过程：过程是编制程序时定义的一个语句序列，用来完成某种指定的操作。

函数：函数有返回值，也是定义的语句序列。

方法：在面向对象概念中，类里面的一段语句序列。

一般来说，在面向对象概念中，函数和方法两个名词是通用的。

### 通过方法读取属性

下面的例子将属性设置为private ，同时声明了public的getName()方法，用来获取属性$name的值，调用getName()方法就会通过 return $this->name 返回 $name 的值。

```php
<?php
class Person
{
    private $name = "NoName"; //private成员$name
    public function getName() {
        return $this->name;
    }
}
$newperson = new Person();
echo " " . $newperson->getName();
?>
```

注意：这里，方法内部调用本地属性时，使用 $this->name来获取属性。在这个例子中，设置了公开的getName()方法，即用户只能获取$name, 而无法改变他的值。这就是封装的好处。

**封装指的是将对象的状态信息（属性）和行为（方法）捆绑为一个逻辑单元的机制。**

PHP5中通过将数据封装、声明为私有的(private)，再提供一个或多个公开的（public）方法实现对该属性的操作，以实现下述目的：

### 方法的参数

通过方法定义时的参数，可以向方法内部传递变量。

如下第5行，定义方法时定义了方法参数$_a。使用这个方法时，可以向方法内传递参数变量。方法内接受到的变量是局部变量，仅在方法内部有效。可以通过向属性传递变量值的方式，让这个变量应用于整个对象。

```php
<?php
class Person
{
    private $a;
    function setA($_a) {
        $thia->a = $_a;
    }
    function getA() {
        return $this->a;
    }
}
$newperson = new Person();
$newperson->setA(100);
echo $newperson->getA();
?>
```

如果声明这个方法有参数，而调用这个方法时没有传递参数，或者参数数量不足，系统会报出错误。如果参数数量超过方法定义参数的数量，PHP就忽略多于的参数，不会报错。可以在函数定义时为参数设定默认值。 在调用方法时，如果没有传递参数，将使用默认值填充这个参数变量。

```php
<?php
class A
{
    public $name = "tom";
}
class Person
{
    private $a;
    function setA($_a) {
        $this->a = $_a;
    }
    function getA() {
        return $this->a;
    }
}
$a1 = new A();
$p = new Person();
$p->setA($a1);
echo $p->getA()->name;
?>
```

** 再次提示**

在PHP5中，指向对象的变量是引用变量。在这个变量里面存储的是所指向对象的内存地址。引用变量传值时，传递的是这个对象的指向。而非复制这个对象。这与其它类型赋值有所不同。

&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/4488476

作者不详