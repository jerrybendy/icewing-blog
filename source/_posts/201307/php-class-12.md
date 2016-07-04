---
title: 'PHP类实例教程（十二）：类中parent::关键字'
tags:
  - OOP
  - PHP
id: 398
categories:
  - PHP
date: 2013-07-12 21:40:45
---

PHP5中使用parent::来引用父类的方法。 parent:: 可用于调用父类中定义的成员方法。parent::的追溯不仅于直接父类。

### 通过parent::调用父类方法

```php
<?php
/**
 * 声明一个员工类,经理类继承自员工类
 */
class employee
{
    protected  $sal = 3000;
    public function getSal() {
        $this->sal = $this->sal + 1200;
        return $this->sal ;
    }
}
class Manager extends employee
{
//如果想让经理在员工工资的基础上多发1500元
//必须先调用父类的getSal()方法
    public function getSal() {
        parent::getSal();   // 这里调用了父类的方法
        $this->sal = $this->sal + 1500;
        return $this->sal ;
    }
}
$emp = new employee();
echo "普通员工的工资是 " . $emp->getSal();
echo "<br />";
$manager = new Manager();
echo "经理的工资是: " . $manager->getSal();

```

###  父类的private属性

Private属性是不能被继承的，如果父类有私有的属性。那么父类的方法只为父类的私有属性服务。

```php
<?php
class employee
{
    private  $sal = 3000;
    //protected $sal = 3000;
    public function getSal() {
        return $this->sal;
    }
}
class Manager extends employee
{
    protected  $sal = 5000;
    public function getParentSal() {
    //这里返回的是父类的private属性
    return parent::getSal();
    }
}
$manager = new Manager();
echo "PHP " . phpversion() . "<br />";
echo $manager->getSal();
echo "<br />";
echo "parent's /$sal " . $manager->getParentSal();

```

如果父类中的属性被子类重写了。注意 第5行的属性定义变成protected。那么两次的输出是不一样的，如果你学过java，你会觉得这一切都是很难理解的。在Java中当子类被创建时，父类的属性和方法在内存中都被创建，甚至构造函数也要被调用。PHP5不是这样，PHP5调用父类用的是parent:: 而不是 parent-> ，这足以说明PHP5不想在内存中让父类也被创建。PHP5想让继承变的比Java更简单。适应下就好。

&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/5212904