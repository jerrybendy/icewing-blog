---
title: 【译】创建自定义angularJS指令（三）- 独立作用域和函数参数
date: 2016-04-08 09:25:14
updated: 2016-04-08 22:25:14
tags:
  - AngularJS
  - 指令
categories:
  - 前端
---

![AngularJs](https://cdn.icewing.cc/201604%2FAngularJS_thumb_1008B166.jpg)

------

1. [基础](https://icewing.cc/post/creating-custom-angularjs-directives-1.html)
2. [独立作用域](https://icewing.cc/post/creating-custom-angularjs-directives-2.html)
3. [独立作用域和函数参数](https://icewing.cc/post/creating-custom-angularjs-directives-3.html)
4. [transclude与restrict](https://icewing.cc/post/creating-custom-angularjs-directives-4.html)
5. [link函数](https://icewing.cc/post/creating-custom-angularjs-directives-5.html)
6. [使用控制器](https://icewing.cc/post/creating-custom-angularjs-directives-6.html)
7. [Creating a Unique Value Directive using $asyncValidators](https://icewing.cc/post/creating-custom-angularjs-directives-7.html)

-----




文章的第二部分我们介绍了独立作用域以及独立作用域如何被用来使指令更易于重用。
关于独立作用域的很大一部分都是`本地作用域属性`以及如何使用如`@`、`=`以及`&`来处理数据绑定和委托。使用这些属性你可以传递数据到AngularJS的指令中，以及从指令中输出数据。如果你对这方面还不了解的话可以先阅读上一篇关于独立作用域的文章。这一节将着重讲下指令本地作用域属性中的函数部分，`&`的具体用法。

## 独立作用域和函数参数

通过使用本地作用域属性，你可以传递一个外部的函数参数（如定义在控制器`$scope`中的函数）到指令。这些使用`&`就可以完成。下面是一个例子，定义一个叫做`add`的本地作用域属性用来保存传入函数的引用：

```js
angular.module('directivesModule')
.directive('isolatedScopeWithController', function () {
    return {
        restrict: 'EA',
        scope: {
            datasource: '=',
            add: '&',
        },
        controller: function ($scope) {

            // ...            
            
            $scope.addCustomer = function () {
                // 调用外部作用域函数
                var name = 'New Customer Added by Directive';
                $scope.add();

                // 添加新的`customer`到指令作用域
                $scope.customers.push({
                    name: name                
                });
            };
        },
        template: '<button ng-click="addCustomer()">Change Data</button><ul>
                   <li ng-repeat="cust in customers">{{ cust.name }}</li></ul>'
    };
});
```

指令的消费者可以通过定义一个`add`属性的方式传递一个外部的函数到指令。如下：

```html
<div isolated-scope-with-controller datasource="customers" add="addCustomer()"></div>
```

在这个例子中，函数`addCustomer()`将会在用户点击指令中创建的按钮时被调用。没有参数传入，所以这里是一个相对简单的操作。

如何向`addCustomer()`函数中传递参数呢？例如，假设`addCustomer()`函数显示在下面的控制器下并且当函数被调用时需要传递一个`name`参数到指令中：

```js
var app = angular.module('directivesModule', []);

app.controller('CustomersController', ['$scope', function ($scope) {
    var counter = 0;
    $scope.customer = {
        name: 'David',
        street: '1234 Anywhere St.'
    };
    
    $scope.customers = [];

    $scope.addCustomer = function (name) {
        counter++;
        $scope.customers.push({
            name: (name) ? name : 'New Customer' + counter,
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

从指令内传递一个参数到外部函数在你了解它的工作方式后会显得特别简单，下面是一般开发者起初可能会尝试的写法：

```js
angular.module('directivesModule')
.directive('isolatedScopeWithController', function () {
    return {
        restrict: 'EA',
        scope: {
            datasource: '=',
            add: '&',
        },
        controller: function ($scope) {
            ...


            $scope.addCustomer = function () {
                // 调用外部函数，注意这里直接传递了一个 name 参数
                var name = 'New Customer Added by Directive';
                $scope.add(name);

                // 添加新的`customer`
                $scope.customers.push({
                    name: name
                });
            };
        },
        template: '<button ng-click="addCustomer()">Change Data</button><ul>' +
                  '<li ng-repeat="cust in customers">{{ cust.name }}</li></ul>'
    };
});
```

需要注意的是指令的控制器通过调用`$scope.add(name)`来尝试调用外部函数并传递一个参数过去。这样可以工作吗？实际上在外部函数中输出这个参数得到的却是`undefined`，这可能让你抓破脑袋都想不通为什么。那么接下来我们该做什么呢？

## 选择1：使用对象字面量

一种方法是传递一个对象字面量。下面是演示如何把`name`传递到外部函数中的例子：

```js
angular.module('directivesModule')
.directive('isolatedScopeWithController', function () {
    return {
        restrict: 'EA',
        scope: {
            datasource: '=',
            add: '&',
        },
        controller: function ($scope) {
            ...

           
            $scope.addCustomer = function () {
                // 调用外部函数
                var name = 'New Customer Added by Directive';
                $scope.add({ name: name });

                // Add new customer to directive scope
                $scope.customers.push({
                    name: name,
                    street: counter + ' Main St.'
                });
            };
        },
        template: '<button ng-click="addCustomer()">Change Data</button>' +
                  '<ul><li ng-repeat="cust in customers">{{ cust.name }}</li></ul>'
    };
});
```

需要注意的是`$scope.add()`方法调用时现在传递了一个对象字面量作为参数。很不幸，这样仍然不能工作！什么原因呢？传递给`$scope.add()`的对象字面量中定义的`name`属性在分配给指令时同样也需要在外部函数中被定义。**非常重要**的一点是，在视图中写的参数名必须要与对象字面量中的名字匹配。下面是一个例子：

```html
<div isolated-scope-with-controller datasource="customers" add="addCustomer(name)"></div>
```

可以看到在视图中使用指令时，`addCustomer()`方法添加了个参数`name`。这个`name`必须要与指令中调用`$scope.add()`时传入的对象字面量中的`name`相匹配。如此一来指令就能正确工作了。

## 选择2：存储一个函数引用并调用它

上面那种方式的问题在于在使用指令时必须要给函数传递参数而且参数名必须在指令内以对象字面量的形式被定义。如果任何一点不匹配将无法工作。虽然这种方法可以完成需求，但仍然有很多问题。例如如果指令没有完善的使用说明文档就很难知道指令中需要传递的参数名究竟是什么，这时就不得不去翻指令源码查看参数内容了。

另一种可行的方法是在指令上定义一个函数但在函数名后面不加圆括号，如下：

```html
<div isolated-scope-with-controller-passing-parameter2 datasource="customers" add="addCustomer"></div>
```

为了传递参数到外部的`addCustomer`函数你需要在指令中做以下事情。把`$scope.add()(name)`代码放到可被`addCustomer`调用的方法下面：

```js
angular.module('directivesModule')
.directive('isolatedScopeWithControllerPassingParameter2', function () {
    return {
        restrict: 'EA',
        scope: {
            datasource: '=',
            add: '&',
        },
        controller: function ($scope) {
            
            ...

            $scope.addCustomer = function () {
                // 调用外部函数
                var name = 'New Customer Added by Directive';

                $scope.add()(name);

                ...          
            };
        },
        template: '<button ng-click="addCustomer()">Change Data</button><ul>' +
                  '<li ng-repeat="cust in customers">{{ cust.name }}</li></ul>'
    };
});
```

为什么这种方法可以工作？这个需要从`&`的另一个主要作用说起。`&`在指令中主要的作用是计算表达式，即在控制器调用以`&`定义的作用域属性时AngularJS会计算出这个表达式的值并返回。例如在视图中输入`add="x = 42 + 2"`，那么在指令中读取`$scope.add()`时将会返回这个表达式的计算结果（44），任何一个有效的AngularJS的表达式都可以是`add`属性的值并在读取`add`属性时被计算。所以当我们在视图中输入不带圆括号的函数`add="customers"`时，指令中`$scope.add()`实际返回的是在控制器中定义的函数`customers()`。所以在指令中调用`$scope.add()(name)`就相当于调用控制器的`customers(name)`。

在指令中输出`$scope.add()`将会得到以下内容（正好验证上面所说）：

![](https://cdn.icewing.cc/201604/image_2.png)

## `&`背后的运行机制

如果你对`&`的运行机制感兴趣，当`&`本地作用域属性被调用（例如上面例子中的`a  dd`本地作用域属性），下面的代码将会执行：

```js
case '&':
    parentGet = $parse(attrs[attrName]);
    isolateScope[scopeName] = function(locals) {
        return parentGet(scope, locals);
    };
break;
```

上面的`attrName`变量相当于前面例子中指令本地作用域属性中的`add`。调用`$pares`返回的`parentGet`函数 如下：

```js
 function (scope, locals) {
      var args = [];
      var context = contextGetter ? contextGetter(scope, locals) : scope;

      for (var i = 0; i < argsFn.length; i++) {
        args.push(argsFn[i](scope, locals));
      }
      var fnPtr = fn(scope, locals, context) || noop;

      ensureSafeObject(context, parser.text);
      ensureSafeObject(fnPtr, parser.text);

      // IE stupidity! (IE doesn't have apply for some native functions)
      var v = fnPtr.apply
            ? fnPtr.apply(context, args)
            : fnPtr(args[0], args[1], args[2], args[3], args[4]);

      return ensureSafeObject(v, parser.text);
}
```

处理代码映射对象字面量属性到外部函数参数并调用函数。

虽然没有必要一定去理解如何使用`&`本地作用域属性，但是去深入发掘AngularJS在背后做了一些什么总是一件有趣的事情。

## 结尾

从上面可以看到`&`的传参过程还是有点困难的。然而一旦学会了如何使用，整个过程其实并不算太难用。

此文章由冰翼翻译自 [asp.net](http://weblogs.asp.net/dwahlin/creating-custom-angularjs-directives-part-3-isolate-scope-and-function-parameters)， 原作者 [Dan Wahlin](http://weblogs.asp.net/dwahlin)

