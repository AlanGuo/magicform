/*TMODJS:{"version":9,"md5":"f7400ef4c2cf7f922d24756921c5ff2b"}*/
template('formPanelTemplate',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,options=$data.options,$each=$utils.$each,op=$data.op,$index=$data.$index,$out='';$out+='</div> <div class="';
$out+=$escape(options.formpanel.classname);
$out+='"> <label class="formitem-label ';
$out+=$escape(options.label.classname);
$out+='" style="';
$out+=$escape(options.label.style);
$out+='" ';
$out+=$escape(options.attr.label);
$out+='></label> ';
$each(options.buttons,function(op,$index){
$out+=' ';
if(op.submit){
$out+=' <button class="';
$out+=$escape(op.className);
$out+='" title="';
$out+=$escape(op.title);
$out+='">';
$out+=$escape(op.name);
$out+='</button> ';
}else{
$out+=' <button class="ml15 ';
$out+=$escape(op.className);
$out+='" title="';
$out+=$escape(op.title);
$out+='">';
$out+=$escape(op.name);
$out+='</button> ';
}
$out+=' ';
});
$out+=' </div>';
return new String($out);
});