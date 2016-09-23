---
title: 【译】React on ES6+
date: 2016-08-30 14:53:28
updated: 2016-08-30 14:53:28
tags:
  - react
  - ES6
categories:
  - 前端
---

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

Right away, you’ll notice a subtle difference – a more terse syntax is available to you when defining classes:

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

Notably, we’ve dropped two parentheses and a trailing semicolon, and for each method declared we omit a colon, a `function` keyword, and a comma.

All of the lifecycle methods but one can be defined as you would expect when using the new class syntax. The class’ `constructor` now assumes the role previously filled by `componentWillMount`:

```js
// The ES5 way
var EmbedModal = React.createClass({
  componentWillMount: function() { … },
});


// The ES6+ way
class EmbedModal extends React.Component {
  constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here
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

ES6 的箭头函数内部没有自己独立的 `this`，所以就使用了外层的 `this`，加上 ES7 的属性初始化语法中的 `this` 总是指向类实例本身，所以函数内的 `this` 自然也就指向了类实例。可以 [点击这里](https://babeljs.io/repl/#?experimental=true&evaluate=true&loose=false&spec=false&code=class%20PostInfo%20extends%20React.Component%20%7B%0A%09handleOptionsButtonClick%20%3D%20(e)%20%3D%3E%20%7B%0A%20%20%20%20this.setState(%7BshowOptionsModal%3A%20true%7D)%3B%0A%20%20%7D%0A%7D) 查看它是如何工作的。

## Dynamic property names & template strings

One of the [enhancements to object literals](https://babeljs.io/docs/learn-es2015/#enhanced-object-literals) includes the ability to assign to a derived property name. We might have originally done something like this to set a piece of state:

```js
var Form = React.createClass({
  onChange: function(inputName, e) {
    var stateToSet = {};
    stateToSet[inputName + 'Value'] = e.target.value;
    this.setState(stateToSet);
  },
});
```

Now, we have the ability to construct objects whose property names are determined by a JavaScript expression at runtime. Here, we use a [template string](https://babeljs.io/docs/learn-es2015/#template-strings) to determine which property to set on state:

```js
class Form extends React.Component {
  onChange(inputName, e) {
    this.setState({
      [`${inputName}Value`]: e.target.value,
    });
  }
}
```

## Destructuring & spread attributes

Often when composing components, we might want to pass down most of a parent component’s props to a child component, but not all of them. In combining ES6+ [destructuring](https://babeljs.io/docs/learn-es2015/#destructuring) with JSX [spread attributes](https://facebook.github.io/react/docs/jsx-spread.html), this becomes possible without ceremony:

```js
class AutoloadingPostsGrid extends React.Component {
  render() {
    var {
      className,
      ...others,  // contains all properties of this.props except for className
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

We can combine JSX spread attributes with regular attributes too, taking advantage of a simple precedence rule to implement overrides and defaults. This element will acquire the `className` “override” even if there exists a `className` property in `this.props`:

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

## Thanks for reading

I hope that you enjoy using ES6+ language features to write React code as much as we do. Thanks to my colleagues for their contributions to this post, and thanks especially to the Babel team for making the future available to all of us, today.

---

via [babelJs.io](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)

