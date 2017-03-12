---
title: PHP转换网址相对路径到绝对路径的一种方法
date: 2014-10-25 20:40:53
updated: 2016-11-15 09:47:00
tags:
  - PHP
  - 路径
id: 1137
categories:
  - PHP
---

> 代码若有改动不再更新文章，请以 Gist 上最新的代码为准。[链接](https://gist.github.com/jerrybendy/dc495f16c5a8da11653e7ecca41ec133)

相信很多程序（尤其是采集类的程序）都会有需要把网址的相对路径转换成绝对路径的需要，例如采集到某页面的HTML代码中包含资源文件经常会看到这样的文件名：

```html
<link rel="stylesheet" href="css/style.css" />
<img src="/logo.png" />
<img src="../banner.jpg" />
```

如果直接用获取其href属性或src属性很明显这个地址是打不开的，这就需要将其中的相对路径转为绝对路径。查一下网上相关的代码也不少，但大多数代码都太难被读懂，而且执行效率不见得会高，基于此我开始着手写一个自己的转化方法。

由于采集来的网址格式大部分为绝对地址或者位于根目录的地址，所以代码对这两种格式的的地址优先处理并返回，以提高代码的执行效率。

源码如下：函数接收两个参数，第一个参数为采集到的相对路径，第二个参数为被采集的原始的URL，例如从www.example.com/a/b/c.html中采集到某资源地址为css/style.css，那么函数调用方式为`filter_relative_url('css/style.css', 'http://www.example.com/a/b/c.html');`（注：函数中省略了对URI参数的验证和过滤操作，如果URI参数没加http://前缀会报错，相关验证代码可自行添加）。

```php
   /**
     * 把从HTML源码中获取的相对路径转换成绝对路径
     * @param string $url HTML中获取的网址
     * @param string $URI 用来参考判断的原始地址
     * @return 返回修改过的网址，如果网址有误则返回FALSE
     */
    function filter_relative_url($url, $URI){
    	//STEP1: 先去判断URL中是否包含协议，如果包含说明是绝对地址则可以原样返回
    	if(strpos($url, '://') !== FALSE){
    		return $url;
    	}

    	//STEP2: 解析传入的URI
    	$URI_part = parse_url($URI);
    	if($URI_part == FALSE)
    		return FALSE;
    	$URI_root = $URI_part['scheme'] . '://' . $URI_part['host'] . (isset($URI_part['port']) ? ':' . $URI_part['port'] : '');

    	//STEP3: 如果URL以左斜线开头，表示位于根目录
    	if(strpos($url, '/') === 0){
    		return $URI_root . $url;
    	}

    	//STEP4: 不位于根目录，也不是绝对路径，考虑如果不包含'./'的话，需要把相对地址接在原URL的目录名上
    	$URI_dir = (isset($URI_part['path']) &amp;&amp; $URI_part['path']) ? '/' . ltrim(dirname($URI_part['path']), '/')  : '';
    	if(strpos($url, './') === FALSE){
    		if($URI_dir != ''){
    			return $URI_root . $URI_dir . '/' . $url;
    		} else {
    			return $URI_root . '/' . $url;
    		}
    	}

    	//STEP5: 如果相对路径中包含'../'或'./'表示的目录，需要对路径进行解析并递归
    		//STEP5.1: 把路径中所有的'./'改为'/'，'//'改为'/'
    	$url = preg_replace('/[^\.]\.\/|\/\//', '/', $url);
    	if(strpos($url, './') === 0)
    		$url = substr($url, 2);

    		//STEP5.2: 使用'/'分割URL字符串以获取目录的每一部分进行判断
    	$URI_full_dir = ltrim($URI_dir . '/' . $url, '/');
    	$URL_arr = explode('/', $URI_full_dir);

    	if($URL_arr[0] == '..')
    		return FALSE;

    	//因为数组的第一个元素不可能为'..'，所以这里从第二个元素开始循环
    	$dst_arr = $URL_arr;  //拷贝一个副本，用于最后组合URL
    	for($i = 1; $i < count($URL_arr); $i ++){
    		if($URL_arr[$i] == '..'){
    			$j = 1;
    			while(TRUE){
    				if(isset($dst_arr[$i - $j]) &amp;&amp; $dst_arr[$i - $j] != FALSE){
    					$dst_arr[$i - $j] = FALSE;
    					$dst_arr[$i] = FALSE;
    					break;
    				} else {
    					$j ++;
    				}
    			}
    		}
    	}

    	// 组合最后的URL并返回
    	$dst_str = $URI_root;
    	foreach($dst_arr as $val){
    		if($val != FALSE)
    			$dst_str .= '/' . $val;
    	}

    	return $dst_str;
    }
```

代码如上分为几步针对不同格式的相对路径进行处理并返回，以下是测试代码：

```php
$URI_1 = 'http://www.abc.com/a/b/c/d.html';
$URI_2 = 'http://www.abc.com';

$test [] = 'http://www.abc.com/css/style.css';
$test [] = '/img/banner.jpg';
$test [] = 'images/res_03.png';
$test [] = '../../js/jquery.min.js';
$test [] = './../res/js/../jquery/./1.8.3/jquery.js';

foreach($test as $val){
    echo filter_relative_url($val, $URI_1);
}
foreach($test as $val){
    echo filter_relative_url($val, $URI_2);
}
```

程序返回：

```html
http://www.abc.com/css/style.css
http://www.abc.com/img/banner.jpg
http://www.abc.com/a/b/c/images/res_03.png
http://www.abc.com/a/js/jquery.min.js
http://www.abc.com/a/b/res/jquery/1.8.3/jquery.js

http://www.abc.com/css/style.css
http://www.abc.com/img/banner.jpg
http://www.abc.com/images/res_03.png
```

*注：测试代码的第二个循环只返回了3条结果，是因为后两条结果返回了FALSE，因为原始URI是位于网站根目录，再在前面加“../“请求上级目录是无效的。

以上代码的主要优点是解决了网上流传的那些代码对于复杂格式的相对路径不能完美兼容的问题，同时照顾了执行效率，减少判断和分解的次数。此代码目前我自己正在使用，如果有任何问题还请留言或邮件联系我，谢谢！

---
### 2016年5月17日更新
看到PHP官网WIKI上面有一个关于相对地址转换的写法，写在下面以供参考：

```php
function normalizePath($path)
{
    $parts = array();// Array to build a new path from the good parts
    $path = str_replace('\\', '/', $path);// Replace backslashes with forwardslashes
    $path = preg_replace('/\/+/', '/', $path);// Combine multiple slashes into a single slash
    $segments = explode('/', $path);// Collect path segments
    $test = '';// Initialize testing variable
    foreach($segments as $segment)
    {
        if($segment != '.')
        {
            $test = array_pop($parts);
            if(is_null($test))
                $parts[] = $segment;
            else if($segment == '..')
            {
                if($test == '..')
                    $parts[] = $test;

                if($test == '..' || $test == '')
                    $parts[] = $segment;
            }
            else
            {
                $parts[] = $test;
                $parts[] = $segment;
            }
        }
    }
    return implode('/', $parts);
}
```

---

参考资料：

* [PHP Document](http://php.net/manual/zh/function.realpath.php#112367)

