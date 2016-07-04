---
title: 分享一个CSS+JS拖动上传图片的源码
tags:
  - AJAX
  - CSS
  - JS
  - 拖动上传
id: 782
categories:
  - 前端
date: 2013-11-22 22:58:56
updated: 2016-05-22 11:33:11
---

如下：

实现了一个简单的拖动图片上传功能 ，带进度显示和图片预览。

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
<title>CSS+JS拖拽图片上传添加附件效果丨芯晴网页特效丨CsrCode.Cn</title>
<style>
<style>
*{ margin:0; padding:0}
body{ background:#000}
#containner{  margin:0 auto; padding:20px; background:#eee; overflow:hidden;position:relative }
#uploadready{ border:2px dashed #ccc; border-radius:3px; float:right; width:100%;background:url(/jscss/demoimg/201207/tipsword.png) center center no-repeat #f8f8f8; text-align:left}
#uploadready h2{ text-align:center; background:#f8f8f8; border-bottom:1px solid #ddd; padding:10px 0; color:#555; font-size:16px}
#uploadready #dropbox{ height:480px; overflow-y:auto;}
#uploadready li{border: 1px solid #DDDDDD;
    float: left;
    font-size: 12px;
    height: 290px;
    line-height: 1.6;
    list-style: none outside none;
    padding: 10px;
    position: relative;
 margin:10px 0 0 10px;
 overflow:hidden;
 box-shadow:2px 2px 2px #ddd;
 -moz-box-shadow:2px 2px 2px #ddd ;
 -webkit-box-shadow:2px 2px 2px #ddd }
#uploadready li p{ background:#F9F4E6; color:#090; padding:1px 4px; cursor:text; word-break:break-all;overflow:hidden; text-overflow:ellipsis;   border-left:#ccc; border-top:#ccc; border-right:#ddd; border-bottom:#ddd; border-width:1px; border-style:solid}
#uploadready li p:focus{ background:#FC9}
.img_and_info img:hover{ cursor:pointer; opacity:.8}
#uploadready li span{ display:none; position:absolute; left:50%; top:50%; text-indent:-9999px; background:url(images/delete_x.png); margin-left:-32px; margin-top:-32px; cursor:pointer;  width:64px; height:64px}
#uploadready li:hover span{ display:block}
.title{ width:628px; height:38px; font-family:'微软雅黑';  font-size:18px; margin-bottom:10px; padding-left:10px}
.source{  border:1px solid #666; background:#FFC; cursor:pointer; padding:5px 12px; font-size:12px; float:left; margin-top:5px}
#uploadView{ min-height:100px;
background:#fff; border:10px solid #ddd;
}
#dropbox img{ display:block; margin:20px auto 5px}
#dropbox ul { padding:0; margin:0}
progress {
    background-color: #EEEEEE;
border:none;
    border-top: 1px solid #ccc;
    bottom: 0;
    height: 2px;
    left: 0;
    position: absolute;
 width:100%
}

progress::-webkit-progress-bar {
    background-color: #d7d7d7;
}

progress::-webkit-progress-value {
    background-color: #f00;
}

.box-shadow{
 box-shadow:0px 0px 8px #999 inset;               /* For Firefox3.6+ */
 -webkit-box-shadow:5px 5px 5px #999 inset;   
 background:#f8f8f8         /* For Chrome5+, Safari5+ */
}

#upload_btn{ width:100%; height:38px; font-size:18px;}
#dropbox img{ background:url('/jscss/demoimg/loading.gif') enter center no-repeat; max-width:230px; max-height:230px}
#dropbox ul{ mix-height:0px}
.btns{ clear:both; padding:8px 0}
.btns input{ padding:5px 20px; margin-right:10px }
</style>
</head>

<body>

<br><font color=skyblue>请使用火狐或chrome浏览！<br>拖拽图片到下面的虚线框中查看预览效果~~<hr><p align="center">本特效由 <a href="http://www.CsrCode.cn" target="_blank">芯晴网页特效</a>丨CsrCode.Cn 收集于互联网，只为兴趣与学习交流，不作商业用途。来源：源码爱好者</font></p>
<div id="containner">
        <div id="uploadready">
        <form id="upload" action="upload.php" method="POST" enctype="multipart/form-data">
        <h2 style="position:relative">
        <input type="button" value="浏览图片" style=" position:absolute; cursor:pointer; left:45px; top:-8px; width:200px">
        <input style="opacity:0; position:absolute; cursor:pointer; left:30px; top:-8px" name="" type="file" multiple="true" onchange="dropHandler(this.files)"   />
        </h2>
      <div id="dropbox">
        <ul id="pageContent">
</ul>
        <ul id="uploaded"></ul>
</div>
<input type="button" style="display:none" id="upload_btn" value="上 传" />
   </form>
        </div>
</div>
<div id="uploadView"></div>
<script type="text/javascript">
 function $(id) {
  return document.getElementById(id);
 }
 function Output(msg) {
  var m = $id("messages");
  m.innerHTML = msg + m.innerHTML;
 }
var oDragWrap =$('uploadready');
//拖进
oDragWrap.addEventListener('dragenter', function(e) {
　e.preventDefault();
  $('dropbox').className='box-shadow';
}, false);

//拖离
oDragWrap.addEventListener('dragleave', function(e) {
  $('dropbox').className='';
}, false);

//拖来拖去 
oDragWrap.addEventListener('dragover', function(e) {
　e.preventDefault();
}, false);

//扔下
oDragWrap.addEventListener('drop', function(e) {
e.stopPropagation();
 e.preventDefault();
var files = e.target.files || e.dataTransfer.files;
dropHandler(files)

}, false);

var arrFiles=[];
var dropHandler = function(files) {
  $('pageContent').className='';
$('upload_btn').style.display='block';
for(var f=0;f<files.length;f++){

 if(files[f].type.indexOf("image")==-1){
  alert('文件' + files[f].name + '不是图片。')
  }
  else{
   arrFiles.push(files[f]);
   //console.log('files['+f+'].index'+files[f].index)

   }
 }
            $('pageContent').innerHTML='';
   for(var i=0; i<arrFiles.length;i++){
    if(arrFiles[i].index!=='no'){
     arrFiles[i].index=parseInt(Math.random() * 9000000);
   }
    }
 for(var i=0; i<arrFiles.length;i++){
   if(arrFiles[i].index!=='no'){
   viewfile(arrFiles[i])
  }
   }

  //调试代码
 for (var i=0; i<arrFiles.length;i++){
  console.log('新数组的索引'+'arrFiles'+i+':'+arrFiles[i].index)
  } 
$('upload_btn').addEventListener('click', function(e) {
　e.preventDefault();
$('upload_btn').style.display='none';//隐藏上传按钮
for(var s=0; s<arrFiles.length;s++){
 if(arrFiles[s].index!=='no'){
 ajaxUpload(arrFiles[s])  
 }
 }
arrFiles=null;
arrFiles=[]; 

}, false); 
}  

//放入完毕
  function ajaxUpload(files){
  var xhr=new XMLHttpRequest();
 xhr.upload.addEventListener('progress',function(e){
  var pc=parseInt(e.loaded/e.total*100);
  if($('progress'+files.index)){
  $('progress'+files.index).value=pc;}
console.log($('progress'+files.index))
  },false)   
  xhr.onreadystatechange = function(e) {
 if (xhr.readyState == 4) {
 var oldli=$('imgViewList'+files.index); 
 var imgsrc='uploads/'+files.name;
   var uploadLi=document.createElement('li');  
    var   html  = '';
    html += '<div  onclick="insertPic(this)" class="img_and_info">';
    html += '<img  border="0" src="'+imgsrc+'">';
    html += '</div>';
    html += ' <p class="imginfo" contenteditable="true">上传完毕</p>';
          uploadLi.innerHTML=html;
          var oldLi=$('imgViewList'+files.index);
     $('pageContent').removeChild(oldLi);
    $('uploaded').appendChild(uploadLi);   
   var bbscode='';
        bbscode+='[img]/000/uploads/'+files.name+'[/img]<br/>'
          $('uploadView').innerHTML+=bbscode;
  }
   };

        xhr.open("POST",'upload.php', true);
   xhr.setRequestHeader("X_FILENAME", files.name);
   xhr.send(files);
   }

// ajaxUpload();
function viewfile(file){
 if(window.webkitURL){

 var imgsrc=window.webkitURL.createObjectURL(file)
createView(file,imgsrc)

  }
 else if(window.URL){

  var imgsrc=window.URL.createObjectURL(file)

createView(file,imgsrc)
  } 

 else{

   var reader = new FileReader();
　reader.onload = function(e) {

var imgsrc=e.target.result;

createView(file,imgsrc)
　}
  reader.readAsDataURL(file);
  }

 }
 //创建预览dom
 function createView(file,imgsrc){

    var html = "";
    html += '<li id="imgViewList'+file.index+'">';
    html += '<div class="img_and_info">';
    html += '<img  border="0" src="'+imgsrc+'">';
    html += '</div>';
    html += '<span onclick="del(\'imgViewList'+file.index+'\')" class="upload_delete" title="删除">删除</span>'
              html += '<progress value="0" max="100" id="progress'+file.index+'"></progress>';
    html += '</li>';
  $('pageContent').innerHTML+=html; 

  }
Array.prototype.del=function(n) {　//n表示第几项，从0开始算起。
　if(n<0){　//如果n<0，则不进行任何操作。
　　return this;}
　else{
　　return this.slice(0,n).concat(this.slice(n+1,this.length));
}
}

//删除预览
  function del(obj){
    var n=parseInt(obj.substring(11));//获取数组索引
  console.log('数组长度为：'+arrFiles.length);
    for(var s=0;s<arrFiles.length; s++){

     if(arrFiles[s].index==n){

     console.log(arrFiles[s].index='no');

      }
     }
        $(obj).parentNode.removeChild($(obj))
  console.log('目前数组为：'+arrFiles);

    }
</script>
</body>
</html>
```

代码转自：[http://www.csrcode.cn/html/txdm/bgtx/4166.htm](http://www.csrcode.cn/html/txdm/bgtx/4166.htm)

可在以上链接中查看效果演示。