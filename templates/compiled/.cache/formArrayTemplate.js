/*TMODJS:{"version":4,"md5":"8e4d92e43e23a3f4f1a0ec4e322b708e"}*/
template('formArrayTemplate',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,data=$data.data,editable=$data.editable,p=$data.p,newTemplate=$data.newTemplate,notNew=$data.notNew,$string=$utils.$string,arrayTemplate=$data.arrayTemplate,$out='';$out+='<span class="form-array-ul formitem-control ';
$out+=$escape(data.classname);
$out+='" type="array"> ';
if(editable){
$out+=' <a href="javascript:;" class="form-icon form-item-add" title="新增" data-p="';
$out+=$escape(p);
$out+='" data-newtemplate="';
$out+=$escape(newTemplate);
$out+='"><i class="mf-iconfont">&#xf0154;</i></a> ';
}
$out+=' ';
if(notNew){
$out+=' ';
$out+=$string(arrayTemplate);
$out+=' ';
}
$out+=' </span>';
return new String($out);
});