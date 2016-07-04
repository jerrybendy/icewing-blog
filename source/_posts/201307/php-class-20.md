---
title: PHP类实例教程（二十）：PHP类接口的实现接口
tags:
  - OOP
  - PHP
id: 419
categories:
  - PHP
date: 2013-07-28 22:45:24
---

类实现接口要使用 implements 。类实现接口要实现其中的抽象方法。一个类可以实现多个接口。

一个类可以使用 implements 实现接口，甚至可以实现多个接口。

大部分的书说，这样是为了实现PHP的多继承。为什么呢？

PHP5是单继承的，一个类只可以继承自一个父类。接口可以实现多个，这样就是多继承了。

这样说有些道理。但，既然接口里面的方法没有方法体，所谓的多继承又有什么意义？

接口的意义在于后面一节继续说的多态。

### 使用implements实现接口

使用implements来实现一个接口。如果实现接口而没有实现其中的抽象方法，会报错如下。

Fatal error: Interface function User::getName() cannot contain body in C:/wamp/www/tt.php on line 5

```php
<?php
interface User  
{  
    const MAX_GRADE = 99;   //此处不用声明，就是一个静态常量  
    function setName($name);  
    static function getName() {  
    }   
}  
class NoumalUser implements User  
{  
}  
?>
```

实现接口要实现方法。注意静态变量的使用。

```php
<?php
interface User  
{  
    const MAX_GRADE = 99;   //此处不用声明，就是一个静态常量  
    function setName($name);  
    function getName();   
}  
//实现接口  
class NoumalUser implements User  
{  
    private $name;  
    function getName() {  
        return $this->name;
    }  
    function setName($_name) {  
        $this->name = $_name;
    }   
}  
$normalUser = new NoumalUser(); //创建对象  
$normalUser->setName("http://www.isstudy.com");
echo "URL is " . $normalUser->getName();
echo "<br />";
echo "MAX_GRADE is " . NoumalUser::MAX_GRADE;   //静态常量  
?>
```

###  实现多个接口

一个类可以实现多个接口。只要使用 , 号将多个接口链接起来就可以。

```php
<?php
interface User
{
    const MAX_GRADE = 99;   //此处不用声明，就是一个静态常量
    function setName($name);
    function getName();
}
interface administrator
{
    function setBulletin($_bulletin) ;
}
//多个接口
class NoumalUser implements User, administrator
{
    private $name;
    function getName() {
        }
    function setName($_name) {
        }
    function setBulletin($_setBulletin) {
    }
}
?>
```

###  继承并实现接口

```php
<?php
class Student
{
    protected $grade;
    public function getGrade() {
        return $this->grade;
    }
}
interface  User
{
    function getName();
    function setName($_name);
}
//只有管理员可以设置公告
interface Administrator
{
    function setBulletin($_bulletin);
}
//为了节省版面,下面方法只写空的实现.不写具体内容了
class StudentAdmin extends Student implements User, Administrator
{
    function getName() {
    }
    function setName($_name) {
    }
    function setBulletin($_bulletin) {
    }
}
$s = new StudentAdmin();
echo $s->getGrade();
echo $s->getName();
echo $s->setBulletin("公告内容");
?>
```
&nbsp;

转自： http://blog.csdn.net/klinghr/article/details/5212997