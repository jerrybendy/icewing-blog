---
title: PHP类实例教程（十五）：final类、final方法和常量
tags:
  - OOP
  - PHP
id: 407
categories:
  - PHP
date: 2013-07-17 01:01:35
---

final---用于类、方法前。

final类---不可被继承。

final方法---不可被覆盖。

### final类不能被继承。

如果我们不希望一个类被继承，我们使用final来修饰这个类。

于是这个类将无法被继承。

比如我们设定的Math类，涉及了我们要做的数学计算方法，这些算法也没有必要修改，也没有必要被继承，我们把它设置成final类型。

```php
<?php
//声明一个final类Math  
final class Math  
{  
    public static $pi = 3.14;  
    public function __toString() {  
        return "这是Math类。";  
    }  
}  
$math = new Math();  
echo $math;  
//声明类SuperMath 继承自 Math类  
class SuperMath extends Math  
{  
}  
//执行会出错，final类不能被继承。  
?>
```

###  final方法不能被重写

如果不希望类中的某个方法被子类重写，我们可以设置这个方法为final方法，只需要在这个方法前加上final修饰符。如果这个方法被子类重写，将会出现错误。

```php
<?php
//声明一个final类Math  
class Math  
{  
    public static $pi = 3.14;        
    public function __toString() {  
        return "这是Math类。";  
    }  
    public final function max($a, $b){
        return $a > $b ? $a : $b ;
    }        
}  
//声明类SuperMath 继承自 Math类  
class SuperMath extends Math  
{  
    public final function max($a, $b) {  
    }  
}  
//执行会出错，final方法不能被重写。  
?>
```

&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/5212941