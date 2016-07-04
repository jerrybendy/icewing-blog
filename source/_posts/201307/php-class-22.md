---
title: PHP类实例教程（二十二）：类型提示
tags:
  - OOP
  - PHP
id: 434
categories:
  - PHP
date: 2013-07-29 21:33:43
---

PHP是弱类型语言，向方法传递参数时候也不太区分类型。这样的使用会引起很多的问题，PHP开发者认为，这些问题应该是由代码书写者在书写代码时进行检验以避免。没有类型提示很危险。

```php
<?php
class NormalUser  
{  
    /* 
    * 其它相关代码..省略........ 
    */  
    private $age;  
    public function setAge($_age) {  
        $this->age = $_age;
    }   
    public function getAge() {  
        return $this->age ;
    }  
}  
$normalUser = new NormalUser();  
$normalUser->setAge("I am tom"); //这里我们传输一个非数值
echo "age is " . $normalUser->getAge();  //注意输出结果不是我想要的类型
?>
```

###  原始类型的类型判

PHP中提供了一些函数，来判断数值的类型。我们可使用is_numeric()。判断是否是一个数值或者可转换为数值的字符串。

其它相关的还有is_bool()、is_int()、is_float()、is_integer()、is_numeric()、is_string()、is_array() 和 is_object()。

于是代码有了修改

```php
<?php
class NormalUser
{
    /*
    * 其它相关代码..省略........
    */
    private $age;
    public function setAge($_age) {
        if (is_numeric($_age)) {
            $this->age = $_age;
        }
    }
    public function getAge() {
        return $this->age ;
    }
}
$normalUser = new NormalUser();
$normalUser->setAge("I am tom");     //这里我们传输一个非数值.
echo "age is " . $normalUser->getAge();  //看到这里的结果为空.
echo  "<br />";
$normalUser->setAge("100");
echo "age is " . $normalUser->getAge();  // 这里就有了结果.
?>
```

###  向方法内传递对象

如果传递的参数是一个对象呢？

下面的代码用起来很正常。

```php
<?php
class NOrmalUser
{
    private $name;
    function setName($_name) {
        $this->name = $_name;
    }
    function getName() {
        return $this->name;
    }
}
class UserAdmin
{
    //这里定义的参数，第一个是User类的实例，第二个是要设置的名字
    static function changeName($_user, $_name) {
        $_user->setName($_name);
    }
}
$normalUser = new NOrmalUser();
UserAdmin::changeName($normalUser, "tom");
echo "username is " . $normalUser->getName();
?>
```
&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/5213016