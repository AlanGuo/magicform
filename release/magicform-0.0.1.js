/**
 * 配置引擎，实现通用化的配置解析与还原
 * @author alan
 * 2013/12/12
 */

"use strict";

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
        formTemplate: /*<MFFormTemplate>*/'<%for(var p in data){if(p.mf){%><%} else {%><!--key-*--><%if(!data[p].inline){%></p><p class="formitem-p"><label class="formitem-label"><%=p%></label><%}else{%><label class="formitem-label formitem-ml50"><%=p%></label><%}%><%if(data[p].mf){if(data[p].control === "radio"){if(data[p].checked){%><input class="formitem-radio" type="radio" checked name="<%=data[p].name%>"><%}else{%><input class="formitem-radio" type="radio" name="<%=data[p].name%>"><%}%><%}else if(data[p].control==="checkbox"){%><%}%><%}else{%><!--key-value--><input class="formitem-input" value="<%=data[p]%>"></p><%}%><%}}%>'/*</MFFormTemplate>*/,
        json2html: function(json) {
            return util.tmpl(this.formTemplate, {
                data: json
            });
        }
    };
})();