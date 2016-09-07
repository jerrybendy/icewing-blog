---
title: 6 种方法在 React 中绑定 javascript 的 this 关键字（ES6/ES7）
date: 2016-08-29 09:06:01
updated: 2016-08-29 09:06:01
tags:
  - javascript
  - ES6
  - ES7
categories:
  - 前端
---

Javascript 中的 `this` 关键字对很多 JS 开发者来说都是令人疑惑、头痛东西，很多时候往往搞不清楚某个 `this` 究竟指的是谁，尤其是在多层回调嵌套的情况下，OH GOD!!

It’s trivial for some other code to rebind the context of the function you’re working with―using the `new` keyword and some of the methods that are built onto `Functon.prototype`. This introduces an entire class of confusing scenarios and often you’ll see callback driven code scattered with calls to `.bind(this)`.



## 问题

因为 React 使用 `this` 关键字在内部引用组件上下文，也就带来了关于 `this` 的一些困惑。你很可以见过或写过下面这样的代码：

```js
this.setState({ loading: true });

fetch('/').then(function loaded() {
  this.setState({ loading: false });
});
```

这段代码会返回一个 `TypeError`，因为 `this.setState is not a function`。这是因为在 promise 的回调中，函数执行的上下文已经改变，`this` 指向了错误的对象（这时 `this` 指回调函数本身）。下面我们来看下如何避免这种问题的发生。

## 解决方案

有一些可选的解决方案已经被使用了很多年，还有一些是仅适用于 React 的，甚至有些方案在浏览器环境下是不能使用的。我们先来看一下。

### 1. 为 `this` 创建别名

这个应该算是被使用最多的一种方法了吧。在函数的顶部为 `this` 创建一个别名，并在组件内部通过这个别名访问 `this`。

```js
var component = this;
component.setState({ loading: true });

fetch('/').then(function loaded() {
  component.setState({ loading: false });
});
```

这种方法很轻量，并且易于理解。使用一个有意义的别名可以很轻松的使用上下文 `this`。

### 2. bind this

第二种方法是运行时在回调函数上绑定我们自己的上下文环境。

```js
this.setState({ loading: true });

fetch('/').then(function loaded() {
  this.setState({ loading: false });
}.bind(this));
```

从 ES5 开始，所有 Javascript 函数都有一个[bind 方法](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind)，可以允许在函数执行的时候重新为函数内部绑定一个 `this`。一旦函数绑定了上下文 `this` 就不可以被重写，也就意味着绑定的上下文环境总是正确的。

这种方式对于其它语言的开发者来说可能很难理解，尤其在有多层函数嵌套时使用 `bind`，这时候就只能凭借自己的理解和记忆来记住究竟哪个 `this` 指的哪个对象。

### 3. React 组件方法

React 可以使用 `createClass` 创建一个组件类对象，组件类对象里的方法会自动绑定到组件的上下文环境，所以你可以直接在这里使用 `this`。这样可以允许把回调直接写在组件里。

```js
React.createClass({
  componentWillMount: function() {
    this.setState({ loading: true });

    fetch('/').then(this.loaded);
  },
  loaded: function loaded() {
    this.setState({ loading: false });
  }
});
```

如果你的组件内部不需要做太多工作的话，想必这会是一种非常优雅的方案。这能允许你使用命名的方法、可以使你的代码更加扁平化，并且忘记 `this` 上下文这回事。事实上，如果你尝试在组件方法中使用 `.bind(this)`， React 将会警告你正在做一件不必要的工作。

> bind(): You are binding a component method to the component. React does this for you automatically in a high-performance way, so you can safely remove this call.

很重要的是，这种方式并[不适用于 ES6 类语法的创建的 React 组件](https://facebook.github.io/react/docs/reusable-components.html#no-autobinding)。 如果你正在使用 ES6 的类语法创建 React 组件，可以尝试下后面的方法。

### 4. ES2015（ES6）箭头语法

ES2015 中新加入了[箭头语法](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions)用来更方便的写函数表达式。箭头语法除了可以以更简短的方式写函数外，还有一些很重要的特性，例如箭头语法创建的函数体中没有 `this` 而总是使用外部的 `this` 对象。

```js
this.setState({ loading: true });

fetch('/').then(() => {
  this.setState({ loading: false });
});
```

无论多少层的函数嵌套，箭头函数中总是使用正确的 `this` 上下文。

很不幸的是，这样我们将无法命名我们的函数。这会使调试变得更困难，调用栈中将会显示这是一个 `(anonymous function)` （匿名函数）。

如果你使用 [Babel](http://babeljs.io/) 转换 ES6 的代码到 ES5，你将会发现一些比较有趣的现象。

* 有些情况下编译器会通过变量名推理出函数名
* 编译器是通过为 `this` 创建别名的方法来保持上下文

```js
const loaded = () => {
  this.setState({ loading: false });
};

// 将会被编译为

var _this = this;
var loaded = function loaded() {
  _this.setState({ loading: false });
};
```

### 5. ES2016 （ES7）的绑定语法

这是一个 ES7 的提案，[ES2016（ES7）的绑定语法](https://github.com/zenparsing/es-function-bind)，使用两个冒号(`::`)作为新的操作符。绑定操作符要求左侧是一个值，并且右侧是需要处理的函数，使用这种语法相当于把双冒号左侧的数值绑定到右侧处理函数的 `this` 上下文中。

下面通过 `map` 来举个简单的例子：

```js
function map(f) {
  var mapped = new Array(this.length);

  for(var i = 0; i < this.length; i++) {
    mapped[i] = f(this[i], i);  
  }

  return mapped;
}
```

不同于 lodash，我们不需要在参数中传递数据，这使 `map` 函数看起来更像是数据的一个成员方法。

```js
[1, 2, 3]::map(x => x * 2)
// [2, 4, 6]
```

是不是曾经像下面这下写过？

```js
[].map.call(someNodeList, myFn);
// or
Array.from(someNodeList).map(myFn);
```

ES7 绑定操作符允许你直接在类数组结构上使用 `map` 函数。

```js
someNodeList::map(myFn);
```

我们也可以在 React 组件中使用这种语法：

```js
this.setState({ loading: true });

fetch('/').then(this::() => {
  this.setState({ loading: false });
});
```

可能我会是第一个站出来承认这种语法会让人觉得恐惧的人。

了解这个操作符会觉得很有趣，虽然它不是专为这种使用场景而生的。它解决了很多由于`.bind(this)`产生的缺点（事实上 babel 最终还是会将它编译成 `.bind(this)`），在解决很多层的嵌套代码中 `this` 的问题时可以放心的使用这种方式。当然这可能会使用其它开发人员有些困惑。

React component context probably isn’t the future of the bind operator, but if you are interested take a look at some of the great projects where it’s being used to great effect (such as [mori-ext](https://www.npmjs.com/package/mori-ext)).


### 6. 函数指定

有些函数可以在执行时手动为它指定上下文的 `this`，例如 `map`，它接受的最后一个参数将会作为回调函数内的 `this`。

```js
items.map(function(x) {
  return <a onClick={this.clicked}>x</a>;
}, this);
```

虽然这可以解决问题，但却不存在通用性。因为大部分的函数是不能接受重新指定的 `this` 的。

## 总结

上面我们说了一些上下文中使用正确的 `this` 的方法。如果担心**性能**问题，为 `this` 创建别名将会是最快的方法（由于箭头函数在编译后与创建别名相同，所以使用 ES6 的箭头函数也是很好的选择）。当然，也许直到你的界面有上万个组件也许都不会看到这种性能差别，也许到那时 `this` 的问题也不会成为真正的瓶颈。

If you’re more concerned about **debugging**, then use one of the options that allows you to write named functions, preferably component methods as they’ll handle some performance concerns for you too.

At [Astral Dynamics](http://astraldynamics.co.uk/), we’ve found a reasonable compromise between mostly using named component methods and arrow functions, but only when we write very short inline functions that won’t cause issues with stack traces. This allows us to write components that are clear to debug, without losing the terse nature of arrow functions when they really count.

Of course, this is mostly subjective and you might find that you prefer to baffle your colleagues with arrow functions and bind syntax. After all, who doesn’t love reading through a codebase to find this?

```js
this.setState({ loading: false });

fetch('/')
  .then((loaded = this::() => {
    var component = this;
    return this::(() =>
      this::component.setState({ loaded: false });
    }).bind(React);
  }.bind(null)));
```

----

via [sitepoint](https://www.sitepoint.com/bind-javascripts-this-keyword-react/)

