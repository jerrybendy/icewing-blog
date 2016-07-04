---
title: PHP类实例教程（十六）：PHP5中的常量
id: 409
categories:
  - PHP
date: 2013-07-17 01:03:18
tags:
---

在PHP5类中继续使用cons修饰常量。我们使用const定义一个常量，定义的这个常量不能被改变。在PHP5中const定义的常量与定义变量的方法不同，不需要加$修饰符。 const PI = 3.14； 这样就可以。

而使用const 定义的常量名称一般都大写，这是一个约定，在任何语言中都是这样。

如果定义的常量由多个单词组成，使用 _ 连接，这也是约定。

比如， MAX_MUMBER 这样的命名方式。一个良好的命名方式，是程序员必须注意的。

类中的常量使用起来类似静态变量，不同点只是它的值不能被改变。我们使用类名::常量名来调用这个常量。

```php
<?php
//声明一个final类Math
class Math
{
    const PI = 3.14;
    public function __construct() {
        return "这是Math类";
    }
    //这里写了一个算圆面积的方法，使用了Const常量，
    //注意使用的方法，类似于静态变量。
    public final function area($r) {
        return $r * $r * self::PI;
    }
    public final function max($a, $b) {
        return $a > $b ? $a : $b;
    }
}
echo Math::PI;

```

尝试为const定义的常量赋值，将会出现错误。

```php
<?php
//说明一个final类Math
class Math
{
    const PI = 3.14;
    public function __toString() {
        return "这是一个Math类";
    }
    //这里写了一个算圆面积的方法，使用了Const常量，
    //注意使用的方法，类似与静态变量。
    public final function area($r) {
        return $r * $r * self::PI;
    }
    public final function max($a, $b) {
        return $a > $b ? $a : $b;
    }
    public function setPI($a) {
        self::PI = 3.1415;
    }
}
echo Math::PI;
?>
```

&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/5212948