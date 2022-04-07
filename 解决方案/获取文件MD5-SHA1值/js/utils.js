/*
	windows命令行获取文件md5和sha1值

	certutil -hashfile ./file.jpg md5
	certutil -hashfile ./file.jpg sha1
	certutil -hashfile ./file.jpg sha256
 */

var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

// 获取文件md5【spark-md5.js】-【binarystring】
function getMD5CodeOfSparkMD5(file){
	return new Promise((resolve, reject)=>{
		var reader = new FileReader();
		var time = Date.now();

		reader.onload = function(ev){
			if(file.size != ev.target.result.length){
				reject('读取后的文件大小与原文件大小不一致');
			}else{
				resolve(SparkMD5.hashBinary(ev.target.result));
				console.log(`%cmd5-完成时间【spark-md5】：${Date.now() - time}ms`, 'background-color: orange;');
			}
		};

		reader.onerror = ()=>reject('读取文件失败');

		reader.readAsBinaryString(file);
	});
}

// 获取文件md5，文件分割分片处理【spark-md5.js】-【binarystring】
function getMD5CodeSplitOfSparkMD5(file){
	return new Promise((resolve, reject)=>{
		var chunkSize = 1024 * 1024 * 2;	// 2mb
		var chunksCount = Math.ceil(file.size / chunkSize);	// 文件需要切割的份数
		var currentChunkIndex = 0;
		var spark = new SparkMD5();
		var time = new Date().getTime();
		var reader = new FileReader();

		reader.onload = function(ev){
			currentChunkIndex += 1;
			spark.appendBinary(ev.target.result);	// append array buffer

			console.log('md5-分割读取进度：%s/%s', currentChunkIndex, chunksCount);

			if(currentChunkIndex < chunksCount){
				loadNext();
			}else{
				resolve(spark.end());
				console.log(`%cmd5-分割完成时间【spark-md5】：${Date.now() - time}ms`, 'background-color: orange;');
			}
		};

		reader.onerror = ()=>reject('读取文件失败');

		function loadNext(){
			var start = currentChunkIndex * chunkSize;
			var end = start + chunkSize >= file.size ? file.size : start + chunkSize;

			var blob = blobSlice.call(file, start, end);
			reader.readAsBinaryString(blob);
		}

		loadNext();
	});
}


// 获取文件md5【spark-md5.js】-【arraybuffer】
function getMD5CodeOfSparkMD5ArrayBuffer(file){
	return new Promise((resolve, reject)=>{
		var reader = new FileReader();
		var time = Date.now();

		reader.onload = function(ev){
			if(file.size != ev.target.result.byteLength){
				reject('读取后的文件大小与原文件大小不一致');
			}else{
				resolve(SparkMD5.ArrayBuffer.hash(ev.target.result));
				console.log(`%cmd5-完成时间【spark-md5】：${Date.now() - time}ms`, 'background-color: orange;');
			}
		};

		reader.onerror = ()=>reject('读取文件失败');

		reader.readAsArrayBuffer(file);
	});
}

// 获取文件md5，文件分割分片处理【spark-md5.js】-【arraybuffer】
function getMD5CodeSplitOfSparkMD5ArrayBuffer(file){
	return new Promise((resolve, reject)=>{
		var chunkSize = 1024 * 1024 * 2;	// 2mb
		var chunksCount = Math.ceil(file.size / chunkSize);	// 文件需要切割的份数
		var currentChunkIndex = 0;
		var spark = new SparkMD5.ArrayBuffer();
		var time = new Date().getTime();
		var reader = new FileReader();

		reader.onload = function(ev){
			currentChunkIndex += 1;
			spark.append(ev.target.result);	// append array buffer

			console.log('md5-分割读取进度：%s/%s', currentChunkIndex, chunksCount);

			if(currentChunkIndex < chunksCount){
				loadNext();
			}else{
				resolve(spark.end());
				console.log(`%cmd5-分割完成时间【spark-md5】：${Date.now() - time}ms`, 'background-color: orange;');
			}
		};

		reader.onerror = ()=>reject('读取文件失败');

		function loadNext(){
			var start = currentChunkIndex * chunkSize;
			var end = start + chunkSize >= file.size ? file.size : start + chunkSize;

			var blob = blobSlice.call(file, start, end);
			reader.readAsArrayBuffer(blob);
		}

		loadNext();
	});
}


// 获取文件sha1【crypto-js.js】
function getSHA1CodeOfCryptoJS(file){
	return new Promise(resolve=>{
		var reader = new FileReader();
		var time = Date.now();

		reader.onload = function(event){
			var res = event.target.result;
			res = CryptoJS.lib.WordArray.create(res);
			var sha1 = CryptoJS.SHA1(res).toString();
			resolve(sha1);
			console.log(`%csha1-完成时间【crypto-js】：${Date.now() - time}ms`, 'background-color: orange;');
		};

		reader.readAsArrayBuffer(file);
	});
}

// 获取文件sha1，文件分割分片处理【crypto-js.js】
function getSHA1CodeSplitOfCryptoJS(file){
	return new Promise((resolve, reject)=>{
		var chunkSize = 1024 * 1024 * 2;	// 2mb
		var chunksCount = Math.ceil(file.size / chunkSize);	// 文件需要切割的份数
		var currentChunkIndex = 0;
		var chunks = CryptoJS.lib.WordArray.create();
		var time = new Date().getTime();
		var reader = new FileReader();

		reader.onload = function(ev){
			currentChunkIndex += 1;
			console.log('sha1-分割读取进度：%s/%s', currentChunkIndex, chunksCount);

			var chunk = CryptoJS.lib.WordArray.create(ev.target.result)
			chunks.concat(chunk);

			if(currentChunkIndex < chunksCount){
				loadNext();
			}else{
				var sha1 = CryptoJS.SHA1(chunks).toString();
				resolve(sha1);

				console.log(`%csha1-分割完成时间【crypto-js】：${Date.now() - time}ms`, 'background-color: orange;');
			}
		};

		reader.onerror = reject;

		function loadNext(){
			var start = currentChunkIndex * chunkSize;
			var end = start + chunkSize >= file.size ? file.size : start + chunkSize;

			var blob = blobSlice.call(file, start, end);
			reader.readAsArrayBuffer(blob);
		}

		loadNext();
	});
}

// 获取文件md5【crypto-js.js】
function getMD5CodeOfCryptoJS(file){
	return new Promise(resolve=>{
		var reader = new FileReader();
		var time = Date.now();

		reader.onload = function(event){
			var res = event.target.result;
			res = CryptoJS.lib.WordArray.create(res);
			var sha1 = CryptoJS.MD5(res).toString();
			resolve(sha1);
			console.log(`%cmd5-完成时间【crypto-js】：${Date.now() - time}ms`, 'background-color: orange;');
		};

		reader.readAsArrayBuffer(file);
	});
}

// 获取文件md5，文件分割分片处理【crypto-js.js】
function getMD5CodeSplitOfCryptoJS(file){
	return new Promise((resolve, reject)=>{
		var chunkSize = 1024 * 1024 * 2;	// 2mb
		var chunksCount = Math.ceil(file.size / chunkSize);	// 文件需要切割的份数
		var currentChunkIndex = 0;
		var chunks = CryptoJS.lib.WordArray.create();
		var time = new Date().getTime();
		var reader = new FileReader();

		reader.onload = function(ev){
			currentChunkIndex += 1;
			console.log('sha1-分割读取进度：%s/%s', currentChunkIndex, chunksCount);

			var chunk = CryptoJS.lib.WordArray.create(ev.target.result)
			chunks.concat(chunk);

			if(currentChunkIndex < chunksCount){
				loadNext();
			}else{
				var sha1 = CryptoJS.MD5(chunks).toString();
				resolve(sha1);

				console.log(`%cmd5-分割完成时间【crypto-js】：${Date.now() - time}ms`, 'background-color: orange;');
			}
		};

		reader.onerror = reject;

		function loadNext(){
			var start = currentChunkIndex * chunkSize;
			var end = start + chunkSize >= file.size ? file.size : start + chunkSize;

			var blob = blobSlice.call(file, start, end);
			reader.readAsArrayBuffer(blob);
		}

		loadNext();
	});
}