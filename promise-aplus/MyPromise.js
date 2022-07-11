// https://zhuanlan.zhihu.com/p/183801144

/*
	测试Promise是否符合规范

	Promise.defer = Promise.deferred = function(){
		let dfd = {};
		dfd.promise = new Promise((resolve,reject)=>{
			dfd.resolve = resolve;
			dfd.reject = reject;
		})
		return dfd;
	}

	安装脚本
	`npm install -g promises-aplus-tests`

	执行命令
	`promises-aplus-tests promise.js`

	promises-aplus-tests 中共有 872 条测试用例
*/

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise{
	status = PENDING;
	value = null;
	reason = null;
	onFulfilledCallbacks = [];
	onRejectedCallbacks = [];

	constructor(executor){

		const resolve = (value)=>{
			if(value instanceof MyPromise){
				return value.then(resolve, reject);
			}

			if(this.status == PENDING){
				this.status = FULFILLED;
				this.value = value;

				this.onFulfilledCallbacks.forEach(cb=>{
					cb(this.value);
				});
			}
		};

		const reject = (reason)=>{
			if(this.status == PENDING){
				this.status = REJECTED;
				this.reason = reason;

				this.onRejectedCallbacks.forEach(cb=>{
					cb(this.reason);
				});
			}
		};

		try{
			executor(resolve, reject);
		}catch(ex){
			reject(ex);
		}
	}

	then(onFulfilled, onRejected){
		// 解决 onFufilled，onRejected 没有传值的问题
    	// Promise/A+ 2.2.1 / Promise/A+ 2.2.5 / Promise/A+ 2.2.7.3 / Promise/A+ 2.2.7.4
		if(typeof onFulfilled != 'function'){
			onFulfilled = value=>value;
		}

		// 因为错误的值要让后面访问到，所以这里也要抛出个错误，不然会在之后 then 的 resolve 中捕获
		if(typeof onRejected != 'function'){
			onRejected = (reason)=>{ throw reason; };
		}

		// 每次调用 then 都返回一个新的 promise  Promise/A+ 2.2.7
		return new MyPromise((resolve, reject)=>{
			// 如果promise的状态是 pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数执行
			if(this.status == PENDING){
				this.onFulfilledCallbacks.push(()=>{
					setTimeout(()=>{
						try{
							const value = onFulfilled(this.value);
							resolve(value);
						}catch(ex){
							reject(ex);
						}
					});
				});

				this.onRejectedCallbacks.push(()=>{
					setTimeout(()=>{
						try{
							const reason = onRejected(this.reason);
							resolve(reason);
						}catch(ex){
							reject(ex);
						}
					});
				});
			}else if(this.status == FULFILLED){
				setTimeout(()=>{
					try{
						const value = onFulfilled(this.value);
						resolve(value);
					}catch(ex){
						reject(ex);
					}
				});
			}else if(this.status == REJECTED){
				setTimeout(()=>{
					try{
						const reason = onRejected(this.value);
						resolve(reason);
					}catch(ex){
						reject(ex);
					}
				});
			}
		});
	}

	// Promise.prototype.catch 用来捕获 promise 的异常，就相当于一个没有成功的 then 。
	catch(errorCallback){
		return this.then(null, errorCallback);
	}

	// finally 表示不是最终的意思，而是无论如何都会执行的意思。 如果返回一个 promise 会等待这个 promise 也执行完毕。如果返回的是成功的 promise，会采用上一次的结果；如果返回的是失败的 promise，会用这个失败的结果，传到 catch 中。
	finally = function(callback){
		return this.then((value)=>{
			return Promise.resolve(callback()).then(()=>value);
		},(reason)=>{
			return Promise.resolve(callback()).then(()=>{
				throw reason
			});
		})
	}

	// 默认产生一个成功的 promise。
	static resolve(value){
		return new Promise(resolve=>resolve(value));
	}

	// 默认产生一个失败的 promise，Promise.reject 是直接将值变成错误结果。
	static reject(reason){
		return new Promise((resolve, reject)=>{
			reject(reason);
		});
	}

	static all(promiseList){
		return new MyPromise((resolve, reject)=>{
			let count = 0;
			let successResults = [];

			promiseList.forEach((promise, i)=>{
				promise.then((value)=>{
					count++;
					successResults[i] = value;

					if(count==promiseList.length){
						resolve(successResults);
					}
				}, (reason)=>{
					reject(reason);
				})
			});
		});
	}

	static race = function(promiseList){
		return new MyPromise((resolve, reject)=>{
			promiseList.forEach((promise)=>{
				promise.then((value)=>{
					resolve(value);
				}, (reason)=>{
					reject(reason);
				});
			});
		});
	};

}


MyPromise.all([
	MyPromise.resolve(1),
	MyPromise.reject('d'),
	MyPromise.resolve(2),
	MyPromise.resolve('c'),
]).then(value=>{
	console.log('promise-all-value:', value);
}, reason=>{
	console.log('promise-all-reason:', reason);
});

Promise.race([
	new Promise((resolve)=>{
		setTimeout(()=>{
			resolve(1);
		}, 1000);
	}),
	new Promise((resolve)=>{
		setTimeout(()=>{
			resolve(2);
		}, 500);
	}),
	new Promise((resolve, reject)=>{
		setTimeout(()=>{
			reject(3);
		}, 200);
	}),
]).then((value)=>{
	console.log('promise-race-value:', value);
}, (reason)=>{
	console.log('promise-race-reason:', reason);
});

MyPromise.resolve(123).then(value=>{
	console.log('promise-resolve value:', value);
});

MyPromise.reject('abc').then((value)=>{
	console.log('promise-reject-resolve:', value);
}, reason=>{
	console.log('promise-reject-reason:', reason);
});

console.log('script start');
const p1 = new MyPromise((resolve, reject)=>{
	setTimeout(()=>{
		resolve(111);
		// reject(222);
	});
});
p1.then((value)=>{
	console.log('p1 value:', value);
	return new MyPromise((resolve)=>{
		setTimeout(()=>{
			resolve('chain value');
		}, 1000);
	});
}, error=>{
	console.log('p1 error:', error);
}).then((value)=>{
	console.log('p1 chain value：', value);
});
p1.then((value)=>{
	console.log('p1 2 value:', value);
});
console.log('script end');
