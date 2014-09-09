/*TMODJS:{"version":25,"md5":"5f3473238d52d18448336fb30baeb566"}*/
template('formPanelTemplate',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,options=$data.options,$each=$utils.$each,op=$data.op,index=$data.index,$index=$data.$index,$out='';$out+='</div> <div class="';
$out+=$escape(options.formpanel.classname);
$out+='"> <label class="formitem-label ';
$out+=$escape(options.label.classname);
$out+='" style="';
$out+=$escape(options.label.style);
$out+='" ';
$out+=$escape(options.attr.label);
$out+='></label> ';
$each(options.buttons,function(op,index,$index){
$out+=' ';
if(op.submit){
$out+=' <button class="';
$out+=$escape(op.classname);
$out+='" title="';
$out+=$escape(op.title);
$out+='" ';
$out+=$escape(op.attr);
$out+='>';
$out+=$escape(op.name);
$out+='</button> ';
}else{
$out+=' <a href="#" class="ml10 ';
$out+=$escape(op.classname);
$out+='" title="';
$out+=$escape(op.title);
$out+='" ';
$out+=$escape(op.attr);
$out+='>';
$out+=$escape(op.name);
$out+='</a> ';
}
$out+=' ';
});
$out+=' </div>';
return new String($out);
});