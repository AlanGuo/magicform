/*TMODJS:{"version":4,"md5":"9e2e52b8be767ae04cc15ef8abc3db29"}*/
template('formArrayControlItemTemplate',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$string=$utils.$string,controlTemplate=$data.controlTemplate,editable=$data.editable,$out='';$out+='<br/> <span class="form-array-li"> ';
$out+=$string(controlTemplate);
$out+=' ';
if(editable){
$out+=' <a href="javascript:;" class="form-icon form-item-remove" title="移除"><i class="mf-iconfont">&#xf0153;</i></a> ';
}
$out+=' </span>';
return new String($out);
});