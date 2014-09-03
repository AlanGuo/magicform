/*TMODJS:{"version":8,"md5":"370c50bdc13c00666febeca175b0068c"}*/
template('formControlSelectTemplate',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,listitem=$data.listitem,p=$data.p,data=$data.data,options=$data.options,$each=$utils.$each,op=$data.op,$index=$data.$index,$out='';$out+='<select data-listitem="';
$out+=$escape(listitem);
$out+='" id="formitem-';
$out+=$escape(p);
$out+='" class="formitem-control formitem-select ';
$out+=$escape(data.classname);
$out+='" style="';
$out+=$escape(data.style);
$out+='" ';
$out+=$escape(data.validation);
$out+=' ';
$out+=$escape(options.status);
$out+=' ';
$out+=$escape(data.disabled);
$out+=' ';
$out+=$escape(data.attr);
$out+=' data-order="';
$out+=$escape(data.order);
$out+='"> ';
$each(data.options,function(op,$index){
$out+=' ';
if(op.group ){
$out+=' </optgroup> <optgroup label="';
$out+=$escape(op.text);
$out+='" class="formitem-selectoption formitem-selectoptiongroup"> ';
}else{
$out+=' <option value="';
$out+=$escape(op.val);
$out+='" class="formitem-selectoption" ';
$out+=$escape(op.attr);
$out+='>';
$out+=$escape(op.text);
$out+='</option> ';
}
$out+=' ';
});
$out+=' </select>';
return new String($out);
});