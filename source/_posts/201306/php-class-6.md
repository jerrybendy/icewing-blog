---
title: PHP类实例教程（六）：构造函数
tags:
  - OOP
  - PHP
id: 381
categories:
  - PHP
date: 2013-06-27 11:01:01
---

PHP构造函数的声明与其它操作的声明一样,只是其名称必须是__construct( )。这是PHP5中的变化,以前的版本中,构造函数的名称必须与类名相同,这种在PHP5中仍然可以用,但现在以经很少有人用了,这样做的好处是可以使构造函数独立于类名,当类名发生改变时不需要改相应的构造函数名称了。为了向下兼容,如果一个类中没有名为__construct( )的方法,PHP将搜索一个php4中的写法,与类名相同名的构造方法。格式：function __construct ( [参数] ) { … … }在一个类中只能声明一个构造方法,而是只有在每次创建对象的时候都会去调用一次构造方法,不能主动的调用这个方法,所以通常用它执行一些有用的初始化任务。比如对成属性在创建对象的时候赋初值。

```php
<?php
class Person {
   private $name;
   public function __construct($name) {
      $this->name = $name;
      echo "在类被初始化的时候，这里的代码将会运行<br />";
      echo "/$name is $this->name <br />";
  }
}
new Person("tom");
new Person("jack");
?>
```

```php
<?php
//创建一个人类

class Person
{
    //下面是人的成员属性
    var $name;       //人的名子
    var $sex;        //人的性别
    var $age;        //人的年龄
    //定义一个构造方法参数为姓名$name、性别$sex和年龄$age
    function __construct($name, $sex, $age)
    {
        //通过构造方法传进来的$name给成员属性$this->name赋初使值
        $this->name=$name;
        //通过构造方法传进来的$sex给成员属性$this->sex赋初使值
        $this->sex=$sex;
        //通过构造方法传进来的$age给成员属性$this->age赋初使值
        $this->age=$age;
    }
    //这个人的说话方法
    function say()
    {
        echo "我的名子叫：".$this->name." 性别：".$this->sex." 我的年龄是：".$this->age."<br>";
    }
}
//通过构造方法创建3个对象$p1、p2、$p3,分别传入三个不同的实参为姓名、性别和年龄
$p1=new Person("张三","男", 20);
$p2=new Person("李四","女", 30);
$p3=new Person("王五","男", 40);
//下面访问$p1对象中的说话方法
$p1->say();
//下面访问$p2对象中的说话方法
$p2->say();
//下面访问$p3对象中的说话方法
$p3->say();
?>
```
