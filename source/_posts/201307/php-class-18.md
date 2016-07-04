---
title: PHP类实例教程（十八）：设计模式之模版模式
tags:
  - OOP
  - PHP
id: 414
categories:
  - PHP
date: 2013-07-28 22:13:09
---

抽象类的应用就是典型的模版模式，先声明一个不能被实例化的模版，在子类中去依照模版实现具体的应用。

模版模式实例

我们写这样一个应用：

银行计算利息，都是利率乘以本金和存款时间，但各种存款方式计算利率的方式不同，所以，在账户这个类的相关方法里，只搭出算法的骨架，但不具体实现。具体实现由各个子类来完成。

```php
<?php
//程序设计模式的模块部分
abstract class LoadAccount
{
	//利息，本金
	protected $interest, $fund;
	public function calculateInterest() {
		//取得利率
		$this->interest = getInterestRate();
		//用于计算利息的算法：本金*利率，但是利率的算法实现并没有在这个类中实现
		$this->interest = $this->getFund() * $this->getInterstRate();
		return $this->interest;
	}
	private function getFund() {
		return $this->fund;
	}
	//.......
	/*
	* 不同类型的存款的利率不同，因此，
	* 不在这个父类中实现率的计算方法，
	* 而将他推迟到子类中实现
	*/
	protected abstract function getInterstRate();
}
?>
```

所有和计算利息的类都继承自这个类，而且必须实现其中的 getInterestRate() 方法，这种用法就是模版模式。