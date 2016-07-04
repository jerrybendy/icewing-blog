---
title: Laravel 5 自定义环境变量
date: 2016-05-21 23:11:00
updated: 2016-05-21 23:11:00
tags:
  - laravel
categories:
  - PHP
---

Laravel 5 中提供了一种通过`.env`文件定义环境变量的方式，根据官方文档的说明应该在不同的环境下使用不同的`.env`文件，并且此文件不应该提交到版本控制中去。如此设定自然是为了方便不同的环境或者多名开发人员完全可以使用自已的`.env`环境变量。

但是官方文档中对于如何自定义`.env`文件中的环境变量却提的很少。文档中只提及了在需要自定义环境变量时最好是在`.env.example`文件中写一份变量的定义，以方便其他开发人员配置。

下面就以我的“遭遇”来讲下 Laravel 5 中如何自定义环境变量。

（内容比较啰嗦，可直接跳到最后[环境变量的正确用法](#环境变量的正确用法)部分）

## 问题
因为我需要路由里面根据不同的二级域名选择不同的控制器，而测试环境和生产环境中的顶级域名不同，于是我打算把顶级域名作为一项环境变量写在`.env`文件中。

```conf .env
APP_BASE_URL=test.com
```

路由中的写法（为了演示我把路由的处理直接写成了闭包，而实际用于生产环境的代码是不能写成闭包的，原因就是路由缓存不支持闭包，不打算使用路由缓存的可以无视）：

```php route.php

$_app_base_url = env('APP_BASE_URL');

Route::group(['domain' => "u.{$_app_base_url}"], function() {
    Route::get('/', function(){
    	return "TEST";
    });
});
```

恶梦就此开始。

## `env()`函数与`$_ENV`超全局变量

这种写法本身是没有任何问题的，访问`u.test.com`，在开发环境中一切正常。然后使用命令`php artisan config:cache`生成配置缓存后却出现了找不到控制器的错误。经过调试发现`$_app_base_url`的输出值是`null`。

`env()`函数的作用是从`$_ENV`超全局变量中取出对应的值，而 Laravel 在启动的时候又会自动加载`.env`文件中的信息到`$_ENV`超全局变量中，所以如果没问题的话在`$_ENV`环境变量中应该能找到刚才定义的环境变量。

```php
var_dump($_ENV);
```

输出了很多环境变量的信息，但。。。没有看到任何在`.env`里面定义的信息。难道信息没有被加载到`$_ENV`？于是尝试清除配置缓存：`php artisan config:clear`后再尝试，发现`.env`里面的信息确实被加载到了`$_ENV`超全局变量中。。。

看来这个问题和配置缓存脱不了关系了。

## 配置缓存
Laravel 中为了加快程序的执行效率做了很多缓存优化的工作，其中就包括配置缓存、路由缓存等，通过把多个零碎的配置文件合并成一个大的配置文件来减少加载的文件数量，从而加快运行速度（如果你研究过PHP的性能的话就会知道IO操作其实占了很大一部分开销）。

Laravel 的配置缓存被保存在`bootstrap/cache/config.php`文件中。打开这个文件可以看到这个文件就是把`config`文件夹的所有文件合并成了一个大的配置文件。`config.php`直接返回一个数组，数组的键名对应`config`文件夹下的文件名，数组的值对应`config`文件夹下文件返回的配置信息。

找遍整个配置文件发现没有任何和`.env`文件里面的定义相关的内容。

难道`env()`函数会从配置缓存中读取数据，因为这个文件里面没有对应的数据所以才返回`null`？抱着这个想法去查看`env()`的源码，发现这个函数和配置缓存没任何关系。。。

## `.env`文件的加载
这时我产生一个想法：有没有可能是框架检测存在配置缓存文件时就不去加载`.env`了呢？

如果是这样的话框架源码里面肯定会有地方去判断`bootstrap/cache/config.php`文件是否存在。

直接在`vendor`里面搜`cache/config.php`，果然找到在`vendor/laravel/framework/src/Illuminate/Foundation/Application.php`的第836行（关于文件和行的信息都是基本我现在使用的 Laravel 5.2.31，版本号不同具体位置也可能不同）：

```php Application.php
    /**
     * Get the path to the configuration cache file.
     *
     * @return string
     */
    public function getCachedConfigPath()
    {
        return $this->bootstrapPath().'/cache/config.php';
    }
```

`getCachedConfigPath()`函数返回了这个配置缓存文件的路径。继续查找这个函数，发现除了控制台部分外共有两个地方使用了这个函数，分别是`Illuminate\Foundation\Bootstrap\LoadConfiguration::LoadConfiguration`和`Illuminate\Foundation\Application::configurationIsCached`。前者是判断如果配置缓存文件存在就包含它，并不再从`config`文件夹下加载配置文件；后者是定义了一个`configurationIsCached()`函数用于返回配置缓存文件是否存在。

根据线索继续查找`configurationIsCached()`函数，找到了唯一的调用方：`vendor/laravel/framework/src/Illuminate/Foundation/Bootstrap/DetectEnvironment.php`的第19行：

```php DetectEnvironment.php
class DetectEnvironment
{
    /**
     * Bootstrap the given application.
     *
     * @param  \Illuminate\Contracts\Foundation\Application  $app
     * @return void
     */
    public function bootstrap(Application $app)
    {
        if (! $app->configurationIsCached()) {
            $this->checkForSpecificEnvironmentFile($app);

            try {
                (new Dotenv($app->environmentPath(), $app->environmentFile()))->load();
            } catch (InvalidPathException $e) {
                //
            }
        }
    }
    
    // ......
}
```

在`bootstrap()`中可以看到，这里会检查配置缓存文件是否存在，如果不存在就会去加载`.env`文件，否则就什么都不做。正好验证了前面的猜测：在生成配置缓存之后就不会去加载`.env`文件了。

（通过上面代码中的`$this->checkForSpecificEnvironmentFile($app);`往下跟踪，发现还可以使用`.env.APP_ENV`的方式定义跟随环境的配置信息，例如`.env`中如果定义了`APP_ENV=local`的话，在加载环境变量时也会尝试加载`.env.local`文件）。

## `.env`应该什么时候被加载？
至此应该是真相大白了。那么`.env`应该什么时候被加载呢？

当然开发环境中不需要生成配置缓存，所以每次请求都会重新加载和解析`.env`文件并设置到`$_ENV`超全局变量中。生产环境中呢？

这时另一个猜想产生了：既然`bootstrap/cache/config.php`缓存文件中没有关于环境变量的信息，并且系统没有尝试加载`.env`文件，会不会有可能是已经把环境变量保存到了`config.php`缓存文件中了呢？如果真的是这样的话，那么`env()`函数就只能在`config/*.php`中的配置文件里面被调用（因为生成了配置缓存后就不再加载环境变量，程序的其它地方再去访问环境变量是得不到`.env`里面的信息的）。

全局搜索`env(`，猜对了，果然只在`config`文件夹里面的文件中使用这个函数，其它地方是没有调用过的。

综合整理一下上面的过程，也就是说如果在`.env`里面自定义了一个环境变量，就需要在`config`文件夹下的任意一个配置文件中把这个环境变量添加进去，这样生成的配置缓存中才会包含这个信息。

## 环境变量的正确用法

好吧，只能说明是我认为是正确的用法。

首先肯定是要在自己的`.env`文件中定义这个环境变量：

```code .env
APP_BASE_URL=test.com
```

然后还需要把这个环境变量的定义写到`.env.example`文件中，以方便团队协作时其他成员能更好的理解你定义的这个变量。

然后很重要的一步，你还需要把这个环境变量写到配置文件中去。因为生成配置缓存时加载配置文件的过程是遍历整个`config`文件夹，所以你可以在`config`文件中任意新建一个PHP文件用来保存自己定义的环境变量，或者修改现有的任一配置文件。

就以新建配置文件为例吧，在`config`文件夹下新建`demo.php`文件：

```php demo.php
<?php

return [
	'app_base_url'  => env('APP_BASE_URL', 'default value'),
];
```

是的，我们是在这个配置文件中调用的`env()`函数。这样在生成配置缓存时就会在这里读取环境变量。

命令行执行；

```bash
php artisan config:cache
```

然后再打开`bootstrap/cache/config.php`文件，会发现其中多了一部分:

```php config.php
//.......
'demo' => array(
    	'app_base_url'  => 'test.com',
	),
```

至此自定义环境变量的过程已经圆满结束。当然因为使用了配置缓存，所以在程序中需要读取自定义环境变量的时候也就不能使用`env()`函数。内容存储在配置中，自然要用`config()`函数。

上面的例子：

```php route.php

$_app_base_url = config('demo.app_base_url');

Route::group(['domain' => "u.{$_app_base_url}"], function() {
    Route::get('/', function(){
        return "TEST";
    });
});
```

`config()`函数使用点号作为分隔符，点号前面部分是配置文件名（例子中配置文件是`demo.php`，所以是`demo`），点号后面是配置项的键名（`app_base_url`）。

## 总结
总结就是如果你想同时使用自定义环境变量和配置缓存的话，你就需要自定义一个配置项来读取环境变量的值。

最后记得不要忘了把创建配置缓存命令写到你的构建脚本或自动部署中。

