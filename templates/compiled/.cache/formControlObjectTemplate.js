/*TMODJS:{"version":4,"md5":"042a8ce71e216cddebf17c0431cd9a04"}*/
template('formControlObjectTemplate',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,p=$data.p,stringifyVal=$data.stringifyVal,$out='';$out+='<a href="javascript:;" class="form-icon form-item-detail formitem-control" for="formitem-';
$out+=$escape(p);
$out+='" data-mf-val="';
$out+=$escape(stringifyVal);
$out+='" title="详细设定"><i class="mf-iconfont">&#xf00e1;</i></a>';
return new String($out);
});