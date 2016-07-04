---
title: 保护文章版权：WordPress复制内容自动添加原文链接
tags:
  - HTML/CSS
  - javascript
  - wordpress
  - 版权
id: 497
categories:
  - PHP
date: 2013-09-01 13:18:34
updated: 2016-05-22 11:29:01
---

这年头，个人博客抄袭成风；某些博主非常不厚道，常常是原封不动地拿过去，不署名来源是常事，还有更可恨的是说成自己的。本站DeveWork.com 为了不必要的纠纷，在网站一开始就搞了个“[版权](http://blog.icewingcc.com/tag/版权)声明”，不仅仅是保护自己，更是警告他人。当然，这些都是防君子不防小人的。下面这个复制文字自动添加版权信息的方法也是如此。

这段代码是在网络上搜索，在某个博客上找到的，当然一看就知道不是他原创的，所以Jeff 也没有必要给出来源；估计都是从老外那里来的；原来的代码有点问题，我修改一下，改成在页脚加载了；该代码其实就是一段[javascript](http://blog.icewingcc.com/tag/javascript) 代码：

### 具体操作过程

1、将以下代码复制到主题下的function.php的最后一个“?>”之前即可。

```php
function add_copyright_text() { ?>
<script type='text/javascript'>
function addLink() {
    var body_element = document.getElementsByTagName('body')[0];
    var selection;
    selection = window.getSelection();
    var pagelink = "<br /><br /> 转载请注明来源: <a href='"+document.location.href+"'>"+document.location.href+"</a>";
    var copy_text = selection + pagelink;
    var new_div = document.createElement('div');
    new_div.style.left='-99999px';
    new_div.style.position='absolute';
    body_element.appendChild(new_div );
    new_div.innerHTML = copy_text ;
    selection.selectAllChildren(new_div );
    window.setTimeout(function() {
        body_element.removeChild(new_div );
    },0);
}
document.oncopy = addLink;
</script>
<;?php
}
add_action( 'wp_footer', 'add_copyright_text');

```

也可以直接将javascript 代码放到合适的位置。

需要常常分享代码的就建议不要这么做了，不然人家复制段代码都有行说明文字，实在不友好。

2、保存文件后，随便网站上的一个文章，复制一些内容粘贴后，发现复制内容后面多了一条“原文链接”。需要常常分享代码的就建议不要这么做了，不然人家复制段代码都有行说明文字，实在不友好。

### 

文章来源：[http://devework.com/wordpress-copyright-protection.html](http://devework.com/wordpress-copyright-protection.html)