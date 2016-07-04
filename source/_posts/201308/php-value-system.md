---
title: PHP5的对象赋值机制介绍
tags:
  - OOP
  - PHP
id: 463
categories:
  - PHP
date: 2013-08-20 19:52:35
---

看到PHP设计模式中值对象模式中的例题，对于结果总感到有点疑惑。回头看了下PHP5的对象赋值才真正清楚。

```php
<?php
class SimpleClass{
    public $var = 'a default value';
    public function displayVar() {
        echo $this->var;
    }
}

$instance = new SimpleClass();
$assigned = $instance;
$reference =&amp; $instance;
$instance->var = '$assigned will have this value';
$instance = null;

var_dump($instance);
var_dump($assigned);
var_dump($reference);
?>
```

最后的执行结果是：

```
NULL

object(SimpleClass)#5 (1) { ["var"]=&amp;gt; string(30) "$assigned will have this value" }

NULL
```

php5 改写了OOP底层。当类生成一个实例（对象）的时候，返回值$instance并不是对象本身，而只是对象的一个id（或者资源句柄），所以，当$instance被赋值给$assigned的时候，$assigned也指向了这个对象，这有点像普通变量的引用(&amp;)操作。所以，当对$instance初始化的时候，$assigned也被初始化了。但是，当$instance被销毁(=null)的时候，因为对应的对象还有一个句柄存在（$assigned），所以对象并不会被销毁，析构函数也不会被触发。结果，var_dump($assigned)是对象的值，而$instance已经是空句柄，显示null。$reference因为与$instance有类似普通变量间的引用关系，所以也成为空句柄，显示 null。

&nbsp;

转自：[脚本之家]()

觉得有用便收下了