---
title: 前端AJAX请求跨域时遇到的一些坑
date: 2016-03-24 23:39:01
updated: 2016-03-24 23:39:01
tags:
  - 前端
  - AJAX
  - 跨域
  - PHP
categories:
  - 前端
---

这两天在做公司的PC站时因为需要使用`angular`的`$http`服务存取数据,而且接口又在另一个域名下面,不得不研究下跨域的问题. 以下把这两天遇到的一些问题总结下.(都是我自己遇到的一些问题, 所以可能不太全面)

### `Access-Control-Allow-Origin`的问题

跨域遇到的第一个问题就是`Access-Control-Allow-Origin`的错误, Chrome报错`Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.`. 即当前发出请求的域名不在服务器的白名单中, 怎么办呢?

当然,最简单的方法就是在被访问的服务端返回的内容上面加上`Access-Control-Allow-Origin`响应头, 值为`*`或是当前网站的域名. 使用`*`的话虽然方便, 但容易被别的网站乱用,总归有些不太安全; 设置为当前网站的域名的话又只能设置一个. 我的解决办法是设置一个允许的域名白名单, 判断当前请求的`refer`地址是否在白名单里,如果是,就设置这个地址到`Access-Control-Allow-Origin`中去,否则就不设置这个响应头.

以下是整理后的代码(实际的白名单列表是写在配置文件中的):

```php
/**
 * API扩展
 *
 * Class ApiTrait
 */
trait ApiTrait
{
    /**
     * 设置允许跨域访问的域名白名单
     */
    protected $_ALLOWED_ORIGINS = [
        'test.icewingcc.com'
    ];


    /**
     * 通过指定的参数生成并显示一个特定格式的JSON字符串
     *
     * @param int|array $status 状态码, 如果是数组,则为完整的输出JSON数组
     * @param array     $data
     * @param string    $message
     */
    protected function render_json($status = 200, $data = [], $message = '')
    {

        /*
         * 判断跨域请求,并设置响应头
         */
        $cross_origin = $this->_parse_cross_origin_domain();

        if($cross_origin){
            @header("Access-Control-Allow-Origin: {$cross_origin}");
        }


        /*
         * 输出格式化后的内容
         */
        echo json_encode([
            'status'  => $status,
            'data'    => $data,
            'message' => $message
        ]);
    }

    /**
     * 解析跨域访问, 如果访问来源域名在 config.inc.php 中预定义的允许的列表中,
     * 则返回完整的跨域允许域名 , 否则将返回FALSE
     *
     * @return bool|string
     */
    private function _parse_cross_origin_domain()
    {
        $refer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';

        $refer = strtolower($refer);

        /*
         * 没有来源地址时直接返回false
         */
        if(! $refer){
            return FALSE;
        }

        /*
         * 解析引用地址, 取出 host 部分
         */
        $refer_parts = parse_url($refer);

        if(! $refer_parts){
            return FALSE;
        }

        $host = isset($refer_parts['host']) ? $refer_parts['host'] : '';
        $scheme = isset($refer_parts['scheme']) ? $refer_parts['scheme'] : 'http';

        if(! $host){
            return FALSE;
        }

        /*
         * 检查引用地址是否在预配置的允许跨域域名列表中,如果不在,返回 FALSE
         */
        if(in_array($host, $this->_ALLOWED_ORIGINS)){

            return ($scheme ? : 'http') . '://' . $host;

        }

        return $host;

    }
}
```

### `Access-Control-Allow-Headers`的问题

以过上面的代码已经实现了跨域中的第一步,GET请求一切正常. 可是需要POST请求发送数据时又出问题了, Chrome报错`Request header field Content-Type is not allowed by Access-Control-Allow-Headers in preflight response.` 查了下资料,大致意思是请求头中的`Content-Type`字段内容没有在`Access-Control-Allow-Headers`中被设置为允许.

这个简单,只需要把这个内容加在`Access-Control-Allow-Headers`上面就行了,顺便也把其它常用的头都加进去吧.

```php
    @header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Connection, User-Agent, Cookie');
```

搞定.

### cookie的问题

用户登录时的POST表单发送问题解决了,紧接着又出现了另一个问题: 系统是通过cookie与后端交互的,而这样跨域时每次请求都是独立的,都会生成不同的cookie. 而cookie里面保存了PHP的session id的信息,自然就无法顺畅的与后端进行交互.

这个处理起来似乎比较麻烦,过程就不说了,最终找到的解决方案是在PHP中再加一个header, 同时JS里也要设置一下:

```php
    @header('Access-Control-Allow-Credentials: true');
```

JS里面也要设置Credentials, 下面是angular的代码, jQuery类似:

```js
$http({
    // ....参数们...

    withCredentials: true
});
```

如此一来便解决了跨域时cookie的问题.


### OPTIONS请求

以上问题都解决了, 基本上跨域已经搞定, 但仔细看Chrome的Network日志, 发现有些请求会出现两次: 第一次是`OPTIONS`请求方式, 第二次才是正常的`POST`. 这个`OPTIONS`是干嘛的呢?

查了些资料并且测试了下, 发现`OPTIONS`就是相当于在正式请求接口之前去获取以下header, 自然就是我们前面所设置的那些header. 如果在这次`OPTIONS`请求中服务器有返回正确的header, 这时才会执行后面真正的请求; 否则请求将会被拒绝, 并抛出错误.

即然这次OPTIONS请求仅仅是为了获取header的, 那么给它一个空的返回就行了呗, 不需要做任何实际的操作.

```php
/*
 * 判断 OPTIONS 请求,如果 请求方式为
 * OPTIONS ,输出头部直接返回
 */
if(isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
    $this->render_json([]);
    exit();
}
```


### 完整代码

下面贴上修改后的完整PHP部分代码, JS就不贴了,加一个参数而已. 仅供参考:


```php
/**
 * API扩展
 *
 * Class ApiTrait
 */
trait ApiTrait
{
    /**
     * 设置允许跨域访问的域名白名单
     */
    protected $_ALLOWED_ORIGINS = [
        'test.icewingcc.com'
    ];


    /**
     * 通过指定的参数生成并显示一个特定格式的JSON字符串
     *
     * @param int|array $status 状态码, 如果是数组,则为完整的输出JSON数组
     * @param array     $data
     * @param string    $message
     */
    protected function render_json($status = 200, $data = [], $message = '')
    {

        /*
         * 判断跨域请求,并设置响应头
         */
        $cross_origin = $this->_parse_cross_origin_domain();

        if($cross_origin){
            @header("Access-Control-Allow-Origin: {$cross_origin}");
        }


        @header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Connection, User-Agent, Cookie');
        @header('Access-Control-Allow-Credentials: true');

        @header('Content-type: application/json');
        @header("Cache-Control: no-cache, must-revalidate");


        /*
         * 输出格式化后的内容
         */
        echo json_encode([
            'status'  => $status,
            'data'    => $data,
            'message' => $message
        ]);
    }

    /**
     * 解析跨域访问, 如果访问来源域名在 config.inc.php 中预定义的允许的列表中,
     * 则返回完整的跨域允许域名 , 否则将返回FALSE
     *
     * @return bool|string
     */
    private function _parse_cross_origin_domain()
    {
        $refer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';

        $refer = strtolower($refer);

        /*
         * 没有来源地址时直接返回false
         */
        if(! $refer){
            return FALSE;
        }

        /*
         * 解析引用地址, 取出 host 部分
         */
        $refer_parts = parse_url($refer);

        if(! $refer_parts){
            return FALSE;
        }

        $host = isset($refer_parts['host']) ? $refer_parts['host'] : '';
        $scheme = isset($refer_parts['scheme']) ? $refer_parts['scheme'] : 'http';

        if(! $host){
            return FALSE;
        }

        /*
         * 检查引用地址是否在预配置的允许跨域域名列表中,如果不在,返回 FALSE
         */
        if(in_array($host, $this->_ALLOWED_ORIGINS)){

            return ($scheme ? : 'http') . '://' . $host;

        }

        return $host;

    }
}



/**
 * 基础API访问类
 *
 * Class BaseApiControl
 */
 abstract class BaseApiControl
 {

    use ApiTrait;

    protected function __construct()
    {
        /*
         * 判断 OPTIONS 请求,如果 请求方式为
         * OPTIONS ,输出头部直接返回
         */
        if(isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
            $this->render_json([]);
            exit();
        }

    }


    // ...

 }

```

目前为止接口运行良好, 再发现新的坑时将会更新此文章. (ps. 虽然这是篇前端分享的文章, 却是用一大堆PHP解决问题...)
