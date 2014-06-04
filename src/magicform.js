/**
 * 配置引擎，实现通用化的配置解析与还原
 * @author alan
 * 2013/12/12
 */

"use strict";


/*global MFFormTemplate:false */
/*global MFFormValueItemTemplate:false */
/*global MFFormArrayItemTemplate:false */
/*global MFFormDialogTemplate:false */
(function(exports) {
    var template = {
        formTemplate: MFFormTemplate,
        formValueItemTemplate: MFFormValueItemTemplate,
        formArrayItemTemplate: MFFormArrayItemTemplate,
        formDialogTemplate: MFFormDialogTemplate
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
                /* jslint evil: true */
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

            /**
             * json -> html
             * @method json2html
             */
            json2html: function(json) {
                var orders = [];
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
                    valueItemTemplate: template.formValueItemTemplate
                });
            },

            /**
             * 把显示属性，附加上去，此方法可以保持数据对象的纯净
             * @method attach
             * @param proc
             * @param proc.dest 目标对象
             * @param proc.src 附加对象
             */

            attach: function(json, attr) {
                var jsonCopy = util.extend({}, json);
                for (var p in jsonCopy) {
                    if (attr[p]) {
                        if (attr[p].proc) {
                            //自定义处理过程
                            jsonCopy[p] = attr[p].proc(jsonCopy[p], attr[p]);
                        } else {
                            //默认处理过程
                            if (json[p]) {
                                attr[p].value = json[p];
                            }
                            jsonCopy[p] = attr[p];
                        }
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
                            json = {
                                mf: 1,
                                control: type,
                                name: inputs[0].name,
                                options: options,
                                order: control.getAttribute("data-order"),
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

                                    try {
                                        order = parseInt(control.getAttribute("data-order"), 10);
                                    } catch (e) {
                                        order = null;
                                    }
                                    val.order = con.getAttribute("data-order");
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


                            try {
                                order = parseInt(control.getAttribute("data-order"), 10);
                            } catch (e) {
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

                            try {
                                order = parseInt(control.getAttribute("data-order"), 10);
                            } catch (e) {
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
            init: function(wrapper) {
                var self = this;
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

                var initFormDetailItem = function(con) {
                    con.addEventListener("click", function() {
                        var dialog = util.createElementsWithTemplate(util.tmpl(template.formDialogTemplate, {
                            title: "详细"
                        }))[0];
                        //只允许有一个dialog
                        var globalDialog = document.getElementById("form-dialog");
                        if (!globalDialog) {
                            wrapper.appendChild(dialog);
                            globalDialog = dialog;
                        } else {
                            globalDialog.innerHTML = dialog.innerHTML;
                        }
                        var w = dialog.clientWidth,
                            h = dialog.clientHeight;
                        //窗口尺寸
                        var winWidth = document.documentElement.clientWidth;
                        var winHeight = document.documentElement.clientHeight;

                        //窗口居中
                        dialog.style.left = (winWidth - w) / 2 + "px";
                        dialog.style.top = (winHeight - h) / 2 + "px";

                        //填充内容
                        var content = dialog.querySelector(".form-dialog-content");
                        content.innerHTML = self.json2html(JSON.parse(decodeURIComponent(con.getAttribute("data-mf-val"))));

                        //绑定按钮事件
                        var closeButton = globalDialog.querySelector(".form-icon-close");
                        var saveButton = globalDialog.querySelector(".form-button-save");

                        closeButton.onclick = function() {
                            wrapper.removeChild(globalDialog);
                        };
                        saveButton.onclick = function() {
                            var dialogContent = globalDialog.querySelector(".form-dialog-content");
                            if (dialogContent) {
                                var json = self.html2json(dialogContent);
                                con.setAttribute("data-mf-val", encodeURIComponent(JSON.stringify(json)));
                                wrapper.removeChild(globalDialog);
                            }
                        };

                    });
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
                                        util: util
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
                    initFormDetailItem(details[i]);
                }

                return this;
            }
        };
    })();

    exports.magicform = magicForm;
})(window);