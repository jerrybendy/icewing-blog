---
title: 后台任务和PHP-Resque的使用（五） 创建任务
tags:
  - PHP
  - php-resque
id: 1213
categories:
  - PHP
date: 2015-04-06 22:02:32
updated: 2016-12-21 12:08:09
---

到目前为止已经让 Worker 运行了，我们需要创建并添加任务。这一节主要了解什么是任务（Job），以及如何使用任务。

简单的说，任务就是传递给 Worker 要执行的内容。我们需要把 Job 依次添加到 Queue 来执行。

要把任务添加到队列，程序必须要包含 php-resque 库以及 Redis。

使用 `require_once '/path/to/php-resque/lib/Resque.php';`包含 php-resque 的库文件，它会自动连接到 Redis 服务器，如果你的 Redis 服务器不是默认的`localhost:6379`，你需要使用`Resque::setBackent('192.168.1.56:3680');` 这样的格式来设置你的 Redis 服务器的地址，同样 setBackent 支持可选的第二个参数为使用的 Redis 数据库名，默认为 0 。

现在 php-resque 已经准备好了，使用以下代码添加一个任务到队列：

```php
Resque::enqueue('default', 'Mail', array('dest@mail.com', 'hi!', 'this is a test content'));
```

*   第一个参数，'default'是指队列的名字，示例中将会把任务推送到名为 default 的队列中
*   第二个参数是 Job 的类名，表示要执行哪个 Job
*   第三个参数是要发送给 Job 的参数也可以使用关联数组的形式

传递给 Job 的参数（上面第三个参数）可以是普通数组、关联数组的形式，也可以是一个字符串，但使用数组可以很方便的传递更多的信息给 Job。所有的参数在推送到队列前都会经过 `json_encode` 处理。

### 创建一个 Job

如上面的例子中，第一个参数是队列的名字（还记得上一节里面启动 `php resque.php` 时传递的 QUEUE 环境变量吗？），第二个参数是 Job 的类名，即要执行的 Job。Mail 类就是一个 Job 类。

所有的Job类都应该包含一个 `perform()` 方法，使用 `Resque::enqueue()` 传递的第三个参数可以在 `perform()` 方法中使用 `$this->args` 来得到。一个典型的 Job 类如下所示：

```php
class Mail{
	public function perform(){
		var_dump($this->args);
	}
}
```

Job 类也可以包含 `setUp()` 和 `tearDown()` 方法，可选的这两个方法分别会在 `perform()` 方法之前和之后运行。

```php
class Mail{
	public function setUp(){
		# 这个方法会在perform()之前运行，可以用来做一些初始化工作
		# 如连接数据库、处理参数等
	}

	public function perform(){
		# 执行Job
	}

	public function tearDown(){
		# 会在perform()之后运行，可以用来做一些清理工作
	}
}
```

### 包含 Job 类

在实例化 Job 类之前，必须让 Worker 找到并包含这个类。有很多种方法可以做到。

#### 使用 include_path

当 PHP 运行于 Apache model 方式的时候可以使用 `.htaccess` 设置包含：

```
php_value include_path ".:/already/existing/path:/path/to/job-classes"
```

或者通过 `php.ini`

```
include_path = ".:/php/includes:/path/to/job-classes"
```

#### 使用 APP_INCLUDE 包含

上一节说了使用 `APP_INCLUDE` 指定 Worker 执行时要包含的PHP文件的路径，如：

```
QUEUE=default APP_INCLUDE=/path/to/loader.php php resque.php
```

loader.php 的内容可以是下面的那样：

```php
include '/path/to/Mail.php';
include '/path/to/AnotherJobClass.php';
include '/path/to/somewhere/AnotherJobClass.php';
include '/JobClass.php';
```

当然也可以使用 PHP 的 autoloader 方法 —— `sql_autoloader`。

### 在你的项目中使用后台任务

以下面的代码为例，把耗时较多的工作交给后台任务来做。

```php
class User{
    # functions(){}  // 其它函数

    public function updateLocation($location) {
        $db->updateUserTable($this->userId, 'location', $location);
        $this->recomputeNewFriends(); # 此操作耗时较长
    }

    public function recomputeNewFriends() {
        # 查找新的朋友
    }
}
```

把以上代码改成：

```php
class User {
    # functions(){}  // 其它函数

    public function updateLocation($location) {
        $db->updateUserTable($this->userId, 'location', $location);
        # 把任务添加到队列
        # 这里的队列名为 'queueName'
        # 任务名为 'FriendRecommendator'
        Resque::enqueue('queueName', 'FriendRecommendator', array('id' => $this->userId));
    }
}
```

以下是任务 `FriendRecommendator` 类的实现代码：

```php
class FriendRecommendator {
    function perform() {
        # 这里没有User类，需要创建一个User类对象
        $user = new User($this->args['id']);
        # 查找新朋友的操作
    }
}
```

简单的说，你只需要把你的执行任务的代码放到 Job 类中并改名为`perform()`即可，只要你愿意甚至可以将普通类改成 Job 类，但并不推荐这样做。

`perform()` 方法有个缺点，即一个 Job 类只能包含一个 `perform()` 方法，也就是说一个 Job 类只能执行一种后台任务。例如你有一个发送通知信息的后台任务，但又有发送给用户和发送给管理员两个不同的需求，一般来说就得需要两个 Job 类才能实现。不过这里有个小小的 Hack 可以使一个 Job 能执行多个类型的任务。

首先就是给你的 Job 分类，把相似工作的 Job 放在同一个 Job 类中，因为完全不相关的 Job 即使放在同一个类中也没有任何意义。然后通过给 `Resque::enqueue()` 方法传递一个表示不同 Job 的参数过去。

```php
# Job类中的写法
class Notification{
	function sentToUser(){
		# Code..
	}

	function sentToAdmin{
		# code..
	}

	function perform(){
		$action = $this->{array_shift($this->args)};
		if(method_exists($this, $action)){
			$this->$action();
		}
	}
}

# 添加任务时的写法
Resque::enqueue('default', 'Notification', array('sendToAdmin', 'this is content'));
```

也可以使用其它类继承 Job 类以获取相同的 `perform()` 方法，但要注意必须同时包含这些类文件。

另外需要注意的是使用这种 Hack 的方法 `Resque::enqueue()` 的第三个参数必须是一个数组，并且它的第一个元素是要执行的任务的方法名，并且这个元素会在执行时从 `$args` 数组中移除。

必须在每次修改 Job 类后**重新启动你的Worker**。

---

本文由冰翼翻译自[Kamisama.me](http://www.kamisama.me/2012/10/13/background-jobs-with-php-and-resque-part-5-creating-jobs)


