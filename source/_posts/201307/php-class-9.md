---
title: 'PHP类实例教程（九）：访问控制 private, protected, public'
tags:
  - OOP
  - PHP
id: 390
categories:
  - PHP
date: 2013-07-04 11:14:02
---

在PHP5中，可以在类的属性和方法前面加上一个修饰符（modifier），来对类进行一些访问上的控制。

* Public（公开）: 可以自由的在类的内部外部读取、修改。
* Private（私有）: 只能在这个当前类的内部读取、修改。
* Protected（受保护）：能够在这个类和类的子类中读取和修改。

### Private的访问权限

private 不能直接被外部调用，只能由当前对象调用。前面介绍过关于封装的内容这里不再重复。比如你可以借钱给别人，但不希望别人知道你钱包里面有多少钱。 我们把它用private隐藏起来。

```php
<?php
class Money
{
   private $mymoney = 1000; //我有点钱数
//借出钱的方法
   public function loan ($num) {
      if ($this->mymoney >= $num) {
         $this->mymoney = $this->mymoney - $num;
         echo "好的，这里借给你 $num 元，可是我也不多了。<br />";
      } else {
         echo "我无法借 $num 元给你，我没有这么多钱。<br />";
      }
   }
}
$mon = new Money();
$mon->loan(300);
$mon->loan(600);
$mon->loan(400);
echo $mon->mymoney;
// 这个地方会抛出异常，私有变量不能被外界访问
?>
```

###  Protected的访问权限

protected 修饰的属性和方法只能被子类调用。外界无法调用。

```php
<?php
class Money
{
    protected $mymoney=1000; //我有点钱数
//借出钱的方法
    public function loan($num) {
        if ($this->mymoney> = $num) {
            $this->mymoney = $this->mymoney - $num;
            echo "好的，这里借给你 $num 元，可是我也不多了。<br />";
        } else {
            echo "我无法借 $num 元给你，我没有这么多钱。<br />";
        }
    }
}
class SMoney extends Money
{
    public function getMoney() {
        return $this->mymoney;
    }
}
$mon = new SMoney();
$mon->loan(900); //借钱
echo "老婆，这里我还有..." . $mon->getMoney() . "元";  //其他人不允许访问，
?>
```

###  Public的访问权限

数据的隐藏和封装是能够帮助我们保护数据的安全性。Public 修饰的属性和方法，可以被无限制的调用。嘿。。你的钱，不安全了。

```php
<?php
class Money
{
    public $mymoney=1000;//我有点钱数
    //借出钱的方法
    public function loan($num) {
        if ($this->mymoney >= $num) {
            $this->mymoney = $this->mymoney - $num;
            echo "好的，这里借给你 $num 元，可是我也不多了。<br />";
        } else {
            echo "我无法借 $num 元给你，我没有这么多钱。<br />";
        }
    }
}
$mon = new Money();
$mon->mymoney = $mon->mymoney - 5000;
echo "我现在只有" . $mon->mymoney;
echo "<br />钱哪里去了，我也不知道。";
?>

```

转自：http://blog.csdn.net/klinghr/article/details/5212880