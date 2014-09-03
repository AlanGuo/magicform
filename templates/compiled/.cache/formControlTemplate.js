/*TMODJS:{"version":4,"md5":"72f5cdee5adce7001dfe0d2ecd8f6acd"}*/
template('formControlTemplate',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,hasCloseTag=$data.hasCloseTag,$escape=$utils.$escape,options=$data.options,$string=$utils.$string,labelTemplate=$data.labelTemplate,$out='';if(hasCloseTag){
$out+=' </div> ';
}
$out+=' <div class="form-group ';
$out+=$escape(options.classname.itemwrapper);
$out+='" style="';
$out+=$escape(options.style.itemwrapper);
$out+='"> ';
$out+=$string(labelTemplate);
return new String($out);
});