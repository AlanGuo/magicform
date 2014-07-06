/**
 * 适用于轻web应用开发的基础框架，简化一些常用操作，简单易懂，不增加学习成本
 * @author alan
 * 2014/05/09
 */
"use strict";
/* exported speedframe */
 var speedframe = {
 	/**
	 * 初始化
  	 */
 	init:function(){
 	}
 };
/**
 * hash 侦听
 * @author alan
 * @2014/05/09
 */

/*global speedframe:false */
"use strict";
(function(exports) {
    var hash = {
        _handler: null,
        onchange: function(handler) {
            var self = this;
            self._handler = handler;
            window.onhashchange = function(evt) {
                var newURL = evt.newURL;

                var hash = /#(.*)$/i.exec(newURL);
                hash = hash && hash[1];

                if (handler && handler[hash]) {
                    handler[hash]({
                        hash: hash
                    });
                }
            }
        },
        goto: function(hash) {
            var self = this;
            var location = window.location;
            if (location.hash !== hash)
                window.location.href = hash;
            else {
                if (hash !== "") {
                    hash = /#(.*)$/i.exec(hash);
                    hash = hash && hash[1];
                }

                if (self._handler && self._handler[hash]) {
                    self._handler[hash]({
                        hash: hash
                    });
                }
            }
        }
    }
    exports.hash = hash;
})(speedframe);
 /**
  * 辅助模块
  * @author alan
  * @2014/05/09
  */

 /*global speedframe:false */
 "use strict";
 (function(exports) {

     var RegExps = {

         escHTML: {
             re_amp: /&/g,
             re_lt: /</g,
             re_gt: />/g,
             re_apos: /\x27/g,
             re_quot: /\x22/g
         },

         restXHTML: {
             re_amp: /&amp;/g,
             re_lt: /&lt;/g,
             re_gt: /&gt;/g,
             re_apos: /&(?:apos|#0?39);/g,
             re_quot: /&quot;/g
         }
     };
     exports.util = {
         /**
          * 对象合并
          * @method extend
          *
          */
         _typeof: function(obj) {
             return /\[object\s(\w*)\]/i.exec(Object.prototype.toString.call(obj))[1];
         },
         /**
          * 对象合并
          * @method extend
          *
          */
         extend: function(objA, objB) {
             for (var p in objB) {
                 objA[p] = objB[p];
             }
             return objA;
         },
         /**
          * 模板解析
          * @method tmpl
          *
          */
         tmpl: function() {
             var cache = {};

             function _getTmplStr(rawStr, mixinTmpl) {
                 if (mixinTmpl) {
                     for (var p in mixinTmpl) {
                         var r = new RegExp("<%#" + p + "%>", "g");
                         rawStr = rawStr.replace(r, mixinTmpl[p]);
                     }
                 }
                 return rawStr;
             }
             return function tmpl(str, data, opt) {
                 /*jslint evil: true */
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
         }(),

         /**
          * create elem with Template
          * @method createWithTemplate
          */
         createWithTemplate: function(tmpl) {
             var div = document.createElement("div");
             div.innerHTML = tmpl;

             return div.children[0];
         },

         /**
          * create elems with Template
          * @method createAllWithTemplate
          */
         createAllWithTemplate: function(tmpl) {
             var div = document.createElement("div");
             div.innerHTML = tmpl;

             return div.children;
         },

         /**
          * html特殊字符转义
          * @method restHTML
          */
         restHTML: function(str) {
             var t = RegExps.restXHTML;
             return this.listReplace((str + ""), {
                 /*
                  * '&' must be
                  * escape last
                  */
                 '<': t.re_lt,
                 '>': t.re_gt,
                 '\x27': t.re_apos,
                 '\x22': t.re_quot,
                 '&': t.re_amp
             });
         },
         /**
          * html特殊字符转义
          * @method escHTML
          */
         escHTML: function(str) {
             var t = RegExps.escHTML;
             return this.listReplace((str + ""), {
                 /*
                  * '&' must be
                  * escape first
                  */
                 '&amp;': t.re_amp,
                 '&lt;': t.re_lt,
                 '&gt;': t.re_gt,
                 '&#039;': t.re_apos,
                 '&quot;': t.re_quot
             });
         },
         commonReplace: function(s, p, r) {
             return s.replace(p, r);
         },
         listReplace: function(s, l) {
             if (this.isHashMap(l)) {
                 for (var i in l) {
                     s = this.commonReplace(s, l[i], i);
                 }
                 return s;
             } else {
                 return s + '';
             }
         },
         isHashMap: function(o) {
             return this._typeof(o).toLowerCase() == "object";
         }
     };
 })(speedframe);
/**
 * 事件处理模块
 * @author alan
 * @2014/05/09
 */

/*global speedframe:false */

"use strict";
(function(exports) {
    exports.event = {
        /**
         * 事件处理路由
         */
        _handleEvents: function(element, target, eventType, handlers, evt) {
            var evtName = target.getAttribute("data-" + eventType + "-event");

            while (!evtName) {
                target = target.parentNode;
                if (target && target != element) {
                    if (target.getAttribute)
                        evtName = target.getAttribute("data-" + eventType + "-event");
                    else break;
                } else {
                    evtName = "";
                    break;
                }
            }

            var handler = handlers[evtName];
            if (handler) {
                handler.call(target, evt);
            }
        },
        /**
         * 注册事件，冒泡来响应事件
         */
        register: function(element, eventType, handlers) {
            var self = this;

            if (!element) {
                throw new Error("element needed");
            }
            if (!eventType) {
                throw new Error("eventType needed");
            } else {
                var bind = function(elem) {
                    if (elem.addEventListener) {
                        elem.addEventListener(eventType, function(evt) {
                            var target = evt.target;
                            self._handleEvents(elem, target, eventType, handlers, evt);
                        }, false);
                    } else if (elem.attachEvent) {
                        elem.attachEvent("on" + eventType, function() {
                            var evt = window.event;
                            var target = evt.srcElement;
                            self._handleEvents(elem, target, eventType, handlers, evt);
                        });
                    }
                }
                if (/array|nodelist/i.test(Object.prototype.toString.call(element)) && element.length) {
                    for (var i = 0; i < element.length; i++) {
                        bind(element[i]);
                    }
                } else {
                    bind(element);
                }
            }
        }
    };
})(speedframe);
 /**
  * 模拟domReady
  * @author alan
  * @2014/05/23
  */

 /*global speedframe:false */
 "use strict";

 (function(exports) {
     var document = window.document,
         domReadyCallback = null,
         readyBound = false,
         isReady = false;

     var ready = function(callback) {

         if (/function/i.test(typeof callback)) {
             domReadyCallback = callback;
         }

         bindReady();
     };

     var domContentLoaded = function() {
         if (!isReady) {
             if (document.addEventListener) {
                 document.removeEventListener("DOMContentLoaded", domContentLoaded, false);
             } else {
                 // we're here because readyState !== "loading" in oldIE
                 // which is good enough for us to call the dom ready!
                 document.detachEvent("onreadystatechange", domContentLoaded);
             }
             domReady();

             isReady = true;
         }
     };


     var domReady = function() {
         if (!document.body) {
             return setTimeout(domReady, 1);
         }
         // If there are functions bound, to execute
         if (domReadyCallback) domReadyCallback();
         // Execute all of them
     };

     var bindReady = function() {
         var toplevel = false;

         if (readyBound) {
             return;
         }
         readyBound = true;

         // Mozilla, Opera and webkit nightlies currently support this event
         if (document.addEventListener) {
             // Use the handy event callback
             document.addEventListener("DOMContentLoaded", domContentLoaded, false);
             // A fallback to window.onload, that will always work
             window.addEventListener("load", domContentLoaded, false);
             // If IE event model is used
         } else if (document.attachEvent) {
             // ensure firing before onload,
             // maybe late but safe also for iframes
             // ie 8适用
             document.attachEvent("onreadystatechange", domContentLoaded);
             // A fallback to window.onload, that will always work
             window.attachEvent("onload", domContentLoaded);


             // If IE and not a frame
             // continually check to see if the document is ready
             try {
                 toplevel = window.frameElement === null;
             } catch (e) {}
             if (document.documentElement.doScroll && toplevel) {
                 doScrollCheck();
             }
         }
     };

     var doScrollCheck = function() {
         if (isReady) return;
         try {
             // If IE is used, use the trick by Diego Perini
             // http://javascript.nwbox.com/IEContentLoaded/
             document.documentElement.doScroll("left");
         } catch (error) {
             setTimeout(doScrollCheck, 1);
             return;
         }
         // and execute any waiting functions
         domReady();
     };

     exports.DOMReady = ready;
 })(speedframe);
/**
 * xhr module
 * @author alan
 * @2014/05/26
 */

/*global speedframe:false */
"use strict";
(function(exports) {
    var xhr = {
        _xhr: null,
        create: function() {
            this._xhr = new window.XMLHttpRequest();
            return this;
        },
        get: function(url, data, options) {
            options = options || {};
            this.create();

            var dataString = "";
            if (data) {
                for (var p in data) {
                    dataString += encodeURIComponent(p) + "=" + encodeURIComponent(data[p]) + "&";
                }
            }
            this._xhr.open("GET", url + "?" + dataString, options.async == null ? true : false);
            this._xhr.send(null);

            return this;
        },
        post: function(url, data, options) {
            options = options || {};

            this.create();
            if (!data) return this;

            this._xhr.open("POST", url, options.async == null ? true : false);
            var dataString = "";

            if (data) {
                for (var p in data) {
                    dataString += encodeURIComponent(p) + "=" + encodeURIComponent(data[p]) + "&";
                }
            }
            this._xhr.send(dataString);

            return this;
        },
        request: function() {

        },
        on: function(event, handler) {
            var self = this;
            if (this._xhr) {
                this._xhr.addEventListener(event, function(evt) {
                    if (handler) {
                        handler.call(self, evt);
                    }
                });
            }
            return this;
        }
    }
    exports.xhr = xhr;
})(speedframe);
/**
 * ajax module, cross domain
 * @author alan
 * @2014/05/26
 */

/*global speedframe:false */
"use strict";
(function(exports) {
    // 与业务无关的组件库
    function noop() {};

    function extend(child, parent) {
        var prop,
            type,
            asArray = "[object Array]",
            asObject = "[object Object]";

        for (prop in parent) {
            if (parent.hasOwnProperty(prop)) {
                type = Object.prototype.toString.call(parent[prop]);

                if ((type === asArray || type === asObject) && (prop != null)) {
                    child[prop] = (type === asArray) ? [] : {};
                    arguments.callee(child[prop], parent[prop]);
                } else {
                    child[prop] = parent[prop];
                }
            }
        }

        return child;
    };

    function parseUrl(url) {
        var link = document.createElement("a");
        link.href = url;

        return link;
    };

    // ie < 10
    function isOldIE() {
        var comment = '<!--[if lte IE 9]><span></span><![endif]-->',
            div = document.createElement("div");

        div.innerHTML = comment;

        return !!div.getElementsByTagName("span").length;
    };

    // 根据"a.b.c"这样的字符串生成命名空间
    function namespace(name, obj) {
        name = String(name);
        obj = obj || window;

        var parts = name.split("."),
            part = parts[0],
            current = obj[part] = obj[part] || {};

        for (var i = 1, len = parts.length; i < len; i++) {
            part = parts[i];
            current = current[part] = current[part] || {};
        }

        return current;
    };

    function setCallback(win, cbName, callback) {
        if (cbName.indexOf(".") === -1) {
            win[cbName] = callback;
            return;
        }

        // 处理后台返回 a.b.callback的情况
        var namesArray = cbName.split("."),
            cb = namesArray.pop(),
            obj = namespace(namesArray.join("."), win);

        obj[cb] = callback;
    };

    // net组件配置
    var netConfig = {
        post: {
            charset: "utf-8",
            timeout: 5000,
            callbackName: "_Callback",
            maxReusedIframes: 3
        },

        get: {
            charset: "utf-8",
            timeout: 5000,
            callbackName: "_Callback",
            encodeMethod: "encodeURIComponent"
        },

        asyncLoad: {
            charset: "utf-8",
            timeout: 3000
        }
    };


    var ajax = {};
    /**
     * iframe模拟post请求
     *
     * @param  {String}     [url]                cgi的url
     * @param  {Object}     [dataObj]            请求参数对象
     * @param  {Function}   [onload]             请求返回后的回调函数
     * @param  {Function}   [onerror]            请求超时后的回调函数
     * @param  {Object}     [options]            请求的配置对象（以下为默认配置）
     * {
     * 		charset: "utf-8",           // 表单编码
     *		timeout: 5000,              // 超时时间(单位ms)
     *		callbackName: "_Callback",  // 后台cgi返回的callback名称
     *      maxReusedIframes: 3         // 最大复用的iframe数量，超出的会自动销毁
     * }
     *
     * 用法：
     * 	net.post("http://www.example.com/cgi/testcgi", {
     * 		cmd: "post",
     *		cn: "中文"
     * 	}, function(json) {
     * 		log(json);
     * 		log(arguments);
     * 	}, function() {
     *		log("post网络繁忙！");
     * 	}, {
     * 		charset: "utf-8",
     * 		timeout: 3000,
     * 		callbackName: "_Callback",
     *      maxReusedIframes: 3
     *	});
     *
     * @author singnozhu
     * @lastModify 2013年5月22日
     *
     */
    ajax.post = (function() {
        var instanceName = "iframe_" + (+new Date());

        var execCounterCommand = (function() {
            var list = {};

            var counterCommands = {
                hook: function() {
                    return getIdleCounter();
                },

                release: function(idx) {
                    delete list[idx];
                }
            };

            // 获取目前未使用的counter
            function getIdleCounter() {
                var i = 1;

                while (true) {
                    if (!list[i]) {
                        list[i] = true;

                        return i;
                    }

                    i++;
                }
            }

            return function(command) {
                var result = counterCommands[command].apply(counterCommands, [].slice.call(arguments, 1));

                return result;
            };
        })();

        var supportEventListener = 'addEventListener' in document;

        var iframeLoad = function(ifr, callback) {
            var load = function() {
                if (supportEventListener) {
                    ifr.removeEventListener('load', load, false);
                } else {
                    ifr.detachEvent('onload', load);
                }

                callback();
            };

            if (supportEventListener) {
                ifr.addEventListener('load', load, false);
            } else {
                ifr.attachEvent('onload', load);
            }
        };

        function PostSender(counter) {
            this.iframeElement = PostSender.getIframe(counter);
        }

        PostSender.getIframe = function(counter) {
            var doc = document,
                id = instanceName + "_" + counter,
                iframe = doc.getElementById(id);

            // 已经存在iframe，则复用之前的
            if (iframe) {
                return iframe;
            }

            //ie6 ~ 8 ，无法直接修改name属性
            try {
                iframe = doc.createElement('<iframe name="' + id + '" id="' + id + '" ></iframe>');
            } catch (ex) {
                iframe = doc.createElement("iframe");
                iframe.id = iframe.name = id;
            }

            iframe.src = 'about:blank';
            iframe.style.cssText = "display:none;position:absolute;left:-9999px;";

            doc.body.insertBefore(iframe, doc.body.firstChild);

            return iframe;
        };

        PostSender.prototype = {
            register: function(name, fn) {
                setCallback(this.iframeElement, name, fn);
            },

            unregister: function(name) {
                setCallback(this.iframeElement, name, undefined);
            },

            setDomain: function() {
                // 解决ie下设置了document.domain之后，同源策略禁止访问iframe的问题
                this.iframeElement.src = "javascript:void((function(){document.open();document.domain='" + document.domain + "';document.close();})())";
            },

            destroy: function() {
                this.iframeElement.parentNode.removeChild(this.iframeElement);
                this.iframeElement = null;
            },

            submit: function(actionUrl, submitData) {
                var iframeDoc = this.iframeElement.contentWindow.document,
                    iframeBody = iframeDoc.body,
                    form = createForm();

                function createForm() {
                    var form = iframeDoc.createElement("form");

                    form.method = "post";
                    form.action = actionUrl;

                    return form;
                }

                function createInputs() {
                    var fragment = iframeDoc.createDocumentFragment(),
                        input;

                    for (var name in submitData) {
                        if (submitData.hasOwnProperty(name)) {
                            input = iframeDoc.createElement("input");
                            input.name = name;
                            input.value = submitData[name];
                            fragment.appendChild(input);
                        }
                    }

                    return fragment;
                }

                // 清空内容
                iframeBody.innerHTML = "";

                iframeBody.appendChild(form);
                form.appendChild(createInputs());
                form.submit();
            },

            setCharset: function(charset) {
                this.iframeElement.contentWindow.document.charset = charset;
            },

            // onload后设置iframe的location为“about:blank”
            // 解决ie下一进入页面立即发送post请求提示表单重复提交的问题
            setBlank: function() {
                this.iframeElement.src = 'about:blank';
            }
        };

        return function(url, dataObj, onload, onerror, options) {
            // 初始化参数
            url = String(url);
            dataObj = dataObj || {};
            onload = onload || noop;
            onerror = onerror || noop;
            options = extend(netConfig.post, options || {});

            var counter = execCounterCommand("hook"),
                postSender = new PostSender(counter),
                timer,
                callbackName = options.callbackName;

            // 释放counter并删除不需要的iframe
            function release(force) {
                execCounterCommand("release", counter);

                // 超过限定的实例数量，则不保留
                if (counter > options.maxReusedIframes || force) {
                    postSender.destroy();
                }
            }

            postSender.register(callbackName, function() {
                // 清除超时计时器
                clearTimeout(timer);

                // 回调成功后，删除设置在iframe上的callbackName，防止复用前一个函数
                postSender.unregister(callbackName);

                // // 解决ie下一进入页面立即发送post请求提示表单重复提交的问题
                // postSender.setBlank();

                release();

                // 最后调用onload，因为父页面是iframe的情况下，使用者可能会移除掉iframe，导致ie9报错
                onload.apply(null, arguments);
            });

            // 设置超时
            timer = setTimeout(function() {
                // callback置为空函数，防止超时后请求返回再次回调
                postSender.register(callbackName, noop);

                // 超时的情况强制删除iframe，不再复用
                release(true);

                onerror();
            }, options.timeout);

            var submit = function() {
                postSender.setCharset(options.charset);
                postSender.submit(url, dataObj);
            };

            var ifr = postSender.iframeElement;

            postSender.setBlank();
            iframeLoad(ifr, function() {
                postSender.setDomain();

                try {
                    submit();
                } catch (ex) {
                    // ie6、ie7 will go this logic
                    iframeLoad(ifr, submit);
                }
            });
        };
    })();

    // fragment仅供兼容老版本ie jsonp请求时使用
    // 内部统一script请求函数
    function loadScript(url, onload, onerror, options, fragment) {
        onload = onload || noop;
        onerror = onerror || noop;
        options = extend({
            charset: "utf-8",
            timeout: 5000
        }, options || {});

        var script = document.createElement("script"),
            container = fragment || document.getElementsByTagName("head")[0] || document.documentElement,

            // 模拟超时
            timer;

        function collectGarbage() {
            script.onload = null;
            script.onreadystatechange = null;
            script.onerror = null;
            clearTimeout(timer);

            // 回收 script 标签
            container.removeChild(script);

            // 防止ie下内存泄漏
            script = null;
        }

        function loadJsSucc() {
            collectGarbage();
            onload();
        }

        function loadJsError() {
            collectGarbage();
            onerror();
        }

        // 优先采用onload方式，以在ie9及以上浏览器获得更好的效果
        if ("onload" in script) {
            script.onload = loadJsSucc;
        } else if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    loadJsSucc();
                }
            }
        }

        // 不支持onerror的浏览器
        timer = setTimeout(loadJsError, options.timeout);

        // 支持onerror的浏览器
        script.onerror = loadJsError;

        script.charset = options.charset;
        script.src = url;
        container.appendChild(script);
    }

    /**
     * 加载script文件
     *
     * @param  {String}       [url]                js 文件地址
     * @param  {Function}     [onload]             js 加载成功后回调
     * @param  {String}       [charset]            js 文件编码
     *
     * 用法：
     * 	net.loadScript("http://imgcache.qq.com/ac/qqshow/v5/version_1/avatar.js", function() {
     *		log("abc");
     *  });
     *
     * @author singnozhu
     * @lastModify 2013年5月22日
     *
     */
    ajax.loadScript = function(url, onload, charset) {
        charset = charset || "utf-8";
        loadScript(url, onload, null, {
            charset: charset
        });
    };

    /**
     * jsonp 请求
     *
     * @param  {String}     [url]                cgi的url
     * @param  {Object}     [dataObj]            请求参数对象
     * @param  {Function}   [onload]             请求返回后的回调函数
     * @param  {Function}   [onerror]            请求超时后的回调函数
     * @param  {Object}     [options]            请求的配置对象（以下为默认配置）
     * {
     * 		charset: "utf-8",                        // 表单编码
     *		timeout: 5000,                          //  超时时间(单位ms)
     *		callbackName: "_Callback",              //  后台cgi返回的callback名称
     *      encodeMethod: "encodeURIComponent"     //   数据编码函数
     * }
     *
     * 用法：
     *  net.get("http://gm.show.qq.com/cgi-bin/qs_gm_zhaopian_saveshow", {
     *		omode: 2,
     *		cmd: "中文"
     *	}, function(json) {
     *		log("get here");
     *		dir(json);
     *	}, function() {
     *		log("get 超时了 ");
     *	}, {
     *		charset: "gb2312",
     *		encodeMethod: "escape",
     *		callbackName: "net._Callback",
     *		timeout:1000
     *	});
     *
     * @author singnozhu
     * @lastModify 2013年5月22日
     *
     */
    ajax.get = (function() {
        var responseArgs = [];

        function storeArgs() {
            responseArgs = arguments;
        }

        function makeUrl(url, encodeMethod, dataObj) {
            var dataArray = [],
                dataStr,
                encode = window[encodeMethod],
                link,
                search;

            for (var prop in dataObj) {
                if (dataObj.hasOwnProperty(prop)) {
                    dataArray.push(encode(prop) + "=" + encode(dataObj[prop]));
                }
            }

            dataStr = dataArray.join("&");

            if (!dataStr) {
                return url;
            }

            link = parseUrl(url);
            search = link.search.slice(1);

            // 只保留基本url
            url = url.replace(/\?.*$/, "");

            if (!search.length) {
                return url + "?" + dataStr;
            }

            return url + "?" + search + "&" + dataStr;
        }

        return function(url, dataObj, onload, onerror, options) {
            onload = onload || noop;
            onerror = onerror || noop;
            options = extend(netConfig.get, options || {});

            var cb = options.callbackName,
                fragment,
                succCallback,
                errorCallback;

            // 兼容ie10以下浏览器回调乱序的bug
            if (isOldIE()) {
                fragment = document.createDocumentFragment();
                setCallback(fragment, cb, function() {
                    onload.apply(null, arguments);
                });
                succCallback = noop;
                errorCallback = function() {
                    // 清除ie10以下浏览器的回调
                    if (fragment) {
                        setCallback(fragment, cb, noop);
                        fragment = null;
                    }

                    onerror();
                };
            } else {
                setCallback(window, cb, storeArgs);
                succCallback = function() {
                    onload.apply(null, responseArgs);
                    responseArgs.length = 0;
                };
                errorCallback = onerror;
            }

            loadScript(makeUrl(url, options.encodeMethod, dataObj), succCallback, errorCallback, options, fragment);
        };
    })();

    /**
     * 异步加载js并保证执行顺序
     *
     * 支持函数根据参数来重载
     * @param {String | Object}
     * 当为 String 时，表示为js的url地址
     * 当为 Object 时，格式为：{
     * 		url: "xxx",
     * 		charset: "xxx",
     * 		callback: fn
     * }
     * 如果最后一个参数为 function ，则表示为所有js加载完后的回调函数
     *
     * 用法1：
     * 所有js加载完后执行函数
     * 	net.asyncLoad("http://imgcache.qq.com/ac/qqshow/v5/version_1/avatar.js", "http://imgcache.qq.com/ac/qqshow/v5/version_1/frame.js", function() {
     *		log("all request finish");
     *	});
     *
     * 用法2:
     * 保证所有callback的执行顺序，并在所有js加载完后执行函数
     * 	net.asyncLoad({
     * 		url: "http://imgcache.qq.com/ac/qqshow/v5/version_1/avatar.js",
     * 		charset: "utf-8",
     * 		callback: function() {
     * 			log("request 1 finish");
     * 		}
     * 	}, "http://imgcache.qq.com/ac/qqshow/v5/version_1/frame.js", {
     * 		url: "http://imgcache.qq.com/ac/qqshow/v5/version_1/avatar2.js",
     * 	 	charset: "gb2312",
     * 	 	callback: function() {
     * 	 		log("request 3 finish");
     * 	 	}
     * 	}, function() {
     *		log("all request finish");
     *	});
     *
     * 用法3:
     * 加载完后什么也不做
     * net.asyncLoad("a.js", "b.js", "c.js");
     *
     * @author singnozhu
     * @lastModify 2013年5月22日
     *
     */
    ajax.asyncLoad = function() {
        var last = arguments.length - 1,
            jsList,
            lastCallback,
            orderList = [],
            processor,
            arg,
            length,
            conf = netConfig.asyncLoad;

        if (Object.prototype.toString.call(arguments[last]) === "[object Function]") {
            jsList = [].slice.call(arguments, 0, last);
            lastCallback = arguments[last];
        } else {
            jsList = [].slice.call(arguments);
            lastCallback = noop;
        }

        length = jsList.length;

        for (var i = 0; i < length; i++) {
            processor = {};
            arg = jsList[i];
            if (Object.prototype.toString.call(arg) === "[object String]") {
                processor.url = arg;
            } else {
                processor.url = arg.url;
            }

            processor.charset = arg.charset || conf.charset;
            processor.timeout = arg.timeout || conf.timeout;
            processor.callback = arg.callback || noop;
            processor.loaded = false;
            processor.done = false;

            orderList.push(processor);
        }

        for (var i = 0; i < length; i++) {
            (function(index) {
                var processor = orderList[index],
                    cur;

                function onload() {
                    processor.loaded = true;
                    for (var i = 0; i < length; i++) {
                        cur = orderList[i];

                        if (!cur.done) {
                            if (!cur.loaded) {
                                break;
                            }

                            cur.callback();
                            cur.done = true;

                            // 所有js都执行完毕
                            if (i === length - 1) {
                                lastCallback();
                            }
                        }
                    }
                }

                loadScript(processor.url, onload, onload, {
                    charset: processor.charset,
                    timeout: processor.timeout
                });
            })(i);
        }
    };

    /*
		 * 统一配置net组件参数
		 *
		 * 用法：
			  changeConfig({
				name: "post",
				config: {
					charset: "utf-8",
		    		timeout: 5000,
		    		callbackName: "_Callback",
		            maxReusedIframes: 3
				}
			  }, {
				name: "get",
				config: {
					charset: "utf-8",
		    		timeout: 5000,
		    		callbackName: "_Callback",
		    		encodeMethod: "encodeURIComponent"
				}
			  }, {
				name: "asyncLoad",
				config: {
					charset: "utf-8",
	    			timeout: 3000
				}
			  })
		 */
    ajax.changeConfig = function() {
        var arg,
            userConfig,
            currentConfig;

        for (var i = 0, len = arguments.length; i < len; i++) {
            arg = arguments[i];
            if (!netConfig.hasOwnProperty(arg.name)) {
                continue;
            }

            userConfig = arg.config;
            currentConfig = netConfig[arg.name];

            for (var prop in userConfig) {
                if (userConfig.hasOwnProperty(prop) && currentConfig.hasOwnProperty(prop)) {
                    currentConfig[prop] = userConfig[prop];
                }
            }
        }
    };

    /*
     * 查看net组件配置
     */
    ajax.configStatus = function() {
        return extend({}, netConfig);
    };

    exports.ajax = ajax;
})(speedframe);