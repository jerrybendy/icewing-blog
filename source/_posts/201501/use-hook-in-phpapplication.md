---
title: 在自己的PHP程序中实现插件机制：提取Wordpress插件机制代码
tags:
  - PHP
  - wordpress
  - 插件
id: 1177
categories:
  - PHP
date: 2015-01-02 11:11:53
---

本人写代码有个毛病：不喜欢把代码写死，总要留出些扩展的余地（其实也不算什么缺点吧，好处是有的，但老是这样对于一些小项目来说太浪费时间了）。对于写一个可扩展的项目而言，插件机制似乎是必须的。例如我们需要在从数据库中获取到文章内容后执行一些操作，如转换代码高亮的符号为对应的pre标签、转换Emoji表情符号为图片地址或类、给文章内所有的图片加上LightBox效果的代码等等，如果把这些操作统统都写到Post类中，这个类将会在以后的代码升级过程中变得越来越大，并且越来越难维护。

了解过[Wordpress](http://blog.icewingcc.com/category/wordpress)的插件机制的可能都知道，WP会这么做（演示代码，并非抄自WP）：

```php
// 插件内
// 添加过滤器函数
add_filter('the_content', 'func_apply_hightlight');
add_filter('the_content', 'func_conv_emoji');
add_filter('the_content', 'func_show_lightbox');
...
function func_apply_hightlight{
    ...
}
...

// Post类内部
// 应用以上过滤器函数
$this->content = apply_filters('the_content', $this->content);
```

程序运行到`add_filter`的时候把过滤器函数暂时保存起来，并且在`apply_filters`的时候再去查找有没有指定的过滤器函数，如果有则依次执行它们。即在需要对文章内容执行操作的地方加上多个过滤器，并在`apply_filters`的时候运行它们。

其实自己写一个类似的插件机制并不难，基于Wordpress已经有写好的成熟的代码了，不用白不用，遂提取之~~

以下从WP提取的代码主要为了自己写代码时方便，我一般使用[CodeIgniter](http://blog.icewingcc.com/category/php/codeigniter)框架，所以代码自然是按着CI框架来的，可以直接命名为`Hooks.php`并放在/application/core目录中替换CI原生的Hook机制。当然这个类库同样适用于别的框架或者无框架的环境，自己改下类名什么的就OK了。

```
<?php
/**
 * 使用WP的插件机制替代CI原生的HOOK类
 * @author		Jerry Bendy
 * @since		Version 2.0
 */
class CI_Hooks {

	/**
	 * 保存已经注册到系统中的Hook和Filter，数组应该是这样的形式：
	 * $_hooks = array(
	 * 				'hook_a' => array(
	 * 						'function_a',
	 * 						'function_b',
	 * 						array('class_c', 'functions_c')
	 * 				),
	 * 				'hook_b' => array ( ....
	 *
	 * 即数组包含另一个数组，且数组的键名即为Hook名（或Filter名），
	 * 子数组内保存每个每个Hook的函数名，以便直接调用执行
	 */
	private $_actions = array();

	private $_filters = array();

	/**
	 * Constructor
	 *
	 */
	function __construct(){

	}

	// --------------------------------------------------------------------

	/**
	 * Call Hook
	 *
	 * 这个函数用于支持CI原生Hook里的_call_hook方法，
         * 因为/system/core/codeigniter.php中多次调用此方法并判断返回值以确定输出
         * 删除此函数会导致CI无法运行（其实框架可无视或删除此函数）
	 *
	 * @access	public
	 * @param	string	the hook name
	 * @return	mixed
	 */
	function _call_hook($which = ''){
		if ( ! isset($this->_actions[$tag]) ){
			return FALSE;
		}
		$this->do_action($which);
		return TRUE;
	}
	// --------------------------------------------------------------------

	/**
	 * 注册一个Filter到系统中
	 * @param string $tag Filter的名字
	 * @param callback $function_to_add 要执行的函数回调名
	 * @param int $priority Filter执行的优先级，数字越小优先级越高
	 * @param int $accepted_args 接收的参数数量
	 * @return boolean
	*/
	function add_filter( $tag, $function_to_add, $priority = 10, $accepted_args = 1 ) {
		$idx = $this->_ig_filter_build_unique_id($tag,$function_to_add,$priority);
		$this->_filters[$tag][$priority][$idx] = array('function' => $function_to_add, 'accepted_args' => $accepted_args);
		return true;
	}

	// --------------------------------------------------------------------

	/**
	 * 检查一个Filter是否被注册，如果指定了要检查的函数则会返回这个函数
	 * 是否已经被注册到了这个Filter中
	 * @param unknown_type $tag
	 * @param unknown_type $function_to_check
	 */
	function has_filter($tag, $function_to_check = FALSE){
		$has = !empty($this->_filters[$tag]);
		if ( false === $function_to_check || false == $has )
			return FALSE;

		if ( !$idx = $this->_ig_filter_build_unique_id($tag,$function_to_check, FALSE) )
			return false;

		foreach ( (array) array_keys($this->_filters[$tag]) as $priority ) {
			if ( isset($this->_filters[$tag][$priority][$idx]) )
				return $priority;
		}

		return false;
	}

	// --------------------------------------------------------------------

	/**
	 * 执行一个Filter，
	 * @param unknown_type $tag
	 * @param unknown_type $value
	 * @return unknown|mixed
	 */
	function apply_filters( $tag, $value ) {
		//检查要执行的Filter是否被注册，如果没有则直接返回传入的Value
		if ( !isset($this->_filters[$tag]) )
			return $value;

		// 对数组按照优先级排序，并将数组指针指向第一个元素
		ksort($this->_filters[$tag]);
		reset( $this->_filters[ $tag ] );

		$args = func_get_args();

		do {
			foreach( (array) current($this->_filters[$tag]) as $the_ ){
				if ( !is_null($the_['function']) ){
					$args[1] = $value;
					$value = call_user_func_array($the_['function'], array_slice($args, 1, (int) $the_['accepted_args']));
				}
			}
		} while ( next($this->_filters[$tag]) !== false );

		return $value;
	}

	// --------------------------------------------------------------------

	/**
	 * 删除一个已经定义的Filter
	 * @param $tag Filter的名称
	 * @param $function_to_remove 要删除的Filter的函数名
	 * @param $priority 优先级
	 * @return Bool
	 */
	function remove_filter( $tag, $function_to_remove, $priority = 10 ) {
		$function_to_remove = $this->_ig_filter_build_unique_id($tag,$function_to_remove,$priority);

		$r = isset($this->_filters[$tag][$priority][$function_to_remove]);

		if ( true === $r) {
			unset($this->_filters[$tag][$priority][$function_to_remove]);
			if ( empty($this->_filters[$tag][$priority]) )
				unset($this->_filters[$tag][$priority]);
			//unset($GLOBALS['merged_filters'][$tag]);
		}

		return $r;
	}

	// --------------------------------------------------------------------

	/**
	 * 添加一个动作
	 * @param $tag 要添加Hook的点
	 * @param $function_to_add 要添加的函数名
	 * @param $priority 优先级，默认为10
	 * @param $accepted_args 接受的参数数量
	 * @return
	 */
	function add_action($tag, $function_to_add, $priority = 10, $accepted_args = 1) {
		return $this->add_filter($tag, $function_to_add, $priority, $accepted_args);
	}

	// --------------------------------------------------------------------
	/**
	 * 执行一个动作
	 * @param $tag
	 * @param $arg
	 */
	function do_action($tag, $arg = '') {

		if ( ! isset($this->_actions[$tag]) )
			$this->_actions[$tag] = 1;
		else
			++$this->_actions[$tag];

		if ( !isset($this->_filters[$tag]) ) {
			return;
		}

		$args = array();
		if ( is_array($arg) &amp;&amp; 1 == count($arg) &amp;&amp; isset($arg[0]) &amp;&amp; is_object($arg[0]) ) // array(&amp;$this)
			$args[] =&amp; $arg[0];
		else
			$args[] = $arg;
		for ( $a = 2; $a < func_num_args(); $a++ )
			$args[] = func_get_arg($a);

		// Sort
		ksort($this->_filters[$tag]);
		reset($this->_filters[ $tag ] );

		do {
			foreach ( (array) current($this->_filters[$tag]) as $the_ )
				if ( !is_null($the_['function']) )
					call_user_func_array($the_['function'], array_slice($args, 0, (int) $the_['accepted_args']));

		} while ( next($this->_filters[$tag]) !== false );
	}
	// --------------------------------------------------------------------
	/**
	 * 判断一个Action是否已被注册
	 * @param $tag
	 * @param $function_to_check
	 */
	function has_action($tag, $function_to_check = false) {
		return $this->has_filter($tag, $function_to_check);
	}
	// --------------------------------------------------------------------
	/**
	 * 删除一个Action
	 * @param $tag
	 * @param $function_to_remove
	 * @param $priority
	 */
	function remove_action( $tag, $function_to_remove, $priority = 10 ) {
		return $this->remove_filter( $tag, $function_to_remove, $priority );
	}
	// --------------------------------------------------------------------
	/**
	 * 为传入的钩子生成一个唯一的标识符，以便区分不同的钩子，
	 * 使用对Tag、函数名、优先级一起格式化后返回
	 * 方式创建唯一标识
	 * @param $tag
	 * @param $function
	 * @param $priority
	 */
	private function _ig_filter_build_unique_id($tag, $function, $priority){
		static $filter_id_count = 0;

		if ( is_string($function) )
			return $function;

		if ( is_object($function) ) {
			// Closures are currently implemented as objects
			$function = array( $function, '' );
		} else {
			$function = (array) $function;
		}

		if (is_object($function[0]) ) {
			// Object Class Calling
			if ( function_exists('spl_object_hash') ) {
				return spl_object_hash($function[0]) . $function[1];
			} else {
				$obj_idx = get_class($function[0]).$function[1];
				if ( !isset($function[0]->wp_filter_id) ) {
					if ( false === $priority )
						return false;
					$obj_idx .= isset($this->_filters[$tag][$priority]) ? count((array)$this->_filters[$tag][$priority]) : $filter_id_count;
					$function[0]->wp_filter_id = $filter_id_count;
					++$filter_id_count;
				} else {
					$obj_idx .= $function[0]->wp_filter_id;
				}

				return $obj_idx;
			}
		} else if ( is_string($function[0]) ) {
			// Static Calling
			return $function[0] . '::' . $function[1];
		}

	}

}
```

光有类库还不太方便，因为这样的话就需要创建一个全局变量（CI的类库不需要创建全局变量，默认可以直接通过$this->hook的方式调用），并在每次使用的时候执行一下声明，如：

```php
// 创建一个全局变量（适用于除CI以外框架）
global $hook;
$hook = new CI_Hook();

// 调用代码
global $hook;
$hook->add_action('xxxx', 'xxxxxxx');
```

显然这样相当繁琐。不过如果把这些函数整理起来并且成一个个辅助函数就会方便很多：

```php
// 辅助函数  hook_helper.php
global $hook;
$hook = new CI_Hook();

function add_action($a, $b, $c=10, $d=1){
    global $hook;
    $hook->add_action($a, $b, $c, $d);
}
...

// 调用函数
add_action('xxx', 'xxxxxx');
```

这样还不够，add_filter必须要在apply_filters之前运行才会有效，所以插件机制需要在系统之前加载，并在还要在系统真正执行对内容的操作之前加载所有插件，这样就需要在系统运行前，如控制器函数构造前、系统核心部件加载时（或完成后）就加载所有插件，再附上我写的一个加载插件文件的函数：

```php
/**
 * 载入一个插件目录中的所有PHP文件，
 * 这通常应该在系统初始化的过程中完成，这样可以保证
 * 所有的插件文件能够在运行前被加载
 * （2014-07-22 更新）
 *
 * @param $path 要加载的插件目录
 * @param $include_sub_dir 默认为TRUE，是否加载子目录中的PHP文件，
 *         值为TRUE时除了加载根目录的PHP文件，也会加载子目录中与子目录同名的文件
 *         值为FALSE时仅加载根目录的PHP文件
 * @return 加载完成后返回TRUE，错误返回FALSE，文件不存在时自动忽略而不提示
 */
function load_plugin_dir($path, $include_sub_dir = TRUE){
	if( ! file_exists($path) || ! is_dir($path))
		return FALSE;
	$path = rtrim($path, '/') . '/*';
	$ret = glob($path);
	foreach($ret as $file){
		if(is_dir($file)){
			if($include_sub_dir){
				$dirname = substr($file, strripos($file, '/') + 1);
				if(file_exists($file . '/' . $dirname . '.php'))
					include_once $file . '/' . $dirname . '.php';
			}
		} else {
			if(strtolower(pathinfo($file, PATHINFO_EXTENSION)) == 'php')
				include_once $file;
		}
	}
}
```

例如你把你的插件都放在一个叫做`/usr/plugin`的目录中，并且一个插件创建一个文件夹，这时你需要让这个插件的入口文件与文件夹同名，并使用以下方法加载它们，此函数可以多次调用以加载不同位置的插件：

```php
load_plugin_dir('/usr/plugin', TRUE);
```

剩下的自己补充吧，附上整理好的CI类库使用的Helper函数：
```php
/**
 *  插件机制的HELPER函数部分
 */
/**
 * 注册一个动作到系统中
 * @param string $tag 动作的名字
 * @param callback $function_to_add 要执行的函数回调名
 * @param int $priority 动作执行的优先级，数字越小优先级越高
 * @param int $accepted_args 接收的参数数量
 * @return boolean
 */
function add_filter( $tag, $function_to_add, $priority = 10, $accepted_args = 1 ) {
	$CI = &amp;get_instance();
	return $CI->hooks->add_filter($tag, $function_to_add, $priority, $accepted_args);
}
/**
 * 检查一个Filter是否被注册，如果指定了要检查的函数则会返回这个函数
 * 是否已经被注册到了这个Filter中
 * @param unknown_type $tag
 * @param unknown_type $function_to_check
 */
function has_filter($tag, $function_to_check = FALSE){
	$CI = &amp;get_instance();
	return $CI->hooks->has_filter($tag, $function_to_check);
}
/**
 * 执行一个Filter，
 * @param unknown_type $tag
 * @param unknown_type $value
 * @return unknown|mixed
 */
function apply_filters( $tag, $value ) {
	$CI = &amp;get_instance();
	$args = func_get_args();
	return call_user_func_array(array($CI->hooks, 'apply_filters'), $args);
}
/**
 * 删除一个已经定义的Filter
 * @param $tag Filter的名称
 * @param $function_to_remove 要删除的Filter的函数名
 * @param $priority 优先级
 * @return Bool
 */
function remove_filter( $tag, $function_to_remove, $priority = 10 ) {
	$CI=&amp;get_instance();
	return $CI->hooks->remove_filter($tag, $function_to_remove, $priority);
}
/**
 * 添加一个动作
 * @param $tag 要添加Hook的点
 * @param $function_to_add 要添加的函数名
 * @param $priority 优先级，默认为10
 * @param $accepted_args 接受的参数数量
 * @return
 */
function add_action($tag, $function_to_add, $priority = 10, $accepted_args = 1) {
	$CI=&amp;get_instance();
	return $CI->hooks->add_action($tag, $function_to_add, $priority, $accepted_args);
}
/**
 * 执行一个动作
 * @param $tag
 * @param $arg
 */
function do_action($tag, $arg = '') {
	$CI=&amp;get_instance();
	$args = func_get_args();
	return call_user_func_array(array($CI->hooks, 'do_action'), $args);
}
/**
 * 判断一个Action是否已被注册
 * @param $tag
 * @param $function_to_check
 */
function has_action($tag, $function_to_check = false) {
	$CI=&amp;get_instance();
	return $CI->hooks->has_action($tag, $function_to_check);
}
/**
 * 删除一个Action
 * @param $tag
 * @param $function_to_remove
 * @param $priority
 */
function remove_action( $tag, $function_to_remove, $priority = 10 ) {
	$CI=&amp;get_instance();
	return $CI->hooks->remove_action($tag, $function_to_remove, $priority);
}
/**
 * 载入一个插件目录中的所有PHP文件，
 * 这通常应该在系统初始化的过程中完成，这样可以保证
 * 所有的插件文件能够在运行前被加载
 * （2014-07-22 更新）
 *
 * @param $path 要加载的插件目录
 * @param $include_sub_dir 默认为TRUE，是否加载子目录中的PHP文件，
 *         值为TRUE时除了加载根目录的PHP文件，也会加载子目录中与子目录同名的文件
 *         值为FALSE时仅加载根目录的PHP文件
 * @return 加载完成后返回TRUE，错误返回FALSE，文件不存在时自动忽略而不提示
 */
function load_plugin_dir($path, $include_sub_dir = TRUE){
	if( ! file_exists($path) || ! is_dir($path))
		return FALSE;
	$path = rtrim($path, '/') . '/*';
	$ret = glob($path);
	foreach($ret as $file){
		if(is_dir($file)){
			if($include_sub_dir){
				$dirname = substr($file, strripos($file, '/') + 1);
				if(file_exists($file . '/' . $dirname . '.php'))
					include_once $file . '/' . $dirname . '.php';
			}
		} else {
			if(strtolower(pathinfo($file, PATHINFO_EXTENSION)) == 'php')
				include_once $file;
		}
	}
}
```

按下来我们就可以像Wordpress那样使用插件机制啦~
