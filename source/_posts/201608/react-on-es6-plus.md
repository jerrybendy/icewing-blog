---
title: 【译】React on ES6+
date: 2016-08-30 14:53:28
updated: 2016-09-23 22:50:28
tags:
  - react
  - ES6
categories:
  - 前端
---

> 本文由冰翼博客翻译自 [babelJs.io](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)
> 原文作者： Steven Luscher （[Github](https://github.com/steveluscher)）



在重新设计 [Instagram Web](https://instagram.com/instagram/) 的最近一年里，我们享受到很多使用 ES6+ 新特性写 React 组件的好处。下面我整理了一些可以方便写 React 应用语言特性，相信这会使工作变得更轻松愉快。

## 类

迄今为止我想在写组件时最能直观看到的变化就是 ES6+ 类的使用。关于 ES6 的类定义语言可 [参考这里](https://babeljs.io/docs/learn-es2015/#classes)。现在，我们可以写一个继承自 `React.Component` 的类来取代 `React.createClass` 的写法。

```js
class Photo extends React.Component {
  render() {
    return <img alt={this.props.caption} src={this.props.src} />;
  }
}
```

当然，你会发现一些细小的变化 —— 在定义类的时候可以使用一些更简短的语法：

```js
// The ES5 way
var Photo = React.createClass({
  handleDoubleTap: function(e) { … },
  render: function() { … },
});


// The ES6+ way
class Photo extends React.Component {
  handleDoubleTap(e) { … }
  render() { … }
}
```

尤其是我们去掉了两个圆括号和一个分号，每一个方法的声明我们都省略了一个冒号、一个 `function` 关键字和一个逗号。

几乎所有的生命周期方法，（`componentWillMount` 除外）都可以使用新的类语法定义。`componentWillMount` 需要写在组件的初始化代码中。

```js
// The ES5 way
var EmbedModal = React.createClass({
  componentWillMount: function() { … },
});


// The ES6+ way
class EmbedModal extends React.Component {
  constructor(props) {
    super(props);
    // 这里可以进行一些组件初始化的工作，componentWillMount 也移到这里执行
  }
}
```

## 属性初始化

在 ES6+ 类的世界中，`propTypes` 以及组件的默认值都可以作为类本身的静态属性存在。类似的，组件中初始化 state 也可以使用 ES7 的 [属性初始化](https://gist.github.com/jeffmo/054df782c05639da2adb)：

```js
// The ES5 way
var Video = React.createClass({
  getDefaultProps: function() {
    return {
      autoPlay: false,
      maxLoops: 10,
    };
  },
  getInitialState: function() {
    return {
      loopsRemaining: this.props.maxLoops,
    };
  },
  propTypes: {
    autoPlay: React.PropTypes.bool.isRequired,
    maxLoops: React.PropTypes.number.isRequired,
    posterFrameSrc: React.PropTypes.string.isRequired,
    videoSrc: React.PropTypes.string.isRequired,
  },
});


// The ES6+ way
class Video extends React.Component {
  static defaultProps = {
    autoPlay: false,
    maxLoops: 10,
  }
  static propTypes = {
    autoPlay: React.PropTypes.bool.isRequired,
    maxLoops: React.PropTypes.number.isRequired,
    posterFrameSrc: React.PropTypes.string.isRequired,
    videoSrc: React.PropTypes.string.isRequired,
  }
  state = {
    loopsRemaining: this.props.maxLoops,
  }
}
```

ES7 的属性初始化代码将会在类的构造函数中被加载，在这里 `this` 指向类对象本身，所以在初始化 state 的代码中可以直接使用 `this.props`。尤其是我们不再需要使用一个 getter 的函数来定义 prop 的默认值和 state 对象。

## 箭头函数

`React.createClass` 会执行一些额外的绑定工作以确保在组件内部 `this` 能够指向组件本身。

```js
// 自动绑定
var PostInfo = React.createClass({
  handleOptionsButtonClick: function(e) {
    // 这里, 'this' 指向组件本身
    this.setState({showOptionsModal: true});
  },
});
```

当我们使用 ES6+ 的类语法时就不会再需要 `React.createClass` 提供的这种辅助绑定，下面可以看到我们将要自己手动执行绑定的过程：

```js
// 在任何需要的地方都需要手动绑定
class PostInfo extends React.Component {
  constructor(props) {
    super(props);
    // 手动绑定方法到组件实例
    this.handleOptionsButtonClick = this.handleOptionsButtonClick.bind(this);
  }
  handleOptionsButtonClick(e) {
    // 需要确保 this 指向组件实例
    this.setState({showOptionsModal: true});
  }
}
```

幸运的时，结合两个 ES6+ 的新特性 —— [箭头函数语法](https://babeljs.io/docs/learn-es2015/#arrows) 和属性初始化语法将会使这种绑定变得轻而易举：

```js
class PostInfo extends React.Component {
  handleOptionsButtonClick = (e) => {
    this.setState({showOptionsModal: true});
  }
}
```

ES6 的箭头函数内部没有自己独立的 `this`，所以就使用了外层的 `this`，加上 ES7 的属性初始化语法中的 `this` 总是指向类实例本身，所以函数内的 `this` 自然也就指向了类实例。可以 [点击这里](https://goo.gl/MQW2rf) 查看它是如何工作的。

> *注：如果上面的短网址打不开的话可以 [点击这里](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-2&experimental=true&loose=false&spec=false) 打开 babel 的 REPL 环境，并在左侧输入以下内容，右侧即可显示编译后的内容：

```js
class PostInfo extends React.Component {
  handleOptionsButtonClick = (e) => {
   this.setState({showOptionsModal: true});
  }
}
```

## 动态属性名 & 模板字符串

其中一个 [对象字面量增强](https://babeljs.io/docs/learn-es2015/#enhanced-object-literals) 的特性使我们有可以分配一个分离的属性名，在此之前我们可能会像下面这样定义 state 的一部分：

```js
var Form = React.createClass({
  onChange: function(inputName, e) {
    var stateToSet = {};
    stateToSet[inputName + 'Value'] = e.target.value;
    this.setState(stateToSet);
  },
});
```

现在我们可以在写一个对象字面量的时候直接使用一个 Javascript 表达式来表示对象的 key。这里我们使用一个 [模板字符串](https://babeljs.io/docs/learn-es2015/#template-strings) 来表示新 state 的 key：

```js
class Form extends React.Component {
  onChange(inputName, e) {
    this.setState({
      [`${inputName}Value`]: e.target.value,
    });
  }
}
```

## 解构 & 属性展开

通常，当我们组合组件时，我们可能会想从父组件中传递很多 prop 到子组件，但不一定是全部。基于 ES6+ 的 [解构赋值语法](https://babeljs.io/docs/learn-es2015/#destructuring) 和 JSX 的 [属性展开语法](https://facebook.github.io/react/docs/jsx-spread.html) ，现在我们可以更随意的去写：

```js
class AutoloadingPostsGrid extends React.Component {
  render() {
    var {
      className,
      ...others,  // 包含 this.props 的全部，除了 className 
    } = this.props;
    return (
      <div className={className}>
        <PostsGrid {...others} />
        <button onClick={this.handleLoadMoreClick}>Load more</button>
      </div>
    );
  }
}
```

我们也可以结合 JSX 属性展开语法和普通属性，利用一个简单的优先规则实现覆盖和默认。
This element will acquire the `className` “override” even if there exists a `className` property in `this.props`:

```js
<div {...this.props} className="override">
  …
</div>
```

This element will regularly have the `className` “base” unless there exists a `className` property in `this.props` to override it:

```js
<div className="base" {...this.props}>
  …
</div>
```

## 感谢阅读

希望你可以享受更多 ES6+ 新特性带来的写 React 组件的乐趣。感谢所有为这篇文章做过贡献的人，更要感谢 Babel 的团队让我们可以在今天用到这么多未来的新特性。


