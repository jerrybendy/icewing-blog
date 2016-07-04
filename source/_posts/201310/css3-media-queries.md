---
title: CSS3 Media Queries实现响应式网页设计
tags:
  - CSS3
  - query
  - 响应式布局
id: 739
categories:
  - 前端
date: 2013-10-21 00:37:48
---

### 在页面的头部调用独立的样式表

**一、最大宽度Max Width**
```html
<link rel="stylesheet" media="screen and (max-width:600px)" href="small.css" type="text/css" />
```

上面表示的是：当屏幕小于或等于600px时，将采用small.css样式来渲染Web页面。

**二、最小宽度Min Width**
```html
<link rel="stylesheet" media="screen and (min-width:900px)" href="big.css" type="text/css" />
```

上面表示的是：当屏幕大于或等于900px时，将采用big.css样式来渲染Web页面。

**三、多个Media Queries使用**
```html
<link rel="stylesheet" media="screen and (min-width:600px) and (max-width:900px)" href="style.css" type="text/css" />
```

Media Query可以结合多个媒体查询，换句话说，一个Media Query可以包含0到多个表达式，表达式又可以包含0到多个关键字，以及一种Media Type。正如上面的其表示的是当屏幕在600px-900px之间时采用style.css样式来渲染web页面。

**四、设备屏幕的输出宽度Device Width**
```html
<link rel="stylesheet" media="screen and (max-device-width: 480px)" href="iphone.css" type="text/css" />
```

上面的代码指的是iphone.css样式适用于最大设备宽度为480px，比如说iPhone上的显示，这里的max-device-width所指的是设备的实际分辨率，也就是指可视面积分辨率

**五、iPhone4**
```html
<link rel="stylesheet" media="only screen and (-webkit-min-device-pixel-ratio: 2)" type="text/css" href="iphone4.css" />
```

上面的样式是专门针对iPhone4的移动设备写的。

**六、iPad**
```html
<link rel="stylesheet" media="all and (orientation:portrait)" href="portrait.css" type="text/css" />

<link rel="stylesheet" media="all and (orientation:landscape)" href="landscape.css"  type="text/css" />
```

在大数情况下，移动设备iPad上的Safari和在iPhone上的是相同的，只是他们不同之处是iPad声明了不同的方向，比如说上面的例子，在纵向(portrait)时采用portrait.css来渲染页面；在横向（landscape）时采用landscape.css来渲染页面。

**七、android**
```html
/*240px的宽度*/
<link rel="stylesheet" media="only screen and (max-device-width:240px)" href="android240.css" type="text/css" />

/*360px的宽度*/
<link rel="stylesheet" media="only screen and (min-device-width:241px) and (max-device-width:360px)" href="android360.css" type="text/css" />

/*480px的宽度*/
<link rel="stylesheet" media="only screen and (min-device-width:361px) and (max-device-width:480px)" href="android480.css" type="text/css" />
```

我们可以使用media query为android手机在不同分辨率提供特定样式，这样就可以解决屏幕分辨率的不同给android手机的页面重构问题。

**八、not关键字**
```html
<link rel="stylesheet" media="not print and (max-width: 1200px)" href="print.css" type="text/css" />
```

not关键字是用来排除某种制定的媒体类型，换句话来说就是用于排除符合表达式的设备。

**九、only关键字**
```html
<link rel="stylesheet" media="only screen and (max-device-width:240px)" href="android240.css" type="text/css" />
```

only用来定某种特定的媒体类型，可以用来排除不支持媒体查询的浏览器。其实only很多时候是用来对那些不支持Media Query但却支持Media Type的设备隐藏样式表的。其主要有：支持媒体特性（Media Queries）的设备，正常调用样式，此时就当only不存在；对于不支持媒体特性(Media Queries)但又支持媒体类型(Media Type)的设备，这样就会不读了样式，因为其先读only而不是screen；另外不支持Media Qqueries的浏览器，不论是否支持only，样式都不会被采用。

**十、其他** 在Media Query中如果没有明确指定Media Type，那么其默认为all，如：
```html
<link rel="stylesheet" media="(min-width: 701px) and (max-width: 900px)" href="medium.css" type="text/css" />
```

另外还有使用逗号（，）被用来表示并列或者表示或，如下
```html
<link rel="stylesheet" type="text/css" href="style.css" media="handheld and (max-width:480px), screen and (min-width:960px)" />
```

上面代码中style.css样式被用在宽度小于或等于480px的手持设备上，或者被用于屏幕宽度大于或等于960px的设备上。

### CSS文件中@media引入

**使用max-width**
```css
@media screen and (max-width: 600px) {
    /* CSS Styles */
}
```

**使用min-width**
```css
@media screen and (min-width: 900px) {
    /* CSS Styles */
}
```

** max-width和min-width的混合使用**
```css
@media screen and (min-width: 600px) and (max-width: 900px) {
    /* CSS Styles */
}
```

同时CSS3 Media Queries还能查询设备的宽度“device-width”来判断样式的调用，这个主要用在iPhone,iPads设备上，比如像下面的应用： **iPhone和Smartphones上的运用**

```css
/* iPhone and Smartphones (portrait and landscape) */
@media screen and (min-device-width : 320px) and (max-device-width: 480px) {
    /* CSS Styles */
}
```

max-device-width指的是设备整个渲染区宽度（设备的实际宽度），而 max-width 指的是可视区域分辨率。 **iPad上的运用**

```css
/* iPads (landscape) */
@media screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : landscape) {
    /* CSS Styles */
}
/* iPads (portrait) */
@media screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : portrait) {
    /* CSS Styles */
}
```

针对移动设备的运用，如果你想让样式工作得比较正常，需要在“”添加“viewport”的meta标签：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

上面针对不同的分辨率，不同的移动设备类型做了不同定义，可能我们在实际的使用中用不着这么详细的去区分不同的设备。 比如针对电脑访问的就制定一个大于800到1280，超过1280的，就显示一个大分类的样式。 移动端访问的，设置小于320的，320-480的，480-800的等等。 目前很多wordpress主题实现是一个主题兼容小屏手机到大屏电脑，虽然这种精神还是值得嘉奖的，但是方式却是不怎么可取的。 所谓的支持小屏手机，更多的是调整排版布局，但是其实很多元素其实并不适合在手机等小屏上展示，那样的交互也并不友好。为移动设备优化了样式表并不意味着你的网站就适合在移动设备显示了。要做到真正的移动设备优化，要削减图像大小、缩减手机上不必展示的元素和加载的资源尺寸等等。CSS3 Media Queries 是用于设计的呈现，而不是优化。 所以，通过CSS3 Media Queries再去定制真正的移动样式才是应该去做的。

转自：[威言威语]()
