---
title: PHP5.4新特性，支持上传进度回显
tags:
  - PHP
  - 上传
id: 933
categories:
  - PHP
date: 2014-02-26 12:01:48
---

文件上传进度反馈, 这个需求在当前是越来越普遍，比如大附件邮件。在PHP5.4以前, 我们可以通过APC提供的功能来实现. 或者使用PECL扩展uploadprogress来实现。这些方法虽然能解决现有的问题，但也有明显的不足，如必须安装扩展。

从PHP的角度来说, 最好的储存这些信息的地方应该是SESSION, 首先它是PHP原生支持的机制。其次, 它可以被配置到存放到任何地方(支持多机共享)。

正因为此, Arnaud Le Blanc提出了针对Session报告上传进度的[RFC](http://wiki.php.net/rfc/session_upload_progress), 并且现在实现也已经包含在了PHP5.4的主干中.

这个新特性, 提供了一些新的INI配置, 他们和APC的相关配置很类似：
```
session.upload_progress.enabled[=1] : 是否启用上传进度报告(默认开启)
session.upload_progress.cleanup[=1] : 是否在上传完成后及时删除进度数据(默认开启, 推荐开启)
session.upload_progress.prefix[=upload_progress_] : 进度数据将存储在_SESSION[session.upload_progress.prefix . _POST[session.upload_progress.name]]
session.upload_progress.name[=PHP_SESSION_UPLOAD_PROGRESS] : 如果_POST[session.upload_progress.name]没有被设置, 则不会报告进度.
session.upload_progress.freq[=1%] : 更新进度的频率(已经处理的字节数), 也支持百分比表示
session.upload_progress.min_freq[=1.0] : 更新进度的时间间隔(秒级)
```

对于如下的上传表单：

```html
<form action="upload.php" method="POST" enctype="multipart/form-data">
	<input type="hidden" name="<?php echo ini_get("session.upload_progress.name"); ?>" value="laruence" />
	<input type="file" name="file1" />
	<input type="file" name="file2" />
	<input type="submit" />
</form>
```

如果我们上传一个足够大的文件(网速要是足够慢就更好:P), 我们就可以从_SESSION中, 得到类似下面的进度信息：

```php
$_SESSION["upload_progress_laruence"] = array(
	"start_time" => 1234567890,   // 请求时间
	"content_length" => 57343257, // 上传文件总大小
	"bytes_processed" => 453489,  // 已经处理的大小
	"done" => false,              // 当所有上传处理完成后为TRUE
	"files" => array(
		0 => array(
			"field_name" => "file1",       // 表单中上传框的名字
			// The following 3 elements equals those in $_FILES
			"name" => "foo.avi",
			"tmp_name" => "/tmp/phpxxxxxx",
			"error" => 0,
			"done" => true,                // 当这个文件处理完成后会变成TRUE
			"start_time" => 1234567890,    // 这个文件开始处理时间
			"bytes_processed" => 57343250, // 这个文件已经处理的大小
		),
	// Another file, not finished uploading, in the same request
		1 => array(
			"field_name" => "file2",
			"name" => "bar.avi",
			"tmp_name" => NULL,
			"error" => 0,
			"done" => false,
			"start_time" => 1234567899,
			"bytes_processed" => 54554,
		),
	)
);
```

既然SESSION中实时保存了这些信息，我们就可以很简单地通过AJAX方式来获取进度了，只需要一个简单的AJAX GET并且对应的PHP脚本中返回这个SESSION中对应的值即可。是不是很方便呢？
