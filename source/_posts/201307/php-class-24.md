---
title: PHP类实例教程（二十四）：PHP5类中的多态
tags:
  - OOP
  - PHP
id: 444
categories:
  - PHP
date: 2013-07-31 20:57:50
---

多态这个概念，在Java中指的是变量可以指向的对象的类型，可是变量声明类型的子类。对象一旦创建，它的类型是不变的，多态的是变量。在PHP5中，变量的类型是不确定的，一个变量可以指向任何类型的数值、字符串、对象、资源等。我们无法说PHP5中多态的是变量。

我们只能说在PHP5中，多态应用在方法参数的类型提示位置。

一个类的任何子类对象都可以满足以当前类型作为类型提示的类型要求。

所有实现这个接口的类，都可以满足以接口类型作为类型提示的方法参数要求。

简单的说，一个类拥有其父类、和已实现接口的身份。

### 通过实现接口实现多态

```php
<?php
class User  
{   // User接口  
    public function  getName() {  
    }  
}  
class NormalUser extends User  
{   // 继承自User类  
    private $name;  
    public function getName() {  
        return $this->name;
    }  
    public function setName($_name) {  
        $this->name = $_name;
    }  
}  
class UserAdmin  
{   //操作  
    public static function  ChangeUserName(User $_user, $_userName) {  
        $_user->setName($_userName);
    }  
}  
$normalUser = new NormalUser();  
UserAdmin::ChangeUserName($normalUser,"Tom");   //这里传入的是 NormalUser的实例  
echo $normalUser->getName();
?>
```

###  使用接口与组合模拟多继承

通过组合模拟多重继承。

在PHP中不支持多重继承，如果我们向使用多个类的方法而实现代码重用有什么办法么?

那就是组合。在一个类中去将另外一个类设置成属性。

下面的例子，模拟了多重继承。

### 接口实例

写一个概念性的例子。 我们设计一个在线销售系统，用户部分设计如下： 将用户分为，NormalUser, VipUser, InnerUser 三种。要求根据用户的不同折扣计算用户购买产品的价格。并要求为以后扩展和维护预留空间。

```php
<?php
interface User  
{  
    public function getName();  
    public function setName($_name);  
    public function getDiscount();  
}  
abstract class AbstractUser implements User  
{  
    private $name = "";  
    protected  $discount = 0;  
    protected  $grade = "";  
    function __construct($_name) {  
        $this->setName($_name);
    }  
    function getName() {  
        return $this->name;
    }  
    function setName($_name) {  
    $this->name = $_name;
    }  
    function getDiscount() {  
        return $this->discount;
    }  
    function getGrade() {  
        return $this->grade;
    }  
}  
class NormalUser extends AbstractUser  
{  
    protected $discount = 1.0;  
    protected $grade = "Normal";  
}  
class VipUser extends AbstractUser  
{  
    protected $discount = 0.8;  
    protected $grade = "VipUser";  
}  
class InnerUser extends AbstractUser  
{  
    protected $discount = 0.7;  
    protected $grade = "InnerUser";  
}  
interface Product  
{  
    function getProductName();  
    function getProductPrice();  
}  
interface Book extends Product  
{  
    function getAuthor();  
}  
class BookOnline implements Book  
{  
    private $productName;  
    protected $productPrice;  
    protected $Author;  
    function __construct($_bookName) {  
        $this->productName = $_bookName;
    }  
    function getProductName() {  
        return $this->productName;
    }  
    function getProductPrice() {  
        $this->productPrice = 100;
        return $this->productPrice;
    }  
    public function getAuthor() {  
        $this->Author = "chenfei";
        return $this->Author;
    }  
}  
class Productsettle  
{  
    public static function finalPrice(User $_user, Product $_product, $number) {  
        $price = $_user->getDiscount() * $_product->getProductPrice() * $number;
        return $price;  
    }  
}  
$number = 10;  
$book = new BookOnline("设计模式");  
$user = new NormalUser("tom");  
$price = Productsettle::finalPrice($user, $book, $number);  
$str = "您好，尊敬的" . $user->getName() . "<br />";
$str .= "您的级别是" . $user->getGrade() . "<br />";
$str .= "您的折扣是" . $user->getDiscount() . "<br />";
$str .= "您的价格是" . $price;  
echo $str;  
?>
```
&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/5213022