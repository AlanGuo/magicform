/*TMODJS:{"version":4,"md5":"9b61ece3d84915939b04bb8e09474652"}*/
template('formLabelTemplate',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,data=$data.data,p=$data.p,$out='';$out+='<label class="formitem-label ';
$out+=$escape(data.label.classname);
$out+='" style="';
$out+=$escape(data.label.style);
$out+='" for="formitem-';
$out+=$escape(p);
$out+='" data-key="';
$out+=$escape(p);
$out+='" ';
$out+=$escape(data.label.attr);
$out+='>';
$out+=$escape(data.label.title);
$out+='</label>';
return new String($out);
});