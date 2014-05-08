READ# Magic Form #

## 功能
- 把对象转换成form
- 把form转换成object

## 类型

### key:value 对应经典键值对

1. value是input type=string

	** json **

		{a:1,b:2}

	** html **

		<p><lable>a</lable><input/></p>
		<p><lable>b</lable><input/></p>
		
		<!--value是input string，转换成json时会有特殊处理-->
		<!--this表示元素自己-->
		<p><lable>a</lable><input data-mf-exp="this.value*2"/></p>
		
2. value是input type=radio

	** json **
	
		{a:{mf:1,control:"radio",checked:true, group:"sex"},b:{type:"radio",value:false}}
		
	** html **
		
		<p><lable>a</lable><input type="radio" name="sex" checked/></p>
		<p><lable>b</lable><input type="radio" name="sex"/></p>
		<!--支持data-mf-exp-->
	
3. value是input type=checkbox		
	
	** json **
	
		{a:{mf:1,control:"checkbox",checked:true},b:{type:"checkbox"}}
		
	** html **
		
		<p><lable>a</lable><input type="checkbox" checked/></p>
		<p><lable>b</lable><input type="checkbox"/></p>
		<!--支持data-mf-exp-->

4. value是input type=number，password...和上述情况类似		
5. value是select		
	
	** json **
	
		{a:{mf:1, control:"select",value:1,options:[{val:1,text:1},{val:2,text:2},{val:3,text:3}]}}
		
	** html **
		
		<p>
			<lable>a</lable>
			<select value=1>
				<option value=1>1</option>
				<option value=2>2</option>
				<option value=3>3</option>
			</select>
		</p>
		<!--支持data-mf-exp-->
		

### key:object	对应对象类型

1. json

		{a:{x:1,y:1}}
	
2. html

		<p>
			<lable>a</lable>
			<a data-mf-val="{x:1,y:1}">详细</a>
		</p>


### key:[array]	对应数组类型

1. json

		{a:[1,2,3,4]}
2. html

		<p>
			<lable>a</lable>
			<div><input value=1><a>+</a><a>-</a></div>
		</p>
		<!--input 类型遵循key:value和key:array的规则-->


### hash:value	key和value都是可编辑的

1. json

		{a:{mf:1,value:1001,hash:1,key:{}}
		//使用keycontrol控制a的类型，规则遵循key:object经典键值对规则
		
2. html		

		<p>
			<input/><input/>
		</p>
		
### 格式

1. json

		{a:{mf:1,value:1001},b:{mf:1,value:1002,inline:1}}
	
2. html
		
		<p>
			<label>a</label><input/>
			<label>b</label><input/>
		</p>
