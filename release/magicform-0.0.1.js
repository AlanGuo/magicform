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
        }
    };
})();


/* exported configEngine */
var configEngine = (function() {
    return {
        config2Object: function(wrapper, endElem) {
            var jsonData = "";
            var elems = Array.prototype.slice.call(wrapper.querySelectorAll("[data-key]"));
            for (var i = 0, len = elems.length; i < len; i++) {
                var elem = elems[i];
                if (endElem && elem == endElem) break;
                var key = elem.getAttribute("data-key");
                var expression = elem.getAttribute("data-expression");
                var type = elem.getAttribute("data-type");
                var datavalue = "";
                switch (type) {
                    //对象
                    case "object":
                        datavalue = expression ? eval(expression) : "";
                        datavalue = unescape(escape(datavalue).replace(/%22|%27/g, "\\\""));
                        if (key)
                            jsonData += ("\"" + key.trim() + "\"" + ":\"" + datavalue + "\"");
                        else
                            jsonData += ("\"" + datavalue + "\"");
                        break;
                        //操作符，不加引号，不eval
                    case "operator":
                        datavalue = expression ? expression : "";
                        jsonData += datavalue;
                        break;
                        //元数据，不eval
                    case "raw":
                        if (key)
                            jsonData += ("\"" + key.trim() + "\"" + ":" + (expression ? expression : "\"null\""));
                        else
                            jsonData += (expression ? expression : "\"null\"");
                        break;
                        //key值，对key值eval
                    case "key":
                        datavalue = expression ? eval(expression) : "";
                        datavalue = unescape(escape(datavalue).replace(/%22|%27/g, "\\\""));
                        jsonData += ("\"" + datavalue + "\"");
                        break;
                }
            }
            return JSON.parse(jsonData.replace(/,[\n\s]*([\}\]]|$)/g, "$1"));
        },

        hash2Config: function(wrapper, obj, options) {
            //设置hash值
            var _self = this;
            var setHash = options.setHash || function(item, value) {
                    var itemTemplate = options.templates[wrapper.getAttribute("data-hashitem")];

                    if (itemTemplate) {
                        item.innerHTML = "";
                        for (var property in value) {
                            var div = document.createElement("div");
                            div.innerHTML = itemTemplate;

                            div.querySelector(".key").value = property;
                            var valElement = div.querySelector(".value");

                            options.hashItemCallback && options.hashItemCallback(div.children[0], value);

                            if ("value" in valElement)
                                valElement.value = value[property];
                            else {
                                _self.object2Config(valElement, value[property], "", options);
                            }

                            item.appendChild(div.children[0]);
                        }
                    }
                }
            setHash(wrapper, obj);
        },

        array2Config: function(wrapper, obj, options) {
            //设置数组
            var _self = this;
            var setArray = options.setArray || function(item, value) {
                    var itemTemplate = options.templates[wrapper.getAttribute("data-arrayitem")];

                    item.innerHTML = "";
                    for (var i = 0, len = value.length; i < len; i++) {
                        var valueItem = value[i];
                        var div = document.createElement("div");
                        div.innerHTML = itemTemplate;
                        options.arrayItemCallback && options.arrayItemCallback(div.children[0], valueItem);
                        _self.object2Config(div.children[0], valueItem, "", options);
                        item.appendChild(div.children[0]);
                    }
                }
            setArray(wrapper, obj);
        },

        /* 根据object的值来设定ui，返回设定的elem */
        object2Config: function(wrapper, obj, routes, options) {
            routes = routes || "";
            options = options || {};
            var _self = this;
            var setValue = options.setValue || function(elem, value) {
                    var type = elem.getAttribute("type");
                    if (type) {
                        if (type && type.toLowerCase() == "date") {
                            elem.valueAsDate = new Date(value);
                        } else if (type.toLowerCase() == "checkbox") {
                            if (value == "true") {
                                elem.setAttribute("checked", "checked");
                            } else {
                                elem.removeAttribute("checked");
                            }
                        }
                    } else {
                        elem.value = value;
                    }
                    options.valueCallback && options.valueCallback(elem, value);
                    return elem;
                }

            var setExpression = options.setExpression || function(elems, value, routes) {
                    if (elems.length > 1) {
                        for (var i = 0, len = elems.length; i < len; i++) {
                            var e = elems[i];
                            var routesNode = e;
                            var r = routesNode.getAttribute("data-routes") || "";
                            while (routesNode != wrapper) {
                                routesNode = routesNode.parentNode;
                                r = (routesNode.getAttribute("data-routes") || "") + r;
                            }
                            if (r && r == routes) {
                                e.setAttribute("data-expression", JSON.stringify(value));
                                options.expressionCallback && options.expressionCallback(e, value);
                                break;
                            }
                        }
                    } else {
                        elems[0].setAttribute("data-expression", JSON.stringify(value));
                        options.expressionCallback && options.expressionCallback(elems[0], value);
                    }
                }

            if (obj != "null" && obj != null) {

                if (/array/i.test(util._typeof(obj))) {
                    //数组
                    var arrayItem = wrapper.querySelector("[data-routes='" + routes + "']");
                    if (wrapper.getAttribute("data-arrayitem")) arrayItem = wrapper;
                    if (arrayItem) {
                        this.array2Config(arrayItem, obj, options);
                    }
                } else {
                    for (var p in obj) {
                        var v = obj[p];
                        if (/string|number/i.test(util._typeof(v))) {
                            //对象
                            //元素是基本类型
                            var elems = Array.prototype.slice.call(wrapper.querySelectorAll("[data-key=" + p + "]"));
                            if (elems.length > 1) {
                                for (var i = 0, len = elems.length; i < len; i++) {
                                    var e = elems[i];
                                    var routesNode = e;
                                    var r = routesNode.getAttribute("data-routes") || "";
                                    while (!r && routesNode != wrapper) {
                                        routesNode = routesNode.parentNode;
                                        r = (routesNode.getAttribute("data-routes") || "") + r;
                                    }
                                    if (r == routes) {
                                        setValue(e, v);
                                        break;
                                    }
                                }
                            } else if (elems.length) {
                                //只有一个元素
                                setValue(elems[0], v);
                            } else {
                                //没找到
                            }
                        } else {
                            //元素是对象或者数组
                            if (/object|array/i.test(util._typeof(v))) {
                                var elems = Array.prototype.slice.call(wrapper.querySelectorAll("[data-key='" + p + "'][data-type=raw]"));
                                if (elems.length) {
                                    setExpression(elems, v, routes + p + ".");
                                } else {
                                    elems = wrapper.querySelector("[data-routes='" + routes + p + "." + "'][data-hashitem]");
                                    if (elems) {
                                        //hashitem
                                        this.hash2Config(elems, v, options);
                                    }
                                    this.object2Config(wrapper, v, routes + p + ".", options);
                                }
                            }
                        }
                    }
                }
            }
        }
    };
})();