---
title: Polyfills 和 Ponyfills 的区别
date: 2017-03-02 11:06:06
updated: 2017-03-02 11:06:06
tags:
  - Polyfill
categories:
  - 前端
---

今天收到 Github 上一个人发的 [issue](https://github.com/jerrybendy/url-search-params-polyfill/issues/2) 提到了 Polyfill 和 Ponyfill 的区别，找到国外的一遍[文章](https://ponyfoo.com/articles/polyfills-or-ponyfills#ponyfills)，所以就翻译整理了一下。

现在我们基本上都知道 Polyfill 这个词，国内通常翻译做“垫片库”。这个词最早是在 2012 年由 Remy Sharp [提出](https://plus.google.com/+PaulIrish/posts/4okUyAE1qQH)的。Polyfill 通常用于弥补一些在浏览器中没有被支持的特性，为这些特性提供一套后备的解决方案。例如 ES5 对数组新增了 `.map` 和 `.reduce` 方法，而一些不支持 ES5 的浏览器却无法使用这些新的方法。为了让这些不支持 ES5 的浏览器仍然可以使用这些方法，于是就有了第三方的垫片库，如 [`es5-shim`](https://github.com/es-shims/es5-shim)。

但是当谈论到 ES6 时，又会有一连串的问题是 Polyfills 根本无法解决的。例如，你不可能通过 Polyfills 实现 ES6 的箭头函数、Generator、数组展开、class 等特性。但是你可以使用 Polyfill 实现一些其它的特性，如 `Array.of`、`Number.isNaN`、`Object.assign` 等，因为这些不会导致语法的改变。

与 Polyfill 类似，Ponyfill 也用于提供对某些浏览器特性的后备支持，与 Polyfill 类似给浏览器打“补丁”的实现方式，Ponyfill 更像是一个“模块”。Ponyfill 以独立的模块的形式提供对新特性的支持，但不会默认把这些支持“补丁”到浏览器上。下面看个例子。

下面的方法演示写一个用于支持 `String.trim` 的 Polyfill，代码来自 [MDN](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/trim)。

```js
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}
```

具有相同功能的 Ponyfill 实现更像是一个导出下面方法的模块。

```js
function trim (text) {
  return text.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}
```

可以看出来两者非常相似，除了 Ponyfill 不会为缺少的功能打上补丁，也不会做特性是否支持的检测。

所以在用途上我觉得两者都有自己的价值。Polyfill 可以很方便的用在像 `String.prototype.trim` 这样的场景，可以让你直接在 `String` 实例上调用 `trim` 方法。在涉及到对低版本浏览器支持的场景下更推荐使用 Polyfill，因为你不能保证你项目中的依赖有没有使用这些低版本浏览器中不支持的新特性。

---

参考资料：[https://ponyfoo.com/articles/polyfills-or-ponyfills](https://ponyfoo.com/articles/polyfills-or-ponyfills)




