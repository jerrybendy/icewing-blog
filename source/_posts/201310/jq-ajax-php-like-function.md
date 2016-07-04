---
title: jQuery+Ajax+PHP实现“喜欢”评级功能代码
tags:
  - AJAX
  - HTML/CSS
  - JQery
  - PHP
id: 678
categories:
  - PHP
date: 2013-10-14 22:14:07
updated: 2016-05-22 11:31:59
---

本文章来给大家介绍一个jQuery+Ajax+PHP实现“喜欢”评级功能代码，用户点击页面中自己喜欢的图片上的红心按钮时，前端页面向后台发送一个ajax请求，后台PHP程序接收请求后，查询IP库中是否已经有该用户的点击记录，如果没有，则将对应的数值+1，同时将该用户IP信息写入IP库，反之则告诉用户已经“喜欢过了”。

**数据库设计**

先准备两张表，pic表保存的是图片信息，包括图片对应的名称、路径以及图片“喜欢”总数，pic_ip则记录用户点击喜欢后的IP数据。

```sql
CREATE TABLE IF NOT EXISTS `pic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pic_name` varchar(60) NOT NULL,
  `pic_url` varchar(60) NOT NULL,
  `love` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `pic_ip` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pic_id` int(11) NOT NULL,
  `ip` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8
```

** index.php**

在index.php中，我们通过PHP读取pic表中的图片信息并展示出来，结合CSS，提升页面展示效果。

```php
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<meta name="keywords" content="jquery">
<meta name="description" content="">
<title>jQuery+Ajax+PHP实现"喜欢"评级</title>
<link rel="stylesheet" type="text/css" href="../css/main.css" />
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript">
$(function(){
$("p a").click(function(){
var love = $(this);
var id = love.attr("rel");
love.fadeOut(300);
$.ajax({
type:"POST",
url:"love.php",
data:"id="+id,
cache:false,
success:function(data){
love.html(data);
love.fadeIn(300);
}
});
return false;
});
});
</script>
<style type="text/css">
.clear{clear:both}
.list{width:760px; margin:20px auto}
.list li{float:left; width:360px; height:280px; margin:10px; position:relative}
.list li p{position:absolute; top:0; left:0; width:360px; height:24px; line-height:24px; background:#000; opacity:.8;filter:alpha(opacity=80);}
.list li p a{padding-left:30px; height:24px; background:url(images/heart.png) no-repeat 4px -1px;color:#fff; font-weight:bold; font-size:14px}
.list li p a:hover{background-position:4px -25px;text-decoration:none}
</style>
</head>
<body>
<div id="main">
<ul class="list">
<?php
include_once("connect.php");
$sql = mysql_query("select * from pic");
while($row=mysql_fetch_array($sql)){
$pic_id = $row['id'];
$pic_name = $row['pic_name'];
$pic_url = $row['pic_url'];
$love = $row['love'];
?>
<li><img src="images/<?php echo $pic_url;?>" alt="<?php echo $pic_name;?>"><p><a href="#" title="我喜欢" class="img_on" rel="<?php echo $pic_id;?>"><?php echo $love;?></a></p></li>
<?php }?>
</ul>
</div>
</body>
</html>
```

CSS中，我们将定义鼠标滑向和离开红心按钮的动态效果，并定位按钮的位置。

```css
.list{width:760px; margin:20px auto}
.list li{float:left; width:360px; height:280px; margin:10px; position:relative}
.list li p{position:absolute; top:0; left:0; width:360px; height:24px; line-height:24px;  
background:#000; opacity:.8;filter:alpha(opacity=80);}
.list li p a{padding-left:30px; height:24px; background:url(images/heart.png) no-repeat  
4px -1px;color:#fff; font-weight:bold; font-size:14px}
.list li p a:hover{background-position:4px -25px;text-decoration:none}
```

** jQuery代码**

当用户点击自己喜欢的图片上的红心按钮时，向后台love.php发送ajax请求，请求响应成功后，更新原有的数值。

```js
$(function(){
    $("p a").click(function(){
        var love = $(this);
        var id = love.attr("rel"); //对应id
        love.fadeOut(300); //渐隐效果
        $.ajax({
            type:"POST",
            url:"love.php",
            data:"id="+id,
            cache:false, //不缓存此页面
            success:function(data){
                love.html(data);
                love.fadeIn(300); //渐显效果
            }
        });
        return false;
    });
});
```

** love.php**

后台love.php接收前端的ajax请求，根据提交的图片id值，查找IP表中是否已有该用户ip的点击记录，如果有则告诉用户已“喜欢过了”，反之，则进行一下操作：

1、更新图片表中对应的图片love字段值，将数值加1。

2、将该用户IP信息写入到pic_ip表中，用以防止用户重复点击。

3、获取更新后的love值，即喜欢该图片的用户总数，并将该总数输出给前端页面。

```php
<?php
$host="localhost";
$db_user="root";
$db_pass="";
$db_name="demo";
$timezone="Asia/Shanghai";
$link=mysql_connect($host,$db_user,$db_pass);
mysql_select_db($db_name,$link);
mysql_query("SET names UTF8");
?>

<?php
include_once("connect.php");
$ip = get_client_ip();
$id = $_POST['id'];
if(!isset($id) || empty($id)) exit;
$ip_sql=mysql_query("select ip from pic_ip where pic_id='$id' and ip='$ip'");
$count=mysql_num_rows($ip_sql);
if($count==0){
$sql = "update pic set love=love+1 where id='$id'";
mysql_query( $sql);
$sql_in = "insert into pic_ip (pic_id,ip) values ('$id','$ip')";
mysql_query( $sql_in);
$result = mysql_query("select love from pic where id='$id'");
$row = mysql_fetch_array($result);
$love = $row['love'];
echo $love;
}else{
echo "喜欢过了..";
}
//获取用户真实IP
function get_client_ip() {
if (getenv("HTTP_CLIENT_IP") &amp;&amp; strcasecmp(getenv("HTTP_CLIENT_IP"), "unknown"))
$ip = getenv("HTTP_CLIENT_IP");
else
if (getenv("HTTP_X_FORWARDED_FOR") &amp;&amp; strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown"))
$ip = getenv("HTTP_X_FORWARDED_FOR");
else
if (getenv("REMOTE_ADDR") &amp;&amp; strcasecmp(getenv("REMOTE_ADDR"), "unknown"))
$ip = getenv("REMOTE_ADDR");
else
if (isset ($_SERVER['REMOTE_ADDR']) &amp;&amp; $_SERVER['REMOTE_ADDR'] &amp;&amp; strcasecmp($_SERVER['REMOTE_ADDR'], "unknown"))
$ip = $_SERVER['REMOTE_ADDR'];
else
$ip = "unknown";
return ($ip);
}
?>
```

代码中get_client_ip()函数是用来获取用户的真实IP

&nbsp;

来源：[PHP100](http://www.php100.com/html/php/lei/2013/0905/5374.html)
