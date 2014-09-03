'use strict';
// Source: src/magicform-handlebars.js
/**
 * 魔法表单，让表单从此轻松
 * @project
 * @name MagicFrom
 * @subtitle v0.0.1
 * @download http://115.29.195.88:92/release/magicform-0.0.1.js
 * @support ie,chrome,firefox
 * @howto
 * 首先假设已经在html页面中拥有一个form表单，假设结构如下：
        
        <!--预置一些基础样式，如果需要使用自定义样式，可无需引入此样式-->
        <link rel="stylesheet" type="text/css" href="../assets/styles/default.css">
        
        ......
        
        <script type="text/javascript" src="./release/magicform-0.0.1.js"></script>
        
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

    - **style**

        给表单设置自定义样式
        
        例如：
        
            style:{
                //标签
                label:"width:100px",
                //控件
                control:"float:right",
                //标签控件的包裹元素
                itemwrapper:"",
                //按钮区域
                formpanel:""
            }

    - **classname**

        给表单添加class
        
        例如：
        
            classname:{
            
                //label是文本标签的样式名，control是控件的样式，magicform内置了许多classname来组合出各种风格的表单
                //当然你可以自己重写这些样式
                //标签
                label:"w20p align-right mr10p",
                //控件
                control:"w70p",
                //标签控件的包裹元素
                itemwrapper:"",
                //按钮区域
                formpanel:""
            }
        
        
    - **template**

        自定义模板
        
        例如：
        
            template:{
            
                //标签
                label:"<label>",
                //控件
                control:"<div class=\"col-sm-9\">{{{control}}}</div>",
                //标签控件的包裹元素
                itemwrapper:"",
                //暂时不支持按钮区域自定义
                formpanel:""
            }

    - **attr**

        自定义属性
        
        例如：
        
            attr:{
            
                //标签
                label:"",
                //控件
                control:"",
                //标签控件的包裹元素
                itemwrapper:"",
                //按钮区域
                formpanel:""
            }



## 数据结构和生成表单的格式

    magicform根据数据结构来生成表单，支持多种数据类型，并且根据不同类型来选择不同的展示结构，满足多种情形，那么magicform对用来生成表单的数据有什么要求呢？
    我们先来看看下面的两种结构：
        
        {a:1}
        {a:{mf:1,value:1}}
        
    第一种结构只有json的key值和value值，这种结构将直接生成input标签并且类型是string，最通用的形式，但如果你想要对表单控件样式加以控制，就需要用到第二种结构，第二种结构json的key值a对应的是一个object，这个object中有个mf:1，表示这是个包含mf配置数据的结构，magicform将会读取配置信息对form控件的样式进行控制，object中的value字段才是真正的值，关于配置字段的详解参见第三节。下面是一个最简单的数据类型和他对应生成的html结构的对照表。


        ** json **

            {a:1,b:2}

        ** html **
        
            <!--省略部分class-->
            
            <p><lable>a</lable><input/></p>
            <p><lable>b</lable><input/></p>
            
            <!--value是input string，转换成json时会有特殊处理-->
            <!--this表示元素自己-->
            <p><lable>a</lable><input data-mf-exp="this.value*2"/></p>
            
            
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
                options.status = options.status || "disabled";
                options.functions = options.functions || ["editable"];
                options.style = options.style || {
                    label: "",
                    control: "",
                    itemwrapper: ""
                };
                options.style.label = options.style.label || "";
                options.style.control = options.style.control || "";
                options.style.itemwrapper = options.style.itemwrapper || "";


                options.classname = options.classname || {
                    label: "w20p align-right mr10p",
                    control: "w70p",
                    itemwrapper: "",
                    formpanel: "formpanel mt30"
                };

                options.classname.label = options.classname.label || "w20p align-right mr10p";
                options.classname.control = options.classname.control || "";
                options.classname.itemwrapper = options.classname.itemwrapper || "";
                options.classname.formpanel = options.classname.formpanel || "formpanel mt30";

                options.template = options.template || {
                    label: "{{{label}}}",
                    control: "{{{control}}}",
                    formpanel: "{{{formpanel}}}",
                    /*暂不支持itemwrapper自定义样式*/
                    itemwrapper: ""
                };
                options.template.label = options.template.label || "{{{label}}}";
                options.template.control = options.template.control || "{{{control}}}";
                options.template.formpanel = options.template.formpanel || "{{{formpanel}}}";

                options.attr = options.attr || {};

                return options;
            },


            /**
             * @private
             * @method _predefineValue
             */
            _predefineValue:function(data,p){
                var Object_proto_toString = Object.prototype.toString;

                if(!/object/i.test(typeof data)){
                    data = {value:data};
                }
                data.label = data.label || {};
                data.label.title = data.label.title || p;
                data.label.classname = data.label.classname || 'w20p align-right mr10p';
                data.label.style = data.label.style || '';

                data.classname = data.classname || 'w70p';
                data.style = data.style || '';
                data.placeholder = data.placeholder || '';

                if(/array/i.test(Object_proto_toString.call(data))){
                    for(var i=0;i<data.length;i++){
                        if(!/object/i.test(typeof data[i])){
                            data[i] = {value:data[i]};

                            data[i].classname = data.classname || 'w70p';
                            data[i].style = data.style || '';
                            data[i].placeholder = data.placeholder || '';
                            data[i].mf = 1;
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
                generatedHtml = magicform.template.formControlTemplate({data:valin,
                    hasCloseTag:hasCloseTag,
                    options:options,
                    labelTemplate:magicform.template.formLabelTemplate({data:valin,p:p})});

                return generatedHtml;
            },

            /**
             * @private
             * @method _translateLabel
             */
            _translateControl:function(valin,hasCloseTag,p,options,additionnal){
                var Object_proto_toString = Object.prototype.toString;
                var generatedHtml = '';
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
                    generatedHtml = magicform.template.formControlHashTemplate({
                        keyControlTemplate:this._translateControl(valin.key,hasCloseTag,p,options,'listitem'),
                        controlTemplate:magicform.template['formControl'+type+'Template']({data:valin,p:p,options:options,listitem:'listitem'})
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
                        arrayHtml += magicform.template.formArrayControlItemTemplate({
                            controlTemplate:this._translateControl(filteredValin[j],hasCloseTag,p,options,'listitem'),
                            editable:editable
                        });
                    }
                    generatedHtml = magicform.template.formArrayTemplate({
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
                    generatedHtml =  magicform.template.formControlObjectTemplate({
                        p:p,
                        stringifyVal:encodeURIComponent(JSON.stringify(valin))
                    });
                }
                else{
                    //key-value
                    generatedHtml =  magicform.template['formControl'+type+'Template']({data:valin,p:p,options:options,listitem:additionnal});
                }

                return generatedHtml;
            },

            /**
             * @private
             * @method _predefineValue
             */
            _translateJson:function(json, orders, options){
                
                var html = '',
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
                //form panel
                if(options.hasbuttons && (options.status === "editable" || options.status === "new")){
                    html += magicform.template.formPanelTemplate({options:options});
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
                        json[p] = {value:json[p]};
                    }
                    //初始化数值
                    this._predefineValue(json[p],p);

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
             * @param attr.options {Array} 用于select的选项，数组形式，例如：options:[{label:"初中",checked:"checked"},{label:"高中"}]
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
             * 把显示属性，剥离出来，此方法可以保持数据对象的纯净
             * @method detach
             * @for magicform
             * @param json {Object} 数据
             * @param attr {Object} 属性
             * @param attr.mf {Number} 这个字段一直为1，标明这个object是mf的配置结构
             * @param attr.control {String} 配置控件的类型，取值可以是text,password,checkbox,radio,date,week等值
             * @param attr.value {Object} 字段的值
             * @param attr.order {Number} 字段显示顺序
             * @param attr.options {Array} 用于select的选项，数组形式，例如：options:[{label:"初中",checked:"checked"},{label:"高中"}]
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
                                        magicform.template.formArrayControlItemTemplate({
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
// Source: lib/handlebars.runtime-v1.3.0.js
/*!

 handlebars v1.3.0

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
/* exported Handlebars */
var Handlebars = (function() {
// handlebars/safe-string.js
var __module3__ = (function() {
var __exports__;
  // Build out our basic SafeString type
  function SafeString(string) {
    this.string = string;
  }

  SafeString.prototype.toString = function() {
    return "" + this.string;
  };

  __exports__ = SafeString;
  return __exports__;
})();

// handlebars/utils.js
var __module2__ = (function(__dependency1__) {
var __exports__ = {};
  /*jshint -W004 */
  var SafeString = __dependency1__;

  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  function escapeChar(chr) {
    return escape[chr] || "&amp;";
  }

  function extend(obj, value) {
    for(var key in value) {
      if(Object.prototype.hasOwnProperty.call(value, key)) {
        obj[key] = value[key];
      }
    }
  }

  __exports__.extend = extend;var toString = Object.prototype.toString;
  __exports__.toString = toString;
  // Sourced from lodash
  // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
  var isFunction = function(value) {
    return typeof value === 'function';
  };
  // fallback for older versions of Chrome and Safari
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  __exports__.isFunction = isFunction;
  var isArray = Array.isArray || function(value) {
    return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
  };
  __exports__.isArray = isArray;

  function escapeExpression(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof SafeString) {
      return string.toString();
    } else if (!string && string !== 0) {
      return "";
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = "" + string;

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  }

  __exports__.escapeExpression = escapeExpression;function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  __exports__.isEmpty = isEmpty;
  return __exports__;
})(__module3__);

// handlebars/exception.js
var __module4__ = (function() {
var __exports__;

  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function Exception(message, node) {
    var line;
    if (node && node.firstLine) {
      line = node.firstLine;

      message += ' - ' + line + ':' + node.firstColumn;
    }

    var tmp = Error.prototype.constructor.call(this, message);

    // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }

    if (line) {
      this.lineNumber = line;
      this.column = node.firstColumn;
    }
  }

  Exception.prototype = new Error();

  __exports__ = Exception;
  return __exports__;
})();

// handlebars/base.js
var __module1__ = (function(__dependency1__, __dependency2__) {
var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;

  var VERSION = "1.3.0";
  __exports__.VERSION = VERSION;var COMPILER_REVISION = 4;
  __exports__.COMPILER_REVISION = COMPILER_REVISION;
  var REVISION_CHANGES = {
    1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
    2: '== 1.0.0-rc.3',
    3: '== 1.0.0-rc.4',
    4: '>= 1.0.0'
  };
  __exports__.REVISION_CHANGES = REVISION_CHANGES;
  var isArray = Utils.isArray,
      isFunction = Utils.isFunction,
      toString = Utils.toString,
      objectType = '[object Object]';

  function HandlebarsEnvironment(helpers, partials) {
    this.helpers = helpers || {};
    this.partials = partials || {};

    registerDefaultHelpers(this);
  }

  __exports__.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
    constructor: HandlebarsEnvironment,

    logger: logger,
    log: log,

    registerHelper: function(name, fn, inverse) {
      if (toString.call(name) === objectType) {
        if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
        Utils.extend(this.helpers, name);
      } else {
        if (inverse) { fn.not = inverse; }
        this.helpers[name] = fn;
      }
    },

    registerPartial: function(name, str) {
      if (toString.call(name) === objectType) {
        Utils.extend(this.partials,  name);
      } else {
        this.partials[name] = str;
      }
    }
  };

  function registerDefaultHelpers(instance) {
    instance.registerHelper('helperMissing', function(arg) {
      if(arguments.length === 2) {
        return undefined;
      } else {
        throw new Exception("Missing helper: '" + arg + "'");
      }
    });

    instance.registerHelper('blockHelperMissing', function(context, options) {
      var inverse = options.inverse || function() {}, fn = options.fn;

      if (isFunction(context)) { context = context.call(this); }

      if(context === true) {
        return fn(this);
      } else if(context === false || context == null) {
        return inverse(this);
      } else if (isArray(context)) {
        if(context.length > 0) {
          return instance.helpers.each(context, options);
        } else {
          return inverse(this);
        }
      } else {
        return fn(context);
      }
    });

    instance.registerHelper('each', function(context, options) {
      var fn = options.fn, inverse = options.inverse;
      var i = 0, ret = "", data;

      if (isFunction(context)) { context = context.call(this); }

      if (options.data) {
        data = createFrame(options.data);
      }

      if(context && typeof context === 'object') {
        if (isArray(context)) {
          for(var j = context.length; i<j; i++) {
            if (data) {
              data.index = i;
              data.first = (i === 0);
              data.last  = (i === (context.length-1));
            }
            ret = ret + fn(context[i], { data: data });
          }
        } else {
          for(var key in context) {
            if(context.hasOwnProperty(key)) {
              if(data) { 
                data.key = key; 
                data.index = i;
                data.first = (i === 0);
              }
              ret = ret + fn(context[key], {data: data});
              i++;
            }
          }
        }
      }

      if(i === 0){
        ret = inverse(this);
      }

      return ret;
    });

    instance.registerHelper('if', function(conditional, options) {
      if (isFunction(conditional)) { conditional = conditional.call(this); }

      // Default behavior is to render the positive path if the value is truthy and not empty.
      // The `includeZero` option may be set to treat the condtional as purely not empty based on the
      // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
      if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });

    instance.registerHelper('unless', function(conditional, options) {
      return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
    });

    instance.registerHelper('with', function(context, options) {
      if (isFunction(context)) { context = context.call(this); }

      if (!Utils.isEmpty(context)) return options.fn(context);
    });

    instance.registerHelper('log', function(context, options) {
      var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
      instance.log(level, context);
    });
  }

  var logger = {
    methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

    // State enum
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 3,

    // can be overridden in the host environment
    log: function(level, obj) {
      if (logger.level <= level) {
        var method = logger.methodMap[level];
        if (typeof console !== 'undefined' && console[method]) {
          console[method].call(console, obj);
        }
      }
    }
  };
  __exports__.logger = logger;
  function log(level, obj) { logger.log(level, obj); }

  __exports__.log = log;var createFrame = function(object) {
    var obj = {};
    Utils.extend(obj, object);
    return obj;
  };
  __exports__.createFrame = createFrame;
  return __exports__;
})(__module2__, __module4__);

// handlebars/runtime.js
var __module5__ = (function(__dependency1__, __dependency2__, __dependency3__) {
var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;
  var COMPILER_REVISION = __dependency3__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency3__.REVISION_CHANGES;

  function checkRevision(compilerInfo) {
    var compilerRevision = compilerInfo && compilerInfo[0] || 1,
        currentRevision = COMPILER_REVISION;

    if (compilerRevision !== currentRevision) {
      if (compilerRevision < currentRevision) {
        var runtimeVersions = REVISION_CHANGES[currentRevision],
            compilerVersions = REVISION_CHANGES[compilerRevision];
        throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
              "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
      } else {
        // Use the embedded version info since the runtime doesn't know about this revision yet
        throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
              "Please update your runtime to a newer version ("+compilerInfo[1]+").");
      }
    }
  }

  __exports__.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

  function template(templateSpec, env) {
    if (!env) {
      throw new Exception("No environment passed to template");
    }

    // Note: Using env.VM references rather than local var references throughout this section to allow
    // for external users to override these as psuedo-supported APIs.
    var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
      var result = env.VM.invokePartial.apply(this, arguments);
      if (result != null) { return result; }

      if (env.compile) {
        var options = { helpers: helpers, partials: partials, data: data };
        partials[name] = env.compile(partial, { data: data !== undefined }, env);
        return partials[name](context, options);
      } else {
        throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
      }
    };

    // Just add water
    var container = {
      escapeExpression: Utils.escapeExpression,
      invokePartial: invokePartialWrapper,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          programWrapper = program(i, fn, data);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = program(i, fn);
        }
        return programWrapper;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common && (param !== common)) {
          ret = {};
          Utils.extend(ret, common);
          Utils.extend(ret, param);
        }
        return ret;
      },
      programWithDepth: env.VM.programWithDepth,
      noop: env.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var namespace = options.partial ? options : env,
          helpers,
          partials;

      if (!options.partial) {
        helpers = options.helpers;
        partials = options.partials;
      }
      var result = templateSpec.call(
            container,
            namespace, context,
            helpers,
            partials,
            options.data);

      if (!options.partial) {
        env.VM.checkRevision(container.compilerInfo);
      }

      return result;
    };
  }

  __exports__.template = template;function programWithDepth(i, fn, data /*, $depth */) {
    var args = Array.prototype.slice.call(arguments, 3);

    var prog = function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
    prog.program = i;
    prog.depth = args.length;
    return prog;
  }

  __exports__.programWithDepth = programWithDepth;function program(i, fn, data) {
    var prog = function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
    prog.program = i;
    prog.depth = 0;
    return prog;
  }

  __exports__.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
    var options = { partial: true, helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    }
  }

  __exports__.invokePartial = invokePartial;function noop() { return ""; }

  __exports__.noop = noop;
  return __exports__;
})(__module2__, __module4__, __module1__);

// handlebars.runtime.js
var __module0__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
var __exports__;
  /*globals Handlebars: true */
  var base = __dependency1__;

  // Each of these augment the Handlebars object. No need to setup here.
  // (This is done to easily share code between commonjs and browse envs)
  var SafeString = __dependency2__;
  var Exception = __dependency3__;
  var Utils = __dependency4__;
  var runtime = __dependency5__;

  // For compatibility and usage outside of module systems, make the Handlebars object a namespace
  var create = function() {
    var hb = new base.HandlebarsEnvironment();

    Utils.extend(hb, base);
    hb.SafeString = SafeString;
    hb.Exception = Exception;
    hb.Utils = Utils;

    hb.VM = runtime;
    hb.template = function(spec) {
      return runtime.template(spec, hb);
    };

    return hb;
  };

  var Handlebars = create();
  Handlebars.create = create;

  __exports__ = Handlebars;
  return __exports__;
})(__module1__, __module3__, __module4__, __module2__, __module5__);

  return __module0__;
})();

// Source: templates/compiled/template-handlebars.js
this["magicform"] = this["magicform"] || {};
this["magicform"]["template"] = this["magicform"]["template"] || {};

this["magicform"]["template"]["formArrayControlItemTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", self=this;

function program1(depth0,data) {
  
  
  return "\n		<a href=\"javascript:;\" class=\"form-icon form-item-remove\" title=\"移除\"><i class=\"mf-iconfont\">&#xf0153;</i></a>\n	";
  }

  buffer += "<br/>\n<span class=\"form-array-li\">\n	";
  if (helper = helpers.controlTemplate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.controlTemplate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.editable), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</span>";
  return buffer;
  });

this["magicform"]["template"]["formArrayTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n		<a href=\"javascript:;\" class=\"form-icon form-item-add\" title=\"新增\" data-p=\"";
  if (helper = helpers.p) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.p); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-newtemplate=\"";
  if (helper = helpers.newTemplate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.newTemplate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"><i class=\"mf-iconfont\">&#xf0154;</i></a>\n	";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n		";
  if (helper = helpers.arrayTemplate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.arrayTemplate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  return buffer;
  }

  buffer += "<span class=\"form-array-ul formitem-control "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.classname)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" type=\"array\">\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.editable), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.notNew), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</span>";
  return buffer;
  });

this["magicform"]["template"]["formControlCheckboxTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n		<input data-listitem=\"";
  if (helper = helpers.listitem) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.listitem); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"formitem-checkbox\" placeholder=\"";
  if (helper = helpers.placeholder) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.placeholder); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  if (helper = helpers.disabled) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.disabled); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.validation) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.validation); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.attr) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.attr); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.flag) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.flag); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " checked=\"";
  if (helper = helpers.checked) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.checked); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"  ";
  if (helper = helpers.status) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.status); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " type=\"checkbox\" id=\"formitem-radio-"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.label)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"><label class=\"formitem-checkbox-label\" for=\"formitem-radio-"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.label)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.label)),stack1 == null || stack1 === false ? stack1 : stack1.attr)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.label)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</label>\n	";
  return buffer;
  }

  buffer += "<span class=\"formitem-control "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.classname)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " formitem-checkbox\" type=\"checkbox\" data-order=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.order)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n	";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.options), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</span>";
  return buffer;
  });

this["magicform"]["template"]["formControlHashTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function";


  buffer += "<span class=\"form-array-li w45p\">";
  if (helper = helpers.keyControlTemplate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.keyControlTemplate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n<span class=\"form-array-li w45p\">";
  if (helper = helpers.controlTemplate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.controlTemplate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>";
  return buffer;
  });

this["magicform"]["template"]["formControlInputConfigTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<input data-listitem=\"";
  if (helper = helpers.listitem) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.listitem); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"formitem-";
  if (helper = helpers.p) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.p); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"formitem-control formitem-input "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.classname)),stack1 == null || stack1 === false ? stack1 : stack1.control)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.style)),stack1 == null || stack1 === false ? stack1 : stack1.control)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.placeholder)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.status)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.validation)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " data-flag=\"";
  if (helper = helpers.flag) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.flag); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.disabled)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.attr)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " data-order=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.order)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" type=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.control)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  return buffer;
  });

this["magicform"]["template"]["formControlInputTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<input data-listitem=\"";
  if (helper = helpers.listitem) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.listitem); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"formitem-";
  if (helper = helpers.p) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.p); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"formitem-control formitem-input "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.classname)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.style)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.status)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " data-flag=\"";
  if (helper = helpers.flag) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.flag); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.placeholder)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.validation)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.attr)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" type=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.control)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  return buffer;
  });

this["magicform"]["template"]["formControlObjectTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<a href=\"javascript:;\" class=\"form-icon form-item-detail formitem-control\" for=\"formitem-";
  if (helper = helpers.p) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.p); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-mf-val=\"";
  if (helper = helpers.stringifyVal) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.stringifyVal); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" title=\"详细设定\"><i class=\"mf-iconfont\">&#xf00e1;</i></a>";
  return buffer;
  });

this["magicform"]["template"]["formControlRadioTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n		<input type=\"radio\" class=\"formitem-radio\"  data-listitem=\"";
  if (helper = helpers.listitem) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.listitem); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"";
  if (helper = helpers.placeholder) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.placeholder); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-flag=\"";
  if (helper = helpers.flag) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.flag); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  if (helper = helpers.validation) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.validation); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.disabled) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.disabled); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.attr) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.attr); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.checked) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.checked); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.status) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.status); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "  data-order=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.order)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" name=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" id=\"formitem-radio-"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.label)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"><label class=\"formitem-radio-label\" for=\"formitem-radio-"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.label)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.label)),stack1 == null || stack1 === false ? stack1 : stack1.attr)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.label)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</label>\n	";
  return buffer;
  }

  buffer += "<span class=\"formitem-control "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.classname)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " formitem-radio\" type=\"radio\" data-order=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.order)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n	";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.options), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</span>";
  return buffer;
  });

this["magicform"]["template"]["formControlSelectTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.optgroup), {hash:{},inverse:self.program(7, program7, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n			";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.flag), {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n				</optgroup>\n				<optgroup label=\"";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"formitem-selectoption formitem-selectoptiongroup\">\n			";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n				<optgroup label=\"";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"formitem-selectoption formitem-selectoptiongroup\">\n			";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			<option value=\"";
  if (helper = helpers.val) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.val); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"formitem-selectoption\" ";
  if (helper = helpers.attr) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.attr); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n		";
  return buffer;
  }

  buffer += "<select data-listitem=\"";
  if (helper = helpers.listitem) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.listitem); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"formitem-";
  if (helper = helpers.p) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.p); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"formitem-control formitem-select "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.classname)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.style)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.validation)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.status)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.disabled)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.attr)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " data-order=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.order)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n	";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.options), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</select>";
  return buffer;
  });

this["magicform"]["template"]["formControlTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "\n	</div>\n";
  }

  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hasCloseTag), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<div class=\"form-group "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.classname)),stack1 == null || stack1 === false ? stack1 : stack1.itemwrapper)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.style)),stack1 == null || stack1 === false ? stack1 : stack1.itemwrapper)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n";
  if (helper = helpers.labelTemplate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.labelTemplate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });

this["magicform"]["template"]["formControlTextareaTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<textarea data-listitem=\"";
  if (helper = helpers.listitem) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.listitem); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"formitem-";
  if (helper = helpers.p) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.p); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"formitem-control formitem-input "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.classname)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.style)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.status)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.placeholder)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-flag=\"";
  if (helper = helpers.flag) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.flag); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.validation)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.disabled)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.attr)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " data-order=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.order)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" type=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.control)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>";
  return buffer;
  });

this["magicform"]["template"]["formLabelHashTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, self=this, functionType="function";

function program1(depth0,data) {
  
  
  return "\n	</div>\n";
  }

  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hasCloseTag), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	<div>\n		";
  if (helper = helpers.labelTemplate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.labelTemplate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  if (helper = helpers.controlTemplate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.controlTemplate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		<span class=\"formitem-ml10\"></span>\n";
  return buffer;
  });

this["magicform"]["template"]["formLabelTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<label class=\"formitem-label "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.label)),stack1 == null || stack1 === false ? stack1 : stack1.classname)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.label)),stack1 == null || stack1 === false ? stack1 : stack1.style)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" for=\"formitem-";
  if (helper = helpers.p) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.p); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-key=\"";
  if (helper = helpers.p) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.p); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.label)),stack1 == null || stack1 === false ? stack1 : stack1.attr)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.data)),stack1 == null || stack1 === false ? stack1 : stack1.label)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</label>";
  return buffer;
  });

this["magicform"]["template"]["formPanelTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.submit), {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			<button class=\"";
  if (helper = helpers.className) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.className); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" title=\"";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n		";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			<button class=\"ml15 ";
  if (helper = helpers.className) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.className); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" title=\"";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n		";
  return buffer;
  }

  buffer += "<div class=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.classname)),stack1 == null || stack1 === false ? stack1 : stack1.formpanel)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n	<label class=\"formitem-label "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.classname)),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.style)),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.attr)),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "></label>\n	";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.buttons), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;
  });