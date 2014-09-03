/*TMODJS:{"version":4,"md5":"6f760fe64cea5ead5304ea589623aac0"}*/
template('formControlHashTemplate',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$string=$utils.$string,keyControlTemplate=$data.keyControlTemplate,controlTemplate=$data.controlTemplate,$out='';$out+='<span class="form-array-li w45p">';
$out+=$string(keyControlTemplate);
$out+='</span> <span class="form-array-li w45p">';
$out+=$string(controlTemplate);
$out+='</span>';
return new String($out);
});