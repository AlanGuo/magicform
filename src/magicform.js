/**
 * 魔法表单，让表单从此轻松
 * @project
 * @name MagicFrom
 * @subtitle v1.0
 * @download http://115.29.195.88:92/release/magicform-0.0.1.js
 * @support ie,chrome,firefox
 * @howto
 * 首先假设已经在html页面中拥有一个form表单，假设结构如下：
    
        <!--预置一些基础样式，如果需要使用自定义样式，可无需引入此样式-->
        <link rel="stylesheet" type="text/css" href="../assets/styles/default.css">
        
        ......
        
        <script type="text/javascript" src="./release/magicform-1.0.js"></script>
        
        ......
        
        <form class="mf">
            <fieldset>
                <div class="legend" data-i18n="form.legend">Form</div>
                <div class="content" id="form"></div>
            </fieldset>
        </form>

    现有如下json数据，希望自动生成表单并填充到上面的form中

        //假设现在有一个json数据如下
        var datajson = {
            email:"",
            username:"",
            password:"",
            message:""
        };
        
        //重点来啦，完全自动化生成
        var form = document.getElementById("form");
        magicform.generate(form,datajson,{
            status:"editable"
        });
            

    ## 高级设置

    在生成表单的时候，你可以进行简单的设置，就像这样

        magicform.generate(form,datajson,{
            //状态，editable/disabled
            status:"editable",
            //是否有提交,取消等按钮
            hasbuttons:false
        });
        
    常用的配置字段有

    - **status**

        表单的状态，取值可以是 "disabled"——只读的,"editable"——允许变更的
        
    - **functions**

        表单的功能，目前只支持
        
        ['editable']

    - **style**

        给表单设置自定义样式
        
        例如：
        
            style:'color:red'

    - **classname**

        给表单添加class
        
        例如：
        
            classname:'w70p'
        
        
    - **tmplprocess**

        自定义模板
        
        例如：
        
            tmplprocess:function(tmpl){
                return "<div class=\"col-sm-9\">" +tmpl+ "</div>";
            },

    - **attr**

        自定义属性
        
        例如：
        
            attr:'checked=checked'
            
    - **label**

        配置label的样式
        
        例如：
        
            label:{
                classname:'',
                style:'',
                attr:'',
                tmplprocess:function(tmpl){},
            }

    - **itemwrapper**

        配置表单项包裹元素的样式
        
        例如：
        
            itemwrapper:{
                classname:'',
                style:'',
                attr:'',
                tmplprocess:function(tmpl){},
            }

    - **formpanel**

        配置表单面板的样式   
        
        例如：
        
            formpanel:{
                classname:'',
                style:'',
                attr:'',
                tmplprocess:function(tmpl){},
            }




## 数据结构和生成表单的格式

    magicform根据数据结构来生成表单，支持多种数据类型，并且根据不同类型来选择不同的展示结构，满足多种情形，那么magicform对用来生成表单的数据有什么要求呢？
    我们先来看看下面的两种结构：
        
        {a:1}
        {a:{mf:1,value:1}}
        
    第一种结构只有json的key值和value值，这种结构将直接生成input标签并且类型是string，最通用的形式，但如果你想要对表单控件样式加以控制，就需要用到第二种结构，第二种结构json的key值a对应的是一个object，这个object中有个mf:1，表示这是个包含mf配置数据的结构，magicform将会读取配置信息对form控件的样式进行控制，object中的value字段才是真正的值，关于配置字段的详解参见第三节。下面是一个最简单的数据类型和他对应生成的html结构的对照表。


    - ** json **

            {a:1,b:2}

    - ** html **
        
            <!--省略部分class-->
            
            <div><lable>a</lable><input/></div>
            <div><lable>b</lable><input/></div>
            
            <!--value是input string，转换成json时会有特殊处理-->
            <!--this表示元素自己-->
            <div><lable>a</lable><input data-mf-exp="this.value*2"/></div>
            
            
## 配置字段说明

    magicform允许对生成的表单元素进行丰富的定制，比如

        name:{mf:1,control:"text",validation:"required maxlength=10 minlength=4",label:"姓名",value:""}

    这段配置定制的name字段的控件类型，以及label标签的名称，还包括验证相关的规则。

    下面详细说明每个配置字段的含义 

    - **mf:1**

        这个字段一直为1，标明这个object是mf的配置结构。
        
    - **control**

        配置控件的类型，取值可以是text,password,checkbox,radio,date,week等值。
        
    - **value**

        字段的值

    - **order**

        配置控件显示的顺序，数字越小越靠前，如果不写，将默认排在有order控件的后面。
        
    - **options** 

        用于select的选项，数组形式
        
        例如：
        
            options:[{label:"初中",checked:"checked"},{label:"高中"}]

    - **name**

        用于checkbox或radio中的配对
            

    - **hash**

        这个为1表示这是一个hash类型的数据

    - **fornew**

        这个字段为1表示这个配置是用来新增数据时用的

    - **key**

        用于hash类型数据，填写一个对象用来配置hash类型中key的属性，配置的格式和本节介绍的配置字段相同

    - **validation**
        
        数据验证的规则，比如：
        
            password:{mf:1,control:"password",validation:"minlength=6 required"}
            email:{mf:1,control:"text",validation:"required pattern='.*@.*'"}
            
    - **attr**

        自定义属性

    - **label**

        对标签进行控制
        
    - **label.title** 

        标签文本
        
    - **label.attr** 

        标签的自定义属性

    - **placeholder**

        占位符 
        
    - **attaproc**

        这个字段传入一个function，可以自由定义如何把值显示出来
        
        例如：
        
            function(atta,prop,src,index){
            }

    - **detaproc**

        这个字段传入一个function，可以自由定义如何把值取出来
        
        例如：
        
            function(prop,src){
            }

    - **isobject**

        这个字段为1表示该字段为一个对象
            
        
    - **onclick**

        当字段为一个对象时，onclick可以传入一个function决定当点击对象详情icon时的行为
        
        例如：
        
            function(json){
            }


## 数据和配置的分离
        
    有的时候我们需要将单纯的数据存储在后台，然后显示的时候再赋予更多样式和效果，以及一些校验规则，这个时候我们就需要用到数据和配置分离了。magicform支持数据和配置分离，这样结构更加清晰，方便你移植以前的老表单。

    例如：

            //纯数据
            var pureJson = {
                email:"",
                username:"",
                password:"",
                message:""
            };

            //attach数据
            var jsonObj = {
                email:{mf:1,control:"text",validation:"required pattern='.*@.*'"},
                password:{mf:1,control:"password",validation:"minlength=6 required"},
                username:{mf:1,validation:"required maxlength=10 minlength=4"},
                message:{mf:1,placeholder:"leave a short message",control:"textarea"}
            };
            
            magicform.generate(form,magicform.attach(pureJson,jsonObj),{
                status:"editable",
                hasbuttons:true
            });
            
    magicform.attach把数据pureJson和jsonObj和在一起返回一个新的结构用来生成表单，默认的合并方法仅仅是将数据的值，给到配置字段的value，如果你的机构有些复杂，也可以自定义一个attaproc

    例如：

        //hashattachProc
        //atta是属性的配置，prop是属性名，src是源数据，index是数组的下标（如果是数组的话)
        var hashAttachProc = function(atta,prop,src,index){
            atta.value = src[prop][index].value;
            atta.key.value = src[prop][index].key;

            return atta;
        };
        
        //配置摘要
        {
        ...
        返回码:[
            {mf:1,hash:1,fornew:1,control:"text",key:{mf:1,control:"text"}},
            {mf:1,hash:1,control:"text",key:{mf:1,control:"text"},attaproc:hashAttachProc,detaproc:hashDetachProc},
            {mf:1,hash:1,control:"text",key:{mf:1,control:"text"},attaproc:hashAttachProc,detaproc:hashDetachProc}
        ]
        ...
        }
        
        
        magicform.generate(form,magicform.attach(pureJson,jsonObj));
        
    同样，你也可以在表单填写完成的时候把数据分离成单纯的数据文件用来持久化，这个时候你需要用到方法

    magicform.detach，同时你也可以自定义一个detaproc来自定义分离的逻辑

    例如：
        
        //hashdetachProc
        var hashDetachProc = function(prop,src){
            var obj = {};
            obj.value = src.value;
            obj.key = src.key.value;

            return obj;
        }
        
        //配置摘要
        {
        ... 
        返回码:[
            {mf:1,hash:1,fornew:1,control:"text",key:{mf:1,control:"text"}},
            {mf:1,hash:1,control:"text",key:{mf:1,control:"text"},attaproc:hashAttachProc,detaproc:hashDetachProc},
            {mf:1,hash:1,control:"text",key:{mf:1,control:"text"},attaproc:hashAttachProc,detaproc:hashDetachProc}
        ]
        ...
        }
            
        //jsonObj是字段配置对象    
        JSON.stringify(magicform.detach(magicform.html2json(form),jsonObj));
 *
 *
 *
 * @author alan
 * 2013/12/12
 */

"use strict";


(function(exports) {
    var util = (function() {
        return {
            extend: function(objA, objB) {
                for (var p in objB) {
                    objA[p] = objB[p];
                }
                return objA;
            },
            getElementsByClassName: function(className, tag, root) {
                if (!root) {root = document;}
                if (!tag) {tag = "*";}
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
                return (/\[object\s(\w*)\]/i).exec(Object.prototype.toString.call(data))[1];
            },
            createElementsWithTemplate: function(template) {
                var div = document.createElement("div");
                div.innerHTML = template;
                return div.children;
            }
        };
    })();


    /* exported magicform */
    /**
     * 魔法表单主类
     * @class magicform
     */
    var mf = (function() {
        return {
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
             * @for magicform
             * @support: ie:>=10,chrome:all,firefox:all
             */
            _setOptions: function(options) {
                options = options || {};

                //默认按钮
                if (!options.buttons) {
                    options.buttons = magicform.DEFAUTLBUTTONS.concat();
                }
                options.status = options.status || 'disabled';
                options.functions = options.functions || ['editable'];
                options.style = options.style || '';
                options.classname = options.classname || 'w70p';
                options.attr = options.attr || '';

                //label
                options.label = options.label || {};
                options.label.style = options.label.style || '';
                options.label.classname = options.label.classname || 'w20p align-right mr10p';
                options.label.attr = options.label.attr || '';

                //itemwrapper
                options.itemwrapper = options.itemwrapper || {};
                options.itemwrapper.style = options.itemwrapper.style || '';
                options.itemwrapper.classname = options.itemwrapper.classname || '';
                options.itemwrapper.attr = options.itemwrapper.attr || '';
                //不支持template

                //formpanel
                options.formpanel = options.formpanel || {};
                options.formpanel.style = options.formpanel.style || '';
                options.formpanel.classname = options.formpanel.classname || 'form-panel mt30';
                options.formpanel.attr = options.formpanel.attr || '';

                //array
                options.array = options.array || {};

                options.attr = options.attr || {};

                return options;
            },


            /**
             * @private
             * @method _predefineValue
             */
            _predefineValue:function(data,p,options){
                var Object_proto_toString = Object.prototype.toString;
                var i = 0;

                data.label = data.label || {};
                data.label.title = data.label.title || p;
                data.label.classname = data.label.classname || options.label.classname || 'w20p align-right mr10p';
                data.label.style = data.label.style || options.label.style ||'';

                data.classname = data.classname || options.classname || 'w70p';
                data.style = data.style || options.style || '';
                data.placeholder = data.placeholder || options.placeholder || '';

                //处理options
                if(data.options){
                    var firstgroup = false;
                    for(i=0;i<data.options.length;i++){
                        //找出firstgroup
                        if(!firstgroup && data.options[i].group){
                            data.options[i].firstgroup = true;
                            firstgroup = true;
                        }
                    }
                }

                if(/array/i.test(Object_proto_toString.call(data))){
                    for(i=0;i<data.length;i++){
                        if(!/object/i.test(typeof data[i])){
                            data[i] = {value:data[i],mf:1};
                            this._predefineValue(data[i],p,options);
                        }
                    }
                }

                return data;
            },

            /**
             * @private
             * @method _translateLabel
             */
            _translateLabel:function(valin,hasCloseTag,p,options){
                var generatedHtml = '';
                var labelTemplate = '';
                labelTemplate = template('formLabelTemplate')({data:valin,p:p});

                if(options.label.tmplprocess){
                    labelTemplate = options.label.tmplprocess(labelTemplate);
                }

                generatedHtml = template('formControlTemplate')({data:valin,
                    hasCloseTag:hasCloseTag,
                    options:options,
                    labelTemplate:labelTemplate});

                return generatedHtml;
            },

            /**
             * @private
             * @method _translateLabel
             */
            _translateControl:function(valin,hasCloseTag,p,options,additionnal){
                var Object_proto_toString = Object.prototype.toString;
                var generatedHtml = '';
                var controlTemplate = '';

                var controlTypeMap = {
                    'text':'Input',
                    'checkbox':'Checkbox',
                    'radio':'Radio',
                    'select':'Select',
                    'textarea':'Textarea'
                };
                var type = controlTypeMap[valin.control] || 'Input';
                //判断字段类型
                 //hash值
                if(valin.hash){
                    controlTemplate = template('formControl'+type+'Template')({data:valin,p:p,options:options,listitem:'listitem'});
                    if(options.tmplprocess){
                        controlTemplate = options.tmplprocess(controlTemplate);
                    }

                    generatedHtml = template('formControlHashTemplate')({
                        keyControlTemplate:this._translateControl(valin.key,hasCloseTag,p,options,'listitem'),
                        controlTemplate: controlTemplate
                    });
                }
                else if(/array/i.test(Object_proto_toString.call(valin))){

                    var editable = (options.status === 'editable' || options.status === 'new');
                    var notNew = options.status !== 'new';
                    var newTemplate = encodeURIComponent(JSON.stringify(valin.filter(function(item){if(item.fornew) {return item;}})[0]));

                    var arrayHtml = '';
                    //过滤掉新增的模板
                    var filteredValin = valin.filter(function(item){
                        if(!item.fornew){
                            return item;
                        }
                    });
                    for(var j=filteredValin.length-1;j>=0;j--){
                        arrayHtml += template('formArrayControlItemTemplate')({
                            controlTemplate:this._translateControl(filteredValin[j],hasCloseTag,p,options,'listitem'),
                            editable:editable
                        });
                    }
                    generatedHtml = template('formArrayTemplate')({
                        data:valin,
                        editable : editable,
                        notNew : notNew,
                        newTemplate : newTemplate,
                        arrayTemplate : arrayHtml,
                        p:p
                    });
                }
                else if('[object Object]' === Object_proto_toString.call(valin) && !valin.mf || valin && valin.isobject){
                    //key-object
                    generatedHtml =  template('formControlObjectTemplate')({
                        p:p,
                        stringifyVal:encodeURIComponent(JSON.stringify(valin))
                    });
                }
                else{
                    //key-value
                    controlTemplate = template('formControl'+type+'Template')({data:valin,p:p,options:options,listitem:additionnal});
                    if(options.tmplprocess){
                        controlTemplate = options.tmplprocess(controlTemplate);
                    }
                    generatedHtml = controlTemplate;
                }

                return generatedHtml;
            },

            /**
             * @private
             * @method _translateJson
             */
            _translateJson:function(json, orders, options){
                
                var html = '',
                    panelTemplate = '',
                    i = 0;

                for(var op in orders){
                    var p = orders[op].p,
                        val = json[p];
                    var hasCloseTag = false;

                    //inline的元素没有closeTag
                    //非inline且不是第一个的元素有closeTag
                    if(i===0){
                        hasCloseTag = false;
                    }
                    else if(!val.inline){
                        hasCloseTag = true;
                    }
                    //控件类型
                    html += this._translateLabel(val,hasCloseTag,p,options);
                    html += this._translateControl(val,hasCloseTag,p,options);
                    i++;
                }

                panelTemplate = template('formPanelTemplate')({options:options});
                if(options.formpanel.tmplprocess){
                    panelTemplate = options.formpanel.tmplprocess(panelTemplate);
                }
                //form panel
                if(options.hasbuttons && (options.status === "editable" || options.status === "new")){
                    html += panelTemplate;
                }

                return html;
            },


            /**
             * json2html -> init
             * @method generate
             * @for magicform
             * @param json {Object} 数据对象
             * @param options {Object}
             * @param options.status {String} 表单状态 "disabled","editable","new"
             * @param options.functions {Array} 表单功能 ["editable"]
             * @param options.buttons {Array} 按钮功能 [{name:"submit","title":"提交表单"},{name:"cancel",title:""},{name:"reset"}]
             * @support: ie:>=10,chrome:all,firefox:all
             */

            generate: function(form, json, options) {
                form.innerHTML = this.json2html(json, options);
                this.init(form, json, options);
                return this;
            },

            /**
             * json -> html json对象转换成html表单，提供配置，可以配置样式和状态
             * @method json2html
             * @for magicform
             * @param json {Object} 数据对象
             * @param options {Object} 配置
             * @param options.status {String} 表单状态 "disabled","editable","new"
             * @param options.functions {Array} 表单功能 ["editable"]
             * @param options.buttons {Array} 按钮功能 [{name:"submit","title":"提交表单"},{name:"cancel",title:""},{name:"reset"}]
             * @support: ie:>=10,chrome:all,firefox:all
             */
            json2html: function(json, options) {
                var orders = [];
                var p = null;
                options = this._setOptions(options);
                //排序
                for (p in json) {
                    //预处理一些属性
                    if(typeof json[p] !== "object"){
                        json[p] = {value:json[p],mf:1};
                    }
                    //初始化数值
                    this._predefineValue(json[p],p,options);

                    orders.push({
                        p: p,
                        order: json[p].order
                    });
                }
                //按照order排序
                orders = orders.sort(function(a, b) {
                    if (a.order === null || a.order === undefined || a.order === "") {a.order = 100;}
                    if (b.order === null || b.order === undefined || b.order === "") {b.order = 100;}
                    if (a.order > b.order) {return true;}
                    if (a.order < b.order) {return false;}
                });

                var html = this._translateJson(json,orders,options);
                
                return html;
            },

            /**
             * 把显示属性，附加上去，此方法可以保持数据对象的纯净
             * @method attach
             * @for magicform
             * @param json {Object} 数据
             * @param attr {Object} 属性
             * @param attr.mf {Number} 这个字段一直为1，标明这个object是mf的配置结构
             * @param attr.control {String} 配置控件的类型，取值可以是text,password,checkbox,radio,date,week等值
             * @param attr.value {Object} 字段的值
             * @param attr.order {Number} 字段显示顺序
             * @param attr.options {Array} 用于select的选项，数组形式，例如：options:[{label:{title:"初中"},checked:"checked"},{label:{title:"高中"}}]
             * @param attr.options.group {Boolean} 创建一个新的optgroup
             * @param attr.options.text {String} optgroup 或者是 option显示的值
             * @param attr.options.val {String} option的值
             * @param attr.name {String} 用于checkbox或radio中的配对
             * @param attr.hash {Number} 这个为1表示这是一个hash类型的数据
             * @param attr.fornew {Number} 这个字段为1表示这个配置是用来新增数据时用的
             * @param attr.key {Object} 用于hash类型数据，填写一个对象用来配置hash类型中key的属性，配置的格式和本节介绍的配置字段相同
             * @param attr.validation {String} 数据验证的规则，比如：password:{mf:1,control:"password",validation:"minlength=6 required"}，email:{mf:1,control:"text",validation:"required pattern='.*@.*'"}
             * @param attr.attr {String} 自定义属性
             * @param attr.label {Object} 定义标签的属性
             *  @param attr.label.title {String} 标签标题
             *  @param attr.label.attr {String} 标签自定义属性
             * @param attr.placeholder {String} 占位符
             * @param attr.attaproc {Function} 自定义属性显示方法
             *  @param attr.attaproc.atta {String} 附加对象
             *  @param attr.attaproc.prop {String} 属性
             *  @param attr.attaproc.src {String} 源数据
             *  @param attr.attaproc.index {Number} 索引
             * @param attr.detaproc 自定义数据提取方法
             *  @param attr.detaproc.prop {String} 属性
             *  @param attr.detaproc.src {String} 源数据
             * @param attr.isobject {Number} 这个字段为1表示该字段为一个对象
             * @param attr.onclick {Function} 当字段为一个对象时，onclick可以传入一个function决定当点击对象详情icon时的行为例如：function(json){}
             * @support: ie:>=10,chrome:all,firefox:all
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
                    if (attr[p] !== undefined) {
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
                            //过程函数
                            defproc(attr[p], p);
                        }
                    }
                }
                return jsonCopy;
            },


            /**
             * 把显示属性，附加上去，此方法可以保持数据对象的纯净
             * @method attach
             * @for magicform
             * @param json {Object} 数据
             * @param attr {Object} 属性
             * @param attr.mf {Number} 这个字段一直为1，标明这个object是mf的配置结构
             * @param attr.control {String} 配置控件的类型，取值可以是text,password,checkbox,radio,date,week等值
             * @param attr.value {Object} 字段的值
             * @param attr.order {Number} 字段显示顺序
             * @param attr.options {Array} 用于select的选项，数组形式，例如：options:[{label:{title:"初中"},checked:"checked"},{label:{title:"高中"}}]
             * @param attr.options.group {Boolean} 创建一个新的optgroup
             * @param attr.options.text {String} optgroup 或者是 option显示的值
             * @param attr.options.val {String} option的值
             * @param attr.name {String} 用于checkbox或radio中的配对
             * @param attr.hash {Number} 这个为1表示这是一个hash类型的数据
             * @param attr.fornew {Number} 这个字段为1表示这个配置是用来新增数据时用的
             * @param attr.key {Object} 用于hash类型数据，填写一个对象用来配置hash类型中key的属性，配置的格式和本节介绍的配置字段相同
             * @param attr.validation {String} 数据验证的规则，比如：password:{mf:1,control:"password",validation:"minlength=6 required"}，email:{mf:1,control:"text",validation:"required pattern='.*@.*'"}
             * @param attr.attr {String} 自定义属性
             * @param attr.label {Object} 定义标签的属性
             *  @param attr.label.title {String} 标签标题
             *  @param attr.label.attr {String} 标签自定义属性
             * @param attr.placeholder {String} 占位符
             * @param attr.attaproc {Function} 自定义属性显示方法
             *  @param attr.attaproc.atta {String} 附加对象
             *  @param attr.attaproc.prop {String} 属性
             *  @param attr.attaproc.src {String} 源数据
             *  @param attr.attaproc.index {Number} 索引
             * @param attr.detaproc 自定义数据提取方法
             *  @param attr.detaproc.prop {String} 属性
             *  @param attr.detaproc.src {String} 源数据
             * @param attr.isobject {Number} 这个字段为1表示该字段为一个对象
             * @param attr.onclick {Function} 当字段为一个对象时，onclick可以传入一个function决定当点击对象详情icon时的行为例如：function(json){}
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
             * @for magicform
             * @private
             * @support: ie:>=10,chrome:all,firefox:all
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
                        if (type === "checkbox" || type === "radio") {
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
                                if (con2 && con2.getAttribute("data-flag") === "true") {
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
                    } else if (/\bselect\b/i.test(control.tagName)) {
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
                                    text: optionControls[j].innerHTML
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
                    } else if (/\ba\b/i.test(control.tagName)) {
                        var value = control.getAttribute("data-mf-val");
                        if (value) {
                            value = decodeURIComponent(value);
                            json = JSON.parse(value);
                        }
                    } else if (/\binput\b/i.test(control.tagName) || (/\btextarea\b/i).test(control.tagName)) {
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
             * html -> json 从html表单中提取数据对象
             * @method html2json
             * @for magicform
             * @param form {HTMLElement} 表单元素
             * @param options {Object} 设置选项
             * @support: ie:>=10,chrome:all,firefox:all
             */
            html2json: function(form, options) {
                options = options || {};
                var items = form.querySelectorAll(".form-group");
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
             * @for magicform
             * @param wrapper {HTMLElement} 表单元素，一般是from，但也可以是div等其他元素
             * @param json {Object} 数据对象
             * @param options {Object} 设置
             * @support: ie:>=10,chrome:all,firefox:all
             */
            init: function(wrapper, json, options) {
                options = this._setOptions(options);
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
                        if (remove) {remove.style.visibility = "visible";}
                    });
                    con.addEventListener("mouseout", function() {
                        var remove = this.querySelector(".form-item-remove");
                        if (remove) {remove.style.visibility = "hidden";}
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
                                var newtemplate = anchor.getAttribute("data-newtemplate") === "undefined" ? null : anchor.getAttribute("data-newtemplate");
                                var p = anchor.getAttribute("data-p");
                                if (newtemplate) {
                                    var elems = util.createElementsWithTemplate(
                                        template('formArrayControlItemTemplate')({
                                            editable:true,
                                            controlTemplate:self._translateControl(JSON.parse(decodeURIComponent(newtemplate)),
                                            false,
                                            p,
                                            options,
                                            'listitem')
                                        }));

                                    //插入元素
                                    var br = ul.querySelector("br");
                                    var last = null;
                                    var focusElem = null;
                                    while (elems.length) {
                                        last = elems[0];
                                        if (!focusElem) {focusElem = last.querySelector("input");}
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
                    var key = details[i].getAttribute("for").replace(/formitem-/, "");
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

    exports.magicform = mf;
})(window);