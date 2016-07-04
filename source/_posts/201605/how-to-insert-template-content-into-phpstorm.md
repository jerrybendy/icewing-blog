---
title: PHPStorm/WebStorm插入当前时间的方法（自定义模板）
date: 2016-05-27 21:03:52
updated: 2016-05-27 21:03:52
tags:
  - PHPStorm
  - WebStorm
categories:
  - 软件
---

JetBrains 家族开发的一系列 IDE 目前被越来越多的人所使用，包括 PHPStorm、WebStorm、IntelliJ IDEA等。

今天就以 PHPStorm 为例，说下如何在 PHPStorm 中快速插入当前时间。方法可对 JetBrains 家族的所有 IDE 通用，并且可定制为快速插入任意模板内容。

<!--more-->

一、打开“偏好设置”

点击菜单中的`preference`打开 PHPStorm 的设置窗口（windows 下似乎是叫 `Settings`）。

依次展开左侧的`Editor` -> `Live Template`。

![偏好设置页面](https://cdn.icewing.cc/201605/phpstorm-template-1.jpg)

二、点击右侧的`+`号，新建一个模板或模板组

如果你有多个模板需要添加并且想把它们归类的话可以添加一个模板组，点击`Template Group`并输入组名即可。

![添加模板](https://cdn.icewing.cc/201605/phpstorm-template-2.jpg)

三、创建模板

选择一个已经存在的分组或自己创建的分组，点击右侧的`+`号，`Live Template`。

![添加模板](https://cdn.icewing.cc/201605/phpstorm-template-3.jpg)

打开的编辑栏中各项参数的含义如下：

`Abbreviation` - 缩略词的写法，例如我想通过在编辑器中输入`datetime`就可以快速输入当前的日期和时间，那么这里就填`datetime`。

`Description` - 对当前模板的描述信息，是方便自己在使用模板时可以有文字提示，我在这里输入了`Press TAB to insert detetime here`，可以随便写或留空。

`Template text` - 模板文本，也就是我输入`datetime`并按`tab`键之后将要显示的文本。可以是任意模板内容、静态内容等，模板内容中的变量要使用两个`$`号围起来。

`Expand with` - 展开代码的方式，默认是按`tab`键应用模板内容，还可以改成空格键或回车键。

`Reformat according to style` - 插入的模板内容是否根据当前上下文重新格式化。这对插入多行代码的模板十分有用。

下面红字提示部分，`No application contexts yes.`，意思是指没有为当前模板指定上下文。模板可以设定为只针对特定的环境有效，如只在PHP代码中可用、只对JS代码中可用等。这里因为我只是想插入日期时间，和什么语言没有关系，就全选了。（点右边的`Define`）

重点在这里——

点击`Options`上方的按钮`Edit variables`，弹出如下窗口：

![定义模板变量](https://cdn.icewing.cc/201605/phpstorm-template-4.jpg)

刚才我们在`Template text`中定义的双`$`号包围的变量会自动出现在弹出的窗口中。接下来要为这个模板变量赋值。

在`Expression`中输入需要的表达式。日期时间可以选择`date()`函数并编辑，或者直接输入`date("yyyy-MM-dd HH:mm:ss")`。然后直接点右下角的`OK`（这里似乎是一个BUG，如果输入了表达式内容后点击其它任意空白处，输入的内容会被清空掉，直接点`OK`键即可保存输入）。

关于`Expression`可以输入的表达式内容可以[参见官网上面给出的列表](https://www.jetbrains.com/help/phpstorm/2016.1/edit-template-variables-dialog.html)。需要注意的是因为 PHPStorm 是用 JAVA 写的，所以例子中我们自定义的日期格式要遵循 JAVA 标准库中的格式定义。如`date("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")`可能会输出`2016-05-27T22:24:01.429Z`。

再次点击`OK`完成模板的创建。来尝试一下吧。

由于上下文环境中我刚才是全选的，也就是在任意环境都可以使用这个模板变量。

随便打开了一个 js 文件，在里面输入`datetime`，如下所示，IDE 已经给出了提示，按下`Tab`键即可在当前位置搞入系统时间。

![小试一下](https://cdn.icewing.cc/201605/phpstorm-template-4.jpg)

由图中可以看出右侧的提示信息就是我刚才在`Description`中输入的信息，这样可以在模板比较多的时候不致于弄混某一个模板的用途。

OK，在这里关于 JetBrains 家族 IDE 中添加模板的过程就讲完了。模板在我们平常写代码的过程中有很多用途，例如快速创建文件头部版权定义、快速插入函数体、甚至可以通过一个简单的指令创建一个 AngularJS 程序！

在这款 IDE 中还隐藏着很多强大的功能有待去发掘。

{% blockquote 不记得是谁说的了 %}
充分了解你使用的 IDE 可以使你的工作效率提高一倍！
{% endblockquote %}

&nbsp;

参考资料：
* [jetbrains.com](https://www.jetbrains.com/help/phpstorm/2016.1/edit-template-variables-dialog.html)
* [stackoverflow](http://stackoverflow.com/questions/8714779/is-there-a-shortcut-for-inserting-date-time-in-intellij-idea)
