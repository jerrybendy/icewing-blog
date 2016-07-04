---
title: 与垃圾评论战斗在一线~~
tags:
  - 垃圾评论
id: 842
categories:
  - PHP
date: 2014-01-13 23:07:28
---

由于以前使用的多说评论，几乎看不到什么垃圾评论，自从朋友说使用多说后收不到我回复时的邮件通知（其实我自己出收不到通知邮件）我就把多说给禁了，从此后垃圾评论满天飞啊~~

试过各种方法去拦截，后来又发现我所用的空间不支持PHP的Mail函数所以导致不能发送邮件（现在开始怀疑多说收不到通知邮件是不是也是这个原因），就尝试重写了wp_mail函数，邮件功能恢复后就开始了邮件满天飞的情况，垃圾邮件到了不得不阻止的地步了。

开始是自己写了个简单的插件，虽然写个小插件与直接改funcions.php效果一样，插件只实现一个简单的功能：就是当评论的内容包含一个以上的链接时将其标记为垃圾评论，误判率低于5%！尽管如此可还是能收到每条垃圾评论的邮件通知。又试着修改“wp-comment-post.php”的文件名，似乎没什么用，又修改其源代码在“wp-comment-post.php”的前面加上了一个额外的字段的判断，并且在主题上添加对应的隐藏字段，这样一来理论上可以防止所有机器人的评论，郁闷的是竟然没起作用？！

```php
if( ! isset($_POST['icewingcc_spam_check'])  || $_POST['icewingcc_spam_check'] != 'oi;D]m*92.rZAMl/b<14}CTczbHdG2KzjvEq,DLKw|t0)#LLd/f5OV/%{!=^+HFk'){
    die('Spam comment is not allowed');
}
```

真的很纠结，换个思路吧，既然垃圾评论已经被识别为垃圾评论了，只要阻止垃圾评论的邮件通知不就可以了吗？查找邮件通知的代码，发现在“wp-includes/pluggable.php”中有一个叫做“wp_notify_postauthor”的函数是控制评论邮件通知的，从Wordpress3.7开始这个函数里面定义了个新的Filter  “comment_notification_recipients”，它接受两个参数，如果mail为空的话便会返回FALSE，就不会继续发送邮件啦。

在上面的插件函数中检测到是垃圾评论时执行以下方法：

```php
wp_spam_comment($comment_id);
add_filter('comment_notification_recipients', 'icewingcc_prevent_notification', 10, 2);

function icewingcc_prevent_notification($emails, $comment_id){
    return array();
}
```

郁闷的是这些代码在本地测试的时候有效，放在空间却没有执行~~因为这是个新出的Filter，网上也找不到相关的说明，不知用法对不对呢。

以下是完整的插件代码：

```php
<?php
/*
Plugin Name: icewingcc_functions
Plugin URI: http://blog.icewingcc.com
Description: 一些额外的函数集合，不可以禁用此插件，以免出错
Version: 1.06
Author: Jerry Bendy
Author URI: http://blog.icewingcc.com
Text Domain: icewingcc_functions
*/

/**
* 自动将hotmail和gmail里面带链接的评论加入到垃圾评论
* @since 1.01 2014-1-9
*/
add_action('comment_post', 'icewingcc_comment_auto_spam');
function icewingcc_comment_auto_spam($comment_id){
    $comment = get_comment($comment_id);
    $comment_author_email = trim($comment->comment_author_email);
    $comment_author_ip = $comment->comment_author_IP;

    //指定邮箱禁止存在链接
    if (preg_match('/(hotmail\.com|gmail\.com|outlook)/i', $comment_author_email)){
        if(preg_match('/<a href=/i', $comment->comment_content)){
            icewingcc_log_file('spam', "the ID is {$comment_id}, IP is {$comment_author_ip},  Get gmail or hotmail Spam comment");
            icewingcc_spam_comment($comment_id);
            return;
        }
    }

    //全局禁止一个以上的链接出现
    if(preg_match_all('/<\/a>/i', $comment->comment_content,  $out, PREG_PATTERN_ORDER) > 1){
        icewingcc_log_file('spam', "the ID is {$comment_id}, IP is {$comment_author_ip}, Get the Spam with more links");
        icewingcc_spam_comment($comment_id);
        return;
    }

    icewingcc_send_email($comment_id);
}

/**
 * 把一条评论加入到垃圾评论，并阻止WP系统发送通知邮件
 */
function icewingcc_spam_comment($comment_id){
    wp_spam_comment($comment_id);

    //通过Filter ：comment_notification_recipients清空收件人列表以阻止发送邮件
    //这个Filter在pluggable.php 文件中的 wp_notify_postauthor函数中被定义
    add_filter('comment_notification_recipients', 'icewingcc_prevent_notification', 10, 2);
}

//执行阻止发送邮件的过程
function icewingcc_prevent_notification($emails, $comment_id){
    icewingcc_log_file('filter', "阻止发送邮件{$comment_id}");
    return array();
}

/**
 * 写入一行日志
 */
function icewingcc_log_file($filename, $content){
    $dir = dirname(__FILE__) . '/';
    $filepath = $dir . $filename . '.log';

    $content = '##' . date('Y-m-d H:i:s', time()) . ': ' . $content . "\n";
    return file_put_contents($filepath, $content, FILE_APPEND);
}

/**
* 发送邮件
* @param $comment_id 传入评论的ID，自动根据ID生成邮件内容
*/
function icewingcc_send_email($comment_id){
    $admin_email = get_bloginfo ('admin_email');
    $comment = get_comment($comment_id);
    $comment_author_email = trim($comment->comment_author_email);
    $parent_id = $comment->comment_parent ? $comment->comment_parent : '';
    $to = $parent_id ? trim(get_comment($parent_id)->comment_author_email) : '';
    $spam_confirmed = $comment->comment_approved;

    //管理回复评论时，发送邮件给发表评论的读者
    if (($parent_id != '') &amp;&amp; ($spam_confirmed != 'spam') &amp;&amp; ($to != $admin_email) &amp;&amp; ($comment_author_email == $admin_email)) {
        $subject = '您在 [' . get_option("blogname") . '] 的评论有新的回复';

$temp_msg = <<<EOF
<div style="background-color:#eef2fa; border:1px solid #d8e3e8; color:#111; padding:0 15px; -moz-border-radius:5px; -webkit-border-radius:5px; -khtml-border-radius:5px; border-radius:5px;">
    <p>{parent_comment_author}， 您好!</p>
    <p>您曾在 [{blog_name}] 的文章 《{post_title}》 上发表评论:<br />
        {parent_comment_content}</p>
    <p>{comment_author} 给您的回复如下:<br />
        {comment_content}<br /></p>
    <p>您可以点击 <a href="{comment_link}">查看回复的完整內容</a></p>
    <p>欢迎再次光临 <a href="{site_url}">{blog_name}</a></p>
    <p>(此郵件由系統自動發出, 請勿回覆.)</p>
</div>
EOF;
        $message = str_replace(
                array(
                        '{parent_comment_author}', //1
                        '{blog_name}', //2
                        '{post_title}', //3
                        '{parent_comment_content}', //4     
                        '{comment_author}',  //5
                        '{comment_content}', //6
                        '{comment_link}', //7
                        '{site_url}'  //8
                        ),
                array(
                        trim(get_comment($parent_id)->comment_author),  //1
                        get_option("blogname"),  //2
                        get_the_title($comment->comment_post_ID),  //3
                        nl2br(get_comment($parent_id)->comment_content), //4
                        trim($comment->comment_author), //5
                        nl2br($comment->comment_content), //6
                        htmlspecialchars(get_comment_link($parent_id)),  //7
                        get_option('home') //8
                        ),
                $temp_msg
                );

        $from = 'From: "' . get_option('blogname') . ' <' . ICEWINGCC_MAIL_ADDR . ">";
        $headers = "$from\nContent-Type: text/html; charset=" . get_option('blog_charset') . "\n";
        wp_mail( $to, $subject, $message, $headers );
    }
}
```

不知为何，代码运行良好，没收到任何错误，却不能阻止邮件的发送，又想到了另一个方法：重写“pluggable.php”中的“wp_notify_postauthor”方法并加入判断机制，当然我并没有这样做，而是安装了一个Akismet插件去过滤垃圾评论。

唉~~在这场垃圾评论的对抗赛中又失败了，最终还是不得不使用了插件~~~
