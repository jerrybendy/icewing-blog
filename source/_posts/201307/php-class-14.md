---
title: PHP类实例教程（十四）：设计模式之单件模式
tags:
  - OOP
  - PHP
id: 403
categories:
  - PHP
date: 2013-07-13 12:36:58
---

单件模式要解决的问题就是“如何让这个类只有一个实例”。

我们的web应用中，大量使用了数据库连接，如果反复建立与数据库的连接必然消耗更多的系统资源。

我们如何解决这个问题，建立唯一的数据库连接是必要的方式。

我们又如何知道与这个数据库的连接是否已经建立？ 还是需要现在建立？

单件模式可以解决这个问题。

先假设我们需要一个类完成在内存中只有一份的功能，我们该如何做呢？

我们一步一步的使用前面学过的知识来写一个单件的例子。

**问题1：**

前面学过，每次用new 类名的方式，就可以创建一个对象。

我们必须禁止外部程序用 new 类名的方式来创建多个实例。

**解决办法：**

我们将构造函数设置成private ，让构造函数只能在内部被调用，而外部不能调用。

这样，这个类就不能被外部用 new 的方式建立多个实例了。

不能被外部用new实例化的类。

```php
<?php
class A
{
    private function __construct() {
    }
}
?>
```

**问题2：**

我们已经禁止外部用new实例化这个类，我们改如何让用户访问这个类呢?前门堵了，我们需要给用户留个后门。

**解决办法：**

static 修饰的方法，可以不经实例化一个类就可以直接访问这个方法。

后门就在这里。

```php
<?php
class A
{
    private function __construct() {
    }
    static function getClassA() {
    return "这里是后门，可以通过这里进入这个类的内部";
    }
}
echo A::getClassA();
?>
```

**问题3：**

虽然我们已经进入类内部，但我们要的是这个类的唯一实例？

先不管别的，我们先需要一个实例。

通过这个static的方法返回这个实例，如何做呢？

**解决办法：**

private的构造函数，不能被外部实例化。

但是我们已经成功潜入类的内部了（间谍？007？），我们在内部当然可以调用private的方法创建对象。

我们这样做看看。

下面的例子我们确实返回了A类的实例，但注意两次执行返回的不是同一个实例。

```php
<?php
class A
{
    private function __construct() {
    }
    static function getClassA() {
        $a = new A();
        return $a;
    }
}
$a1 = A::getClassA();
$a2 = A::getClassA();
echo "/$a1的类是" . get_class($a1) . ", /$a2是" . get_class($a2);
if ($a1 === $a2) {
    echo "<br />/$a1 /$a2指向同一个对象。";
} else {
    echo "<br />/$a1 /$a2不是同一个对象。";
}
?>
```

**问题4：**

我们已经通过static方法返回了A的实例。但还有问题。

我们如何保证我们多次操作获得的是同一个实例的呢？

**解决办法：**

static的属性在内部也只有一个。

static 属性能有效的被静态方法调用。

将这个属性也设置成private，以防止外部调用。

先将这个属性设置成 null。

每次返回对象前，先判断这个属性是否为null 。

如果为null 就创建这个类的新实例，并赋值给这个 static 属性。

如果不为空，就返回这个指向实例的static 属性。

```php
<?php
class A
{
    private static $link = null;
    private function __construct() {
    }
    static function getClassA() {
        if (null == self::$link) {
            self::$link = new A();
        }
        return self::$link;
    }
}
$a1 = A::getClassA();
$a2 = A::getClassA();
echo "/$a1的类是" . get_class($a1) . ", /$a2是" . get_class($a2);
if ($a1 === $a2) {
    echo "<br />/$a1 /$a2指向同一个对象。";
} else {
    echo "<br />/$a1 /$a2不是同一个对象。";
}
?>
```

到此，我们写了一个最简单的单件模式 。

现在，你可以尝试写一个应用单件设计模式的数据库连接类。

要记住单件模式的使用效果和书写方式。

&nbsp;

转自：http://blog.csdn.net/klinghr/article/details/5212933