---
title: 【译】巧用 CSS 变量实现自动前缀
date: 2016-11-07 09:25:33
updated: 2016-11-07 09:25:33
tags:
  - CSS
categories:
  - 前端
---

> 原文 [http://lea.verou.me/2016/09/autoprefixing-with-css-variables/](http://lea.verou.me/2016/09/autoprefixing-with-css-variables/)

最近，当我在制作 [markapp.io](http://markapp.io/) 这个小网站的时候，我想出一个巧妙的技巧用在 CSS 变量上，我们可以天然地使用它们的动态本质。让我们看一下当你想使用一个属性，但是这个属性有不同的版本，一个无前缀的标准版和一个或多个有前缀的版本的情形。在这里我举一个例子，比如我们使用`clip-path`，[目前](http://caniuse.com/#feat=css-clip-path)需要同时使用无前缀的版本和一个`-webkit-`前缀的版本，我的这个方法可以适用于这种情况，不管这个 CSS 属性是什么，有多少种前缀，只要它不论什么前缀的值都是同样的就可以。

第一步是在所有元素上定义一个 `--clip-path` 属性，值是 `initial`。这样阻止这个属性在每一次使用的时候被继承，而由于 `*` 没有特异性，任何使用了 `--clip-path` 的声明都能被覆盖。然后你定义所有不同版本的属性名，值为 `var(--clip-path)`：

```css
* {
  --clip-path: initial;
  -webkit-clip-path: var(--clip-path);
  clip-path: var(--clip-path);
}
```

这样，在我们需要使用 `clip-path` 的地方，我们都用 `--clip-path` 替代，它可以正常工作：

```css
header {
  --clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 2.5em), 0% 100%);
}
```

甚至连 `!important` 都可以正常工作，因为[它影响 CSS 变量的级联](https://www.w3.org/TR/css-variables/#syntax)。此外，如果由于某些原因你想要明确地设置 `-webkit-clip-path`，你也可以正常写，这也是因为 `*` 是零特异性（意味着是最低优先级的选择符——译者注）。这种用法的主要缺点是要求浏览器必须同时支持你使用的属性和 CSS 变量才能正常工作。不过，[除了 Edge 之外，所有的浏览器都支持 CSS 变量](http://caniuse.com/#feat=css-variables)而 [Edge 也在准备支持它](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/csscustompropertiesakacssvariables/)。除了上面这个问题，我没发现其它的缺点了（除了显然必须使用与标准属性有些不同的属性之外），但是如果你有发现别的坑，请在评论里面留言让我知道！

我想，CSS 变量的巧妙用法还有许多有待发掘。我想要知道这个技巧是否能改进一下让它支持自定义 css 属性全写，比如将 `box-shadow` 分开成 `--box-shadow-x` 和 `--box-shadow-y` 等等，但是目前我还没想到好办法。你有好办法吗？😉

---

> 本文转自：[十年踪迹的博客](https://www.h5jun.com/post/autoprefixing-with-css-variables-lea-verou.html)
> 英文原文地址：[http://lea.verou.me/2016/09/autoprefixing-with-css-variables/](http://lea.verou.me/2016/09/autoprefixing-with-css-variables/)   

