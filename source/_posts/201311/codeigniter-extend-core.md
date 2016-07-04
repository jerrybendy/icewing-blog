---
title: CodeIgniter中对同一个核心类的多次扩展
id: 771
categories:
  - PHP
date: 2013-11-12 22:33:44
tags:
  - CodeIgniter
---

CodeIgniter提供了对核心类进行扩展的方法，默认情况下是添加MY_前缀（当然这个前缀是可以改的），但是很多情况下我们可能需要对同一个核心类多次扩展，例如：我们可能需要在网站的所有后台管理页面的开头加上用户身份认证的代码，当后台有多个文件时就相当于有多个入口，而我们却不得不对每个控制器类文件的构造函数中添加身份认证的代码，很显然这样不利用代码的重用，而且不易于维护。

还好，CI提供了扩展核心类的方法，这就意味着我们可以通过在Application/core中创建一个“MY_Controller”文件来扩展Controller类，然后在这个类的构造函数中进行身份认证，管理部分的控制器只需要继承自这个类就可以了。

问题是网站上不可能只有管理员，还需要在前台页面对用户的身份加以认证，可以再扩展一个Controller类吗？例如一个MY_Controller，一个MY_Admin_Controller？答案是否定的，“System/Core/Codeigniter.php”中有这样一段代码 ：

```php
if (file_exists(APPPATH.'core/'.$CFG->config['subclass_prefix'].'Controller'.EXT))
{
    require APPPATH.'core/'.$CFG->config['subclass_prefix'].'Controller'.EXT;
}
```

就是说CI只会查找MY_Controller文件，别的文件不会被加载，如此一来该如何对默认的Controller类进行多次扩展呢？

有一个取巧的方法：既然CI的启动的时候会加载MY_Controller这个类，当然就是加载了“MY_Controller.php”这个文件，既然整个文件都加载了，理论上即使这个文件中包含多个类也会同时被加载，呵呵。方法很简单，就是<span style="color: #ff0000;">在“MY_Controller.php”这个文件中写两个类</span>，我试过，这样确实可行，只要你在继承的时候别继承错父类就可以了。

如果非想一个文件一个类的话依据上面的方法也可以，就是在“MY_Controller.php”的开头加上“ require_once(dirname(__FILE__) . '/' . 'admin_controller.php');”即可。

还有另一个方法，是我在博客园上看到的，就是只使用这一个扩展核心类，只是在这个扩展的类的构造函数中去<span style="color: #ff0000;">判断网址的段</span>，代码如下：

```php
class MY_Controller extends CI_Controller {
    function __construct(){
        parent::__construct();
        if( $this->uri->segment(1) === 'admin' ){
               ...
        }
    }
}
```
&nbsp;
