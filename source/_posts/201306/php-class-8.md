---
title: PHP类实例教程（八）：类的继承
tags:
  - OOP
  - PHP
id: 387
categories:
  - PHP
date: 2013-06-30 18:30:27
---

继承是面向对象最重要的特点之一，就是可以实现对类的复用。

通过“继承”一个现有的类，可以使用已经定义的类中的方法和属性。

继承而产生的类叫做子类。

被继承的类，叫做父类，也被成为超类。

PHP是单继承的，一个类只可以继承一个父类，但一个父类却可以被多个子类所继承。

从子类的角度看，它“ 继承（inherit ， extends）”自父类；而从父类的角度看，它“派生（derive）”子类。它们指的都是同一个动作，只是角度不同而已。

子类不能继承父类的私有属性和私有方法。

在PHP5中类的方法可以被继承，类的构造函数也能被继承。

### 继承的简单例子

我们分析自然界中的关系，动物类与犬类的关系。

```php
<?Php
class Animal
{
   private $weight;
   public function getWeight() {
      return $this->weight;
   }
   public function setWeight($W) {
      $this->weight = $W;
   }
}

class Dog extends Animal
{
}
?>
```

当我们实例化animal类的子类Dog类时， 父类的方法setWeight() 和 getWeight() 被继承。

我们可以直接调用父类的方法设置其属性$weight，取得其属性$weight 。

```php
<?php
// ……….
$myDog = new Dog();
$myDog->setWeight(20);
echo "Mydog's weight is " . $myDog->getWeight() . "<br />";
$myDog->Bark();
?>
```

### 构造函数的继承

有些资料上说PHP5的构造函数不被继承。演示的结果证明，PHP5的构造函数被继承了。当子类Dog1被实例化时，继承的构造函数被调用了，屏幕上显示了一句 “I am an Animal.”。

```php
<?php
class Animal
{
    public $legNum = 0;
    public function __construct() {
       $this->legNum = 4;
       echo "I am an animal <br />";
    }
}
class Dog1 extends Animal
{
}
$dog1 = new Dog1();
echo "<br />";
echo  "legNum is " . $dog1->legNum;
    /*
       实例化子类时，构造函数被调用了。
    */
?>
```

私有变量和方法不被继承

&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/5212872