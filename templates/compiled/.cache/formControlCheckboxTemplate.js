/*TMODJS:{"version":5,"md5":"9376a1f7c495e644f4ae433a9f7dc0a7"}*/
template('formControlCheckboxTemplate',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,data=$data.data,$each=$utils.$each,op=$data.op,$index=$data.$index,listitem=$data.listitem,$out='';$out+='<span class="formitem-control ';
$out+=$escape(data.classname);
$out+=' formitem-checkbox" type="checkbox" data-order="';
$out+=$escape(data.order);
$out+='"> ';
$each(data.options,function(op,$index){
$out+=' <input data-listitem="';
$out+=$escape(listitem);
$out+='" class="formitem-checkbox" placeholder="';
$out+=$escape(op.placeholder);
$out+='" ';
$out+=$escape(op.disabled);
$out+=' ';
$out+=$escape(op.validation);
$out+=' ';
$out+=$escape(op.attr);
$out+=' ';
$out+=$escape(op.flag);
$out+=' checked="';
$out+=$escape(op.checked);
$out+='" ';
$out+=$escape(op.status);
$out+=' type="checkbox" id="formitem-radio-';
$out+=$escape(op.label.title);
$out+='"><label class="formitem-checkbox-label" for="formitem-radio-';
$out+=$escape(op.label.title);
$out+='" ';
$out+=$escape(op.label.attr);
$out+='>';
$out+=$escape(op.label.title);
$out+='</label> ';
});
$out+=' </span>';
return new String($out);
});