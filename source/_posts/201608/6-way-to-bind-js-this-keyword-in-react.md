---
title: 6 Ways to Bind JavaScript’s this Keyword in React, ES6 & ES7
date: 2016-08-29 09:06:01
updated: 2016-08-29 09:06:01
tags:
categories:
---

Javascript’s `this` keyword is the source of a lot of confusion for many developers every single day. Unlike a language with a rigid class model, it’s not always clear what `this` is going to refer to in your code, especially when dealing with callback functions, whose callsites you have no control over.

It’s trivial for some other code to rebind the context of the function you’re working with―using the `new` keyword and some of the methods that are built onto Function.prototype. This introduces an entire class of confusing scenarios and often you’ll see callback driven code scattered with calls to `.bind(this)`.

## The Problem

Because React uses the `this` keyword to reference the component context inside each class, it also inherits this confusion. You’re probably used to seeing code like this inside React components.

```js
this.setState({ loading: true });

fetch('/').then(function loaded() {
  this.setState({ loading: false });
});
```

This code results in a `TypeError` because `this.setState is not a function`. This is because when the callback to the promise is called, the internal context of the function is changed and `this` references the wrong object. Let’s take a look at the ways in which we can prevent this from happening.

## The Options

Some of these alternatives are old techniques that have been used in Javascript for years, others are specific to React and some won’t even work in browsers yet, but we’ll explore them all anyway.

### 1. Alias This

This is approach has been around for a lot longer than React and it involves creating a second reference to the `this` at the top level of the component’s scope.

```js
var component = this;
component.setState({ loading: true });

fetch('/').then(function loaded() {
  component.setState({ loading: false });
});
```

This approach is lightweight and very easy to understand for beginners (although it may not be clear why you did it). It gives you a visual guarantee that you’ll be referring to the correct context.

It feels a bit like you’re working against the semantics of the language itself, but it’s a simple solution and it works well.

### 2. Bind This

The next option we have involves injecting the correct context into our callback function at runtime.

```js
this.setState({ loading: true });

fetch('/').then(function loaded() {
  this.setState({ loading: false });
}.bind(this));
```

All functions in Javascript have a [bind method](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind), which allow you to specify the value for `this`. Once a function has been “bound” the context can’t be overriden, meaning that we have a guarantee that `this` will refer to the correct thing.

This approach is a little bit harder to understand for other programmers and if you’re working with deeply nested, asynchronous code, then you’ll find yourself having to remember to bind each function as you go.

### 3. React Component Methods

React allows you to define arbitrary methods on your component classes and these methods are automatically bound with the correct context for `this` when you create your components with `React.createClass`. This allows you move your callback code out onto your component.

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

This can be a very elegant solution if you aren’t doing much work in your component (you probably shouldn’t be, either!). It allows you to use named functions, flatten your code and forget about having the correct context. In fact, if you try to `.bind(this)` onto a component method, then React will warn you that you’re doing unnecessary work.

> bind(): You are binding a component method to the component. React does this for you automatically in a high-performance way, so you can safely remove this call.

It’s important to remember that this [autobinding doesn’t apply to ES2015 classes](https://facebook.github.io/react/docs/reusable-components.html#no-autobinding). If you use them to declare your components, then you’ll have to use one of the other alternatives.

### 4. ES2015 Arrows

The ES2015 specification introduces the [arrow function syntax](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) for writing function expressions. As well as being terser than regular function expressions, they can also have implicit return and most importantly, they always use the value of `this` from the enclosing scope.

```js
this.setState({ loading: true });

fetch('/').then(() => {
  this.setState({ loading: false });
});
```

Regardless of how many levels of nesting you use, arrow functions will always have the correct context.

Unfortunately, we’ve lost the ability to name our function. This makes debugging harder, as stack traces referring to this function will label it as `(anonymous function)`.

If you are using a compiler like [Babel](http://babeljs.io/) to transform ES2015 code into ES5, then you’ll that there are some interesting qualities to be aware of.

* In some cases the compiler can infer the name of the function if it has been assigned to a variable.
* The compiler uses the Alias This approach to maintain context.

```js
const loaded = () => {
  this.setState({ loading: false });
};

// will be compiled to

var _this = this;
var loaded = function loaded() {
  _this.setState({ loading: false });
};
```

### 5. ES2016 Bind Syntax

There’s currently a proposal for an [ES2016 (ES7) bind syntax](https://github.com/zenparsing/es-function-bind), which introduces :: as a new operator. The bind operator expects a value on the Left-Hand Side and a function on the Right-Hand Side, this syntax binds the RHS function, using the LHS as the value for this.

Take this implementation of `map` for example.

```js
function map(f) {
  var mapped = new Array(this.length);

  for(var i = 0; i < this.length; i++) {
    mapped[i] = f(this[i], i);  
  }

  return mapped;
}
```

Unlike lodash, we aren’t required to pass the data as an argument, allowing us to write code that makes `map` look like a member of our data instead.

```js
[1, 2, 3]::map(x => x * 2)
// [2, 4, 6]
```

Ever been fed up of having to use code like this?

```js
[].map.call(someNodeList, myFn);
// or
Array.from(someNodeList).map(myFn);
```

This operator will allow you to use the map function directly on array-like structures.

```js
someNodeList::map(myFn);
```

We can also make use of this syntax within our React components.

```js
this.setState({ loading: true });

fetch('/').then(this::() => {
  this.setState({ loading: false });
});
```

I’ll be the first to admit that this syntax is a little terrifying.

Whilst it’s interesting to know about this operator, it’s not particularly useful in this context. It suffers from many of the same drawbacks as `.bind(this)` (in fact, that’s what Babel compiles it to) and you’re forced to use it again and again if you nest your code. It’s likely to confuse other programmers of all abilities.

React component context probably isn’t the future of the bind operator, but if you are interested take a look at some of the great projects where it’s being used to great effect (such as [mori-ext](https://www.npmjs.com/package/mori-ext)).

### 6. Method Specific

Some functions allow you to pass an explicit value for `this` as an argument. One example is `map`, which accepts this value as it’s final argument.

```js
items.map(function(x) {
  return <a onClick={this.clicked}>x</a>;
}, this);
```

Whilst this works, it’s not a consistent interface. Most functions don’t accept this parameter, so you’re probably better off favouring the other options discussed here.

## Conclusion

We’ve seen a range of different ways to ensure that you end up with the correct context in your functions, but which one should you use?

If **performance** is a concern, then aliasing `this` is probably going to be the fastest approach. Although you probably won’t notice a difference until you are working with tens of thousands of components and even then, there are many bottlenecks that would arise before it became an issue.

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