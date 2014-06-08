READ# Magic Form #

## 功能
- 把json对象转换成form
- 把form转换成json对象
- 表单验证
- 服务器端数据同步


## 数据结构和生成表单的格式说明
magicform支持多种类型的数据，根据不同类型来生成不同的html结构，满足多种需求，json数据分为两种
	
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
- **mf:1**

	这个字段一直为1，标明这个object是mf的配置结构。
	
- **control**

	配置控件的类型，取值可以是text,password,checkbox,radio,date,week等值。
	
- **order**

	配置控件显示的顺序，数字越小越靠前，如果不写，将默认排在有order控件的后面。
	
- **options** 
- **name**
- **attaproc**
- **detaproc**
- **hash**
- **fornew**
- **key**
- **validation**

		
## 表单验证
## 数据和配置分离
