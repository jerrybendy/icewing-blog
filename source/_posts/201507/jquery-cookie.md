---
title: 使用jQuery/JS操作浏览器Cookie
tags:
  - cookie
  - javascript
  - JQuery
id: 1226
categories:
  - 前端
date: 2015-07-14 00:20:31
---

以下代码演示如何使用jQuery操作浏览器Cookie（说是用jQuery，其实没用到jQuery的任何函数，所以只需要把外层封装的jQuery扩展函数去掉就可以应用在任何JavaScript环境中。

```js
/******************************
 扩展一个jQuery对象
 用于操作Cookie
 ******************************/
jQuery.extend({
    /**
     * 获取指定Cookie的内容
     * @param sName Cookie的名称
     * @returns {string}
     */
    getCookie : function(sName) {
        var aCookie = document.cookie.split("; ");
        for (var i=0; i < aCookie.length; i++){
            var aCrumb = aCookie[i].split("=");
            if (sName == aCrumb[0]) return decodeURIComponent(aCrumb[1]);
        }
        return '';
    },
    /**
     * 设置Cookie
     * @param sName 名称
     * @param sValue 值
     * @param sExpires 有效期（秒）
     */
    setCookie : function(sName, sValue, sExpires) {
        var sCookie = sName + "=" + encodeURIComponent(sValue);
        if (sExpires != null) {
            var exp = new Date();
            exp.setTime(exp.getTime() + sExpires * 1000);
            sCookie += "; expires=" + exp.toGMTString();
        }

        document.cookie = sCookie;
    },
    /**
     * 删除指定Cookie
     * @param sName
     */
    removeCookie : function(sName) {
        document.cookie = sName + "=; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
    }
});
```

使用方法：

```js
// 设置Cookie， 有效期2小时
$.setCookie('test', 'This is value', 7200);

// 获取Cookie的值
alert($.getCookie('test'));

// 删除刚刚设置的Cookie
$.removeCookie('test');
```
