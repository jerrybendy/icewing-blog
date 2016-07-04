---
title: 'JQuery在所有图片加载完成后执行 & 图片的垂直居中'
tags:
  - HTML/CSS
  - JQuery
id: 809
categories:
  - 前端
date: 2013-12-28 23:30:21
updated: 2016-05-22 11:35:25
---

这两天没事的时候在做个小Tab页面玩玩，效果可参见[http://tab.byi.pw](http://tab.byi.pw)，纯粹是做着玩，用来做为自己的主页方便打开各个自己常用的页面。在写HTML/CSS的时候遇到的最大的一个问题就是如何令图片在其父元素内垂直居中，因为父元素的高度固定宽度自适应，而且图片的宽高全部未知，max-width和max-height是90%，在网上找了好多资料，包括Display成table和table-cell都不能完美实现，最后只能尝试着使用JQuery动态来解决了。

思路很简单，就是在网页加载完成后去判断图片的高度和其父容器的高度，用父容器的高度减去图片高度再除以2得到其Top值（需要提前把图片的position设为relative），再用JQ的CSS方法设置Top值即可，部分代码如下：

HTML（使用Bootstrap3.0）：

```html
<div class="col-xs-4 col-md-2">
   <p>
      <img class="favicon" src="http://www.google.com/s2/favicons?domain_url=http://www.icewingcc.com" />
      	冰翼博客
    </p>
    <div class="thumb-box">
      	<a href="http://www.icewingcc.com" class="thumbnail" target="_blank">
             <img src="data/baidu.png" />
        </a>
    </div>
</div>
```

CSS（重写Bootstrap的部分）：

```css
.thumbnail {
	height:120px;
}

.thumbnail>img, .thumbnail a>img {
	display:block;
	max-width:90%;
	max-height:90%;
	position:relative;
}

a.thumbnail:hover, a.thumbnail:focus, a.thumbnail.active {
	background-color:rgba(216, 236, 253, 0.71);
}
```

在写Javascript的时候遇到一个问题：总是有不固定的一两个网站的LOGO的高度返回0，后来仔细查看发现是JQuery代码在网页加载完成后执行，而这个时候有些图片还没有加载完成，所以无法取得这个图片的高度，自然就会返回0。拿着这个问题又是一阵百度Google，也有说用image对象的onload方法什么的，最后发现下面的方法还是挺好用的：

JS：

```js
$(window).on('load',function(){
    	$('.thumbnail').each(function(){
    		imgheight = $(this).children('img').height();
    		divheight = $(this).height();
		$(this).children('img').css('top',(divheight-imgheight)/2);
    	});
});
```



**备注（2014-01-03）：**

上面的JS代码在实际使用的时候出了问题，当图片比较多时就无法正确加载了，于是不得不去寻找新的方法。

因为函数是要在图片加载完成时才能执行的，所以Lazyload很适合。直接在网上下载JQuery Lazyload插件，并修改以下代码。

图片部分：

```html
<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" data-original="图片地址" />
```

这里我使用了一个1象素的GIF图像的代码作为默认图片，实际可以根据自己需要换成别的图片地址甚至动态图片；把原来的图片地址写在“data-original”里面。

JS部分：

```js
$('.thumbnail img').lazyload({
	effect:"fadeIn",
	load:function(){
		imgheight = $(this).height();
		divheight = $(this).parent().height();
		$(this).css('top', (divheight-imgheight)/2);
	}
});
```

关于Lazyload的简单使用方法网上有很多，我也打算再写一篇，在这里只需要知道effect是动态效果，而图片加载完成时的回调函数写在load里面即可。
