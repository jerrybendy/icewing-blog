---
title: 【译】十个可以使用 ES6 代替的 Lodash 特性
date: 2016-08-30 21:45:09
updated: 2016-09-25 22:20:09
tags:
  - ES6
  - lodash
categories:
  - 前端
---

[Lodash](https://lodash.com/) 应该算是目前在 npm 上被依赖的最多的包了吧，但是如果你使用 ES6，也许你不再需要它。在这篇文章中，我们将尝试使用一些 ES6 的新特性来解决几种常见的问题。

## 1. Map, Filter, Reduce

这些方法使转换数据变得轻而易举，而且非常通用。我们可以使用 ES6 的箭头函数语法，帮助我们用更简短的方式代替 Lodash 的语法。

```js
_.map([1, 2, 3], function(n) { return n * 3; });
// [3, 6, 9]
_.reduce([1, 2, 3], function(total, n) { return total + n; }, 0);
// 6
_.filter([1, 2, 3], function(n) { return n <= 2; });
// [1, 2]

// becomes

[1, 2, 3].map(n => n * 3);
[1, 2, 3].reduce((total, n) => total + n);
[1, 2, 3].filter(n => n <= 2);
```

不仅如此，如果你使用 ES6 的 polyfill，我们还可以使用 [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)、[some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)、[every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every) 以及 [reduceRight](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight) 等方法。

## 2. Head & Tail

[解构语法](https://www.sitepoint.com/preparing-ecmascript-6-destructuring-assignment/) 允许我们轻而易举的获取一个列表的头部或尾部，不需要依赖任何函数。

```js
_.head([1, 2, 3]);
// 1
_.tail([1, 2, 3]);
// [2, 3]

// becomes

const [head, ...tail] = [1, 2, 3];
```

也可以使用类似的方法达到 `initial` 和 `last` 的效果。

```js
_.initial([1, 2, 3]);
// -> [1, 2]
_.last([1, 2, 3]);
// 3

// becomes

const [last, ...initial] = [1, 2, 3].reverse();
```

如果你介意 [reverse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse) 改变了原来的数组，还可以使用另一个解构将原数组复制一份。

```js
const xs = [1, 2, 3];
const [last, ...initial] = [...xs].reverse();
```

## 3. Rest & Spread

[rest](https://lodash.com/docs#rest) 和 [spread](https://lodash.com/docs#spread) 函数允许我们定义可以接收可变数量参数的函数。使用 ES6 可以更完美的支持 rest 和 spread。

```js
var say = _.rest(function(what, names) {
  var last = _.last(names);
  var initial = _.initial(names);
  var finalSeparator = (_.size(names) > 1 ? ', & ' : '');
  return what + ' ' + initial.join(', ') +
    finalSeparator + _.last(names);
});

say('hello', 'fred', 'barney', 'pebbles');
// "hello fred, barney, & pebbles"

// becomes

const say = (what, ...names) => {
  const [last, ...initial] = names.reverse();
  const finalSeparator = (names.length > 1 ? ', &' : '');
  return `${what} ${initial.join(', ')} ${finalSeparator} ${last}`;
};

say('hello', 'fred', 'barney', 'pebbles');
// "hello fred, barney, & pebbles"
```

## 4. Curry （柯里化）

Without a higher level language such as [TypeScript](http://www.typescriptlang.org/) or [Flow](http://flowtype.org/), we can’t give our functions type signatures which makes [currying](https://www.sitepoint.com/currying-in-functional-javascript/) quite difficult. When we receive curried functions it’s hard to know how many arguments have already been supplied and which we will need to provide next. With arrow functions we can define curried functions explicitly, making them easier to understand for other programmers.

```js
function add(a, b) {
  return a + b;
}
var curriedAdd = _.curry(add);
var add2 = curriedAdd(2);
add2(1);
// 3

// becomes

const add = a => b => a + b;
const add2 = add(2);
add2(1);
// 3
```

These explicitly curried arrow functions are particularly important for debugging.

```js
var lodashAdd = _.curry(function(a, b) {
  return a + b;
});
var add3 = lodashAdd(3);
console.log(add3.length)
// 0
console.log(add3);
//function wrapper() {
//  var length = arguments.length,
//  args = Array(length),
//  index = length;
//
//  while (index--) {
//    args[index] = arguments[index];
//  }…

// becomes

const es6Add = a => b => a + b;
const add3 = es6Add(3);
console.log(add3.length);
// 1
console.log(add3);
// function b => a + b
```

If we’re using a functional library like [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide) or [ramda](http://ramdajs.com/) then we can also use arrows to remove the need for the auto-curry style.

```js
_.map(_.prop('name'))(people);

// becomes

people.map(person => person.name);
```

## 5. Partial

Like with currying, we can use arrow functions to make partial application easy and explicit.

```js
var greet = function(greeting, name) {
  return greeting + ' ' + name;
};

var sayHelloTo = _.partial(greet, 'hello');
sayHelloTo('fred');
// "hello fred"

// becomes

const sayHelloTo = name => greet('hello', name);
sayHelloTo('fred');
// "hello fred"
```

It’s also possible to use rest parameters with the spread operator to partially apply variadic functions.

```js
const sayHelloTo = (name, ...args) => greet('hello', name, ...args);
sayHelloTo('fred', 1, 2, 3);
// "hello fred"
```

## 6. Operators

Lodash comes with a number of functions that reimplement syntactical operators as functions, so that they can be passed to collection methods.

In most cases, arrow functions make them simple and short enough that we can define them inline instead.

```js
_.eq(3, 3);
// true
_.add(10, 1);
// 11
_.map([1, 2, 3], function(n) {
  return _.multiply(n, 10);
});
// [10, 20, 30]
_.reduce([1, 2, 3], _.add);
// 6

// becomes

3 === 3
10 + 1
[1, 2, 3].map(n => n * 10);
[1, 2, 3].reduce((total, n) => total + n);
```

## 7. Paths

Many of Lodash’s functions take paths as strings or arrays. We can use arrow functions to create more reusable paths instead.

```js
var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };

_.at(object, ['a[0].b.c', 'a[1]']);
// [3, 4]
_.at(['a', 'b', 'c'], 0, 2);
// ['a', 'c']

// becomes

[
  obj => obj.a[0].b.c,
  obj => obj.a[1]
].map(path => path(object));

[
  arr => arr[0],
  arr => arr[2]
].map(path => path(['a', 'b', 'c']));
```

Because these paths are “just functions”, we can compose them too.

```js
const getFirstPerson = people => people[0];
const getPostCode = person => person.address.postcode;
const getFirstPostCode = people => getPostCode(getFirstPerson(people));
```

We can even make higher order paths that accept parameters.

```js
const getFirstNPeople = n => people => people.slice(0, n);

const getFirst5People = getFirstNPeople(5);
const getFirst5PostCodes = people => getFirst5People(people).map(getPostCode);
```

## 8. Pick

The [pick](https://lodash.com/docs#pick) utility allows us to select the properties we want from a target object. We can achieve the same results using destructuring and shorthand object literals.

```js
var object = { 'a': 1, 'b': '2', 'c': 3 };

return _.pick(object, ['a', 'c']);
// { a: 1, c: 3 }

// becomes

const { a, c } = { a: 1, b: 2, c: 3 };

return { a, c };
```

## 9. Constant, Identity, Noop

Lodash provides some utilities for creating simple functions with a specific behaviour.

```js
_.constant({ 'a': 1 })();
// { a: 1 }
_.identity({ user: 'fred' });
// { user: 'fred' }
_.noop();
// undefined
```

We can define all of these functions inline using arrows.

```js
const constant = x => () => x;
const identity = x => x;
const noop = () => undefined;
```

Or we could rewrite the example above as:

```js
(() => ({ a: 1 }))();
// { a: 1 }
(x => x)({ user: 'fred' });
// { user: 'fred' }
(() => undefined)();
// undefined
```

## 10. Chaining & Flow

Lodash provides some functions for helping us write chained statements. In many cases the built-in collection methods return an array instance that can be directly chained, but in some cases where the method mutates the collection, this isn’t possible.

However, we can define the same transformations as an array of arrow functions.

```js
_([1, 2, 3])
 .tap(function(array) {
   // Mutate input array.
   array.pop();
 })
 .reverse()
 .value();
// [2, 1]

// becomes

const pipeline = [
  array => { array.pop(); return array; },
  array => array.reverse()
];

pipeline.reduce((xs, f) => f(xs), [1, 2, 3]);
```

This way, we don’t even have to think about the difference between [tap](https://lodash.com/docs#tap) and [thru](https://lodash.com/docs#thru). Wrapping this reduction in a utility function makes a great general purpose tool.

```js
const pipe = functions => data => {
  return functions.reduce(
    (value, func) => func(value),
    data
  );
};

const pipeline = pipe([
  x => x * 2,
  x => x / 3,
  x => x > 5,
  b => !b
]);

pipeline(5);
// true
pipeline(20);
// false
```

## Conclusion

Lodash is still a great library and this article only offers a fresh perspective on how the evolved version of JavaScript is allowing us to solve some problems in situations where we would have previously relied on utility modules.

Don’t disregard it, but instead—next time you reach for an abstraction—think about whether a simple function would do instead!


---

via [sitePoint](https://www.sitepoint.com/lodash-features-replace-es6/?utm_source=sitepoint&utm_medium=relatedinline&utm_term=&utm_campaign=relatedauthor)

