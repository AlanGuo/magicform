# Magic From

-----

## 如何使用

首先假设已经在html页面中拥有一个form表单，假设结构如下：
	
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


	** json **

		{a:1,b:2}

	** html **
	
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