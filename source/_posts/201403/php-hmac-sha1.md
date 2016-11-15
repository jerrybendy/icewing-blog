---
title: PHP中对hmac_sha1签名算法的实现方法
tags:
  - PHP
id: 982
categories:
  - PHP
date: 2014-03-31 23:30:17
updated: 2016-11-15 09:37:51
---

最近研究一个七牛的下载API，其中用到了一种叫hmac_sha1的签名算法，用官方给出代码无法实现（因为空间配置没有提供这个函数），所以就去了解了下这种算法。

![400px-Shahmac](https://cdn.icewing.cc/wp-content/uploads/2014/03/400px-Shahmac.jpg)

具体关于hmac_sha1的信息可以参见[维基百科](http://en.wikipedia.org/wiki/Hash-based_message_authentication_code)。我只说下具体的PHP代码实现：
```php
	/**
	 * 获取hmac_sha1签名的值
	 * @link 代码来自： http://www.educity.cn/develop/406138.html
	 *
	 * @param $str 源串
	 * @param $key 密钥
	 *
	 * @return 签名值
	 */
	function hmac_sha1($str, $key) {
		$signature = "";
		if (function_exists('hash_hmac')) {
			$signature = base64_encode(hash_hmac("sha1", $str, $key, true));
		} else {
			$blocksize = 64;
			$hashfunc = 'sha1';
			if (strlen($key) &amp;gt; $blocksize) {
				$key = pack('H*', $hashfunc($key));
			}
			$key = str_pad($key, $blocksize, chr(0x00));
			$ipad = str_repeat(chr(0x36), $blocksize);
			$opad = str_repeat(chr(0x5c), $blocksize);
			$hmac = pack(
					'H*', $hashfunc(
							($key ^ $opad) . pack(
									'H*', $hashfunc(
											($key ^ $ipad) . $str
									)
							)
					)
			);
			$signature =base64_encode($hmac);
		}
		return $signature;
	}
}
```
经实际测验以上方法有效。

注：自PHP5.1.2起就已经内置了hash_hmac函数，所以可不必做function_exsits的判断，一行代码便可获取hmac_sha1签名值：
```php
$signature = base64_encode(hash_hmac("sha1", $str, $key, true));
```
