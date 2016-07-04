---
title: PHP类实例教程（二十三）：PHP抽象类实现接口
tags:
  - OOP
  - PHP
id: 436
categories:
  - PHP
date: 2013-07-29 21:42:31
---

抽象类实现接口，可以不实现其中的抽象方法，而将抽象方法的实现交付给具体能被实例化的类去处理。

```php
<?php
interface User
{
 function getName();
 function setName($_name);
}
 //此处只是实现了一个接口的一个方法
abstract class abatractNormalUser implements User
{
 protected $name;
 function getName() {
  return $this->name;
 }
}
 //这里实现了接口的另外一个方法
class NormalUser extends abatractNormalUser
{
 function setName($_name) {
  $this->name = $_name;
 }
}
$normaluser = new NormalUser();
$normaluser->setName("tom");
echo "name is " . $normaluser->getName();
?>
```
&nbsp;