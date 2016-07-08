---
title: 【译】创建自定义angularJS指令（一）- 基础
date: 2016-03-31 19:48:06
updated: 2016-04-02 21:21:06
tags:
  - angularJS
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



AngularJS提供了很多指令可以帮助我们操作DOM、处理事件、数据绑定、绑定控制器与作用域（ngView）等等。例如`ngClick`、`ngShow`、`ngHide`、`ngRepeat`以及[其它](https://docs.angularjs.org/api/ng/directive)很多AngularJS核心的指令都可以帮助我们很轻松的使用这个框架。

虽然内置的指令已经覆盖了大部分的使用场景，但在实际使用中为了简化操作或组件重用等我们经常需要创建自己的指令。在这个系列的文章中我将一步步带你了解AngularJS指令是如何工作的，以及如何开始使用/创建它们。

在这个系列的文章中我们假定你已经知道指令是什么并且知道如何使用它们。如果你还不知道指令如何使用可以点击[这里](https://docs.angularjs.org/guide/directive)了解一些基本的用法。

## 编写AngularJS指令难吗？

AngularJS的指令对第一次接触它的人来说可能会吓一跳。它有很多选项，有一些复杂的特性，对第一次使用来说确实有些挑战。一旦你对它有一些了解你会发现其实并没有那么糟。如果比喻成乐器的话，当你第一次弹钢琴或吉他时你会感觉无从下手以及难以驾驭，然而在经过一段时间必要的练习后你会慢慢开始熟练甚至弹出一些优美的曲子。

## 开始自定义指令

为什么需要自定义指令？想一下如果你正在执行一项任务：把客户数据的集合转换成指定的格式输出到一个表格中——你当然可以选择直接添加DOM来完成，但这样做的话会使测试和控制变得困难而且使关注分离，这在AngularJS中是很不好的实现，你肯定不想这么做。作为替代方案，你应该自定义一个指令来完成上面的操作。另一方面，你可能有一些数据绑定会多次在不同的视图中出现并且你想重用这些数据绑定。当使用`ngInclude`载入一个子视图时，指令仍然能很好的工作。当然，指令还有很多实用的场景，上面说的也只是表面。

让我们直接来看一个基本的指令的例子。假设我们在程序中定义了以下模块和控制器：

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

比方说，我们发现自己写了一个数据绑定，类似于下面这样的代码，在整个程序中一遍又一遍的出现：

```html
Name: {{customer.name}} 
<br />
Street: {{customer.street}}
```

一种重用方法是把这部分HTML写在一个子视图中（在这里我们命名为`myChildView.html`），并且在父视图中使用`ngInclude`来使用它。这使得`myChildView.html`在程序中得到重用。

```html
<div ng-include="'myChildView.html'"></div>
```

虽然这能够完成任务，显然另一种更好的方案是把数据绑定表达式写到一个自定义指令中。要创建一个指令，首先需要创建一个指令所属的目标模块（module），并在模块上调用`directive()`方法。`directive()`方法有一个名称和一个函数作为参数，以下是一个简单的指令嵌入数据绑定表达式的例子。

```js
angular.module('directivesModule')
.directive('mySharedScope', function () {
    return {
        template: 'Name: {{customer.name}}<br /> Street: {{customer.street}}'
    };
});
```

这是不是说可以使用自定义指令来代替`ngInclude`指令载入子视图? 不止如此。指令可以通过很少一部分代码来完成很多功能，它可以使DOM与业务逻辑之间的关系变得更简单。下面是一个简单的把`mySharedScope`指令绑定到一个`<div>`元素上的例子：

```html
<div my-shared-scope></div>
```

当指令执行后将会输出下面的基于控制器中的数据：

**Name: David**   
**Street: 1234 Anywhere St.**

有一点你可能会引起注意的是`mySharedScope`指令在视图中被引用的名字是`my-shared-scope`。为什么是这样？其实指令在命名时是使用的驼峰命名法，而引用时使用连字符方式。例如，当你使用`ngRepeat`指令时，实际的连字符写法是`ng-repeat`。

在这个指令中还有另一个有趣的事情是它总是默认继承视图的作用域（scope）。如果提前绑定控制器（`CustomersController`）到视图，这时作用域的`customer`属性中在指令中就是可用的。这种**共享作用域**的方式在你了解指令所处的父作用域时可以工作得很好，但是在你需要复用一个指令时你往往不能很好的了解或控制它所在的父作用域，这时我们就可以使用**独立作用域**。关于独立作用域的具体用法将会在后面的文章中详述。

## 指令的属性

在上面的`mySharedScope`指令中我们只是在函数中返回了一个仅包含`template`属性的对象字面量，这个属性被用来定义指令生成HTML的模板（在这个例子中是一个简单的绑定表达式），那么还有哪些其它可用的属性呢？

自定义指令一般会通过返回一个对象字面量来定义指令所需的属性，例如模板、控制器（如果需要的话）、DOM操作代码等等。有一些不同的属性可以被使用（[你可以在这里找到完整的属性列表](http://docs.angularjs.org/api/ng/service/$compile)）。下面是一些你可能遇到的常用的比较关键的属性，以及一个简单的使用它们的例子：

```js
angular.module('moduleName')
    .directive('myDirective', function () {
    return {
        restrict: 'EA', //E = element(元素), A = attribute(属性), C = class(类), M = comment(注释)         
        scope: {
            // @ 读取属性值, 
            // = 双向数据绑定, 
            // & 使用函数
            title: '@'         },
        template: '<div>{{ myVal }}</div>',
        templateUrl: 'mytemplate.html',
        controller: controllerFunction, // 可以在指令中嵌入自定义控制器
        link: function ($scope, element, attrs) { } // DOM操作
    }
});
```

以下是对部分属性的一些简要说明：

属性         | 描述
:-----------|:-----------------
`restrict`  | 检测指令可用的位置（是元素、属性、CSS类中还是注释中）
`scope`     | 用来创建一个新的子作用域或独立作用域
`template`  | 用来定义指令输出的内容，可以包含HTML、数据绑定表达式，甚至包含其它指令
`templateUrl` | 提供一个指令使用的模板的路径，也可以是一个使用`<script>`标签定义的模板的ID
`controller` | 用来定义一个控制器以联系视图模板
`link`      | 主要用来处理一些DOM操作的任务

## 操作DOM

除了在模板中进行数据绑定操作外，指令也可以被用来操作DOM。这使用了前面提到的`link`函数。

`link`函数通常会接收3个参数（在某些情况下还会有其它参数），包含当前作用域、与指令相关联的DOM元素、以及元素上绑定的属性。下面是一个使用指令处理点击、鼠标移入、鼠标移出事件的例子：

```js
app.directive('myDomDirective', function () {
    return {
        link: function ($scope, element, attrs) {
            element.bind('click', function () {
                element.html('You clicked me!');
            });
            element.bind('mouseenter', function () {
                element.css('background-color', 'yellow');
            });
            element.bind('mouseleave', function () {
                element.css('background-color', 'white');
            });
        }
    };
});
```

要想使用这个指令你需要在你的视图中添加以下代码：

```html
<div my-dom-directive>Click Me!</div>
```

当鼠标移入或移出时，`<div>`的背景颜色将会在黄色和白色（虽然在这个例子中使用了内联样式，但使用CSS类将会更好）。当目标元素被点击，内部的HTML就会变成“You clicked me!”。指令在AngularJS中是唯一可以直接操作DOM的服务，学会使用它将会对你的学习和使用很有帮助。


## 格式化AngularJS指令代码

虽然`mySharedScope`和`myDomDirective`指令运行的很好，但是我更喜欢在定义指令和其它AngularJS组件时使用一些特定的格式，像下面这样：

```js
(function () {

    var directive = function () {
        return {

        };
    };

    angular.module('moduleName')
        .directive('directiveName', directive);

}());
```

这段代码使用了一个自执行函数包围了所有逻辑代码以防止全局命名空间污染。使用`directive`变量定义指令函数，最后，在模块上调用`directive()`函数并传递`directive`变量进去。有很多技巧可以被用来格式化代码，但我比较喜欢上面这种。

## 总结

这是这个系列的第一篇文章，你可以了解到一些基本的指令知识并且学会如何去创建一个简单的指令。这仅仅是表面！在下一篇文章中我们将会讨论独立作用域以及不同的数据绑定方式。

---

此文章由冰翼翻译自 [asp.net](http://weblogs.asp.net/dwahlin/creating-custom-angularjs-directives-part-i-the-fundamentals)， 原作者 [Dan Wahlin](http://weblogs.asp.net/dwahlin)