---
title: 无插件解决Wordpress无法发送邮件的问题
tags:
  - PHP
  - wordpress
  - 邮件
id: 839
categories:
  - PHP
date: 2014-01-13 00:03:02
---

用过Wordpress的都知道，只要在“设置”->“讨论”里面设置了有人发表评论时或有评论等待审核时发送邮件通知后便可以在文章被评论时收到Wordpress的提醒邮件，但这个发送邮件是基于PHP的Mail函数的，而PHP的Mail要求php.ini有对应的设置，而虚拟主机用户往往无法修改这个设置便导致WP发送邮件失败，我们就不能在收到评论时看到提醒邮件了。

网上有很多种方法可以解决这个问题，虽然都是使用SMTP发送邮件，但具体实现不同：即通过SMTP插件、修改Wordpress源代码。但插件太多会使博客打开变慢，修改源代码在遇到WP更新时又会丢失所有的更改，于是我想到通过另一个方法来实现无插件调用SMTP发送邮件。

在看到网上的修改源代码的方法时我注意到修改的文件是wp-includes目录下的“pluggable.php”，“pluggable”不就是可被扩展的意思吗？打开发现里面的所有函数在定义前都调用了一次“if( ! function_exists(xxx))”来检测这个函数是否已经被定义过，也就是说如果我们在外部（插件或主题）上定义一个和这里重名的函数（wp_mail）就可以覆盖WP自带的wp_mail函数了。

所以我们要做的就是在主题的“functions.php”中添加一个“wp_mail”函数，并且参数和实现与自带的函数相同，这样就不需要再修改其它地方的调用代码。方法其实已经很简单了，直接复制“pluggable.php”中的“wp_mail”函数的实现，并粘贴在主题的“functions.php”中，再按网上的方法修改一部分代码即可。

下面提供我自己修改好的代码，只需要把下面的代码复制到主题“function.php”中，并且修改上面的HOST、邮件地址、密码等改成你自己的，就可了。（修改的部分包括使用SMTP发送邮件以及删除了默认的抄送和密送的支持），使用SMTP发送邮件记得要打开邮箱中对应的功能。

```php 重写wp_mail的代码
/**
 * 对邮件发送参数的部分定义
 */
define('ICEWINGCC_MAIL_HOST', 'smtp.qq.com');  //邮件服务器的地址
define('ICEWINGCC_MAIL_NAME', 'wordpress');  //要显示的发件人的名字，这个设置可以在发送前被改写
define('ICEWINGCC_MAIL_ADDR', 't1944@qq.com');  //发件人邮件地址（你的邮箱地址）
define('ICEWINGCC_MAIL_PSWD', '**********');  //邮件密码

/**
 * 使用SMTP方式发送邮件，重写WP的wp_mail函数
 *
 *函数返回TRUE只代表发送过程没有发生任何错误，并不代表用户就收到邮件
 *
 * 默认的Content-type是'text/plain'，且不允许使用HTML
 * 可以通过"wp_mail_content_type"筛选器来设置它，或者使用附加的header参数
 *
 *默认的编码使用WP的编码，可以使用"wp_mail_charset"筛选器来改变它。
 *
 * @uses apply_filters() Calls 'wp_mail' hook on an array of all of the parameters.
 * @uses apply_filters() Calls 'wp_mail_from' hook to get the from email address.
 * @uses apply_filters() Calls 'wp_mail_from_name' hook to get the from address name.
 * @uses apply_filters() Calls 'wp_mail_content_type' hook to get the email content type.
 * @uses apply_filters() Calls 'wp_mail_charset' hook to get the email charset
 * @uses do_action_ref_array() Calls 'phpmailer_init' hook on the reference to
 *		phpmailer object.
 * @uses PHPMailer
 *
 * @param string|array $to 发送到的邮件地址数组（或单个邮件地址）
 * @param string $subject 邮件标题
 * @param string $message 邮件正文
 * @param string|array $headers 可选的，附加的header
 * @param string|array $attachments 可选的，附件列表
 * @return bool 表明是否发送成功
 */
function wp_mail( $to, $subject, $message, $headers = '', $attachments = array() ) {
	// Compact the input, apply the filters, and extract them back out
	extract( apply_filters( 'wp_mail', compact( 'to', 'subject', 'message', 'headers', 'attachments' ) ) );

	if ( !is_array($attachments) )
		$attachments = explode( "\n", str_replace( "\r\n", "\n", $attachments ) );

	global $phpmailer;

	// (Re)create it, if it's gone missing
	if ( !is_object( $phpmailer ) || !is_a( $phpmailer, 'PHPMailer' ) ) {
		require_once ABSPATH . WPINC . '/class-phpmailer.php';
		require_once ABSPATH . WPINC . '/class-smtp.php';
		$phpmailer = new PHPMailer( true );
	}

	// Headers
	if ( empty( $headers ) ) {
		$headers = array();
	} else {
		if ( !is_array( $headers ) ) {
			// Explode the headers out, so this function can take both
			// string headers and an array of headers.
			$tempheaders = explode( "\n", str_replace( "\r\n", "\n", $headers ) );
		} else {
			$tempheaders = $headers;
		}
		$headers = array();

		// If it's actually got contents
		if ( !empty( $tempheaders ) ) {
			// Iterate through the raw headers
			foreach ( (array) $tempheaders as $header ) {
				if ( strpos($header, ':') === false ) {
					if ( false !== stripos( $header, 'boundary=' ) ) {
						$parts = preg_split('/boundary=/i', trim( $header ) );
						$boundary = trim( str_replace( array( "'", '"' ), '', $parts[1] ) );
					}
					continue;
				}
				// Explode them out
				list( $name, $content ) = explode( ':', trim( $header ), 2 );

				// Cleanup crew
				$name    = trim( $name    );
				$content = trim( $content );

				switch ( strtolower( $name ) ) {
					// Mainly for legacy -- process a From: header if it's there
					case 'from':
						if ( strpos($content, '<' ) !== false ) {
							// So... making my life hard again?
							$from_name = substr( $content, 0, strpos( $content, '<' ) - 1 );
							$from_name = str_replace( '"', '', $from_name );
							$from_name = trim( $from_name );

							$from_email = substr( $content, strpos( $content, '<' ) + 1 );
							$from_email = str_replace( '>', '', $from_email );
							$from_email = trim( $from_email );
						} else {
							$from_email = trim( $content );
						}
						break;
					case 'content-type':
						if ( strpos( $content, ';' ) !== false ) {
							list( $type, $charset ) = explode( ';', $content );
							$content_type = trim( $type );
							if ( false !== stripos( $charset, 'charset=' ) ) {
								$charset = trim( str_replace( array( 'charset=', '"' ), '', $charset ) );
							} elseif ( false !== stripos( $charset, 'boundary=' ) ) {
								$boundary = trim( str_replace( array( 'BOUNDARY=', 'boundary=', '"' ), '', $charset ) );
								$charset = '';
							}
						} else {
							$content_type = trim( $content );
						}
						break;
					default:
						// Add it to our grand headers array
						$headers[trim( $name )] = trim( $content );
						break;
				}
			}
		}
	}

	// Empty out the values that may be set
	$phpmailer->ClearAllRecipients();
	$phpmailer->ClearAttachments();
	$phpmailer->ClearCustomHeaders();
	$phpmailer->ClearReplyTos();

	// From email and name
	// If we don't have a name from the input headers
	if ( !isset( $from_name ) )
		$from_name = ICEWINGCC_MAIL_NAME;

	/**
	 * From邮箱统一设置
	 */
	$from_email = ICEWINGCC_MAIL_ADDR;

	// Plugin authors can override the potentially troublesome default
	$phpmailer->From     = apply_filters( 'wp_mail_from'     , $from_email );
	$phpmailer->FromName = apply_filters( 'wp_mail_from_name', $from_name  );

	// Set destination addresses
	if ( !is_array( $to ) )
		$to = explode( ',', $to );

	foreach ( (array) $to as $recipient ) {
		try {
			// Break $recipient into name and address parts if in the format "Foo <bar@baz.com>"
			$recipient_name = '';
			if( preg_match( '/(.*)<(.+)>/', $recipient, $matches ) ) {
				if ( count( $matches ) == 3 ) {
					$recipient_name = $matches[1];
					$recipient = $matches[2];
				}
			}
			$phpmailer->AddAddress( $recipient, $recipient_name);
		} catch ( phpmailerException $e ) {
			continue;
		}
	}

	// Set mail's subject and body
	$phpmailer->Subject = $subject;
	$phpmailer->Body    = $message;

	// 更改为使用SMTP发送邮件
	$phpmailer->IsSMTP();

	$phpmailer->SMTPAuth = true;

	$phpmailer->Host = ICEWINGCC_MAIL_HOST;
	$phpmailer->Username = ICEWINGCC_MAIL_ADDR;
	$phpmailer->Password = ICEWINGCC_MAIL_PSWD;

	// Set Content-Type and charset
	// If we don't have a content-type from the input headers
	if ( !isset( $content_type ) )
		$content_type = 'text/plain';

	$content_type = apply_filters( 'wp_mail_content_type', $content_type );

	$phpmailer->ContentType = $content_type;

	// Set whether it's plaintext, depending on $content_type
	if ( 'text/html' == $content_type )
		$phpmailer->IsHTML( true );

	// If we don't have a charset from the input headers
	if ( !isset( $charset ) )
		$charset = get_bloginfo( 'charset' );

	// Set the content-type and charset
	$phpmailer->CharSet = apply_filters( 'wp_mail_charset', $charset );

	// Set custom headers
	if ( !empty( $headers ) ) {
		foreach( (array) $headers as $name => $content ) {
			$phpmailer->AddCustomHeader( sprintf( '%1$s: %2$s', $name, $content ) );
		}

		if ( false !== stripos( $content_type, 'multipart' ) &amp;&amp; ! empty($boundary) )
			$phpmailer->AddCustomHeader( sprintf( "Content-Type: %s;\n\t boundary=\"%s\"", $content_type, $boundary ) );
	}

	if ( !empty( $attachments ) ) {
		foreach ( $attachments as $attachment ) {
			try {
				$phpmailer->AddAttachment($attachment);
			} catch ( phpmailerException $e ) {
				continue;
			}
		}
	}

	do_action_ref_array( 'phpmailer_init', array( &amp;$phpmailer ) );

	// Send!
	try {
		return $phpmailer->Send();
	} catch ( phpmailerException $e ) {
		return false;
	}
}
```

&nbsp;

* * *

修改于2014年4月18日

非常感谢John提出的关于wp_mail函数被重新定义的问题，这个问题产生的原因可以参见我的另一篇文章《[WordPress可扩展函数（pluggable）的作用及用法](http://blog.icewingcc.com/understanding-wp-pluggable-functions.html)》，简单来说就是Pluggable函数是不能写在主题functions.php文件中的，因为它会在扩展函数之后被加载。
另外我发现了一个比扩展wp_mail函数更方便的方法（扩展系统函数虽然能提供更大的自由度但毕竟代码较为复杂），即在PHPMailer类初始化的时候就修改为使用SMTP发送邮件：

```php
/**
* 修改邮件发送方式为使用SMTP发送
*/
add_action('phpmailer_init', 'mail_smtp');
function mail_smtp( $phpmailer ) {
	$phpmailer->FromName = '冰翼博客';  //对方收到邮件后显示的发件人名称
	$phpmailer->Host = 'smtp.exmail.qq.com';  //SMTP服务器
	$phpmailer->Port = 465;   //SMTP端口号
	$phpmailer->Username = 'jerry@icewingcc.com';  //发送邮件的邮箱账号
	$phpmailer->Password = '***********';  //发送邮件的邮箱密码
	$phpmailer->From = 'jerry@icewingcc.com';   //来自，应与 Username相同
	$phpmailer->SMTPAuth = true;
	$phpmailer->SMTPSecure = 'ssl'; //tls or ssl ，是否启用SSL
	$phpmailer->IsSMTP();  //这一行指定了使用SMTP发送邮件
	return $phpmailer;
}
```

代码如上，把对应的信息设成你自己的就OK了。
