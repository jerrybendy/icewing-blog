---
title: PHP简单合并两个数组：数组相加
tags:
  - PHP
id: 779
categories:
  - PHP
date: 2013-11-22 09:53:52
---

今天在看一个源码时意外发现了PHP数组的一种用法，可能这种用法早就被广泛流传了吧，只是我才刚知道。

PHP在类中经常会用数组保存很多关于类的设置，而这些设置又可以被构造的时候通过传参覆盖掉，如果对这些参数都用实参来传递进行构造的话会显得很麻烦，而且默认值不好处理，于是就有了下面的方法：

```php
<?php

class a{
  private $options;

  public function __construct($option = array()){
    $this->options = array(
       'a'=>'aaa',
       'b'=>'bbb'
    );

    $this->options = $options + $this->options;
  }
}
```

从以上代码中可以看出来类中是把所有设置项保存在一个内部的 $options 变量中，并且这个数组的值在类构造时初始化。在构造函数进行前，客户端代码使用传参的方式把新的option数组传递进来，构造函数要做的就是把传进来的option数组与默认的options数组进行合并，而且要保证新传入的数组优先级较高。这就体现了数组相加的作用。

按照PHP官方的文档说明，两个数组相加时总是从后向前加，即 A+B的结果是B中的元素会覆盖A中键名相同的元素。

```php
$switching = array(         10, // key = 0
                    5    =>  6,
                    3    =>  7,
                    'a'  =>  4,
                            11, // key = 6 (因为之前最大的键名是5)
                    '8'  =>  2, // key = 8 (8是一个整数)
                    '02' => 77, // key = '02'
                    0    => 12  // 键名同样为0的元素（10）将会被替换掉
                  );
```

运算符把右边的数组元素附加到左边的数组后面，两个数组中都有的键名，则只用左边数组中的，右边的被忽略。

```php
<?php
$a = array("a" => "apple", "b" => "banana");
$b = array("a" => "pear", "b" => "strawberry", "c" => "cherry");

$c = $a + $b; // Union of $a and $b
echo "Union of \$a and \$b: \n";
var_dump($c);

$c = $b + $a; // Union of $b and $a
echo "Union of \$b and \$a: \n";
var_dump($c);
```

执行结果：

```php
//Union of $a and $b:
array(3) {
  ["a"]=>
  string(5) "apple"
  ["b"]=>
  string(6) "banana"
  ["c"]=>
  string(6) "cherry"
}
//Union of $b and $a:
array(3) {
  ["a"]=>
  string(4) "pear"
  ["b"]=>
  string(10) "strawberry"
  ["c"]=>
  string(6) "cherry"
}
```
&nbsp;
