/**
 * 配置引擎，实现通用化的配置解析与还原
 * @author alan
 * 2013/12/12
 */

"use strict";


(function(exports) {
    var template = {
        formTemplate: /*<MFFormTemplate>*/'<%var flag=false;for(var i in order){var p = order[i].p;if(!data[p].inline){%><%if(flag){%><%if(data[p].hash){%></p><p><label class="formitem-label <%=data[p].classname?data[p].classname.label:options.classname.label%>" style="<%=data[p].style?data[p].style.label:options.style.label%>" for="<%=p%>" data-key="<%=p%>"><%=p%></label><%=util.tmpl(valueItemTemplate,{data:data[p].key,flag:true,options:options,listitem:""})%><span class="formitem-ml10"></span><%}else{%></p><p class="formitem-p"><label class="formitem-label <%=data[p].classname?data[p].classname.label:options.classname.label%>" style="<%=data[p].style?data[p].style.label:options.style.label%>" for="<%=p%>" data-key="<%=p%>"><%=data[p].label?data[p].label:p%></label><%}%><%}else{flag=true;%><%if(data[p].hash){%><label class="formitem-label <%=data[p].classname?data[p].classname.label:options.classname.label%>" style="<%=data[p].style?data[p].style.label:options.style.label%>" for="<%=p%>" data-key="<%=p%>"><%=p%></label><%=util.tmpl(valueItemTemplate,{data:data[p].key,flag:true,options:options,listitem:""})%><span class="formitem-ml10"></span><%}else{%><p class="formitem-p"><label class="formitem-label <%=data[p].classname?data[p].classname.label:options.classname.label%>" style="<%=data[p].style?data[p].style.label:options.style.label%>" for="<%=p%>" data-key="<%=p%>"><%=data[p].label?data[p].label:p%></label><%}%><%}%><%}else if(data[p].hash){%><p><label class="formitem-label <%=data[p].classname?data[p].classname.label:options.classname.label%>" for="<%=p%>" style="<%=data[p].style?data[p].style.label:options.style.label%>" data-key="<%=p%>"><%=p%></label></p><%=util.tmpl(valueItemTemplate,{data:data[p].key,flag:true,options:options})%><span class="formitem-ml10"></span><%}else{%><label class="formitem-label <%=data[p].classname?data[p].classname.label:options.classname.label%> formitem-ml50 " style="<%=data[p].style?data[p].style.label:options.style.label%>" for="<%=p%>" data-key="<%=p%>"><%=data[p].label?data[p].label:p%></label><%}%><%if(/array/i.test(Object.prototype.toString.call(data[p]))){%><!--key-array--><span class="form-array-ul formitem-control <%=data[p].classname?data[p].classname.control:options.classname.control%>" type="array"><%if(options.status == "editable" || options.status == "new"){%><a href="javascript:;" class="form-icon form-item-add" title="新增" data-newtemplate="<%=encodeURIComponent(JSON.stringify(data[p].filter(function(item){if(item.fornew) return item;})[0]))%>"><i class="mf-iconfont">&#xf0154;</i></a><%}%><%if(options.status != "new"){%><%for(var i=data[p].length-1;i>=0;i--){%><%if(!data[p][i].fornew){%><br><%if(data[p][i].hash){%><span class="form-array-li w45p"><%=util.tmpl(valueItemTemplate,{data:data[p][i].key,flag:true,options:options,listitem:"listitem"})%></span><span class="form-array-li w50p"><%=util.tmpl(valueItemTemplate,{data:data[p][i],flag:true,options:options,listitem:""})%><%}else{%><span class="form-array-li"><%=util.tmpl(valueItemTemplate,{data:data[p][i],flag:true,options:options,listitem:"listitem"})%><%}%><%if(options.status == "editable" || options.status == "new"){%><a href="javascript:;" class="form-icon form-item-remove" title="移除"><i class="mf-iconfont">&#xf0153;</i></a><%}%></span><%}%><%}%><%}%></span><%}else if("[object Object]" === Object.prototype.toString.call(data[p]) && !data[p].mf || data[p].mf && data[p].isobject){%><!--key-object--><a href="javascript:;" class="form-icon form-item-detail formitem-control" for="<%=p%>" data-mf-val="<%=encodeURIComponent(JSON.stringify(data[p]))%>" title="详细设定"><i class="mf-iconfont">&#xf00e1;</i></a><%}else{%><!--key-value--><%=util.tmpl(valueItemTemplate,{data:data[p],flag:true,options:options,listitem:""})%><%}%><%}%><%if(options.hasbuttons && (options.status == "editable" || options.status == "new")){%><p class="formpannel"><label class="formitem-label <%=options.classname.label%>" style="<%=options.style.label%>"></label><%for(var i=0;i<options.buttons.length;i++){%><%if(options.buttons[i].submit){%><button class="<%=options.buttons[i].className%>" title="<%=options.buttons[i].title%>"><%=options.buttons[i].name%></button><%}else{%><button class="ml15 <%=options.buttons[i].className%>" title="<%=options.buttons[i].title%>"><%=options.buttons[i].name%></button><%}%><%}%></p><%}%>'/*</MFFormTemplate>*/,
        formValueItemTemplate: /*<MFFormValueItemTemplate>*/'<%if(data.mf){%><%if(data.control === "radio"){%><span class="formitem-radio" type="radio" data-order="<%=data.order%>"><%for(var i=0;i<data.options.length;i++){%><input data-listitem="<%=listitem%>" class="formitem-radio" <%=options.status=="disabled" ? "disabled": ""%> placeholder="<%=data.options[i].placeholder?data.options[i].placeholder:""%>" data-flag="<%=flag%>" <%=data.options[i].validation%> <%=data.options[i].disabled%> type="radio" <%=options.status=="new" ? "" : data.options[i].checked%> data-order="<%=data.order%>" name="<%=data.name%>" id="formitem-radio-<%=data.options[i].label%>"><label class="formitem-radio-label" for="formitem-radio-<%=data.options[i].label%>"><%=data.options[i].label%></label><%}%></span><%}else if(data.control === "checkbox"){%><span class="formitem-checkbox" type="checkbox" data-order="<%=data.order%>"><%for(var i=0;i<data.options.length;i++){%><input data-listitem="<%=listitem%>" class="formitem-checkbox" placeholder="<%=data.options[i].placeholder?data.options[i].placeholder:""%>" <%=options.status=="disabled" ? "disabled": ""%> <%=data.options[i].disabled%> <%=data.options[i].validation%> data-flag="<%=flag%>" type="checkbox" <%=options.status=="new" ? "" : data.options[i].checked%> id="formitem-radio-<%=data.options[i].label%>"><label for="formitem-radio-<%=data.options[i].label%>" class="formitem-checkbox-label"><%=data.options[i].label%></label><%}%></span><%}else if(data.control==="select"){var flag=false;%><select data-listitem="<%=listitem%>" class="formitem-control <%=data.classname?data.classname.control:options.classname.control%> formitem-select" style="<%=data.style?data.style.control:options.style.control%>" <%=options.status=="disabled" ? "disabled": ""%> data-flag="<%=flag%>" <%=data.validation%> <%=data.disabled%> data-order="<%=data.order%>"><%for(var i=0;i<data.options.length;i++){%><%if(data.options[i].val==="optgroup"){%><%if(flag){%></optgroup><optgroup label="<%=data.options[i].text%>" class="formitem-selectoption formitem-selectoptiongroup"><%}else{flag=true;%><optgroup label="<%=data.options[i].text%>" class="formitem-selectoption formitem-selectoptiongroup"><%}%><%}else{%><option value="<%=data.options[i].val%>" class="formitem-selectoption"><%=data.options[i].text%></option><%}}%></select><%}else if(data.control === "textarea"){%><textarea data-listitem="<%=listitem%>" class="formitem-control <%=data.classname?data.classname.control:options.classname.control%> formitem-input" style="<%=data.style?data.style.control:options.style.control%>" <%=options.status=="disabled" ? "disabled": ""%> placeholder="<%=data.placeholder?data.placeholder:""%>" data-flag="<%=flag%>" <%=data.validation%> <%=data.disabled%> data-order="<%=data.order%>" type="<%=data.control%>"><%=options.status=="new" ? "" : data.value%></textarea><%}else{%><input data-listitem="<%=listitem%>" class="formitem-control <%=data.classname?data.classname.control:options.classname.control%> formitem-input" style="<%=data.style?data.style.control:options.style.control%>" placeholder="<%=data.placeholder?data.placeholder:""%>" <%=options.status=="disabled" ? "disabled": ""%> data-flag="<%=flag%>" <%=data.validation%> <%=data.disabled%> data-order="<%=data.order%>" type="<%=data.control%>" value="<%=options.status=="new" ? "" : data.value%>"><%}%><%}else{%><!--key-value--><input data-listitem="<%=listitem%>" class="formitem-control <%=data.classname?data.classname.control:options.classname.control%> formitem-input" style="<%=data.style?data.style.control:options.style.control%>" <%=options.status=="disabled" ? "disabled": ""%> data-flag="<%=flag%>" <%=data.validation%> value="<%=options.status=="new" ? "" : data%>"><%}%>'/*</MFFormValueItemTemplate>*/,
        formArrayItemTemplate: /*<MFFormArrayItemTemplate>*/'<br><%if(data.hash){%><span class="form-array-li w45p"><%=util.tmpl(valueItemTemplate,{data:data.key,flag:true,options:options,listitem:"listitem"})%></span><span class="form-array-li w50p"><%=util.tmpl(valueItemTemplate,{data:data,flag:false,options:options,listitem:""})%><%if(options.status == "editable" || options.status == "new"){%><a href="javascript:;" class="form-icon form-item-remove" title="移除"><i class="mf-iconfont">&#xf0153;</i></a><%}%></span><%}else{%><span class="form-array-li"><%=util.tmpl(valueItemTemplate,{data:data,flag:false,options:options,listitem:"listitem"})%><%if(options.status == "editable" || options.status == "new"){%><a href="javascript:;" class="form-icon form-item-remove" title="移除"><i class="mf-iconfont">&#xf0153;</i></a><%}%></span><%}%>'/*</MFFormArrayItemTemplate>*/,
        formDialogTemplate: /*<MFFormDialogTemplate>*/'<div class="form-dialog dialog" id="form-dialog"><div class="topbar clearfix"><span class="title"><%=title%></span><span class="buttons"><a class="form-icon form-icon-close close" href="javascript:;"></a></span></div><div class="form-dialog-content content"></div></div>'/*</MFFormDialogTemplate>*/
    };

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
            /*jshint quotmark: false */
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
                /* jshint -W054 */
                return function tmpl(str, data, opt) {
                    opt = opt || {};
                    var key = opt.key,
                        mixinTmpl = opt.mixinTmpl,
                        strIsKey = opt.strIsKey !== null ? opt.strIsKey : !/\W/.test(str);
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

            DEFAUTLBUTTONS: [{
                "name": "提交",
                "title": "提交表单",
                "className": "primary",
                "submit": true
            }, {
                "name": "取消",
                "title": "取消",
                "className": "normal"
            }],

            /**
             * @method _setOptions
             * @private
             */
            _setOptions: function(options) {
                options = options || {};

                //默认按钮
                if (!options.buttons) {
                    options.buttons = magicForm.DEFAUTLBUTTONS.concat();
                }
                options.status = options.status || "disabled";
                options.functions = options.functions || ["editable"];
                options.style = options.style || {
                    label: "",
                    control: ""
                };
                options.classname = options.classname || {
                    label: "formitem-label w20p align-right mr10p",
                    control: "formitem-control w70p"
                };

                return options;
            },


            /**
             * json2html -> init
             * @method generate
             * @param json 数据对象
             * @param options
             * @param options.status {String} 表单状态 "disabled","editable","new"
             * @param options.functions {Array} 表单功能 ["editable"]
             * @param options.buttons {Array} 按钮功能 [{name:"submit","title":"提交表单"},{name:"cancel",title:""},{name:"reset"}]
             */

            generate: function(form, json, options) {
                form.innerHTML = this.json2html(json, options);
                this.init(form, json, options);
                return this;
            },

            /**
             * json -> html
             * @method json2html
             * @param json 数据对象
             * @param options
             * @param options.status {String} 表单状态 "disabled","editable","new"
             * @param options.functions {Array} 表单功能 ["editable"]
             * @param options.buttons {Array} 按钮功能 [{name:"submit","title":"提交表单"},{name:"cancel",title:""},{name:"reset"}]
             */
            json2html: function(json, options) {
                var orders = [];
                options = this._setOptions(options);
                //排序
                for (var p in json) {
                    orders.push({
                        p: p,
                        order: json[p].order
                    });
                }
                /*jshint eqnull:true */
                orders = orders.sort(function(a, b) {
                    if (a.order == null || a.order === "") a.order = 100;
                    if (b.order == null || b.order === "") b.order = 100;
                    if (a.order > b.order) return true;
                    if (a.order < b.order) return false;
                });


                return util.tmpl(this.formTemplate, {
                    data: json,
                    order: orders,
                    util: util,
                    options: options,
                    valueItemTemplate: template.formValueItemTemplate
                });
            },

            /**
             * 把显示属性，附加上去，此方法可以保持数据对象的纯净
             * @method attach
             * @param attaproc
             * @param attaproc.atta 附加对象
             * @param attaproc.prop 属性
             * @param attaproc.src 源数据
             * @param attaproc.index 索引
             */

            attach: function(json, attr) {
                var jsonCopy = util.extend({}, json);

                var defproc = function(a, p, i) {
                    /*jshint eqnull:true */
                    if (i != null) {
                        if (a.attaproc) {
                            //自定义处理过程
                            jsonCopy[p][i] = a.attaproc(a, p, json, i);
                        } else {
                            //默认处理过程
                            if (json[p][i]) {
                                a.value = json[p][i];
                            }
                            jsonCopy[p][i] = a;
                        }
                    } else {
                        if (a.attaproc) {
                            //自定义处理过程
                            jsonCopy[p] = a.attaproc(a, p, json);
                        } else {
                            //默认处理过程
                            if (json[p]) {
                                a.value = json[p];
                            }
                            jsonCopy[p] = a;
                        }
                    }
                };

                for (var p in jsonCopy) {
                    if (attr[p]) {
                        var index = 0;
                        if (/array/i.test(util._typeof(attr[p]))) {
                            for (var i = 0; i < attr[p].length; i++) {
                                if (!attr[p][i].fornew) {
                                    defproc(attr[p][i], p, i - index);
                                } else {
                                    //fornew
                                    jsonCopy[p].push(attr[p][i]);
                                    index++;
                                }
                            }
                        } else {
                            defproc(attr[p], p);
                        }
                    }
                }
                return jsonCopy;
            },


            /**
             * 把显示属性，剥离出来，此方法可以保持数据对象的纯净
             * @method detach
             * @param detaproc
             * @param detaproc.prop 属性
             * @param detaproc.src 源数据
             * @param detaproc.index 索引
             */

            detach: function(json, attr) {
                var jsonCopy = {};
                var defproc = function(jsonCopy, src, p, index) {
                    /*jshint eqnull:true*/
                    if (index != null) {
                        jsonCopy[p] = jsonCopy[p] || [];
                        if (attr[p][i].detaproc) {
                            jsonCopy[p].push(attr[p][i].detaproc(p, src, index));
                        } else {
                            jsonCopy[p].push(src.value);
                        }
                    } else {
                        if (attr[p] && attr[p].detaproc) {
                            jsonCopy[p] = attr[p].detaproc(p, src, index);
                        } else {
                            if (src.mf) {
                                jsonCopy[p] = src.value || "";
                            } else if (/object/i.test(util._typeof(src))) {
                                //是个对象
                                jsonCopy[p] = src;
                            }
                        }
                    }
                };
                for (var p in json) {
                    if (/array/i.test(util._typeof(json[p]))) {
                        for (var i = 0; i < json[p].length; i++) {
                            if (!json[p][i].fornew) {
                                defproc(jsonCopy, json[p][i], p, i);
                            }
                        }
                    } else {
                        defproc(jsonCopy, json[p], p);
                    }
                }

                return jsonCopy;
            },

            /**
             * html2value
             * @method _html2value
             * @private
             */
            _html2value: function(control) {
                var json = null;
                var options = null;
                var order = null;
                var j = 0;
                if (control) {
                    //判断控件类型
                    if (/span/i.test(control.tagName)) {
                        var type = control.getAttribute("type");
                        if (type == "checkbox" || type == "radio") {
                            var inputs = control.querySelectorAll("input");
                            var labels = control.querySelectorAll("label");
                            options = [];
                            for (j = 0; j < inputs.length; j++) {
                                options.push({
                                    label: labels[j].innerHTML,
                                    checked: inputs[j].checked ? "checked" : "",
                                    disabled: inputs[j].disabled ? "disabled" : ""
                                });
                            }

                            order = parseInt(control.getAttribute("data-order"), 10);
                            if (isNaN(order)) {
                                order = null;
                            }
                            json = {
                                mf: 1,
                                control: type,
                                name: inputs[0].name,
                                options: options,
                                order: order
                            };
                        } else {
                            //数组或者hash
                            var controls = control.querySelectorAll(".formitem-control");
                            var add = control.querySelector(".form-item-add");
                            var addItem = add.getAttribute("data-newtemplate");
                            json = addItem ? [JSON.parse(decodeURIComponent(addItem))] : [];
                            for (var i = controls.length - 1; i >= 0; i--) {
                                var con = controls[i];
                                var con2 = controls[i - 1];
                                if (con2 && con2.getAttribute("data-flag") == "true") {
                                    var key = this._html2value(con2);
                                    var val = this._html2value(con);
                                    if (/string/i.test(typeof val)) {
                                        val = {
                                            value: val
                                        };
                                    }
                                    val.mf = 1;
                                    val.hash = 1;
                                    val.key = key;
                                    val.control = con.getAttribute("type");

                                    order = parseInt(control.getAttribute("data-order"), 10);
                                    if (isNaN(order)) {
                                        order = null;
                                    }
                                    val.order = order;
                                    val.disabled = con.disabled ? "disabled" : "";
                                    json.push(val);

                                    i--;
                                } else {
                                    json.push(this._html2value(con));
                                }
                            }
                        }
                    } else if (/select/i.test(control.tagName)) {
                        //select
                        var optionControls = control.querySelectorAll(".formitem-selectoption");
                        options = [];
                        for (j = 0; j < optionControls.length; j++) {
                            if (/optgroup/i.test(optionControls[j])) {
                                options.push({
                                    val: "optgroup",
                                    text: optionControls[j].getAttribute("label")
                                });
                            } else {
                                options.push({
                                    val: optionControls[j].value,
                                    text: optionControls[j].innerHTML,
                                });
                            }


                            order = parseInt(control.getAttribute("data-order"), 10);
                            if (isNaN(order)) {
                                order = null;
                            }
                            json = {
                                mf: 1,
                                control: "select",
                                options: options,
                                order: order,
                                disabled: control.disabled ? "disabled" : ""
                            };
                        }
                    } else if (/a/i.test(control.tagName)) {
                        var value = control.getAttribute("data-mf-val");
                        if (value) {
                            value = decodeURIComponent(value);
                            json = JSON.parse(value);
                        }
                    } else if (/input/i.test(control.tagName)) {
                        if (control.type) {
                            order = parseInt(control.getAttribute("data-order"), 10);
                            if (isNaN(order)) {
                                order = null;
                            }
                            //其他input类型
                            json = {
                                mf: 1,
                                control: control.type,
                                value: control.value,
                                order: order,
                                disabled: control.disabled ? "disabled" : ""
                            };
                        } else {
                            //字符串
                            json = control.value;
                        }
                    }
                }

                return json;
            },
            /**
             * html -> json
             * @method html2json
             */
            html2json: function(form, options) {
                options = options || {};
                var items = form.querySelectorAll(".formitem-p");
                var json = {};
                for (var i = 0; i < items.length; i++) {
                    var key = items[i].querySelector(".formitem-label").getAttribute("data-key");
                    var control = items[i].querySelector(".formitem-control");
                    //转换html结构
                    json[key] = this._html2value(control);
                }
                return json;
            },

            /**
             * 初始化一些事件
             * @method init
             */
            init: function(wrapper, json, options) {
                var self = this;
                options = this._setOptions(options);
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
                };

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
                };

                /*jshint -W083 */
                var i = 0;
                var uls = wrapper.querySelectorAll(".form-array-ul");
                for (i = 0; i < uls.length; i++) {
                    var addAnchor = uls[i].querySelector(".form-item-add");
                    if (addAnchor) {
                        //绑定新增事件
                        (function(anchor, ul) {
                            anchor.addEventListener("click", function() {
                                var newtemplate = anchor.getAttribute("data-newtemplate") == "undefined" ? null : anchor.getAttribute("data-newtemplate");

                                if (newtemplate) {
                                    var elems = util.createElementsWithTemplate(util.tmpl(template.formArrayItemTemplate, {
                                        valueItemTemplate: template.formValueItemTemplate,
                                        data: JSON.parse(decodeURIComponent(newtemplate)),
                                        util: util,
                                        options: options
                                    }));
                                    //插入元素
                                    var br = ul.querySelector("br");
                                    var last = null;
                                    var focusElem = null;
                                    while (elems.length) {
                                        last = elems[0];
                                        if (!focusElem) focusElem = last.querySelector("input");
                                        ul.insertBefore(elems[0], br);
                                    }
                                    //焦点元素
                                    if (focusElem) {
                                        focusElem.focus();
                                    }
                                    if (last) {
                                        initFormArrayItem(last);
                                    }
                                }
                            });
                        })(addAnchor, uls[i]);
                    }
                }

                //初始化表单数组
                var controls = wrapper.querySelectorAll(".form-array-li");
                for (i = 0; i < controls.length; i++) {
                    initFormArrayItem(controls[i]);
                }
                //初始化详情按钮
                var details = wrapper.querySelectorAll(".form-item-detail");
                for (i = 0; i < details.length; i++) {
                    var key = details[i].getAttribute("for");
                    var val = json[key];
                    if (val.onclick) {
                        details[i].addEventListener("click", function() {
                            val.onclick.call(this, JSON.parse(decodeURIComponent(this.getAttribute("data-mf-val"))));
                        });
                    }
                }

                return this;
            }
        };
    })();

    exports.magicform = magicForm;
})(window);