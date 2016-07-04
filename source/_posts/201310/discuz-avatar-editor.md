---
title: 独立Discuz头像编辑模块
tags:
  - avatar
  - discuz
  - 源码
id: 667
categories:
  - PHP
date: 2013-10-06 21:35:24
updated: 2016-05-22 11:30:00
---

摘要：在Discuz产品系列（包括UCenter、UCHome）中有一个flash头像上传编辑的功能比较好用，和之前自己用js实现的照片在线编辑插件比较像，于是想将它独立出来，一方面可以学习研究，另一方面有机会可以在项目中使用（这里主要是指Asp.Net程序,php的与之类似）。

**主要内容：**

1.  版权声明
2.  头像上传和编辑的原理
3.  独立头像上传及编辑模块

### 一、版权声明

由于此模块核心均来自于Discuz NT，根据相关规定："**禁止在 Discuz! / UCenter 的整体或任何部分基础上以发展任何派生版本、修改版本或第三方版本用于重新分发。**"
因此在开始下面的内容之前声明如下：

本程序仅为个人学习研究，不以营利为目的，如若侵犯他人利益，[请发送邮件KenshinCui@hotmail.com](mailto:KenshinCui@hotmail.com)联系作者，本人获得通知后立即删除相关内容，其他第三方下载者或使用者在使用时注意其内容版权归[北京康盛新创科技有限责任公司](http://www.comsenz.com/products/discuz) 所有。

### 二、头像上传和编辑的原理

在Discuz中头像上传和编辑主要通过flash来完成，它处理了包括文件上传和裁切的主要核心工作，但是我们这里没有.fla源文件，只有.swf文件，所以要弄清其原理就必须跟踪相关的接口调用。

在此之前我们首先需要了解在Discuz中flash的页面代码是通过document.write动态生成的，其中的输出的字符串是通过调用AC_FL_RunContent()这个js方法（这个方法在common.js中）。它主要是生成相关falsh的html布局代码，结构大致如下：

```html
<object width="540" height="253" id="mycamera" name="mycamera" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" >
    <param name="scale" value="exactfit" />
    <param name="movie" value="/images/common/camera.swf?nt=1&amp;amp;inajax=1&amp;appid=67111770b37d9fc06c56e691c013b685&amp;input=Jv5BQ48IKF4=&amp;ucapi=http%3a%2f%2fkenshincui-pc%3a305%2ftools%2fajax.aspx" />
    <param name="quality" value="high" />
    <param name="bgcolor" value="#ffffff" />
    <param name="wmode" value="transparent" />
    <param name="menu" value="false" />
    <param name="swLiveConnect" value="true" />
    <param name="allowScriptAccess" value="always" />
</object>
```

在上面的代码中最重要的就是movie参数，它定义了头像名称、裁切上传api路径以及flash所在路径等。

有了这些信息之后我们只需要了解相关接口调用接口，这时我们可以打开fiddler进行跟踪：

![discuz_photoedit_fiddler_1](https://cdn.icewing.cc/wp-content/uploads/2013/10/discuz_photoedit_fiddler_1-600x472.png)

在首次到达头像修改界面的时候访问了/images/common/camera.swf?nt=1&amp;inajax=1&amp;appid=1036681732c9187901d4693bf1ab8416&amp;input=DCdSBXIA4rY=&amp;ucapi=http%3a%2f%2f192.168.1.92%3a312%2ftools%2fajax.aspx

这就是上面我们说的movie参数的值，由于像input（后面我们会发现它就是头像图片的名称）等信息需要是动态设定的，所以Discuz设计的时候采用动态生成js的方法。

接着我们上传一张照片：

![discuz_photoedit_fiddler_2](https://cdn.icewing.cc/wp-content/uploads/2013/10/discuz_photoedit_fiddler_2-600x472.png)

从跟踪可以看到访问路径/tools/ajax.aspx?m=user&amp;inajax=1&amp;a=uploadavatar&amp;appid=1036681732c9187901d4693bf1ab8416&amp;input=DCdSBXIA4rY%3D&amp;agent=null&amp;avatartype=null，它是主要负责处理照片上传的，其中的a参数告诉ajax.aspx执行何种操作（事实上后面我们会发现a为uploadavatar则执行上传操作），input参数同上面一样，是头像图片的名称。

然后我们执行裁切：

![discuz_photoedit_fiddler_3](https://cdn.icewing.cc/wp-content/uploads/2013/10/discuz_photoedit_fiddler_3-600x472.png)

从Fiddler中我们可以看到请求路径为/tools/ajax.aspx?m=user&amp;inajax=1&amp;a=rectavatar&amp;appid=1036681732c9187901d4693bf1ab8416&amp;input=DCdSBXIA4rY%3D&amp;agent=null&amp;avatartype=null，这是a参数变成了rectavatar，其他信息基本和上一步操作一致，经过分析我们可以看到这一步对应的是裁切保存操作。

有了上面的分析我们可以大概了解到在Discuz中整个头像上传及编辑功能大概的原理，我们发现在代码实现部分主要就是ajax.aspx这个页面，因此我们可以打开这个页面对其进行修改去掉同Discuz自身业务无关的东西，形成一个独立的小组件。

### 三、独立头像上传及编辑模块

有了上面的分析之后我们要独立上传模块并不太难。首先我们可以将ajax.aspx独立出来去掉其中和具体业务有关的代码，只保留上传和保存操作，并将其路径设计为可配置的。其次我们可以将动态生成flash布局代码的方式改为静态的，因为对我们来说其他参数都不重要，重要的就是图片保存名称而已，这个过程中我们经过加工可以将其网络路径设置为动态获取的（原来Discuz中是在安装过之后设置死的）。最后我们将flash其相关文件拷贝到项目中就可以了，这其中除了.swf文件还有多国原因包用到的locale.xml，以及本地跨域文件crossdomain.xml。

OK，说了那么多下面看看我们独立出来的模块如何使用吧。

首先这个独立头像编辑模块目录结构如下：

![discuz_photoedit_use_1](https://cdn.icewing.cc/wp-content/uploads/2013/10/discuz_photoedit_use_1-600x151.png)

使用时只需要拷贝bin中的PhotoEditor.dll拷贝到站点bin目录中；将crossdomin.Js、Ajax.aspx、photoEdit.htm、js目录、images目录放到站点根目录中，然后在Web.config添加如下配置：

```html
<add key="ImagePath" value="images"/><!--图片存放的相对路径-->
<add key ="TempFilePath" value="images/upload"/><!--上传的临时文件路径-->
<add key="ImageSize" value="all"/><!--图片大小，支持三种，分别是large、medium、small，如果使用三种则配置为all--></pre>
当然其中的图片路径即生成的照片路径都可以根据情况修改的。

在使用过程中只需要调用photoEdit.js中的SetPhotoName()传递图片名称即可（可以通过后两个参数设置flash存放路径和Ajax.aspx地址）：
<pre class="lang:default decode:true"><mce:script type="text/javascript" language="javascript"><!--
    SetPhotoName("YukoOgura");
// --></mce:script>
```

另外SetPhotoName()方法还有两个可选参数，那就是flash文件的路径和处理上传和裁切的Ajax.aspx路径，换句话说这两个路径也是可以随意放的。

下面看看实际效果（通过"拍摄照片"的方式上传和编辑照片的截图比较类似就不再截图了）：

上传一张照片：

![discuz_photoedit_edit_1](https://cdn.icewing.cc/wp-content/uploads/2013/10/discuz_photoedit_edit_1-600x485.png)

执行裁切操作：

![discuz_photoedit_edit_2](https://cdn.icewing.cc/wp-content/uploads/2013/10/discuz_photoedit_edit_2-600x485.png)

裁切后生成三种尺寸的图片：

![discuz_photoedit_edit_3](https://cdn.icewing.cc/wp-content/uploads/2013/10/discuz_photoedit_edit_3-600x180.png)

[模块下载地址](http://cid-e7bd5e8882a6a2da.office.live.com/self.aspx/BlogFile/PhotoEdit.zip)

&nbsp;

转自：[博客园](http://blog.csdn.net/kenshincui/article/details/6525422)