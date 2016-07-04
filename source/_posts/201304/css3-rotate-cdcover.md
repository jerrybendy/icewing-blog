---
title: CSS3打造不断旋转的CD封面
tags:
  - CSS3
  - HTML/CSS
id: 247
categories:
  - 前端
date: 2013-04-28 16:51:39
updated: 2016-05-22 11:17:04
---

最初看到这个效果是在一个音乐站，[http://jing.fm](http://jing.fm)，这个网站的界面做得非常不错，音乐也很有风格。当我第一次进入这个网站时最感兴趣的还是中间那个不断旋转的光盘封面，就想知道它是如何运作的，以及如何能把它也放在我的网站首页上面以增加效果，具体的效果可以去jing.fm看下，用新浪微博账号即可登录。

我提取的效果仅仅包含了使其旋转的部分代码，并没有包括中间的暂停按钮，可以到这里去[查看演示以及源代码](http://demo.icewingcc.com/FM/index.html "查看示例")。

演示中用的图片及CSS代码全部从jing.fm提取，我只是对它做了一些简化。再者由于本人刚接触网页不太久，很多东西还不能得到深刻的认识，目前就先分享一些简单的内容。

会CSS的人从源码都能看懂它的工作方式，我只解释一些我自己学习过程中有疑惑的地方，如果有不懂的可以留言。

### 一、原本是一个矩形的光盘封面如何被嵌入到一个圆形的区域中

这是我刚开始最小知道的问题，怎样能用CSS把图形嵌入到一个形状中，后来研究图片发现它是把一个中间镂空的PNG图形放在了最上面，把封面放在下面一层，使用position:absolute进行定位，使CD封面处于镂空的中间位置，这样看起来就好像是把封面嵌入到了背景里面。

### 二、如何使背景图形位于CD封面的上方

看图片发现所谓的背景图形只是其中一部分，使用z-index把它的层次调高，让CD封面的层次靠下，这样背景图形就位于CD封面上面了。

### 三、如何让CD封面不断自动旋转

这个是重点。研究CSS3的时候发现有一个transform效果可以使图形旋转，并且可以指定旋转中心（当然这里旋转中心就是图形的中央，所以不需要特别指定），使用transform:rotate(360deg)可以使图形旋转一周，但并不能让它持续旋转。在使用FireBug查看jing.fm里面的元素样式的时候找到一个animation可以控制旋转但复制下来后却起不到作用。

后来查看w3School上的CSS3教程得知animation应该是和keyframe配套的，在animation上需要指定效果的名称。继续查找jing.fm的CSS样式，最后终于找到了关键代码，即：

```css
@keyframes rotate{
from{-webkit-transform:rotate(0deg)}
to{-webkit-transform:rotate(360deg)}
}
```

animation效果里面就是调用这个rotate。animation里面有一个选项是可以控制效果循环的次数的，当然，设成无限循环就行了。整体代码如下：

CSS

```css
@-webkit-keyframes rotate{
from{-webkit-transform:rotate(0deg)}
to{-webkit-transform:rotate(360deg)}
}
@-moz-keyframes rotate{
from{-moz-transform:rotate(0deg)}
to{-moz-transform:rotate(360deg)}
}
@-ms-keyframes rotate{
from{-ms-transform:rotate(0deg)}
to{-ms-transform:rotate(360deg)}
}
@-o-keyframes rotate{
from{-o-transform:rotate(0deg)}
to{-o-transform:rotate(360deg)}
}

.tupain{
background-image: url(img/cd.jpg);
background-repeat: no-repeat;
animation: 9.5s linear 0s normal none infinite rotate;
-webkit-animation:9.5s linear 0s normal none infinite rotate;
height: 300px;
width: 300px;
position: absolute;
top: 74px;
left: 73px;
z-index: 0;
}

.zhezhao{
background:url(img/playerMask.png) no-repeat;
height:430px;
width:430px;
z-index:1;
position:absolute;
}
```

HTML
```html
<div>
    <div class="zhezhao"></div>
    <div class="tupian"></div>
</div>
```