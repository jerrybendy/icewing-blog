---
title: 不用更新Discuz缓存就可以快速调试模板的方法
tags:
  - discuz
  - 模板
  - 缓存
id: 565
categories:
  - PHP
date: 2013-09-14 22:57:09
---

我们在制作Discuz模板的时候经常会遇到一个问题，就是每次修改CSS或者htm文件后都必须要在后台更新缓存后再可以看出来效果，这样就严重地降低了我们的工作效率，今天我给大家分享的这个不用更新缓存的方法其实是看的cr180的视频里面的，虽然视频里面没有提及到这个用处。

Discuz是一个多入口的程序，关于单一入口和多入口可以参见我之前分享的文章《{% post_link "php-only-entry-feature" "PHP单一入口的特有作用2" %}》，既然是一个多入口的程序这样就给了我们一个创建自定义入口的机会，在cr180的教程里面当然也提到了创建自定义入口，即：复制论坛根目录下任一入口文件，如forum.php、portal.php、group.php等，并重新命名为自己需要的名字，然后修改里面定义的APPTYPEID和CURSCRIPT常量等。这两个常量可以改成任何自定义的值，当然最好不要与系统自带的重复，不然会发生什么我也不知道。

下面是我修改好的一个入口文件，可以把代码复制下来并粘贴到一个新建的php文件中去：


```php
<?php
define('APPTYPEID', 431); //可以改成任一自己的ID
define('CURSCRIPT', 'icetest'); //可以改成任一名称

require './source/class/class_core.php';
$cachelist = array();

C::app()->cachelist = $cachelist;
C::app()->init();

runhooks();

$navtitle = '123456'; //新窗口的标题

include template('diy:index');
?>
```

如上：带有注释的三行可以根据需要自行修改。

顺带提一下最后一行，template函数的参数中，“diy:”的意思是页面可以被DIY，加上这4个字符就会在页面的右上角出来一个“自定义”按钮，后面的“index”是指模板目录下的index.htm或者index.php文件，如果文件不存在就会报错。所以需要在您新建的模板目录下放置这个文件并且在后台中把当前风格切换成新建的这个。cr180的教程里在index前面加上了模板目录名，但是这样会多了一层文件夹，好处是无需在后台设置当前风格。

举个例子，例如我们新建的模板目录名是./template/ice_test/，那么以上代码中的“index”就是指./template/ice_test/index.htm（或php），如果此处文件不存在的话就会查找./template/default/index.htm（或php）；而cr180的例子中最后一行代码是`include template('diy:ice_test/index')`，这样系统就会去查找./template/ice_test/ice_test/index.htm，没错，多了一层目录。

关于index.htm里面应该写什么内容就随你了，要善用“{subtemplate }”函数，如自动加载header、footer并带有一个DIY区域的写法：

```html
<!--{subtemplate common/header}-->

<!--[diy=diy1]--><div id="diy1" class="area"></div><!--[/diy]-->

</div>

<!--{subtemplate common/footer}-->
```

其它页面方法一样，看着来好啦！
