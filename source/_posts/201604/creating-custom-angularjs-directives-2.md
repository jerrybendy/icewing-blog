---
title: 创建自定义angularJS指令（二）- 独立作用域
date: 2016-04-03 22:25:14
updated: 2016-04-07 22:30:14
tags:
  - AngularJS
  - 指令
categories:
  - 前端
---

![AngularJs](https://cdn.icewing.cc/201604%2FAngularJS_thumb_1008B166.jpg)

------

一、 {% post_link creating-custom-angularjs-directives-1 基础 %}
二、 {% post_link creating-custom-angularjs-directives-2 独立作用域 %}
三、 {% post_link creating-custom-angularjs-directives-3 独立作用域和函数参数 %}
四、 {% post_link creating-custom-angularjs-directives-4 transclude与restrict %}
五、 {% post_link creating-custom-angularjs-directives-5 link函数 %}
六、 {% post_link creating-custom-angularjs-directives-6 使用控制器 %}
七、 {% post_link creating-custom-angularjs-directives-7 Creating a Unique Value Directive using $asyncValidators
 %}

-----




在这个系列的第一篇文章中介绍了AngularJS自定义指令以及一些简单的例子，这篇文章我们去了解下AngularJS的**独立作用域**，以及独立作用域在创建自定义指令时有多重要。

## 什么是独立作用域？

默认情况下，指令是可以直接访问父作用域中的属性的。例如，下面的指令依靠父作用域来输出一个自定义对象的`name`和`street`属性：

```js
angular.module('directivesModule').directive('mySharedScope', function () {
    return {
        template: 'Name: {{customer.name}} Street: {{customer.street}}'
    };
});
```

虽然这可以完成工作，但在实际使用中你必须要知道和这个指令相关的父作用域的很多信息来确保指令能够正常工作，或者仅仅使用`ngInclude`和HTML模板来完成同样的事情（这在上一篇文章中已经讨论过了）。这样做的问题在于如果父作用域作了一点改变，这个指令很可能就不再有用了。

如果你想创建一个可重用的指令，你当然不能让指令去依赖父作用域的任何属性而是使用**独立作用域**来代替它们。这是一个对比**共享作用域**和**独立作用域**的示意图：

![共享作用域和独立作用域对比图](https://cdn.icewing.cc/201604%2Fimage_29E6A765.png)

通过上面的示意图可以看到共享作用域允许父作用域向下延伸到指令中。独立作用域在这种方式下是不能工作的，独立作用域就像在你的指令一圈围上一堵墙，父作用域无法直接翻过围墙访问指令内容的属性。就好像下面这样：

![](https://cdn.icewing.cc/201604%2Fimage_74DCA8E5.png)

## 在指令中创建独立作用域

在指令中创建独立作用域是很简单的：只需要在指令中添加一个`scope`参数即可。像下面代码中所示，这会自动为指令创建一个独立的作用域。

```js
angular.module('directivesModule').directive('myIsolatedScope', function () {
    return {
        scope: {},
        template: 'Name: {{customer.name}} Street: {{customer.street}}'
    };
});
```

现在作用域是独立的了，上面例子中来自父作用域中的`customer`对象在指令中将无法使用。当这个指令被用在下个视图中将会有以下输出（注意`name`和`street`的值没有被输出）：

**Name: Street:**


既然独立作用域切断了与父作用域通信的桥梁，那么我们该如何处理与父作用域之间的数据交换呢？我们可以使用`@`、`=`以及`&`符号来定义作用域，这一眼看起来似乎有些奇怪，但熟练使用后会发现不算太糟。下面我们就来看一下这些符号如何使用。

## 本地作用域属性介绍

独立作用域提供3个不种的方式用来与外部作用域之间进行交互。这三种方式通过在指令的`scope`属性中指定不同的标识符来实现，这三个标识符分别是`@`、`=`和`&`。下面看一下它们是如何工作的。

### `@`本地作用域属性

`@`被用来读取在指令外部的字符串值。例如，一个控制器可能在`$scope`对象上定义一个`name`属性，你需要在指令里面读取这个`name`的值，就可以使用`@`来完成，通过下图我们来进一步讲解：

![](https://cdn.icewing.cc/201604%2Fimage_0D02A3F2.png)

1. 在控制器中定义`$scope.name`；
2. `$scope.name`属性需要在指令中可读；
3. 指令在独立作用域中定义一个本地作用域属性`name`（注意这个属性名可以是任意符合要求的名字，没必要与外部作用域中的相同）。使用`scope: {name: '@'}`即可；
4. `@`字符告诉指令这个新的`name`属性是一个来自外部作用域的字符串值。如果外部作用域中这个`name`的值被修改了，指令中的这个值也会自动更新；
5. 包含这个指令的视图可以通过`name`属性绑定值到指令。

下面是一个整合起来的例子，假设下面的控制器在一个app中被定义：

```js
var app = angular.module('directivesModule', []);

app.controller('CustomersController', ['$scope', function ($scope) {
    var counter = 0;
    $scope.customer = {
        name: 'David',
        street: '1234 Anywhere St.'
    };
            
    $scope.customers = [
        {
            name: 'David',
            street: '1234 Anywhere St.'
        },
        {
            name: 'Tina',
            street: '1800 Crest St.'
        },
        {
            name: 'Michelle',
            street: '890 Main St.'
        }
    ];

    $scope.addCustomer = function () {
        counter++;
        $scope.customers.push({
            name: 'New Customer' + counter,
            street: counter + ' Cedar Point St.'
        });
    };

    $scope.changeData = function () {
        counter++;
        $scope.customer = {
            name: 'James',
            street: counter + ' Cedar Point St.'
        };
    };
}]);
```

指令创建一个独立作用域，允许从外部作用域中绑定`name`属性：

```js
angular.module('directivesModule')
.directive('myIsolatedScopeWithName', function () {
    return {
        scope: {
            name: '@'
        },
        template: 'Name: {{ name }}'
    };
});
```

可以像下面这样使用这个指令：

```html
<div my-isolated-scope-with-name name="{{ customer.name }}"></div>
```

注意`$scope.customer.name`的值是如何绑定到指令独立作用域中的`name`属性上去的。

代码将会输出如下：

**Name: David**

如前面提到的，当`$scope.customer.name`的值改变时，指令将会立即自动作出改变。然而，如果是指令内部修改了它自己的`name`属性的话，外部作用域中的`$scope.customer.name`值是不会作出改变的。如果你需要让独立作用域中的值与外部作用域中的值保持同步，你需要使用`=`来代替`@`。

有一点也比较重要的是，如果你想让指令独立作用域中的`name`属性与绑定到视图上的属性不同，你可以使用下面的替代语法：

```js
angular.module('directivesModule')
.directive('myIsolatedScopeWithName', function () {
    return {
        scope: {
            name: '@someOtherName'
        },
        template: 'Name: {{ name }}'
    };
});
```

这样的话在指令内部将使用`name`属性，而在外部的数据绑定中将使用`someOtherName`代替`name`，数据绑定写法如下：

```html
<div my-isolated-scope-with-name some-other-name="{{ customer.name }}"></div>
```

我一般更偏向于让独立作用域中的属性名与视图中绑定的属性名保持一致，所以我一般不使用这种写法。然而，这在某些场景下可以保持系统弹性。这在使用`@`、`=`以及`&`定义本地作用域时都是有效的。

### `=`本地作用域属性

`@`在只需要给指令传递字符串值时很方便实用，但在需要把在指令中对值的改变反映到外部作用域时却无能为力。在需要创建在指令的独立作用域和外部作用域中的双向绑定时，你可以使用`=`字符，如下图：

![](https://cdn.icewing.cc/201604%2Fimage_134C0B31.png)

1. 在控制器中定义`$scope.person`对象；
2. `$scope.person`对象需要通过创建双向绑定的方式传入到指令中；
3. 指令创建一个自定义本地的独立作用域属性`customer`，通过使用`scope: {customer: '='}`完成；
4. `=`告诉指令传入指令本地作用域中的对象需要使用双向绑定的方式。如果外部作用域中的属性值变动，指令本地作用域中的值也会自动更新；如果指令中修改了这个值，外部作用域中对应的也会同步被修改；
5. 指令内的视图模板现在可以绑定到独立域的`customer`属性。

下面是一个使用`=`的例子：

```js
angular.module('directivesModule').directive('myIsolatedScopeWithModel', function () {
    return {
        scope: {
            customer: '=' // 双向数据绑定
        },
        template: '<ul><li ng-repeat="prop in customer">{{ prop }}</li></ul>'
    };
});
```

在这个例子中，指令使用一个对象作为`customer`属性的值，并且使用`ngRepeat`遍历`customer`对象的所有属性最后将其输出到`<li>`元素中。

使用下面的方式给指令传递数据：

```html
<div my-isolated-scope-with-model customer="customer"></div>
```

需要注意下，在使用`=`本地作用域属性时你不能像使用`@`时那样使用`{{ customer }}`，而是直接使用属性名（不需要双花括号）。在上面的例子中，`customer`对象被直接放在的`customer`属性里。指令使用`ngRepeat`遍历`customer`对象的所有属性并输出它们。将会输出以下内容：

* **David**
* **1234 Anywhere St.**

### `&`本地作用域属性

在学习使用`&`之前你需要先了解如何使用`@`本地作用域属性传递一个字符串值给指令，并且知道如何通过`=`本地作用域属性完成指令与外部作用域中对象的双向绑定。最后一个本地作用域属性是使用`&`字符来绑定一个外部函数。

`&`本地作用域属性允许指令调用方传递一个可被指令内部调用的函数。例如，假设你在写一个指令，终端用户点击指令中的一个按钮并需要在控制器中触发一个事件。你不能把点击事件硬编码在指令的代码内部，这样的话外部的控制器就无法知道指令内部到底发生了什么。在需要时触发一个事件可以很好的解决这个问题（使用`$emit`或`$broadcast`），但是控制器需要知道具体侦听的事件名是什么所以也不是最优的。

更好的方法是让指令的消费者传递给指令一个在需要时可以被调用的函数。每当指令检测到指定的操作（例如检测当用户点击一个按钮）时它可以调用传递给它的函数。这种方式指令的消费者拥有100%的控制权，能完全知道指令中发生了什么，并委托控制函数传入指令。下面是一张简易示意图：

![](https://cdn.icewing.cc/201604%2Fimage_0986A3B9.png)

1. 在控制器中定义一个叫做`$scope.click`的函数；
2. `$scope.click`函数需要传入到指令中，目的是使指令在按钮点击时可以调用这个函数；
3. 指令创建一个叫做`action`的自定义本地作用域属性。使用`scope: {action: '&'}`可以做到。在这个例子中，`action`仅仅相当于`click`的一个别名。当`action`被调用，`click`也会被调用；
4. `&`字符从根本上来说相当于： “嘿，给我一个函数我可以在指令中发生某些事件时调用它”；
5. 指令中的模板可以包含一个按钮，当按钮被点击时，`action`（外部函数的引用）函数将会被调用。

下面是一个使用`&`的例子：

```js
angular.module('directivesModule')
.directive('myIsolatedScopeWithModelAndFunction', function () {
    return {
        scope: {
            datasource: '=',
            action: '&'
        },
        template: '<ul><li ng-repeat="prop in datasource">{{ prop }}</li></ul> ' +
                  '<button ng-click="action()">Change Data</button>'
    };
});
```

需要注意的是下面的来自指令模板代码引用到`action`本地作用域函数并且在按钮被点击时调用。

```html
<button ng-click="action()">Change Data</button>
```

下面是使用这个指令的例子。当然更建议为指令起一个短一点的名字。

```html
<div my-isolated-scope-with-model-and-function 
     datasource="customer" 
     action="changeData()">
</div>
```

被传入到指令`action`属性的`changeData()`函数在控制器中定义，控制器的定义和文章前面的一样，`changeData()`函数定义如下：

```js
$scope.changeData = function () {
      counter++;
      $scope.customer = {
          name: 'James',
          street: counter + ' Cedar Point St.'
      };
};
```

## 结尾

在这个系列的文章中你将会看到一些关键点，如模板、独立作用域、本地作用域属性等。创建独立作用域只需要在指令定义中添加一个`scope`属性，值为一个对象即可。一共有三种本地作用域属性可用，分别是：

* `@` 用来传递一个字符串值到指令
* `=` 用于创建一个双向绑定的对象
* `&` 允许传入一个可被指令内部调用的函数


## 译者注

`scope`属性的值可以为一个bool型，值为`false`时不使用独立作用域，和不写此属性没区别。

`scope`中定义的属性名要使用驼峰命名的方式，而在模板中使用的时候要使用连字符语法，假设有一个指令叫`datePicker`，`scope`部分定义如下：

```js
scope: {
	isOpen: "="，
	currentDate: "=",
	onChange: "&"
}
```

视图中使用方式如下（假设引号里面的函数和作用域属性是已经在控制器中定义的）：

```html
<div date-picker
		is-open="openState"
		current-date="currentDate"
		on-change="dateChange()"
		></div>
```	

另外，如果`scope`中的一些属性是可选的（如上面例子中，`isOpen`默认为false，指令的使用者可以选择不传递这个属性），在使用这个指令的时候AngularJS就会报错，也就是说`scope`定义的属性在调用指令时都需要被传递（不传递会报错，但不影响程序运行）。解决这个问题的话可以在可选参数后面加一个问号`?`标识这个属性是可选的，修改后的指令`scope`部分如下：

```js
scope: {
	isOpen: "=?"， // 注意这里的问号，指定这个参数是可选的
	currentDate: "=",
	onChange: "&"
}
```
		

---

此文章由冰翼翻译自 [asp.net](https://weblogs.asp.net/dwahlin/creating-custom-angularjs-directives-part-2-isolate-scope)， 原作者 [Dan Wahlin](http://weblogs.asp.net/dwahlin)