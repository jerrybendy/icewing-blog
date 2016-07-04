---
title: PHP类实例教程（十）：类的重写（override）
tags:
  - OOP
  - PHP
id: 394
categories:
  - PHP
date: 2013-07-07 10:38:00
---

如果从父类继承的方法不能满足子类的需求，可以对其进行改写，这个过程叫方法的覆盖（override），也称为方法的重写。

当对父类的方法进行重写时，子类中的方法必须和父类中对应的方法具有相同的方法名称，在PHP5中不限制输入参数类型、参数数量和返回值类型。（这点和JAVA不同）子类中的覆盖方法不能使用比父类中被覆盖方法更严格的访问权限。

声明方法时，如果不定义访问权限。默认权限为public。

先设置一个父类，这个父类是 “Dog”类，这个类描述了dog的特性。Dog有2个眼睛，会跑，会叫。就这样描述先。我养了一直狗，是只小狗，符合Dog类的特性，但有所不同。我的小狗有名字，我的小狗太小了，不会大声的叫，只会哼哼。 我们用继承的概念去实现这个设计。

```php
<?php
//狗有两只眼睛，会汪汪叫，会跑
class  Dog
{
    protected  $eyeNumber = 2; //
    //返回封装的属性方法
    public function getEyeNumber() {
        return $this->eyeNumber;
    }
    //狗会叫
    public function  yaff() {
        return  "Dog yaff, wang ..wang ..";
    }
    //狗会跑
    public function  run() {
        return  "Dog run..running ...";
    }
}
$dog = new Dog();
echo "dog have " . $dog->getEyeNumber() . " eyes. <br />";
echo $dog->yaff() . "<br />" . $dog->run();
echo  "<br /><br /><br /><br />";
//这是我的小狗，叫"狗狗",他还小不会汪汪叫，智慧哼哼。。
class MyDog extends Dog
{
    private $name = "";
    public function getName() {
        return $this->name;
    }
        public function  yaff() {
        return  $this->name . " yaff, heng...heng ..";
    }
}
$myDog = new MyDog();
echo $myDog->getName() . " have " . $myDog->getEyeNumber() . " eyes. <br />";
echo $myDog->yaff() . "<br />" . $myDog->run();
?>

```

重写方法与访问权限

子类中的覆盖方法不能使用比父类中被覆盖方法更严格的访问权限。

&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/5212889