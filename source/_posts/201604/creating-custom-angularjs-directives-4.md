---
title: 【译】创建自定义angularJS指令（四）- transclude与restrict
date: 2016-04-25 22:53:51
updated: 2016-05-06 23:12:00
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




在这个系列的第三节中，我们介绍了怎样定义函数独立作用域属性并且传递参数给函数。这一节我将讲解关于指令的包含（transclude）与限制（restrict）。

## restrict （约束）

指令在HTML里可以被定义为元素、属性、CSS类或者注释。那么你将如何限制你的自定义指令可以使用哪种方式？

为了限制一个指令可以如何以及在哪里被使用，你可以用`restrict`属性来定义，它可以接收以下值：

### `E` —— 元素
指令可以作为一个独立的元素使用，在指令完全需要完全重写元素的行为时推荐使用，也可以和`A`同样使用：

```html
<my-directive></my-directive>
```

### `A` —— 属性
指令可以作为某个元素的属性使用，在指令需要增强元素的功能或同一个元素需要有多个指令同时工作时推荐使用：

```html
<div my-directive=exp></div>
```

### `C` —— CSS类
指令可以作为元素的CSS类使用，不太推荐使用；如果是需要给某些具有特定CSS类的元素附加功能时推荐使用：

```html
<div class=my-directive: exp;></div>
```

### `M` —— 注释（不推荐）
指令可以作为HTML注释使用，这种方式由于不易读，且可能会被一些HTML压缩工具删除掉，所以不推荐使用：

```html
<!-- directive: my-directive exp -->
```

这里是一个例子，指令可以被作为一个元素或者元素的属性使用，要注意在多个属性值之间不需要任何分隔符：

```js
app.directive('myDirectiveWithRestriction', function () {
    return {
        restrict: 'EA',
        scope: {
            tasks: '='
        }
    };
});
```

虽然`C`和`M`属性值也可以用，但它们被用得很少。大多数的指令只会使用`E`和`A`。

关于`restrict`的东西就这么简单，下面我们来看`transclude`。

## transclude （嵌入）

如果你曾经载入一个CSS样式或HTML模板到一个HTML页面，或载入一个头部或脚部的HTML碎片到一个shtml页面（也就是SSI），那么你就使用过`transclude`的特性。下面是原作者的一个简单介绍`transclude`的视频（天朝打不开，不用试了）。

### AngularJS Transclusion in 120 Seconds

{% youtube TRrL5j3MIvo %}

我们创建了一个指令，`transclude`方法提供了一种在指令的消费者那里定义被包含的HTML代码的方式。例如你可能需要输出一个表格，创建一个指令用来控制表格的行如何被渲染。或者，你可能有一个可以输出错误信息的指令，允许指令的消费者提供HTML的内容，指令本身控制输出的错误消息的颜色和行为。需要支持这种类型的功能，指令的消费者需要拥有对指令的HTML有更多的控制权，可以决定指令的HTML如何被生成。

AngularJS提供两个关键的特性用于支持嵌入。第一个是在指令中使用`transclude`的属性，需要把指令的`transclude`属性设置为`true`。第二个使用`ng-transclude`指令，用来指定嵌入的HTML内容将会被放置在指令模板的什么地方。指令代码使用这两个特性来支持嵌入。

下面是一个简单的指令的例子来演示如何使用`transclude`。例子中使用嵌入来允许指令消费者提供一段HTML生成每一个任务。看下面的代码你会发现指令的`transclude`属性被设置成`true`，并且`restrict`属性设置成`E`，所以指令只能被作为一个元素使用。这允许在指令的消费者处使用自定义的内容。另一个属性，`replace`，用来处理是否使用指令的模板内容替换掉指令的元素（在这个例子中是`<isolated-scope-with-transclusion>`元素），如果值为`false`或省略此属性，指令将会保留`<isolated-scope-with-transclusion>`元素。

```js
angular.module('directivesModule')
.directive('isolatedScopeWithTransclusion', function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            tasks: '='
        },
        controller: function ($scope) {
            $scope.addTask = function () {

                if (!$scope.tasks) $scope.tasks = [];

                $scope.tasks.push({
                    title: $scope.title
                });

            };
        },
        template: '<div>Name: <input type="text" ng-model="title" />&nbsp;' +
                  '<button ng-click="addTask()">Add Task</button>' +
                  '<div class="taskContainer"><br />' +
                     '<ng-transclude></ng-transclude>' +
                  '</div></div>'
    };
});
```

仔细看指令的`template`部分，你会发现`<div>`上有一个`ng-transclude`指令。指令中嵌入的内容将会被放置在定义了`ng-transclude`指令的元素内。下面是一个使用指令的例子，并且在指令内嵌入了一段HTML内容：

```html
<isolated-scope-with-transclusion tasks="tasks">
    <div ng-repeat="task in tasks track by $index">
         <strong>{{ task.title }}</strong>
    </div>
</isolated-scope-with-transclusion>
```

在这个例子中，指令内部通过`ngRepeat`指令处理`tasks`，并把处理后的内容放置在`<isolated-scope-with-transclusion>`指令元素内部。自定义的HTML内容将会被放置在指令模板中`ng-transclude`被定义的位置。假定`tasks`内只包含一个元素，指令初次运行时的输出将会像下图中显示的那样。最后当用户添加任务时，任务会自动被添加到列表中。

![](https://cdn.icewing.cc/201605/image_2.png)

这个例子很简单，所以我们可以很容易的把焦点关注在`transclude`以及它如何使用和工作上面。一般来说通过一些扩展和一些HTML片段就可以让指令拥有更丰富的功能，而且指令中并没有限制只能使用一个`ngTransclude`指令。一些第三方的指令，如 UI-bootstrap 中的[Alert](https://github.com/angular-ui/bootstrap/blob/master/src/alert/alert.js)和[Accordion](https://github.com/angular-ui/bootstrap/blob/master/src/accordion/accordion.js)也是通过`transclude`来工作的。

## 最后

`transclude`在你熟悉了它的基本工作方式和优点之后会显得很简单。像在视频中提到的，通过在指令中使用`tranclude`以及`ngTransclude`，你可以方便的为你的指令提供一个自定义的功能。

`transclude`在指令模板中使用`ngRepeat`或`ngIf`时行为会变得比较复杂，这种情况我将会在以后的文章中具体指出。

---

此文章由冰翼翻译自 [asp.net](https://weblogs.asp.net/dwahlin/creating-custom-angularjs-directives-part-4-transclusion-and-restriction)， 原作者 [Dan Wahlin](http://weblogs.asp.net/dwahlin)
