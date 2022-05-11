// 参考： https://juejin.cn/post/7017588385615200270

/* JSON.stringify() 9大特性

	特性一
		1、undefined、任意的函数以及symbol值，出现在非数组对象的属性值中时在序列化过程中会被忽略
		2、undefined、任意的函数以及symbol值出现在数组中时会被转换成 null。
		3、undefined、任意的函数以及symbol值被单独转换时，会返回 undefined
	特性二
		布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
	特性三
		所有以symbol为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。
	特性四
		NaN 和 Infinity 格式的数值及 null 都会被当做 null。
	特性五
		转换值如果有 toJSON() 方法，该方法定义什么值将被序列化。
	特性六
		Date 日期调用了 toJSON() 将其转换为了 string 字符串（同Date.toISOString()），因此会被当做字符串处理。
	特性七
		对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。
	特性八
		其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性
	特性九
		当尝试去转换 BigInt 类型的值会抛出错误
*/

function jsonstringify(value, replacer, space){
	var refs = [];

	function fn(value, replacer, space){
		// 特性1-3 undefined、任意的函数以及symbol值被单独转换时，会返回 undefined
		if(['undefined', 'function', 'symbol'].includes(typeof value)){
			return undefined;
		}

		// 特性9 bigint抛异常
		if(typeof value === 'bigint'){
			throw new TypeError('不支持bigint');
		}

		// 特性4 NaN、Infinity、null会被当做null处理
		if([NaN, Infinity, null].includes(value)){
			return 'null';
		}

		// 特性2 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
		// 处理包装类
		const rawType = Object.prototype.toString.call(value).slice(8, -1);
		if(rawType == 'Number' || rawType == 'Boolean'){
			return String(value)
		}
		// 特性2 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
		if(rawType == 'String'){
			return `"${value}"`;
		}

		if(typeof value != 'object'){
			return value;
		}

		// 特性5 对象如果有toJSON()方法，调用此方法
		// 特性6 Date日期对象调用toJSON()
		if(typeof value.toJSON == 'function'){
			return fn(value.toJSON());
		}

		if(Array.isArray(value)){
			return `[${value.map(v=>{
				// 特性1-2 undefined、任意的函数以及symbol值出现在数组中时会被转换成 null
				if(['undefined', 'function', 'symbol'].includes(typeof v)){
					return 'null';
				}

				return fn(v);
			}).join(',')}]`;
		}

		let kv = [];

		// 特性8 只能序列化可枚举的属性
		var kvs = Object.entries(value);
		for(let [k, v] of kvs){
			const type = typeof v;

			// 特性1-1 undefined、任意的函数以及symbol值，出现在非数组对象的属性值中时在序列化过程中会被忽略
			// 特性3 所有以symbol为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。
			if(['symbol', 'function', 'undefined'].includes(type)){
				v = undefined;
			}else if([NaN, Infinity, null].includes(v)){ // 特性4 NaN 和 Infinity 格式的数值及 null 都会被当做 null。
				v = 'null';
			}else if(type == 'string'){
				v = `"${v}"`;
			}else if(type == 'object'){
				// 特性7 循环引用检查，形成无限循环抛异常
				if(refs.includes(v)){
					throw new Error('无线引用了');
				}

				refs.push(v);

				v = fn(v);

				refs.splice(refs.indexOf(v), 1);
			}

			v !== undefined && kv.push(`"${k}":${v}`);
		}

		return `{${kv.join(',')}}`;
	}

	return fn(value, replacer, space);
}

var o = {
	a: 1,
	b: 'b',
	c: true,
	d: null,
	e: undefined,
	f: Symbol('f'),
	g: NaN,
	h: function(){},
	i: {
		'i-a': 3,
		'i-b': '字符串',
	},
	j: Infinity,
	// toJSON(){
	// 	return 'hahaha';
	// },
	k: [
		1,
		2,
		3,
		"d",
		false,
		null,
		undefined,
		function(){},
		Symbol(),
		{
			a:1,
			b:'2',
		},
	],
};
console.log(jsonstringify(o));
console.log(JSON.stringify(o));

// 1. 测试一下基本输出
console.log(jsonstringify(undefined)) // undefined
console.log(jsonstringify(() => { })) // undefined
console.log(jsonstringify(Symbol('前端胖头鱼'))) // undefined
console.log(jsonstringify((NaN))) // null
console.log(jsonstringify((Infinity))) // null
console.log(jsonstringify((null))) // null
console.log(jsonstringify({
	name: '前端胖头鱼',
	toJSON() {
		return {
			name: '前端胖头鱼2',
			sex: 'boy'
		}
	}
}))
// {"name":"前端胖头鱼2","sex":"boy"}

// 2. 和原生的JSON.stringify转换进行比较
console.log(jsonstringify(null) === JSON.stringify(null));
// true
console.log(jsonstringify(undefined) === JSON.stringify(undefined));
// true
console.log(jsonstringify(false) === JSON.stringify(false));
// true
console.log(jsonstringify(NaN) === JSON.stringify(NaN));
// true
console.log(jsonstringify(Infinity) === JSON.stringify(Infinity));
// true
let str = "前端胖头鱼";
console.log(jsonstringify(str) === JSON.stringify(str));
// true
let reg = new RegExp("\w");
console.log(jsonstringify(reg) === JSON.stringify(reg));
// true
let date = new Date();
console.log(jsonstringify(date) === JSON.stringify(date));
// true
let sym = Symbol('前端胖头鱼');
console.log(jsonstringify(sym) === JSON.stringify(sym));
// true
let array = [1, 2, 3];
console.log(jsonstringify(array) === JSON.stringify(array));
// true
let obj = {
	name: '前端胖头鱼',
	age: 18,
	attr: ['coding', 123],
	date: new Date(),
	uni: Symbol(2),
	sayHi: function () {
		console.log("hello world")
	},
	info: {
		age: 16,
		intro: {
			money: undefined,
			job: null
		}
	},
	pakingObj: {
		boolean: new Boolean(false),
		string: new String('前端胖头鱼'),
		number: new Number(1),
	}
}

console.log(jsonstringify(obj) === JSON.stringify(obj))
// true
console.log((jsonstringify(obj)))
// {"name":"前端胖头鱼","age":18,"attr":["coding",123],"date":"2021-10-06T14:59:58.306Z","info":{"age":16,"intro":{"job":null}},"pakingObj":{"boolean":false,"string":"前端胖头鱼","number":1}}
console.log(JSON.stringify(obj))
// {"name":"前端胖头鱼","age":18,"attr":["coding",123],"date":"2021-10-06T14:59:58.306Z","info":{"age":16,"intro":{"job":null}},"pakingObj":{"boolean":false,"string":"前端胖头鱼","number":1}}

// 3. 测试可遍历对象
let enumerableObj = {}

Object.defineProperties(enumerableObj, {
	name: {
		value: '前端胖头鱼',
		enumerable: true
	},
	sex: {
		value: 'boy',
		enumerable: false
	},
})

console.log(jsonstringify(enumerableObj))
// {"name":"前端胖头鱼"}

// 4. 测试循环引用和Bigint

let obj1 = { a: 'aa' }
let obj2 = { name: '前端胖头鱼', a: obj1, b: obj1 }
obj2.obj = obj2

// console.log(jsonstringify(obj2))
// TypeError: Converting circular structure to JSON
console.log(jsonstringify(BigInt(1)))
// TypeError: Do not know how to serialize a BigInt
