---
title: 网页中id与name的区别
tags:
  - HTML/CSS
  - PHP
id: 421
categories:
  - PHP
date: 2013-07-28 23:24:14
---

上周我也遇到了ID和Name的问题，在页面里输入了一个`input type="hidden"`，只写了一个`ID="SliceInfo"`，赋值后submit，在后台用$_GET["SliceInfo"]却怎么也取不到值。后来恍然大悟因该用Name来标示，于是在input里加了个`Name="SliceInfo"`，就一切 ok了。

可以说几乎每个做过Web开发的人都问过，到底元素的ID和Name有什么区别阿？为什么有了ID还要有Name呢?! 而同样我们也可以得到最classical的答案：ID就像是一个人的身份证号码，而Name就像是他的名字，ID显然是唯一的，但Name是可以重复的。

第一段里对于ID和Name的解答说的太笼统了，当然那个解释对于ID来说是完全对的，它就是Client端HTML元素的身份证。而Name其实要复杂的多，因为Name有很多种的用途，所以它并不能完全由ID来代替，从而将其取消掉。具体用途有：

**用途6:** 某些特定元素的属性，如attribute，meta和param。例如为Object定义参数`<PARAM NAME = "appletParameter" VALUE = "value">`或Meta中`<META NAME = "Author" CONTENT = "Dave Raggett">`。

显然这些用途都不是能简单的使用ID来代替掉的，所以HTML元素的ID和Name的却别并不是身份证号码和姓名这样的区别，它们更本就是不同作用的东西。

当然HTML元素的Name属性在页面中也可以起那么一点ID的作用，因为在DHTML对象树中，我们可以使用 `document.getElementsByName`来获取一个包含页面中所有指定Name元素的对象数组。Name属性还有一个问题，当我们动态创建可包含Name属性的元素时，不能简单的使用赋值`element.name = "..."`来添加其Name，而必须在创建Element时，使用`document.createElement(''<element name = "myName"></element>'')`为元素添加Name属性。这是什么意思啊？看下面的例子就明白了。

**用途5:** 在IMG元素和MAP元素之间关联的时候，如果要定义IMG的热点区域，需要使用其属性usemap，使usemap="#name"(被关联的MAP元素的Name)。

**用途4:** 作为对象的Identity，如Applet、Object、Embed等元素。比如在Applet对象实例中，我们将使用其Name来引用该对象。

**用途3:** 建立页面中的锚点，我们知道<a href="URL">link</a>是获得一个页面超级链接，如果不用href属性，而改用Name，如：`<a name="PageBottom"></a>`，我们就获得了一个页面锚点。

**用途2:** HTML元素`Input type="radio"`分组，我们知道radio button控件在同一个分组类，check操作是mutex的，同一时间只能选中一个radio，这个分组就是根据相同的Name属性来实现的。

用途1: 作为可与服务器交互数据的HTML元素的服务器端的标示，比如input、select、textarea、和button等。我们可以在服务器端根据其Name通过$_GET[]取得元素提交的值。

```html
<scrīpt language="Javascrīpt">
var input = document.createElement("input");
input.id = "myId";
input.name = "myName";
alert(input.outerHTML);
</scrīpt>
```

消息框里显示的结果是：

```html
<INPUT id=myId>
<scrīpt language="Javascrīpt">
var input = document.createElement('<INPUT name="myName">');
input.id = 'myId';
alert(input.outerHTML);
</scrīpt>
```

消息框里显示的结果是：`<INPUT id=myId name=myName>`。

初始化Name属性的这个设计不是IE的缺陷，因为MSDN里说了要这么做的，可是这样设计的原理什么呢？我暂时没有想太明白。

这里再顺便说一下，要是页面中有n(n>1)个HTML元素的ID都相同了怎么办？在DHTML对象中怎么引用他们呢？如果我们使用ASPX页面，这样的情况是不容易发生的，因为aspnet进程在处理aspx页面时根本就不允许有ID非唯一，这是页面会被抛出异常而不能被正常的render。要是不是动态页面，我们硬要让ID重复那IE怎么搞呢？这个时候我们还是可以继续使用document.getElementById获取对象，只不过我们只能获取ID重复的那些对象中在HTML Render时第一个出现的对象。而这时重复的ID会在引用时自动变成一个数组，ID重复的元素按Render的顺序依次存在于数组中。

其实一句话：ID和html页面内部元素相关，不和页面元素的内容相关。name则更多地和页面元素的内容相关

看了看Reference，name还有一个用途window.name，最常见的就是windows.open的第二个参数，在`<A>`的target里用到。

iframe： 还有 frame 和 iframe 的 name 属性。

来源：[http://www.isstudy.com/htmljc/4405.html](http://www.isstudy.com/htmljc/4405.html)