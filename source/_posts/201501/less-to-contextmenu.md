---
title: 在前端使用和编译LESS
tags:
  - HTML/CSS
  - LESS
id: 1188
categories:
  - 前端
date: 2015-01-23 11:22:45
updated: 2016-05-22 11:58:20
---

做前端的应该都会知道LESS，使用LESS书写CSS样式可以在很大程序上降低工作量以及由拼写造成的错误，但对新手来说除了LESS的语法外，如何在自己的工作环境上用上LESS可能也是个问题。

个人认为，使用LESS最简单的方法就是实时编译：即对LESS文件做的修改可以在不额外加任何操作（编译）的情况下应用在测试环境甚至生产环境，毕竟对LESS文件每做一点小修改都要重新编译一次也太麻烦了些，而且很慢。

实时编译有两种方法：一是在HTML中引入less.js文件，并且设置工作环境是“development”，这样在网页每次载入时都会重新编译LESS文件；二是使用某些编辑器，如Sublime Text，Sublime Text有几个插件可以在保存LESS文件的时候自动编译这个文件。

### 使用less.js

使用less.js（即官网上说的客户端用法）需要先下载less.js文件，Github地址:[https://github.com/less/less.js](https://github.com/less/less.js)，文件在 dist 目录内。 less.min.js是其压缩版本。

客户端用法是在开发时最方便的一种方法，但不适用于生产环境，因为每次打开页面都需要编译所以性能会比较差。

使用less.js需要把引入CSS的rel属性改成 “stylesheet/less”，并且引入less.js文件：

```html
<link rel="stylesheet/less" type="text/css" href="styles.less" />

<script src="less.js" type="text/javascript"></script>
```

必须要保证你的JS是在LESS文件之后导入的，建议只导入一个LESS文件，其它文件可以在LESS文件内通过`@import "xxx.less";`的方式导入。

可以为less.js指定某些编译选项，这些选项应该在less.js文件导入之前：

```html
<!-- 在导入less.js之前设置参数 -->
<script>
  less = {
    env: "development",
    async: false,
    fileAsync: false,
    poll: 1000,
    functions: {},
    dumpLineNumbers: "comments",
    relativeUrls: false,
    rootpath: ":/a.com/"
  };
</script>
<script src="less.js" type="text/javascript"></script>
```

其中的`env`支持两个参数，即`development`和`production`，development为开发环境，每次刷新页面都会重新编译LESS；production是生产环境（不建议在生产环境使用less.js），系统会将编译生成的CSS样式存储在浏览器的LocalStorage中，下次使用不会再重新编译。

`dumpLineNumbers`可以帮你快速在LESS文件中定位到错误的位置。

### 在Sublime Text中使用LESS

因为我一般是使用第一种方法，所以这个方法我了解的也不多。

首先在ST中安装“LESS”插件，可以打开LESS文件的代码高亮功能。

ST中编译LESS需要安装Node及lessc，安装Less2CSS插件可以“工具”->“编译系统”中多出一个LESS的选项，选中它，点击“工具”->“编译”即可把LESS文件编译成同名的CSS文件。

### 把编译LESS加入Windows右键菜单

此方法与ST中类似，只不过是把编译放进了Windows的右键菜单，而不是ST的编译命令中。

首先还是需要安装Node和lessc，确保在cmd中输入“lessc”可用。

创建一个批处理文件命名为“makeless.bat”，内容如下：

```shell
@echo off
cd /d %~dp1
lessc %1 > %~n1.css
```

把该文件移到系统的windows目录下，打开注册表编辑器。

定位到“HKEY_CLASSES_ROOT\.less”，不存在请新建，如已存在需要查找默认值的名称，并在HKEY_CLASSES_ROOT中定位它。

创建或打开“shell\”项，新建子项“make”，默认项改为“编译LESS”；

创建子项“command”，默认项改为`makeless.bat "%1"`，引号不可省略。

（啰嗦一大堆其实就是基本的右键菜单操作方法）

然后在所有.less文件的右键菜单中就会出现“编译LESS”的命令，点击之将会在当前目录中生成与LESS文件同名的css文件（如果编译出错的话错误信息也会输出到这个CSS文件中）
