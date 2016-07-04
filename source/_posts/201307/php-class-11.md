---
title: PHP类实例教程（十一）：类中this关键字
tags:
  - OOP
  - PHP
id: 396
categories:
  - PHP
date: 2013-07-12 21:35:40
---

PHP5中为解决变量的命名冲突和不确定性问题，引入关键字“$this”代表其所在当前对象。

$this在构造函数中指该构造函数所创建的新对象。

在类中使用当前对象的属性和方法，必须使用$this->取值。

方法内的局部变量，不属于对象，不使用$this关键字取值。

局部变量和全局变量与 $this 关键字,使用当前对象的属性必须使用$this关键字。局部变量的只在当前对象的方法内有效，所以直接使用。

注意：局部变量和属性可以同名，但用法不一样。在使用中，要尽量避免这样使用，以免混淆。

```php
<?php
class A
{
    private $a = 99;
    //这里写一个打印参数的方法
    public function printInt($a) {
        echo "/$a是传递的参数 $a ";
        echo "<br />";
        echo "/$this->a 是属性 $this->a";
    }
}
$a = new A();   //这里的$a可不是类中的任何变量
$a->printInt(88);
?>
```

###  用$this调用对象中的其它方法

```php
<?php
class Math
{
    //两个数值比较大小
    public function Max($a, $b) {
        return $a > $b ? $a : $b;
    }
    //三个数值比较大小
    public function Max3($a, $b, $c) {
        $a = $this->Max($a, $b);     //调用类中的其它方法
        return $this->Max($a, $c);
    }
}
$math = new Math();
echo "最大值是 " . $math->Max3(99, 100, 88);
?>
```

###  使用$this调用构造函数

调用构造函数和析构函数的方法一致。

```php
<?php
class A
{
    private $a = 0;
    public function __construct() {
        $this->a = $this->a + 1;
    }
    public function doSomeThing() {
        $this->__construct();
        return $this->a;
    }
}
$a = new A(); // 这里的$a 可不是类中的任何一个变量了
echo "现在 /$a 的值是" . $a->doSomeThing();
?>
```

###  $this 到底指的什么？

$this 就是指当前对象，我们甚至可以返回这个对象使用 $this。

```php
<?php
class A
{
    public function  getASelf() {
        return $this;
    }
    public function __toString() {
        return "这是类A的实例";
    }
}
$a = new A();   //创建A的实例
$b = $a->getASelf(); //调用方法返回当前实例
echo $a;    //打印对象会调用它的__toString方法
?>
```

###  通过 $this 传递对象

在这个例子中,我们写一个根据不同的年龄发不同工资的类。我们设置处理年龄和工资的业务模型为一个独立的类。

```php
<?php
class User
{
    private $age ;
    private $sal ;
    private $payoff ;   //声明全局属性
    //构造函数,中创建Payoff的对象
    public function __construct() {
        $this->payoff = new Payoff();
    }
    public function getAge() {
        return $this->age;
    }
    public function setAge($age) {
        $this->age = $age;
    }
    // 获得工资
    public function getSal() {
        $this->sal =  $this->payoff->figure($this);
        return $this->sal;
    }
}
//这是对应工资与年龄关系的类.
class Payoff
{
    public function figure($a) {
        $sal =0;
        $age = $a->getAge();
        if ($age > 80 || $age < 16 ) {
            $sal = 0;
        } elseif ($age > 50) {
            $sal = 1000;
        } else {
            $sal = 800;
        }
        return $sal;
    }
}
//实例化User
$user = new User();
$user->setAge(55);
echo $user->getAge() . " age, his sal is " . $user->getSal();
echo "<br />";
$user->setAge(20);
echo $user->getAge() . " age, his sal is " . $user->getSal();
echo "<br />";
$user->setAge(-20);
echo $user->getAge() . " age, his sal is " . $user->getSal();
echo "<br />";
$user->setAge(150);
echo $user->getAge() . " age, his sal is " . $user->getSal();
?>

```
&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/5212896