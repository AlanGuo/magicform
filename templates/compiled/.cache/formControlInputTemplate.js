/*TMODJS:{"version":4,"md5":"bd60fa076a80b5927ff5f5291a2ca631"}*/
template('formControlInputTemplate',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,listitem=$data.listitem,p=$data.p,data=$data.data,options=$data.options,flag=$data.flag,$out='';$out+='<input data-listitem="';
$out+=$escape(listitem);
$out+='" id="formitem-';
$out+=$escape(p);
$out+='" class="formitem-control formitem-input ';
$out+=$escape(data.classname);
$out+='" style="';
$out+=$escape(data.style);
$out+='" ';
$out+=$escape(options.status);
$out+=' data-flag="';
$out+=$escape(flag);
$out+='" placeholder="';
$out+=$escape(data.placeholder);
$out+='" ';
$out+=$escape(data.validation);
$out+=' ';
$out+=$escape(data.attr);
$out+=' value="';
$out+=$escape(data.value);
$out+='" type="';
$out+=$escape(data.control);
$out+='">';
return new String($out);
});