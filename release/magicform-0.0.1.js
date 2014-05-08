/**
 * 配置引擎，实现通用化的配置解析与还原
 * @author alan
 * 2013/12/12
 */

"use strict";

~

function(exports) {
    var template = {
        formTemplate: /*<MFFormTemplate>*/'<%var flag=false;for(var p in data){if(p.mf){%><%} else {%><!--key-*--><%if(!data[p].inline){%><%if(flag){%><%if(data[p].hash){%></p><p><label class="formitem-label"><%=p%></label><%=util.tmpl(valueItemTemplate,{data:data[p].key})%><span class="ml10"></span><%}else{%></p><p class="formitem-p"><label class="formitem-label"><%=p%></label><%}%><%}else{flag=true;%><%if(data[p].hash){%><label class="formitem-label"><%=p%></label><%=util.tmpl(valueItemTemplate,{data:data[p].key})%><span class="ml10"></span><%}else{%><p class="formitem-p"><label class="formitem-label"><%=p%></label><%}%><%}%><%}else if(data[p].hash){%><p><label class="formitem-label"><%=p%></label></p><%=util.tmpl(valueItemTemplate,{data:data[p].key})%><span class="ml10"></span><%}else{%><label class="formitem-label formitem-ml50"><%=p%></label><%}%><%if(/array/i.test(Object.prototype.toString.call(data[p]))){%><!--key-array--><span style="display:inline-block"><a href="javascript:;">+</a><%for(var i=data[p].length-1;i>=0;i--){%><br><%if(data[p][i].hash){%><%=util.tmpl(valueItemTemplate,{data:data[p][i].key})%><span class="ml10"></span><%}%><%=util.tmpl(valueItemTemplate,{data:data[p][i]})%><a href="javascript:;">-</a><%}%></span><%}else if("[object Object]" === Object.prototype.toString.call(data[p]) && !data[p].mf){%><!--key-object--><a class="formitem-detail-a" href="javascript:;" data-mf-val="<%=encodeURIComponent(JSON.stringify(data[p]))%>">详细</a><%}else{%><!--key-value--><%=util.tmpl(valueItemTemplate,{data:data[p]})%><%}%><%}}%>'/*</MFFormTemplate>*/,
        formValueItemTemplate: /*<MFFormValueItemTemplate>*/'<%if(data.mf){%><%if(data.control === "radio"){for(var i=0;i<data.options.length;i++){if(data.options[i].checked){%><input class="formitem-radio" type="radio" checked name="<%=data.name%>"><label class="formitem-radio-label"><%=data.options[i].label%></label><%}else{%><input class="formitem-radio" type="radio" name="<%=data.name%>"><label class="formitem-radio-label"><%=data.options[i].label%></label><%}%><%}%><%}else if(data.control === "checkbox"){for(var i=0;i<data.options.length;i++){if(data.options[i].checked){%><input class="formitem-checkbox" type="checkbox" checked><label class="formitem-checkbox-label"><%=data.options[i].label%></label><%}else{%><input class="formitem-checkbox" type="checkbox"><label class="formitem-checkbox-label"><%=data.options[i].label%></label><%}%><%}%><%}else if(data.control==="select"){var flag=false;%><select class="formitem-select"><%for(var i=0;i<data.options.length;i++){%><%if(data.options[i].val==="optgroup"){%><%if(flag){%></optgroup><optgroup label="<%=data.options[i].text%>"><%}else{flag=true;%><optgroup label="<%=data.options[i].text%>"><%}%><%}else{%><option value="<%=data.options[i].val%>"><%=data.options[i].text%></option><%}}%></select><%}else if(data.control){%><input class="formitem-input" type="<%=data.control%>" value="<%=data.value%>"><%}%><%}else{%><!--key-value--><input class="formitem-input" value="<%=data%>"><%}%>'/*</MFFormValueItemTemplate>*/
    }

    var util = (function() {
        return {
            extend: function(objA, objB) {
                for (var p in objB) {
                    objA[p] = objB[p];
                }
                return objA;
            },
            getElementsByClassName: function(className, tag, root) {
                if (!root) root = document;
                if (!tag) tag = "*";
                var result = [];
                var tags = root.getElementsByTagName(tag);
                var reg = new RegExp("(^|\\s+)" + className + "(\\s+|$)", "g");
                for (var i = 0, len = tags.length; i < len; i++) {
                    var t = tags[i];
                    if (reg.test(t.className)) {
                        result.push(t);
                        reg.lastIndex = 0;
                    }
                }
                return result;
            },
            _typeof: function(data) {
                return /\[object\s(\w*)\]/i.exec(Object.prototype.toString.call(data))[1];
            },
            createElementWithTemplate: function(template) {
                var div = document.createElement("div");
                div.innerHTML = template;
                return div.children[0];
            },
            tmpl: function() {
                var cache = {};

                function _getTmplStr(rawStr, mixinTmpl) {
                    if (mixinTmpl) {
                        for (var p in mixinTmpl) {
                            var r = new RegExp('<%#' + p + '%>', 'g');
                            rawStr = rawStr.replace(r, mixinTmpl[p]);
                        }
                    }
                    return rawStr;
                }
                return function tmpl(str, data, opt) {
                    opt = opt || {};
                    var key = opt.key,
                        mixinTmpl = opt.mixinTmpl,
                        strIsKey = opt.strIsKey != null ? opt.strIsKey : !/\W/.test(str);
                    key = key || (strIsKey ? str : null);
                    var fn = key ? cache[key] = cache[key] || tmpl(_getTmplStr(strIsKey ? document.getElementById(str).innerHTML : str, mixinTmpl)) :
                        new Function("obj", "var _p_=[],print=function(){_p_.push.apply(_p_,arguments);};with(obj){_p_.push('" + str
                            .replace(/[\r\t\n]/g, " ")
                            .split("\\'").join("\\\\'")
                            .split("'").join("\\'")
                            .split("<%").join("\t")
                            .replace(/\t=(.*?)%>/g, "',$1,'")
                            .split("\t").join("');")
                            .split("%>").join("_p_.push('") + "');}return _p_.join('');");
                    return data ? fn(data) : fn;
                };
            }()
        };
    })();


    /* exported configEngine */
    var magicForm = (function() {
        return {
            formTemplate: template.formTemplate,
            json2html: function(json) {
                return util.tmpl(this.formTemplate, {
                    data: json,
                    util: util,
                    valueItemTemplate: template.formValueItemTemplate
                });
            }
        };
    })();


    exports.magicForm = magicForm;
}(window);