---
title: 后台任务和PHP-Resque的使用（四） 使用Worker
tags:
  - bash
  - CLI
  - PHP
  - php-resque
id: 1210
categories:
  - PHP
date: 2015-04-05 11:57:32
updated: 2016-05-22 12:07:43
---

注意，这篇教程仅适用于Linux和OS X的系统，Windows并不适用。

### 理解Worker的本质

技术上讲一个Worker就是一个不断运行的PHP进程，并且不断监视新的任务并运行。

一个简单的Worker的代码如下：

```php
while (true) {
    $jobs = pullData(); // 从队列中拉取任务

    foreach ($jobs as $class => $args) { // 循环每个找到的任务
        $job = new $class();
        $job->perform($args); // 执行任务
    }
    sleep(300); // 等待5分钟后再次尝试拉取任务
}
```

以上这些代码的具体实现都可以交给php-resque。创建一个Worker，php-resque需要以下参数：

*   `QUEUE`: 需要执行的队列的名字
*   `INTERVAL`：在队列中循环的间隔时间，即完成一个任务后的等待时间，默认是5秒
*   `APP_INCLUDE`：需要自动载入PHP文件路径，Worker需要知道你的Job的位置并载入Job
*   `COUNT`：需要创建的Worker的数量。所有的Worker都具有相同的属性。默认是创建1个Worker
*   `REDIS_BACKEND`：Redis服务器的地址，使用 hostname:port 的格式，如127.0.0.1:6379，或localhost:6379。默认是localhost:6379
*   `REDIS_BACKEND_DB`：使用的Redis数据库的名称，默认是0
*   `VERBOSE`：啰嗦模式，设置“1”为启用，会输出基本的调试信息
*   `VVERBOSE`：设置“1”启用更啰嗦模式，会输出详细的调试信息
*   `PREFIX`：前缀。在Redis数据库中为队列的KEY添加前缀，以方便多个Worker运行在同一个Redis数据库中方便区分。默认为空
*   `PIDFILE`：手动指定PID文件的位置，适用于单Worker运行方式

以上参数中只有`QUEUE`是必须的。如果让Worker监视执行多个队列，可以用逗号隔开多个队列的名称，如："queue1,queue2,queue3"，队列执行是有顺序的，如上queue2和queue3总是会在queue1后面被执行。

也可以设置`QUEUE`为`*`让Worker以字母顺序执行所有的队列。

Worker **必须以CLI方式启动**。你不可以从浏览器启动Worker，因为：

*   你无法从浏览器执行后台任务
*   PCNTL扩展只能运行在CLI模式

### 启动Worker

可以从`resque.php`启动Worker，这个位置位于php-resque/bin目录下（也可能不带.php后缀）。

在终端中执行：

```bash
cd /path/to/php-resque/bin/

php resque.php
```

很显然Worker不会被启动，因为缺少必须的参数`QUEUE`，程序将会返回如下错误：

```
Set QUEUE env var containing the list of queues to work.
```

php-resque通过`getenv`获取参数，所以在启动Worker的时候应该传递环境变量过去。所以应该以下面的方式启动Worker：

```bash
QUEUE=notification php resque.php
```

如果启用`VVERBOSE`模式：

```bash
QUEUE=notification VVERBOSE=1 php resque.php
```

终端将会输出：

```
*** Starting worker KAMISAMA-MAC.local:84499:notification
** [23:48:18 2012-10-11] Registered signals
** [23:48:18 2012-10-11] Checking achievement
** [23:48:18 2012-10-11] Checking notification
** [23:48:18 2012-10-11] Sleeping for 5
** [23:48:23 2012-10-11] Checking achievement
** [23:48:23 2012-10-11] Checking notification
** [23:48:23 2012-10-11] Sleeping for 5
... etc ...
```

Worker会自动被命名为`KAMISAMA-MAC.local:84499:notification`，命名的规则是`hostname:process-id:queue-names`。

如果觉得这种启动方式太麻烦且难记，可以自己手动写一个bash脚本来帮助你启动Resque，如：

```bash
EXPORT QUEUE=notifacation
EXPORT VERBOSE=1

php resque.php
```

### 后台运行Worker

通过上面的方法成功启动了Worker，但只有在终端开启的状态下，关闭终端或按下Ctrl+C时Worker就会停止运行。我们可以在命令后面添加一个`&amp;`来使其后台运行。

```bash
QUEUE=notification php resque.php &amp;
```

这样就可以让resque在后台运行。但如果你开启了VERBOSE模式，所有的输出信息将会丢失。所以我们需要在resque后台运行时把输出的信息保存起来。

我们可以使用`nohup`来保持resque后台运行，即使是在用户登出后。

```bash
nohup QUEUE=notification php resque.php &amp;
```

### 记录下Worker的输出

可以使用管道操作的方式重定向输出到文件：

```bash
nohup QUEUE=notification php resque.php >> /path/to/your/logfile.log 2>&amp;1 &amp;
```

这样一来所有的标准及错误输出都会被写入到_logfile.log_文件中。如果需要监视这个文件的内容：

```bash
tail -F /path/to/your/logfile.log
```

### Worker的执行权限

无论何时你在终端中执行命令都是以当前登录用户的权限来执行。如果你登录的jerry的账户，php-resque将会运行于jerry的权限下。以root用户登录时也一样。

如果需要避开当前登录账户以其它用户的权限运行，如Apache通常运行在_www-data_用户下，让php-resque运行于www-data账户：

```bash
nohup sudo -u www-data QUEUE=notification php resque.php >> /path/to/your/logfile.log 2>&amp;1 &amp;
```

操作执行权限时需要注意：

*   通过Worker生成的文件无法被其它用户的php代码读取
*   Worker没有权限创建或编辑其它用户的文件

### Let's play

前面已经讲了如何启动、如何后台运行、以及记录运行日志，下面就用一些例子结束本节的内容。

创建一个执行`default`队列的Worker，并且每隔10秒检索一次任务：

```bash
INTERVAL=10 QUEUE=default php resque.php
```

创建5个执行`default`队列的Worker，每隔5秒检索一次任务：

```bash
QUEUE=default COUNT=5 php resque.php
```

`INTERVAL`参数没有被指定，因为默认值是5秒。

创建一个执行_achievement_和_notification_队列的Worker（需要注意队列名的顺序）：

```bash
QUEUE=achievement,notification php resque.php
```

创建一个执行所有队列的Worker：

```bash
QUEUE=* php resque.php
```

如果你的Redis服务器在别的地址：

```bash
QUEUE=default REDIS_BACKENT=192.168.1.56:6380 php resque.php
```

使用自动载入php文件：

```bash
QUEUE=default APP_INCLUDE=/path/to/autoloader.php php resque.php
```

### 确认你的Worker成功运行了

通过管道操作无法知道Worker是否成功启动，当前通过查看log文件中有没有输出`*** Starting worker .....`的内容也可以知道是否启动。

也可以通过查看系统进程的方法确认Worker是否正在运行。

```bash
ps -ef|grep resque.php
```

将会输出名称中包含`resque.php`的进程，其中第二列是进程的PID。

使用这个方法可以很好的知道Worker是否正在运行，以及有没有意外终止。

### 暂停和停止Worker

要停止一个Worker，直接kill掉它的进程就行了。可以通过`ps -ef|grep resque.php`查看Worker进程的PID。当然通过这个命令你无法知道哪个PID代码的哪个Worker。

如果要结束一个PID是86681的进程：

```bash
kill 86681
```

这个命令将会立即结束掉PID为86681的进程及子进程。如果Worker正在执行一个任务也不会等待任务执行完成（未完成的部分将会丢失）。

有一个可以平滑的停止Worker的方法，可以通过给kill命令发送一个SIGSPEC信号来告诉kill应该怎么做，这需要PCNTL扩展的支持。

当然下面所讲述的所有命令都需要PCNTL扩展支持。

通过PCNTL扩展，Worker可以支持以下信号：

*   `QUIT` - 等待子进程结束后再结束
*   `TERM` / `INT` - 立即结束子进程并退出
*   `USR1` - 立即结束子进程，但不退出
*   `USR2` - 暂停Worker，不会再执行新任务
*   `CONT` - 继续运行Worker

当没有信号发出时默认是`TERM` / `INT`信号。

如果想在所有当前正在运行的任务都完成后再停止，使用`QUIT`信号：

```bash
kill -QUIT YOUR-WORKER-PID
```

结束所有子进程，但保留Worker：

```bash
kill -USR1 YOUR-WORKER-PID
```

暂停和继续执行Worker：

```bash
kill -USR2 YOUR-WORKER-PID

kill -CONT YOUR-WORKER-PID
```

本文由冰翼翻译自[Kamisama.me](http://www.kamisama.me/2012/10/12/background-jobs-with-php-and-resque-part-4-managing-worker)
