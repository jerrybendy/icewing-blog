---
title: PHP类实例教程（二十一）：PHP类接口的继承
tags:
  - OOP
  - PHP
id: 432
categories:
  - PHP
date: 2013-07-29 21:30:50
---

一个接口可以继承自另外的接口。PHP5中的类是单继承，但是接口很特殊。一个接口可以继承自多个接口。

一个接口继承其它接口时候，直接继承父接口的静态常量属性和抽象方法。

在PHP5中，接口是可以继承自另外一个接口的。这样代码的重用更有效了。

要注意只有接口和接口之间使用 继承关键字extends。

类实现接口必须实现其抽象方法，使用实现关键字 implements。

### 接口实现继承

要注意只有接口和接口之间使用 继承关键字extends。

类实现接口必须实现其抽象方法，使用实现关键字 implements。

这个例子定义接口User，User有两个抽象方法getName和setName。又定义了接口VipUser，继承自User接口，并增加了和折扣相关的方法getDiscount。最后定义了类 Vip ，实现了VipUser接口。并实现了其中的三个方法。

```php
<?php
interface User
{
    function getName();
    function setName($_name);
}
interface VipUser extends User
{
    function getDiscount(); //此处添加了一个抽象的方法
}
class Vip implements VipUser
{
    private $name;
    private $discount = 0.8;    //折扣变量
    function getName() {
        return $this->name;
    }
    function setName($_name) {
        $this->name = $_name;
    }
    function getDiscount() {
        return $this->discount;
    }
}
?>
```

&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/5213009