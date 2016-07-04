---
title: 编写高效的CSS(二)
tags:
  - HTML/CSS
  - 技巧
  - 效率
id: 189
categories:
  - 前端
date: 2013-04-04 00:14:37
---

继上节讨论了一些常用的提高CSS效率技巧之外,本文将参考Mozilla UI 中介绍的CSS优化规则深入讨论CSS的优化原理.

本文第一部分说明CSS的书写规则,第二部分分析应该使用哪些规则才能使页面渲染效率更高.

### 一.CSS的4种书写规则

首先声明,我在本文中定义一个术语叫– *主选择符*. 其定义是在一个选择符中最右边的那部分.(浏览器匹配选择符的时候是从最右边开始的,而不是从他的祖先选择符开始的.)举例说明:

```css
a img,
div > p,
h1 + [title] { }

div p a{}
```
这里主选择符就是指 `img`, `p`, `[title]`, `a`.

#### 1.ID系列选择符

就是包含ID的选择符

例如:

```css
button#backButton { } /* This is an ID-categorized rule */
#urlBar[type="autocomplete"] { } /* This is an ID-categorized rule */
.treeitem > .treerow > .treecell#myCell:active { } /* This is an ID-categorized rule */
```

####  2.Class 系列选择符

包含class的选择符

例如:

```css
button.toolbarButton { } /* A class-based rule */
.fancyText { } /* A class-based rule */
.menuitem > .menu-left[checked="true"] { } /* A class-based rule */
```

####  3.标签(tag)选择符

指不包含ID和CLASS的 纯标签组成的选择符

例如:

```css
td { } /* A tag-based rule */
.treeitem > .treerow { } /* A tag-based rule */
input[type="checkbox"] { } /* A tag-based rule */
```

####  4.通用选择符

除了上述3种以外的情况

例如:

```css
[hidden="true"] { } /* A universal rule */
* { } /* A universal rule */
.tree > [collapsed="true"] { } /* A universal rule */
```

###  二.CSS的匹配原理

(本文参考的是Mozilla文档,因此不确定IE是否是同样的原理.)

CSS的匹配规则是从选择符的最后一个开始依次往上匹配.直到最顶一级.

例如:

```css
div .news ul li span {}
```

匹配的时候会先匹配所有的span 然后检查父元素是否是li 然后是ul 依次类推.

如果只有一个ID,则直接检出这个元素.如果只有一个class,则检索出符合class的一组元素,如果是一个标签选择符,只匹配符合此标签的一组元素,如果是通用选择符,则匹配所有元素.

因此提高页面渲染效率的关键是使用确切的选择符,以减少不必要的匹配时间.

### 三.提高CSS效率的一些建议

#### 1、不要在ID前面添加额外的选择符

如果你有一个选择器是以id作为关键选择符，请不要添加多余标签名上去。因为ID是唯一的，你不要为了一个不存在的理由而降低了匹配的效率。

* 不赞成 – button#backButton { }
* 不赞成 – .menu-left #newMenuIcon { }
* 建议用 – #backButton { }
* 建议用 – #newMenuIcon { }

同样对于class:

* 不赞成 – treecell.indented { }
* 建议用 – .treecell-indented { }
* 最好用 – .hierarchy-deep { }

#### 2、尽量选择最特殊的类来存放选择器

降低系统效率的一个最大原因是我们在标签类中用了过多的选择符。通过添加 class 到元素，我们可以将类别进行再细分为 class 类，这样就不用为了一个标签浪费时间去匹配过多的选择符了。

* 不赞成 – treeitem[mailfolder=”true”] > treerow > treecell { }
* 建议用 – .treecell-mailfolder { }

#### 3、避免子孙选择符

子孙选择符是CSS中最耗资源的选择符。他真的是非常的耗资源，尤其是在选择器使用标签类或通用类的时候。很多情况中，我们真正想要的是子选择符。除非有明确说明，在 UI CSS 中是严禁使用子孙选择符的。

* 不赞成 – treehead treerow treecell { }
* 好一点，但还是不行(参照下一条) – treehead > treerow > treecell { }

#### 4、标签类中不要包含子选择符

不要在标签类中使用子选择符。否则，每次元素的出现，都会额外地增加匹配时间。（特别是当选择器似乎多半会被匹配的情况下）

* 不赞成 – treehead > treerow > treecell { }
* 建议用 – .treecell-header { }

#### 5、留意所有子选择符的使用

小心地使用子选择符。如果你能想出一个的不使用他的方法，那么就不要使用。特别是在 RDF 树和菜单会频繁地使用子选择符，像这样。

* 不赞成 – treeitem[IsImapServer=”true”] > treerow > .tree-folderpane-icon { }

请记住 RDF 的属性是可以在模板中被复制的！利用这一点，我们可以复制那些想基于该属性改变的子 XUL 元素上的 RDF 属性。

* 建议用 – .tree-folderpane-icon[IsImapServer=”true”] { }

#### 6.善于利用继承

理解哪个属性会继承，并允许他们这么做！我们已经清楚地建立了 XUL widgetry(?) ，所以你可以把 list-style-image 或 font 属性设置在父标签上，然后他会渗透到匿名内容里。这样，你就不需要浪费时间在匿名内容上直接写声明了。

* 不赞成 – #bookmarkMenuItem > .menu-left { list-style-image: url(blah); }
* 建议用 – #bookmarkMenuItem { list-style-image: url(blah); }

&nbsp;

转自：[http://www.yiyifly.com/blog/archives/346 | 吹衣轻飏](http://www.yiyifly.com/blog/archives/346)