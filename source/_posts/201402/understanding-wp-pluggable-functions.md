---
title: Wordpress可扩展函数（pluggable）的作用及用法
tags:
  - wordpress
  - 插件
id: 901
categories:
  - PHP
date: 2014-02-06 21:42:59
updated: 2016-05-22 11:50:20
---

Wordpress核心函数中有一些函数称为可扩展函数（pluggable functions），这些函数都是在wp-include/pluggable.php中被定义的，正如它们的名字一样，我们可以通过插件来重写或者加强它们的功能。

可扩展函数的真正强大之处在于我们可以自定义函数来增强或改变原有函数的行为。在pluggable.php中可以找到这些函数的定义，或者在WP文档[Pluggable Functions](http://codex.wordpress.org/Pluggable_Functions)中找到它们。以下有几个经常被重写的核心函数：

*   `wp_logout`用于登出WP系统，你可以在这里加入一些自定义的操作（如移除自定义SESSION等）。
*   `wp_mail`是被扩展的最多的WP函数，可以通过覆写它来使用自己的邮件模版、使用其它的发送邮件方式（如SMTP）等。
*   `wp_new_user_notification`可以修改新用户注册时发送邮件的方式。
*   `auth_redirect`用于在用户未登录时重定向操作到登录页，可以用它来显示一些自定义的信息。
下面来了解一下如何扩展一个pluggable函数。以wp_logout为例。

### 怎样使用

首先，打开pluggable.php并复制wp_logout函数部分的代码，并且在你的文件里粘贴，默认的代码如下：

```php
if ( ! function_exists( 'wp_logout' ) ) {
    /**
     * Log the current user out.
     *
     * @since 2.5.0
     */
    function wp_logout() {
        wp_clear_auth_cookie();
        do_action( 'wp_logout' );
    }
}
```

下面是重写后的版本：

```php
if ( ! function_exists( 'wp_logout' ) ) {
    /**
     * Log the current user out.
     *
     * @since 2.5.0
     */
    function wp_logout() {
        remove_sessions() ; // 自定义的函数调用
        wp_clear_auth_cookie();
        do_action( 'wp_logout' );
    }

    function remove_sessions() {
        // 在这里移除自定义SESSION和Cookie
    }
}
```

以上仅仅是在自己的插件里面实现了对WP核心函数的重写，并且添加了自定的函数调用。有一个细节性的问题是在函数定义前必须要加上`if(!function_exists('wp_logout')){`，这一行会在定义函数前检查这个函数是否已经在前面被定义过了，如果不加上这句会在函数已被定义的情况下产生一个致命错误。

有一个问题就是在使用了“function_exists”来检测函数是否被定义过时我如何才能知道我写的扩展函数到底是否被执行了呢？这个关系到WP系统的执行顺序，下面会提到。

### 可以在自定义函数中省略“function_exists”的检查吗？

当然可以，不过你需要承担因此带来的一切后果。如果你要重写的函数在其它插件中已经被重写过了，这时就有可能会出现一个PHP致命错误“Cannot redeclare wp_logout()”。所以在重写之前最好还是检查一下函数是否已经被定义过。

既然已经知道了可扩展函数的使用方法，下面就提下这些函数应该被放置在什么位置。

### 可扩展函数的执行顺序

我见过很多人在主题的functions.php中重写pluggable函数，结果没能如预期般正确执行，所以你有必要了解下WP的pluggable函数的执行顺序。

在WP文档的[Action Reference](http://codex.wordpress.org/Plugin_API/Action_Reference)中有提到，这里引用一张图片（虽然是英文）来简单说下可扩展函数的执行顺序。

![wordpress-action-execution-order](https://cdn.icewing.cc/wp-content/uploads/2014/02/wordpress-action-execution-order.png)

&nbsp;

这张图展示了通常的WP函数的执行顺序。基本意思是最先执行必须加载的插件函数，然后是MU插件、已激活的插件、pluggable函数、主题，也就是说pluggable.php会在主题之前被加载。也就是说：

*   所以的自定义扩展函数都应该放在pluggable.php文件被加载之前定义，即在插件中定义；
*   如果插件中没有定义扩展函数，将会默认执行pluggable.php中定义的函数；
*   你无法在主题中定义扩展数，因为主题会在pluggable.php之后加载，此时这些可扩展函数都是已经被定义过的了。
所以我们只能够在插件中来重写这些函数（自己创建一个插件的方式非常简单）。接下来的问题就是如果多个插件中同时重写了同一个可扩展函数时将会怎样呢？这个时候就无法再像我们预期那样执行了，系统总会调用第一次被定义的那个函数。

当然，有一个非主流的并且被称为不推荐使用的方法可以避免上面的问题，并且保证总是调用你的函数，即使用PHP的APD函数。PHP有个函数叫做[rename_function](http://www.php.net/manual/zh/function.rename-function.php)，使用这个函数可以改变一个已经定义的函数的函数名，于是可以衍生出以下用法：

```php
if ( function_exists( 'wp_logout' ) ) { //注意这行没有加叹号
    // 把已被定义过的wp_logout函数改名为wp_logout_orig，并定义自己的wp_logout函数
    rename_function('wp_logout', 'wp_logout_orig');
}

/**
* Log the current user out.
*
* @since 2.5.0
*/
function wp_logout() {
   remove_sessions() ; // Custom Function Call
   wp_clear_auth_cookie();
   do_action( 'wp_logout' );
}

function remove_sessions() {
   // Remove custom session and cookie information
}
```

即在定义这个函数时先检查这个函数是否已经被定义过，如果定义过的话就把这个函数的名字改掉，并重新定义这个函数。

WP的可扩展函数允许我们自己来扩展Wordpress的核心函数，当然它的基本思路还是简单的在定义函数之前检测下这个函数是否已经被定义过，同样的道理我们也可以在自己的主题functions.php中使用这个方法，以方便在子主题中轻松地扩展主题函数。Wordpress系统是在不断更新的，使用可扩展函数的最大实用是可以100%的自定义，并且超出actions可以做到的限度。当然使用这些函数也有不好的地方，如重复定义的问题等。不过可喜的是现在大部分原来必须要重写可扩展函数才能完成的功能逐渐被WP强大的插件体系完善了。如之前必须重写或者修改源代码才能完成的使用SMTP发送邮件的方法现在也可以使用`phpmailer_init`动作来完成了。WP是在不断进步的，还有更多惊喜等着被发现。

部分内容来源于[tutsplus](http://code.tutsplus.com/tutorials/understanding-wordpress-pluggable-functions-and-their-usage--wp-30189)
