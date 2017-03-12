---
title: 【译】创建自定义angularJS指令（七）- 使用 $asyncValidators 创建唯一值指令
date: 2016-04-27 00:04:11
updated: 2016-09-11 21:48:11
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

在上一篇文章中我演示了如何创建一个唯一值校验的指令来确定一个 email 地址是否已经被使用过。在 AngularJS 1.3+ 以上的版本中增加了许多新的特性可以使指令的代码变得更加整洁并且更易于使用。在这篇文章中，我将会更新之前的代码，尝试一下新的特性。下面展示的代码是 [Customer Manager Standard](https://github.com/DanWahlin/CustomerManagerStandard) 中的一部分，你可以在 Github 上看到完整的代码。

下面的截图是运行后的一部分，在截图中，email 地址已经被其它用户使用，导致显示错误信息。


![](https://cdn.icewing.cc/201609/image_2.png)

指令使用以下代码绑定到 `email` 输入框中：

```html
<input type="email" name="email" 
        class="form-control"
        data-ng-model="customer.email"
        data-ng-model-options="{ updateOn: 'blur' }"
        data-wc-unique
        data-wc-unique-key="{{customer.id}}"
        data-wc-unique-property="email"
        data-ng-minlength="3"
        required />
```

You can see that a custom directive named `wc-unique` is applied as well as 2 properties named `wc-unique-key` and `wc-unique-property` (I prefer to add the `data-` prefix but it’s not required). Before jumping into the directive let’s take a look at an AngularJS factory that can be used to check if a value is unique or not.
通过上面的代码你可以看到我们使用了一个叫做 `wc-unique` 的自定义指令，以及两个属性 `wc-unique-key` 和 `wc-unique-property` （我更喜欢为添加 `data-` 前缀，虽然这不是必须的）。在跳到指令代码之前，我们先看下 AngularJS 中可以用来检查一个值是否唯一的 factory 。

## 创建 Factory

唯一值校验需要依赖后端服务，AngularJS 提供了一些可以与后端通信的服务，如 `$http` 和 `$resource`。在这个例子中，我会使用一个叫做 `dataService` 自定义的 factory，依赖 `$http` 服务进行 Ajax 操作与后端通信。它内部使用一个叫做 `checkUniqueValue()` 的方法处理唯一值验证。要注意一下，我并没有特别去区分 "factory" 与 "service"，因为它们从根本上来说所做的事情其实是一样的，只是对我来说 "service" 可能更好听一些（个人爱好）。

```js
(function () {

    var injectParams = ['$http', '$q'];

    var customersFactory = function ($http, $q) {
        var serviceBase = '/api/dataservice/',
            factory = {};

        factory.checkUniqueValue = function (id, property, value) {
            if (!id) id = 0;
            return $http.get(serviceBase + 'checkUnique/' + id + '?property=' + property + 
              '&value=' + escape(value)).then(
                function (results) {
                    return results.data.status;
                });
        };

        //More code follows

        return factory;
    };

    customersFactory.$inject = injectParams;

    angular.module('customersApp').factory('customersService', customersFactory);

}());
```

## 创建唯一值指令

我创建了一个叫做 `wcUnique` 的指令用于处理唯一值的验证（`wc` 是指 Wahlin Consulting，作者所在的公司名）。这是一个相当简单的指令，仅限于被用作一个属性。指令的外壳基本如下：

```js
function () {

    var injectParams = ['$q', 'dataService'];

    var wcUniqueDirective = function ($q, dataService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {

                //Validation code goes here

            }
        };
    };

    wcUniqueDirective.$inject = injectParams;

    angular.module('customersApp').directive('wcUnique', wcUniqueDirective);

}());
```

As the directive is loaded the `link()` function is called which gives access to the current scope, the element the directive is being applied to, attributes on the element, and the `ngModelController` object. If you’ve built custom directives before (hopefully you’ve been reading my series on directives!) you’ve probably seen `scope`, `element` and `attrs` before but the 4th parameter passed to the `link()` function may be new to you. If you need access to the `ngModel` directive that is applied to the element where the custom directive is attached to you can “require” `ngModel` (as shown in the code above). ngModel will then be injected into the `link()` function as the 4th parameter and it can be used in a variety of ways including validation scenarios.  One of the new properties available in `ngModelController` with AngularJS 1.3+ is `$asyncValidators` (read more about it here) which we’ll be using in this unique value directive.

![](https://aspblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Using-asyncValidators-to-Build-a-Custom-_B9B3/image_7.png)

Here’s the complete code for the `wcUnique` directive:

```js
(function () {

    var injectParams = ['$q', '$parse', 'dataService'];

    var wcUniqueDirective = function ($q, $parse, dataService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$asyncValidators.unique = function (modelValue, viewValue) {
                    var deferred = $q.defer(),
                        currentValue = modelValue || viewValue,
                        key = attrs.wcUniqueKey,
                        property = attrs.wcUniqueProperty;

                    //First time the asyncValidators function is loaded the
                    //key won't be set  so ensure that we have 
                    //key and propertyName before checking with the server 
                    if (key && property) {
                        dataService.checkUniqueValue(key, property, currentValue)
                        .then(function (unique) {
                            if (unique) {
                                deferred.resolve(); //It's unique
                            }
                            else {
                                deferred.reject(); //Add unique to $errors
                            }
                        });
                    }
                    else {
                        deferred.resolve(); //Ensure promise is resolved if we hit this 
                     }

                    return deferred.promise;
                };
            }
        };
    };

    wcUniqueDirective.$inject = injectParams;

    angular.module('customersApp').directive('wcUnique', wcUniqueDirective);

}());
```

You’ll notice that the `ngModel` parameter that is injected into the `link()` function is used to access a property named `$asyncValidators`. This property allows async operations to be performed during the data validation process which is perfect when you need to go back to the server to check if a value is unique. In this case I created a new validator property named `unique` that is assigned to a function. The function creates a deferred object and returns the promise. From there the code grabs the current value of the input that we’re trying to ensure is unique and also grabs the `key` and `property` attribute values shown earlier.

The `key` represents the unique key for the object (ultimately the unique identifier for the record). This is used so that we exclude the current object when checking for a unique value across objects on the server. The `property` represents the name of the object property that should be checked for uniqueness by the back-end system.

Once the variables are filled with data, the `key` and `property` values are passed along with the element’s value (the value of the textbox for example) to a function named `checkUniqueValue()` that’s provided by the `dataService` factory shown earlier. This triggers an Ajax call back to the server which returns a true or false value. If the server returns that the value is unique we’ll resolve the promise that was returned. If the value isn’t unique we’ll reject the promise. A rejection causes the `unique` property to be added to the `$error` property of the `ngModel` so that we can use it in the view to show and hide and error message.

## Showing Error Messages

The unique property added to the `$error` object can be used to show and hide error messages. In the previous section it was mentioned that the `$error` object is updated but how do you access the `$error` object? When using AngularJS forms, a `name` attribute is first added to the `<form>` element as shown next:

```html
<form name="editForm">
```

The `editForm` value causes AngularJS to create a child controller named `editForm` that is associated with the current scope. In other words, `editForm` is added as a property of the current scope (the scope originally created by your controller). The textbox shown earlier has a name attribute value of `email` which gets converted to a property that is added to the `editForm` controller. It’s this email property that gets the `$error` object.  Let’s look at an example of how we can check the `unique` value to see if the email address is unique or not:

```html
<div class="col-md-2">
    Email:
</div>
<div class="col-md-10">
    <!-- type="email" causing a problem with Breeze so using regex -->
    <input type="email" name="email" 
            class="form-control"
            data-ng-model="customer.email"
            data-ng-model-options="{ updateOn: 'blur' }"
            data-wc-unique
            data-wc-unique-key="{{customer.id}}"
            data-wc-unique-property="email"
            data-ng-minlength="3"
            required />
    <!-- Show error if touched and unique is in error -->
    <span class="errorMessage" ng-show="editForm.email.$touched && editForm.email.$error.unique">
        Email already in use
    </span>
</div>
```

Notice that the `ngShow` directive (on the span at the bottom of the code) checks the `editForm` property of the current scope and then drills down into the `email` property. It checks if the value is touched using the `$touched` property  (this property is in AngularJS 1.3+ and reports if the target control lost focus – it has nothing to do with a touch screen) and if the `$error.unique` value is there or not. If `editform.email.$error.unique` exists then we have a problem and the user entered an email that is already in use. It’s a little bit confusing at first glance since we’re checking if `unique` is added to the `$error` object which means the email is already in use (the unique property is in error). If it’s not on the `$error` object then then everything is OK and the user entered a unique value.

The end result is the red error message shown next:

![](https://aspblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Using-asyncValidators-to-Build-a-Custom-_B9B3/image_10.png)

## Conclusion

Directives provide a great way to encapsulate functionality that can be used in views. In this post you’ve seen a simple AngularJS unique directive that can be applied to textboxes to check if a specific value is unique or not and display a message to the user. To see the directive in an actual application check out the Customer Manager sample application at [https://github.com/DanWahlin/CustomerManagerStandard](https://github.com/DanWahlin/CustomerManagerStandard).

---

From [ASP.net](https://weblogs.asp.net/dwahlin/creating-custom-angularjs-directives-part-7-%E2%80%93-creating-a-unique-value-directive-using-asyncvalidators)

