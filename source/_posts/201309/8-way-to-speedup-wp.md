---
title: 8个简单方法提升WordPress速度
tags:
  - wordpress
  - 插件
  - 效率
id: 527
categories:
  - PHP
date: 2013-09-02 21:47:35
updated: 2016-05-22 11:25:57
---

WordPress是一个很棒的开源程序，几乎我认识的站长朋友当中，粗略估算有80%使用[Wordpress](http://blog.icewingcc.com/category/wordpress)。但很棒不等于完美，就在我所认识的这些朋友中，几乎所有人都会抱怨Wordpress太臃肿，运行效率太低了，大家有无同感？

所以，今天这篇博文和大家分享8个小贴士来提升WP的运行效率，如果您运用了这些方法后发现确实有帮助，请把这篇博文分享给更多的人好吧？当然为了尊重劳动成果，也烦请指明出处。

**1、使用高效的缓存插件**

WordPress的插件们是非常有用的， 我推荐一款缓存插件可以改善页面载入时间，它就是[W3 Total Cache](http://wordpress.org/extend/plugins/w3-total-cache)，有了这个插件之后咱就不再推荐你其他缓存插件了，因为所有缓存插件有的功能它都有了，而且安装和使用非常方便。

拥有这款插件之后，你的页面载入速度会加快，因为网站的主要元素已经被缓存了。

**2\. 使用内容分发网络 (CDN)**

基本上所有你喜欢的大网站都会使用CDN。简单来说，CDN是把你站点上的文件们（CSS\JS\图片等）发布到最接近用户所在的网络区域，让用户就近下载，这样就能提高站点运行速度。在国内ChinaCache是比较有名的CDN供应商，不过价格贵了一些，像各大门户网站，比如腾讯、新浪、网易等等都是用ChinaCache。所以不管你在哪里，访问这些门户网站都会觉得速度很快。当然啦，对于小站来说，这个成本可能会高一些，

所以，你无论是在南方，或者北方，还是在北美，访问这些门户网站，感觉速度都很快，最主要的原因之一就是CDN发挥了效果。一般小网站是用不起这服务的，所以慢点就慢点了吧，可以租用互联互通的6线机房（6线机房是指包括网通、电信、铁通、移动、联通、教育网等多线接入的骨干网IDC机房，彻底消除各地网络瓶颈，保证互联网访问畅通无阻的高速机房。）

顺便提一下，还有一个Wordpress插件叫[Free-CDN](http://wordpress.org/extend/plugins/free-cdn)，号称也能达到类似的效果，虽然我还没有做过测试…

**3、图片优化很重要**

Yahoo! 有一个图片优化软件叫Smush.it可以最大程度无损压缩图片，不过，除非你超级有耐心，否则一张张压缩图片的话太浪费时间了，好在，还有一个很给力的WP插件叫[WP-SmushIt](http://wordpress.org/extend/plugins/wp-smushit)，这货可以为你网站上所有的图片做一次性压缩，所以没有理由不去用它。

**4、优化你的WP数据库**

你可以用[WP-Optimize](http://wordpress.org/extend/plugins/wp-optimize/installation)这个插件来优化你的WP数据库（清理spam，反复改版的文章，草稿，表格等等为你的服务器腾出更多空间从而提升效率）；还有一些插件如[WP-Cleaner](http://wordpress.org/plugins/wpcleaner)，[DB-Manger](http://wordpress.org/plugins/wp-dbmanager)等。

**5、开启防盗链机制**

盗链是带宽的窃贼，当其他网站直接引用你站点的图片的时候，这会影响占用你本身的服务器资源从而影响网站运行效率，你的站点越出名，就会有越多的人盗用你的图片，解决方法是Wordpress有现成的插件[Hotlink Protection](http://wordpress.org/plugins/wordpress-automatic-image-hotlink-protection)。当然也可以通过重写htaccess文件来达到同样的效果，欲深入了解的童鞋可以询问自己的空间商如何设置。

**6、为文件添加过期时间**

关于这个文件过期时间，听起来很玄乎，其实就是通过header报文来指定特定类型的文件在浏览器中的缓存时间。有些文件（例如样式表中调用的背景图片和一些装饰性图片）其实在很长一段时间内这些图片都不会有很大的变化，所以对这类文件我们不妨设置长一些的缓存时间，这样浏览器就不需要每次从服务器下载这些文件而直接从缓存中读取，这样绝对可以提升加载速度。

当然，所以做法很简单，只需要在网站的.htaccess文件中加入以下代码，

```
<IfModule mod_expires.c>
ExpiresActive On
ExpiresDefault A600
ExpiresByType image/x-icon A2592000
ExpiresByType application/x-javascript A604800
ExpiresByType text/css A604800
ExpiresByType image/gif A2592000
ExpiresByType image/png A2592000
ExpiresByType image/jpeg A2592000
ExpiresByType text/plain A86400
ExpiresByType application/x-shockwave-flash A2592000
ExpiresByType video/x-flv A2592000
ExpiresByType application/pdf A2592000
ExpiresByType text/html A600
</IfModule>

```

稍微解释一下，text/css表示样式表文件，text/plain代表的纯文本类文件，依次类推。其中A2592000就表示这种类型文件在浏览器中的缓存时间，以秒为单位。一天86400秒，2592000就表示这类文件可以缓存30天。

如果你不是经常修改模板，那样式表文件和javasctipt文件基本上也可以设置缓存一周到一个月左右。text/html文件不要设置太长的缓存时间，因为这些东西修改的频率很高，一天更新一次是有必要的。

**7、为你的图片添加延时加载**

延时加载就是当用户停留在第一屏的时候，不加载任何第一屏以下的图片信息，只有当用户把鼠标往下滚动的时候，这些图片才开始加载。这玩意儿不仅可以提升站点载入速度，更是可以节省带宽。要轻松的拥有这项功能，请安装WP的[jQuery Image Lazy Load](http://wordpress.org/extend/plugins/jquery-image-lazy-loading) 插件吧。

**8、控制文章草稿存数数**

通常一篇博文我会保存10次以上的草稿，而Wordpress会无限制的存储每个草稿；如果我的博文已经发布了，为啥我还需要这些储存的草稿文章呢？所以这就是为啥我会用 [Revision Control](http://wordpress.org/extend/plugins/revision-control) 插件来确保这些草稿内容的最小化。通常我会设置只存储2-3篇草稿来防止万一，但存储的数量绝对不会太高，否则你的WordPress backend只会被这些无意义的内容塞满从而降低运行效率。

好了，今天的分享就到这里，希望对大家有帮助，其实这些要点不仅仅对Wordpress有帮助，对其他开源网站也同样奏效。:-)

&nbsp;

来源：[SEOTime](http://seotime.org/blog/8-easy-ways-to-speed-up-wordpress)
