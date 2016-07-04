---
title: PHP类实例教程（十七）：abstract类和abstract方法
tags:
  - OOP
  - PHP
id: 412
categories:
  - PHP
date: 2013-07-28 22:02:45
---

可以使用abstract来修饰一个类或者方法。

用abstract修饰的类表示这个类是一个抽象类，用abstract修饰的方法表示这个方法是一个抽象方法。

抽象类不能被实例化。

抽象方法是只有方法声明，而没有方法的实现内容。

### abstract 抽象类

可以使用abstract来修饰一个类。

用abstract修饰的类表示这个类是一个抽象类。

抽象类不能被实例化。

这是一个简单抽象的方法，如果它被直接实例化，系统会报错。

```php
<?php
//定义一个抽象类  
abstract class User  
{  
    public function __toString() {  
        return get_class($this);  
    }   
}  
//实例化这个类会出现错误  
echo new User();  
?>
```

下面例子的 NormalUser 继承自 User类，就可以被实例化了。

```php
<?php
//定义一个抽象类  
abstract class User  
{  
    public function __toString() {  
        return get_class($this);  
    }   
}  
//实例化这个类会出现错误  
echo new User();  
class NormalUser extends User  
{  
}  
$a = new NormalUser();  
echo "这个类" . $a . "的实例";  
?>
```

单独设置一个抽象类是没有意义的，只有有了抽象方法，抽象类才有了血肉。下面介绍抽象方法。

### abstract 抽象方法

用abstract修饰的类表示这个方法是一个抽象方法。

抽象方法，只有方法的声明部分，没有方法体。

抽象方法没有 {} ，而采用 ; 结束。

一个类中，只要有一个抽象方法，这个类必须被声明为抽象类。

抽象方法在子类中必须被重写。

下面是一个抽象类，其中有两个抽象方法，分别是 setSal() 和 getSal()。用来取回 $sal 员工的工资。
```php
<?php
abstract class User  
{  
    protected $sal = 0;  
    //这里定义的抽象方法。  
    //注意抽象方法没有方法体，而且方法结束使用 ; 号。  
    abstract function getSal();  
    abstract function setSal();  
    //定义它的__tostring方法  
    public function __toString() {  
        return get_class($this);  
    }   
}   
?>
```

既然User类不能被直接继承，我们写一个NormalUser类继承自User类。当我们写成如下代码时，系统会报错。 这个错误告诉我们，在 User类中有两个抽象方法，我们必须在子类中重写这两个方法.

```php
<?php
abstract class User  
{  
    protected $sal = 0;  
    //这里定义的抽象方法。  
    //注意抽象方法没有方法体，而且方法结束使用 ; 号。  
    abstract function getSal();  
    abstract function setSal();  
    //定义它的__tostring方法  
    public function __toString() {  
        return get_class($this);  
    }   
}  
class NormalUser extends User  
{  
}  
?>
```

下面例子，重写了这两个方法，虽然方法体里面 {} 的内容是空的，也算重写了这个方法。注意看重写方法的参数名称，这里只要参数数量一致就可以，不要求参数的名称必须一致。

```php
<?php
abstract class User  
{  
    protected $sal = 0;  
    //这里定义的抽象方法。  
    //注意抽象方法没有方法体，而且方法结束使用；号。  
    abstract function getSal();  
    abstract function setSal();  
    //定义它的__tostring方法  
    public function __toString() {  
        return get_class($this);  
    }   
}  
class NormalUser extends User  
{  
    function getSal() {  
    }  
    function setSal($sal) {   
    }  
}  
    //这样就不会出错了。  
?>
```

下面19-21行，三种写重写的方式都会报错。

19行，缺少参数。

20行，参数又多了。

21行，参数类型不对。（这种写法在以后章节介绍）

一个类中，如果有一个抽象方法，这个类必须被声明为抽象类。

下面这个类不是抽象类，其中定义了一个抽象方法，会报错。

```php
<?php
class User
{
	protected $sal = 0;
	//这里定义的抽象方法。
	//注意抽象方法没有方法体，而且方法结束使用；号。
	abstract function getSal();
	abstract function setSal();
	//定义它的__tostring方法
	public function __toString() {
		return get_class($this);
	} 
}
	//这个类中有两个抽象方法，如果这个类不是抽象的。会报错
?>
```
抽象类继承抽象类

抽象类继承另外一个抽象类时，不用重写其中的抽象方法。

抽象类中，不能重写抽象父类的抽象方法。

这样的用法，可以理解为对抽象类的扩展

下面的例子，演示了一个抽象类继承自另外一个抽象类时，不需要重写其中的抽象方法。

```php
<?php
abstract class User
{
	protected $sal = 0;
	abstract function getSal();
	abstract function setSal($sal); 
}
abstract class VipUser extends User
{
}
?>
```

抽象类在被继承后，其中的抽象方法不能被重写。

如果发生重写，系统会报错。

```php
<?php
abstract class User
{
	protected $sal = 0;
	abstract function getSal();
	abstract function setSal($sal); 
}
abstract class VipUser extends User
{
	abstract function setSal(); 
}
?>
```

抽象类继承抽象类，目的对抽象类的扩展。

```php
<?php
abstract class User
{
	protected $sal = 0;
	abstract function getSal();
	abstract function setSal($sal); 
}
abstract class VipUser extends User
{
	protected $commision = 0;
	abstract function getCommision();
	abstract function setCommision();
}
?>
```

在PHP5.1中，抽象类中支持静态抽象方法。下面这个例子，看到静态抽象方法可以声明。实现这个方法时，必须是静态的方法。

### 静态抽象方法

在PHP5.1中，抽象类中支持静态抽象方法。下面这个例子，看到静态抽象方法可以声明。实现这个方法时，必须是静态的方法。

```php
<?php
abstract class User
{
	protected static  $sal = 0;
	static abstract function getSal();
	static abstract function setSal($sal); 
}
class VipUser extends User
{
	static function getSal() {
		return self::$sal;
	}
	static function setSal($sal) {
		self::$sal = $sal;
	}
}
VipUser::setSal(100);
echo "you sal is " . VipUser::getSal();
?>

```
&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/5212952