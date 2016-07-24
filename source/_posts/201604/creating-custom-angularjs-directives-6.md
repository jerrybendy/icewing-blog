---
title: 【译】创建自定义angularJS指令（六）- 使用控制器
date: 2016-04-27 00:04:06
updated: 2016-06-18 21:37:06
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

在这个 AngularJS 指令系列的文章中你已经了解到一些指令的关键部分，但还没有任何指令与控制器绑定相关的内容。控制器在 AngularJS 中的典型用途就是把路由和视图联系在一起，在指令中也是如此。事实上，在指令中使用控制器通常会使代码看起来更简洁，并且更易于维护。当然，指令中的控制器是可选的，如果你喜欢用简单的方式创建指令，你会发现控制器在很多情况下是适用的，并且更好用。使用控制器会让指令看起来更像是“子视图”。

在这篇文章中我将会简单的讲解下如何会配控制器到指令，以及控制器在指令中扮演折角色。先看一个不使用控制器的指令的例子：

## 不使用控制器的指令

指令提供一些不同的方式用于生成 HTML、管理数据以及处理额外的任务等。在指令需要处理大量 DOM 操作时，使用 `link` 方法是很好的实践。下面是一个使用 `link` 方法的例子：

```js
(function() {

  var app = angular.module('directivesModule');

  app.directive('domDirective', function () {
      return {
          restrict: 'A',
          link: function ($scope, element, attrs) {
              element.on('click', function () {
                  element.html('You clicked me!');
              });
              element.on('mouseenter', function () {
                  element.css('background-color', 'yellow');
              });
              element.on('mouseleave', function () {
                  element.css('background-color', 'white');
              });
          }
      };
  });

}());
```

往指令中添加一个控制器对于指令中的 DOM 操作和事件处理来说没有任何意义。虽然例子中可以通过在视图中添加 AngularJS 指令（如 `ngClick`）和控制器的方式完成相同的功能，但如果 DOM 操作是指令整体要完成的工作的话我们还是没有理由要使用控制器的。

在你需要进行一些简单的 DOM 操作，或整合数据到 HTML， 或处理事件等的时候，添加控制器可以很大程度上简化你的代码。下面通过一个简单的指令的例子来理解上面这句话。例子中生成一个列表，并且可以通过按钮添加项目到列表中。下图是可能的输出：

![](https://aspblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Creating-Custom-AngularJS-Directives-Par_D3AB/image_thumb%5B2%5D_2.png)

有很多种方法可以做到这种效果。一个典型的 DOM 为中心的方法是使用 `link` 函数处理指令中显示的内容。请记住，有很多方法可以做到这一点，总的目标是展示 DOM 为中心的代码（尽可能简单）：

```js
(function() {

  var app = angular.module('directivesModule');

  app.directive('isolateScopeWithoutController', function () {
      
      var link = function (scope, element, attrs) {
              
              //Create a copy of the original data that’s passed in              
              var items = angular.copy(scope.datasource);
              
              function init() {
                  var html = '<button id="addItem">Add Item</button><div></div>';
                  element.html(html);
                  
                  element.on('click', function(event) {
                      if (event.srcElement.id === 'addItem') {
                          addItem();
                          event.preventDefault();
                      }
                  });
              }
              
              function addItem() {
                  //Call external function passed in with &
                  scope.add();

                  //Add new customer to the local collection
                  items.push({
                      name: 'New Directive Customer'
                  });
                  
                  render();
              }
                
              function render() {
                  var html = '<ul>';
                  for (var i=0,len=items.length;i<len;i++) {
                      html += '<li>' + items[i].name + '</li>'
                  }
                  html += '</ul>';                  
                  
                  element.find('div').html(html);
              }
              
              init();
              render();        
      };
      
      
      return {
          restrict: 'EA',
          scope: {
              datasource: '=',
              add: '&',
          },
          link: link
      };
  });

}());
```

虽然这些代码完成了这个功能，却是使用了一种类型于 jQuery 插件的思路来写的，使用一种作者称之为 “[control-oriented](http://weblogs.asp.net/dwahlin/The-JavaScript-Cheese-is-Moving_3A00_-Data_2D00_Oriented-vs.-Control_2D00_Oriented-Programming)” 的方式，即标签名称和/或ID在代码中普遍存在。手动操作 DOM 算是一种好的方法，尤其是在一些特殊的场景下（为性能考虑），但这绝不是我们构建 Angualar 应用程序的方式。这种混合的写法会使代码变得凌乱并让指令变得臃肿。

在上面的代码中，当点击按钮时，`addItem()`函数被调用，添加一个新的元素并重新`render()`。`render()`函数创建一个`<ul>`标签和多个`<li>`标签。虽然这样看起来是没有什么问题，事实上这会导致代码的碎片化，将会使以后的维护工作变得非常困难。或许在这种很小的指令里面看起来问题还不算严重，在以后需要给指令添加或修改功能时这个问题才会日渐突出。

还有在这段代码中有一个更细微的问题。当调用`scope.add()`或其它方式修改了任何父范围内作用域的值后还必须要调用`$scope.$apply()`应用更改（具体原因在这篇文章中就不详述了，但这是绝对需要考虑的因素）。最后，指令并不像文章开头提到的“子视图”的概念——它只是一串代码。在这个例子中控制器能如何更好的帮助我们吗？Let's take a look。

## 给指令添加控制器和视图

上一节中的指令能够完成任务，但我们更愿意写一个标准的 AngularJS 视图，使用数据驱动的方式改变 DOM。通过在指令中使用控制器和视图，我们就可以像写一般的视图一样写指令。

下面的例子把之前的指令代码转换为控制器的形式，有没有感觉很清新？

```js
(function() {

  var app = angular.module('directivesModule');

  app.directive('isolateScopeWithController', function () {
      
    var controller = ['$scope', function ($scope) {

          function init() {
              $scope.items = angular.copy($scope.datasource);
          }

          init();

          $scope.addItem = function () {
              $scope.add();

              //Add new customer to directive scope
              $scope.items.push({
                  name: 'New Directive Controller Item'
              });
          };
      }],
        
      template = '<button ng-click="addItem()">Add Item</button><ul>' +
                 '<li ng-repeat="item in items">{{ ::item.name }}</li></ul>';
      
      return {
          restrict: 'EA', //Default in 1.3+
          scope: {
              datasource: '=',
              add: '&',
          },
          controller: controller,
          template: template
      };
  });

}());
```

这个指令可以以下面任一种方式使用：

```html
属性: <div isolate-scope-with-controller datasource="customers" add="addCustomer()"></div>

元素: <isolate-scope-with-controller datasource="customers" add="addCustomer()">
         </isolate-scope-with-controller>
```

通读上面的代码你会发现通过控制器与视图绑定的方式写指令格外简单，就像在写一个子视图一样。这样写的好处就在于完全避开了 DOM 操作，现在的代码可以认为是与 DOM 无关的，无疑这会减少很多开发和维护成本。

视图使用 `template` 属性定义，控制器使用 `controller` 属性定义。当然视图还可以使用 `templateUrl` 从外部文件导入，没必要都直接写在指令代码里面。当视图文件有很多代码时，`templateUrl` 或 `$templateCache` 会是更好的选择。

继续上面的例子，视图中经常会调用其它指令，如 `ng-click`、`ng-repeat`，也会使用如 `{% raw %}{{ ... }}{% endraw %}` 或 `ng-bind` 这种形式的数据绑定。避免 DOM 操作的好处在这里更加明显。控制器中注入 `$scope` 并定义 `items` 属性，视图中使用 `ng-repeat` 在 `items` 中循环并生成 `<li>`标签。当点击添加按钮时，会调用 `$scope` 中的 `addItem()` 方法并添加一个新的项目到 `items` 中。因为 `addItem()` 是由 `ng-click` 调用的，所以父级作用域在使用 `$scope.add` 的时候无需关心前面提到的关于 `$scope.$apply()` 的任何问题。

通常在指令需要很高的性能的情况下更建议使用原始的 DOM 操作的方式，直接操作 DOM 总是比使用控制器要快很多（可以避免很多额外的操作）。如果你参加我的讲座将可能会听到我经常说这么一名话：“使用正确的工具做正确的事情（Use the right tool for the right job）”，我从来不会相信有任何一种工具可以适用所有场景，并知道每一种情形和应用都是独一无二的。

This thought process definitely applies to directives since there are many different ways to write them.  In many situations I’m happy with how AngularJS performs and know about the pitfalls to avoid so I prefer the controller/view type of directive whenever possible. It makes maintenance much easier down the road since you can leverage existing Angular directives in the directive’s view and modify the view using a controller and scope. If, however, I was trying to maximize performance and eliminate the use of directives such as ng-repeat then going the DOM-centric route with the `link` function might be a better choice. Again, choose the right tool for the right job.

## Using controllerAs in a Directive

If you’re a fan of the controllerAs syntax you may be wondering if the same style can be used inside of directives. The answer is “yes”! When you define a Directive Definition Object (DDO) in a directive you can add a `controllerAs` property. Starting with Angular 1.3 you’ll also need to add a [bindToController](https://docs.angularjs.org/api/ng/service/$compile) property as well to ensure that properties are bound to the controller rather than to the scope. Here’s an example of the previous directive that has been converted to use the controllerAs syntax:

```js
(function() {

  var app = angular.module('directivesModule');

  app.directive('isolateScopeWithControllerAs', function () {
      
      var controller = function () {
          
              var vm = this;
          
              function init() {
                  vm.items = angular.copy(vm.datasource);
              }
              
              init();
              
              vm.addItem = function () {
                  vm.add();

                  //Add new customer to directive scope
                  vm.items.push({
                      name: 'New Directive Controller Item'
                  });
              };
      };    
      
      var template = '<button ng-click="vm.addItem()">Add Item</button>' +
                     '<ul><li ng-repeat="item in vm.items">{{ ::item.name }}</li></ul>';
      
      return {
          restrict: 'EA', //Default for 1.3+
          scope: {
              datasource: '=',
              add: '&',
          },
          controller: controller,
          controllerAs: 'vm',
          bindToController: true, //required in 1.3+ with controllerAs
          template: template
      };
  });

}());
```

Notice that a controller alias of `vm` (short for “ViewModel”) has been assigned to the `controllerAs` property and that the alias is used in the controller code and in the view. The `bindToController` property is set to `true` to ensure that properties are bound to the controller instead of the scope. While this code is very similar to the initial controller example shown earlier, it allows you to use “dot” syntax in the view (vm.customers for example) which is a recommended approach.

## Conclusion

Controllers can be used to cleanup directives in many scenarios. Although using a controller isn’t always necessary, you’ll find that by levering the “child view” concept in directives your code can be kept more maintainable and easier to work with. The next post in the series moves on to discuss additional features that can be used in directives such as $asyncValidators.


---

From [ASP.net](http://weblogs.asp.net/dwahlin/creating-custom-angularjs-directives-part-6-using-controllers)