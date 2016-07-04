---
title: PHP高级面向对象：__call()详解
tags:
  - OOP
  - PHP
id: 811
categories:
  - PHP
date: 2013-12-31 20:59:59
---

这是我写的第一篇面向对象的高级教程，主要思路来源于《深入PHP：面向对象、模式与实践》，我感觉这本书写得很好，我才读了三分之一就感觉获益匪浅。这次我要写的的关于PHP的魔法函数`__call()`的用法（语文是数学老师教的，文字可能太啰嗦，请见谅）。

```php
class foo{
	function __call($name, $param){
		echo '你调用的函数名是' . $name;
		echo '调用参数是' . $parma;
	}
}

$bar = new foo();
foo->abc();
```

很多教程都会给出如上这样的`__call`的基本使用方法，也就是在外部调用一个类里面不存在的函数时（注意是函数，而不是属性，如果是属性的话应该用`__get()`），PHP系统会自动寻找类中是否存在`__call()`方法，如果这个方法存在的话就会把这次调用的函数名和参数列表发送给`__call()`方法，其中参数列表会以数组的形式传递。

我们要做的就是在在`__call()`方法中处理PHP传递而来的方法名和参数，显然这对组合模式非常有利。

`__call()`最大的用途就是在类中包含另一个类时，例如我们有一个类product，它包含所有产品的信息：

```php
class Product {
	protected $_pid;
	protected $_name;
	protected $_cost;

	function __call($name, $params){
		if(preg_match('/(.*)_(.*)/i', $matchs)){
			if(isset($matchs[1]) &amp;&amp; isset($matchs[2])){
				if($matchs[1] == 'get'){
					$attr = '_' . $matchs[2];
					return $this->$attr;
				} elseif ($matchs[1] == 'set'){
					$attr = '_' . $matchs[2];
					$this->$attr = $parmas[0];
				}
			}
		} else {
			echo '您请求的函数不存在';
		}
	}
}

$foo = new Product();
$foo->set_name('candy');
echo $foo->get_name;
```
上面的代码或许在类中保存多个属性时非常有用，但PHP已经有了更方便的`__get()`和`__set()`，关于这两个魔法函数这里就不细述了，如果需要某个属性不被这种调用修改的话（如pid），可以通过修改它的前缀的方式来避免。

但这不是`__call()`的最好用法，`__call()`在许多时候只有和`call_user_func()`或`call_user_func_array()`搭配使用才能达到最佳效果，即在类中包含另一个对象的实例时，或者需要在一个类中调用另一个类的方法时，参见以下代码（代码源自我做的一个相册程序，使用CI框架，类Image_model是在CI中直接调用的接口类，另外的虚拟类和两个延伸类则用于在Image_model中被调用）：

```php
class Image_model extends CI_Model {
	//用来保存Image_handle的实例
	private $_image_handle;

	function __construct(){
		parent::__construct();

		switch($this->config->item('image_handle')){
			case 'local':
				$this->_image_handle = new Local_image_handle();
				break;
			case 'bae':
				$this->_image_handle = new Bae_image_handle();
				break;
			case 'sae':
				$this->_image_handle = new Sae_image_handle();
				break;
			default:
				show_error('参数错误');
		}
	}

	/**
	* 在CALL魔法函数中查找要调用的方法是否存在，如果存在可以直接
	* 调用对应类中的方法，这里用到call_user_func_array()
	*/
	function __call($name, $params){
		if(method_exists($this->_image_handle, $name){
			call_user_func_array(array($this->_image_handle, $name), $params);
		} else {
			show_error ('你调用的方法不存在');
		}
	}
}

/**
* 这里定义一个虚拟的接口类image_handle
* 这个类存在的意义就是在外部调用image_handle的方法时
* 可以保证这个方法是一定存在的，这样可以避免很多错误
*/
abstrct class Image_handle {
	function get_content();
	function get_mime_type();
	// ......
}

/**
* Image_handle的本地实现
*/
class Local_image_handle extends Image_handle {
	function get_content(){
		//......
	}
	function get_mime_type(){
		//......
	}
}

/**
* Image_handle的BAE实现
*/
class Bae_image_handle extends Image_handle {
	function get_content(){
		//......
	}
	function get_mime_type(){
		//......
	}
}
```

以上基本阐释了__call()和call_user_func_array的用法，call_user_func_array接受两个数组作为参数，第一个数组有两个参数，即要调用的类的名称（或类的实例）和要调用的方法名，第二个参数即是要传递给该方法的参数列表，具体可参见PHP官方文档。
