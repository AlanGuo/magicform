/**
 * 配置引擎，实现通用化的配置解析与还原
 * @author alan
 * 2013/12/12
 */

"use strict";

~

function(exports) {
    var template = {
        formTemplate: /*<MFFormTemplate>*/'<%var flag=false;for(var p in data){if(p.mf){%><%} else {%><!--key-*--><%if(!data[p].inline){%><%if(flag){%><%if(data[p].hash){%></p><p><label class="formitem-label "><%=p%></label><%=util.tmpl(valueItemTemplate,{data:data[p].key})%><span class="formitem-ml10"></span><%}else{%></p><p class="formitem-p"><label class="formitem-label "><%=p%></label><%}%><%}else{flag=true;%><%if(data[p].hash){%><label class="formitem-label "><%=p%></label><%=util.tmpl(valueItemTemplate,{data:data[p].key})%><span class="formitem-ml10"></span><%}else{%><p class="formitem-p"><label class="formitem-label "><%=p%></label><%}%><%}%><%}else if(data[p].hash){%><p><label class="formitem-label "><%=p%></label></p><%=util.tmpl(valueItemTemplate,{data:data[p].key})%><span class="formitem-ml10"></span><%}else{%><label class="formitem-label formitem-ml50 "><%=p%></label><%}%><%if(/array/i.test(Object.prototype.toString.call(data[p]))){%><!--key-array--><span class="form-array-ul"><a href="javascript:;" class="form-icon form-item-add" title="新增" data-newtemplate="<%=encodeURIComponent(JSON.stringify(data[p].filter(function(item){if(item.fornew) return item;})[0]))%>"><i class="iconfont">&#xf0154;</i></a><%for(var i=data[p].length-1;i>=0;i--){%><%if(!data[p][i].fornew){%><br><%if(data[p][i].hash){%><span class="form-array-li"><%=util.tmpl(valueItemTemplate,{data:data[p][i].key})%><span class="formitem-ml10"></span></span><%}%><span class="form-array-li"><%=util.tmpl(valueItemTemplate,{data:data[p][i]})%><a href="javascript:;" class="form-icon form-item-remove" title="移除"><i class="iconfont">&#xf0153;</i></a></span><%}%><%}%></span><%}else if("[object Object]" === Object.prototype.toString.call(data[p]) && !data[p].mf){%><!--key-object--><a href="javascript:;" class="form-icon form-item-detail" data-mf-val="<%=encodeURIComponent(JSON.stringify(data[p]))%>" title="详细设定"><i class="iconfont">&#xf00e1;</i></a><%}else{%><!--key-value--><%=util.tmpl(valueItemTemplate,{data:data[p]})%><%}%><%}}%>'/*</MFFormTemplate>*/,
        formValueItemTemplate: /*<MFFormValueItemTemplate>*/'<%if(data.mf){%><%if(data.control === "radio"){for(var i=0;i<data.options.length;i++){if(data.options[i].checked){%><input class="formitem-radio" type="radio" checked name="<%=data.name%>"><label class="formitem-radio-label"><%=data.options[i].label%></label><%}else{%><input class="formitem-radio" type="radio" name="<%=data.name%>"><label class="formitem-radio-label"><%=data.options[i].label%></label><%}%><%}%><%}else if(data.control === "checkbox"){for(var i=0;i<data.options.length;i++){if(data.options[i].checked){%><input class="formitem-checkbox" type="checkbox" checked><label class="formitem-checkbox-label"><%=data.options[i].label%></label><%}else{%><input class="formitem-checkbox" type="checkbox"><label class="formitem-checkbox-label"><%=data.options[i].label%></label><%}%><%}%><%}else if(data.control==="select"){var flag=false;%><select class="formitem-select"><%for(var i=0;i<data.options.length;i++){%><%if(data.options[i].val==="optgroup"){%><%if(flag){%></optgroup><optgroup label="<%=data.options[i].text%>"><%}else{flag=true;%><optgroup label="<%=data.options[i].text%>"><%}%><%}else{%><option value="<%=data.options[i].val%>"><%=data.options[i].text%></option><%}}%></select><%}else if(data.control){%><input class="formitem-input" type="<%=data.control%>" value="<%=data.value%>"><%}%><%}else{%><!--key-value--><input class="formitem-input" value="<%=data%>"><%}%>'/*</MFFormValueItemTemplate>*/,
        formArrayItemTemplate: /*<MFFormArrayItemTemplate>*/'<br><%if(data.hash){%><span class="form-array-li"><%=util.tmpl(valueItemTemplate,{data:data.key})%><span class="formitem-ml10"></span></span><%}%><span class="form-array-li"><%=util.tmpl(valueItemTemplate,{data:data})%><a href="javascript:;" class="form-icon form-item-remove" title="移除"><i class="iconfont">&#xf0153;</i></a></span>'/*</MFFormArrayItemTemplate>*/
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
            createElementsWithTemplate: function(template) {
                var div = document.createElement("div");
                div.innerHTML = template;
                return div.children;
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

            /**
             * json -> html
             * @method json2html
             */
            json2html: function(json) {
                return util.tmpl(this.formTemplate, {
                    data: json,
                    util: util,
                    valueItemTemplate: template.formValueItemTemplate
                });
            },

            /**
             * 初始化一些事件
             * @method init
             */
            init: function(wrapper) {
                var initRemoveAnchor = function(removeAnchor) {
                    removeAnchor.addEventListener("click", function() {
                        var removeParent = this.parentNode.parentNode;
                        //删除换行

                        var previousSibling = this.parentNode.previousSibling;

                        if (/form-array-li/i.test(previousSibling.className)) {
                            //删除三个元素
                            removeParent.removeChild(this.parentNode.previousSibling.previousSibling);
                            removeParent.removeChild(this.parentNode.previousSibling);
                            removeParent.removeChild(this.parentNode);
                        } else {
                            //删除两个元素
                            removeParent.removeChild(this.parentNode.previousSibling);
                            removeParent.removeChild(this.parentNode);
                        }
                    });
                }

                var initFormArrayItem = function(con) {
                    con.addEventListener("mouseover", function() {
                        var remove = this.querySelector(".form-item-remove");
                        if (remove) remove.style.visibility = "visible";
                    });
                    con.addEventListener("mouseout", function() {
                        var remove = this.querySelector(".form-item-remove");
                        if (remove) remove.style.visibility = "hidden";
                    });

                    var removeAnchor = con.querySelector(".form-item-remove");

                    if (removeAnchor) {
                        initRemoveAnchor(removeAnchor);
                    }
                }

                var uls = wrapper.querySelectorAll(".form-array-ul");
                for (var i = 0; i < uls.length; i++) {
                    var addAnchor = uls[i].querySelector(".form-item-add");
                    if (addAnchor) {
                        //绑定新增事件
                        (function(anchor, ul) {
                            anchor.addEventListener("click", function(evt) {
                                var newtemplate = anchor.getAttribute("data-newtemplate") == "undefined" ? null : anchor.getAttribute("data-newtemplate");

                                if (newtemplate) {
                                    var elems = util.createElementsWithTemplate(util.tmpl(template.formArrayItemTemplate, {
                                        valueItemTemplate: template.formValueItemTemplate,
                                        data: JSON.parse(decodeURIComponent(newtemplate)),
                                        util: util
                                    }));
                                    //插入元素
                                    var br = ul.querySelector("br");
                                    var last = null;
                                    while (elems.length) {
                                        last = elems[0];
                                        ul.insertBefore(elems[0], br);
                                    }
                                    if (last) {
                                        var input = last.querySelector("input");
                                        input && input.focus();

                                        initFormArrayItem(last);
                                    }
                                }
                            });
                        })(addAnchor, uls[i]);
                    }
                }

                //初始化表单数组
                var controls = wrapper.querySelectorAll(".form-array-li");
                for (var i = 0; i < controls.length; i++) {
                    initFormArrayItem(controls[i])
                }

                return this;
            }
        };
    })();

    exports.magicForm = magicForm;
}(window);