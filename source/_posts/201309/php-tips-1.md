---
title: PHP的一点小知识（1）
tags:
  - PHP
  - 技巧
id: 624
categories:
  - PHP
date: 2013-09-26 18:35:15
---

最近在看PHP的教学视频，在里面整理了一些有用的或者容易忽略的小知识，在这里随便写下。

1、纯PHP代码的文件可以省略结尾的“?>”标记，这样可以避免代码后面额外输出空格；

2、在单引号中的字符串时面的变量和转义序列不会被替换，而双引号中的会；

3、当字符串用双引号或heredoc结构定义时，其中的变量将会被正常解析；

4、PHP可以使用中文作为变量名，字符串插入变量时如果变量后面没有空白或符号分隔的话就需要把变量用大括号“{}”括起来，如：`string = "这是一个变量{$val}哦！"`；

5、手动将页面跳转到404页的方法：`header ('HTTP/1.1 404 Not Found');`，这样可以把不希望用户打开的页面直接跳转到404；

6、可以使用如“$$val”的形式定义一个可变变量，即把另一个变量的值作为新变量的变量名，关于可变变量的使用方法百度一大堆，不再细述；

7、逻辑运算符异或（xor）只有在两边仅有一个是真时返回真，其余情况均返回假；

8、在if语句中如果有一个条件成立，则其它的elseif子句将不再执行；

9、if语句中用“&&”和“||”连接多个判断条件时，当有任何一个条件不成立（已经能确定表达式为False时）时，后面的判断条件将不会再去判断；

10、对当前脚本设置允许的最大执行时限，使用set_time_limit()函数，接受一个以秒为单位的参数；

11、break用于跳出循环或Switch，它可以带一个int参数，用于指示退出几级循环，如break 2;表示退出2级循环；

12、continue用于跳到本次循环体结尾，也可以带一个int参数，表示跳过几次循环体；

13、使用static定义的静态变量只有在第一次调用的时候赋值（执行一次），它是在多个函数中共享的；

14、PHP函数默认是的传参方式是按值传递，在参数前加上&符号可以改变成按址传递，按址传递可以改变传入变量的值；

15、PHP函数可以接受任意数量的参数，func_get_args()会返回一个数组，数组里面包含所以传递到函数中的参数，func_num_args()返回传递到函数的参数个数，func_get_arg(int $num)返回第$num个参数，序号从0开始。

先写到这儿，以后持续发表，请关注《PHP的一点小知识》系列。
