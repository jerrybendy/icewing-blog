---
title: php导入、导出CSV文件
tags:
  - CSV
  - Excel
  - PHP
id: 767
categories:
  - PHP
date: 2013-11-09 09:40:41
updated: 2016-05-22 11:33:32
---

PHP也可以操作Excel文件，但是这种方式有缺陷，老版本的excel有个数据上限，最多65536行数据，这时我们就无法通过excel来实现大数据的导出。

为了导出大数据，我们可以通过导出csv的方式来实现：

代码：

```php
class csv
{
	private $resource;

	/**
	 * @param string $fileName 文件路径
	 * @param string $mode     文件访问类型：w：写入、r：只读
	 */
	public function __construct($fileName, $mode)
	{
		$this->resource = fopen($fileName, $mode);
	}

	public function __destruct()
	{
		fclose($this->resource);
	}

	/**
	 * 导入CSV
	 * @param array $data
	 * @return int
	 */
	public function export($data)
	{
		fputcsv($this->resource, $data);
	}

	/**
	 * 导出CSV
	 * @return array
	 */
	public function import()
	{
		$tmp = array();
		while($data = fgetcsv($this->resource))
		{
			$tmp[] = $data;
		}

		return $tmp;
	}
}
```

这里我们主要用到了php fgetcsv函数、fputcsv函数。

需要提醒的是在导入、导出数据过程注意中文乱码问题，这主要是数据编码格式问题，使用过程根据实际情况对数据进行转码。

&nbsp;

转自：[http://blog.php230.com/php-import-and-import-csv-file.html](http://blog.php230.com/php-import-and-import-csv-file.html)