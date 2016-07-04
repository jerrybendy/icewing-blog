---
title: PHP类实例教程（十九）：PHP类接口的定义与规范
tags:
  - OOP
  - PHP
id: 417
categories:
  - PHP
date: 2013-07-28 22:20:54
---

接口(interface)是抽象方法和静态常量定义的集合。

接口是一种特殊的抽象类，这种抽象类中只包含抽象方法和静态常量。

接口中没有其它类型的内容。

### 接口的定义

我们先写接口的定义，后面几节再介绍接口的意义。

下面的例子是接口的一个简单写法。

```php
<?php
interface 接口名  
{   
}  
?>
```

下面的例子定义了一个接口 User ，这个接口中有两个抽象方法，getName() 和setName()。能看到接口的写法和类很相似。

```php
<?php
interface User  
{  
    function setName($name);  
    function getName();   
}  
?>
```

###  接口中的抽象方法

注意，在接口中只能有抽象方法。如果在接口中出现了非抽象方法，会报错如下： Interface function User::setName() cannot contain body in ……….

```php
<?php
interface User  
{  
    function setName($name);  
    function getName(){}    //这个地方是一个非抽象方法，会报错   
}  
?>
```

###  接口中抽象方法的修饰和访问权限

在接口中的抽象方法只能是public的，默认也是public权限。并且不能设置成 private 或者 protected 类型。否则会报错如下： Access type for interface method User::setName() must be omitted in —on line — （在接口中，访问类型必须忽略。）

```php
<?php
interface User  
{  
    function setName($name);  
    private function getName(); //不允许带修饰符，此处如果换成protected也会出错  
}  
?>
```

即使abstract 和 final 修饰符也不能修饰接口中的抽象的方法。

### 接口中的静态抽象方法

在接口中可以使用静态抽象方法。在PHP5.2中，不建议在抽象类中使用静态抽象方法。而接口中依然保留了静态抽象方法。

```php
<?php
interface User  
{  
    function setName($name);  
    static function getName() {  
    }   
}  
?>
```

###  接口中的静态常量

在接口中可以定义静态常量。而且不用static修饰就是静态的常量。

```php
<?php
interface User  
{  
    const MAX_GRADE = 99;   //此处不用声明，就是一个静态常量  
    function setName($name);  
    static function getName() {  
    }   
}  
?>
```

&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/5212976