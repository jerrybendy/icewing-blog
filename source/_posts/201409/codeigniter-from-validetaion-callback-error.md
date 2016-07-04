---
title: CodeIgniter表单验证类报错：Unable to access an error message corresponding to your field name.
tags:
  - PHP
  - 表单
  - CodeIgniter
id: 1105
categories:
  - PHP
date: 2014-09-18 11:41:08
---

在使用CodeIgniter（CI）框架中的表单验证类做用户登录时，发现了一个出错信息：

![ci_unable_access_an_error](https://cdn.icewing.cc/wp-content/uploads/2014/09/ci_unable_access_an_error.jpg)

查看源代码发现并没有与其相关的说明，而且语言文件中也没有对这句话的翻译，最终在N次测试后发现问题出现在了对密码验证的回调函数上：

```php
//.......
$this->form_validation->set_rules('password', '密码', 'trim|required|min_length[5]|max_length[30]|callback_pword_check');

//........

/**
 * 用户名及密码有效性验证回调函数
 */
function pword_check($pword){
	$uname = $this->input->post('username');
	$ret =  $this->user_model->login_user($uname, $pword);  //此模块函数完成对密码有效性的验证

	if ($ret) {
		return TRUE;
	} else {
		$this->form_validation->set_message('密码', '用户名或%s错误');
		return FALSE;
	}
}
```

再次查阅CI的文档发现有句没被翻译的内容大致是说“在上面回调的例子中， 错误信息是通过传送回调函数的名称来返回的”，也就是说`set_message`函数的第一个参数应该是对应回调函数的函数名。

```php
$this->form_validation->set_message('pword_check', '用户名或%s错误');
```

OK，错误消失~~

现在知道了，set_message如果是在回调函数使用的话，第一个参数应该是对应的回调函数的函数名称。
