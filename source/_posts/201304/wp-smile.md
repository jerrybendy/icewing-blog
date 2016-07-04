---
title: Wordpress非插件实现自定义表情及修改表情目录
tags:
  - wordpress
  - 插件
  - 美化
  - 自定义
  - 表情
id: 206
categories:
  - PHP
date: 2013-04-06 22:00:09
---

或许我们每天都会浏览大量博客，这其中大多数是基于Wordpress的，我们也会留言表示来过，偶尔看到别人博客上漂亮的表情很是心动，或者早已厌倦了Wordpress自带的22个丑到爆的表情，想要换成自己喜欢的风格，下面我们就来实现这种自定义表情！！！

首先你应该准备一些表情图片，不要太大，可以在网上找，也可以去我的百度云盘下载，文章最后有下载地址，里面是52个常用的QQ表情和下面将会用到的代码。

根据个人习惯，我把表情解压到了根目录的res/smilies/文件夹下，这个位置可以自己定义，不过代码要改成自己定义的文件夹路径。

OK，闲话少说，上代码 ！

### 第一步：添加筛选器

打开主题目录下的“functions.php”,找到最后的那个“?>”符号，这是PHP的结束标记。

在这个符号前面添加如下代码：

```php
//添加表情筛选器
add_filter('smilies_src','custom_smilies_src',1,10);
function custom_smilies_src ($img_src, $img, $siteurl){
    return '/res/smilies/'.$img;
```

以上代码里面需要把对应的路径改成自己的路径。

关于add_filter的文档可以参见网友“山的那边很漂亮”的文章：[wordpress之插件 add_filter,add_action()机制](http://blog.163.com/wangzhenbo85@126/blog/static/10136328220126711631317/ "http://blog.163.com/wangzhenbo85@126/blog/static/10136328220126711631317/")

### 第二步：定义表情符号对应的文件名

关于这一步有多种实现方法。

#### 方法一：修改“wp-includes/functions.php”

这个是系统的文件，打开后转到第2426行（至少我的是第2426行）或者搜索“function smilies_init”，可以看到在“$wpsmiliestrans = array(”后面放满了类似':mrgreen:' => 'icon_mrgreen.gif'这种对表情代码和表情文件间的映射，既然我们是自定义表情和表情路径，那么这些自带的映射就完全可以不要了，删除之（注意这些映射前后的括号不能删）。

接下来要做的就是依样画葫芦，把自己的表情标识和文件名之间映射起来，我是用文件名做的标识，即 【‘:tp:’=>’tp.gif’,】，别忘了每两项之间的逗号！

其实稍微懂些PHP的都能看明白，这是定义了一个数组。

#### 方法二：修改主题目录下的“functions.php”

方法一虽然简单直接，但毕竟是修改了系统文件，而对系统文件的任何修改都是不推荐的（如果以后遇到WP升级就会把修改的文件替换掉）。

如果不想修改系统文件可以在主题目录的“functions.php”的最后，即第一步中添加筛选器的后面添加如下代码：

```php
//进行表情定义
if ( !isset( $wpsmiliestrans ) ) {
    $wpsmiliestrans = array(
        ':bs:' => 'bs.gif',
        ':by:' => 'by.gif',
        ':bye:' => 'bye.gif',
        ':bz:' => 'bz.gif',
        ':ch:' => 'ch.gif',
        ':cy:' => 'cy.gif',
    );
}
```

因为篇幅的问题我就不把所有的映射都写完了，可以下载我编写好的代码直接添加。

其实这个方法和方法一是一样的，只是修改的文件不同罢了。

#### 方法三：使用遍历文件夹的方法

这个方法我研究了好久，起初是看到[恋羽的日志](http://www.loveyu.org/?p=1873)上的内容，但不知道是代码有问题还是我把代码放错了位置，一直起不到作用，最后又修改了一下，代码如下：

```php
//使用遍历文件夹的方法添加表情
if (!isset($wpsmiliestrans)){
    $wpsmiliestrans = array();
    $s_path="res/smilies/"; //表情的路径，改成你自己的路径
    $s_filedata=glob("$s_path*.gif"); //这里只针对了gif文件
    foreach($s_filedata as $s_id){
        $s_name=str_replace("$s_path","",$s_id); //文件名
        $s_tage=str_replace(".gif","",$s_name);  //标志
        $wpsmiliestrans[":".$s_tage.":"] = $s_name;
    }
}
```

这里需要把路径改成自己表情文件夹的路径，另外，如果你有除了gif格式的图片外还有别的如jpg格式的图片，可以改成

```php
$s_filedata=glob("$s_path{*.gif,*.jpg}");
```

这段代码的意思是遍历表情文件夹里面的所有gif格式的文件，并把这些文件加入到数组`wpsmiliestrans`中去，如果你的文件命名方法不同请自行修改“文件名”和“标志”行上的代码。

### 第三步：添加表情到评论

添加筛选器和表情定义只是为了能让表情正常显示，接下来还需要把表情添加到评论页。

找到主题文件夹下的“comments.php”文件，在其中搜索“textarea”，这个“textarea”指的是评论框，可以找找附近是否有类似于“<?php include(TEMPLATEPATH . '/includes/smiley.php'); ?>”这句话，如果有就可以直接打开这个“'/includes/smiley.php'”文件，如果没有可以自己在需要的位置添加这么一句，另外再在对应的位置建立一个smiley.php文件。

打开smiley.php，并且把以下代码粘贴进去：

```html
<script type="text/javascript">
/* <![CDATA[ */
    function grin(tag) {
        var myField;
        tag = ' ' + tag + ' ';
        if (document.getElementById('comment') &amp;&amp; document.getElementById('comment').type == 'textarea') {
            myField = document.getElementById('comment');
        } else {
            return false;
        }
        if (document.selection) {
            myField.focus();
            sel = document.selection.createRange();
            sel.text = tag;
            myField.focus();
        }
        else if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;
            var cursorPos = endPos;
            myField.value = myField.value.substring(0, startPos)
                          + tag
                          + myField.value.substring(endPos, myField.value.length);
            cursorPos += tag.length;
            myField.focus();
            myField.selectionStart = cursorPos;
            myField.selectionEnd = cursorPos;
        }
        else {
            myField.value += tag;
            myField.focus();
        }
    }
/* ]]> */
</script>
```

这是javescript的内容，紧接着是把每个表情对应的链接以下面的格式添加：

```html
<a href="javascript:grin(':by:')"><img src="/res/smilies/by.gif" alt=":by:" /></a>
```

或者仍然使用遍历文件夹的方法：

```php
<?php
	global $wpsmiliestrans;
	foreach($wpsmiliestrans as $s_tage => $s_name){
	  echo "<a href=javascript:grin('".$s_tage."')><img src=/res/smilies/".$s_name." alt=".$s_tage."; /></a>";
	}
?>
```

**建议：**除非文件很多的情况下不要使用遍历的方法，因为这样会增加函数调用，理论上会降低代码的执行效率。使用遍历方法的好处是如果以后增加或删除部分表情的话不需要再改代码

### 完成

到这里如果没有什么意外的话已经可以正常运行了，试下吧！

[下载打包好的表情文件及代码](http://pan.baidu.com/share/link?shareid=464634&uk=1610990884)
&nbsp;

参考文档：

恋羽：[自定义增加wordpress表情及修改目录](http://www.loveyu.org/1873.html "自定义增加wordpress表情及修改目录")

万戈：[WordPress 默认的22个表情不够用？](http://wange.im/wordpress-default-22-expression-is-not-enough.html "WordPress 默认的22个表情不够用？")

万戈：[将 WordPress 中的表情符号转化为图片](http://wange.im/convert-smilies-to-pic-in-wordpress.html "将 WordPress 中的表情符号转化为图片")

山的那边很漂亮：[wordpress之插件 add_filter,add_action()机制](http://blog.163.com/wangzhenbo85@126/blog/static/10136328220126711631317/ "http://blog.163.com/wangzhenbo85@126/blog/static/10136328220126711631317/")