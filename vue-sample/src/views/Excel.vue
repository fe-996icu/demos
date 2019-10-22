/*前端读取excel文件内容，将数据导出到excel中
	参考：http://blog.haoji.me/js-excel.html
 * @Author: zzh0211@live.com
 * @Date: 2019-10-22 18:46:52
 * @Last Modified by: zzh0211@live.com
 * @Last Modified time: 2019-10-22 18:47:23
 */
<template>
	<div class="excel-wrapper">
		<h3>下载excel</h3>
		<button @click="downExcel">下载excel</button>

		<h3>上传解析excel，查看控制台输出</h3>
		<input type="file" @change="fileChangeHandle" />
	</div>
</template>

<script>
	import XLSX from 'xlsx';

	export default {
		data(){
			return {
				sheet1data: [
					{
						department: "行政部",
						count: 2
					}, {
						department: "前端部",
						count: 2
					}
				],
				sheet2data: [
					{
						name: "张三",
						do: "整理文件"
					}, {
						name: "李四",
						do: "打印"
					}
				],
				sheet3data: [
					{
						name: "张大人",
						do: "vue"
					}, {
						name: "李大人",
						do: "react"
					}
				],
			};
		},
		methods: {
			// 将workbook装化成blob对象
			workbook2blob(workbook){
				// 生成excel的配置项
				var wopts = {
					// 要生成的文件类型
					bookType: "xlsx",
					// // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
					bookSST: false,
					type: "binary"
				};
				var wbout = XLSX.write(workbook, wopts);
				// 将字符串转ArrayBuffer
				function s2ab(s) {
					var buf = new ArrayBuffer(s.length);
					var view = new Uint8Array(buf);
					for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
					return buf;
				}
				var blob = new Blob([s2ab(wbout)], {
					type: "application/octet-stream"
				});
				return blob;
			},
			// 将blob对象创建bloburl，然后用a标签实现弹出下载框
			openDownloadDialog(blob, fileName){
				if (typeof blob == "object" && blob instanceof Blob) {
					blob = URL.createObjectURL(blob); // 创建blob地址
				}
				var aLink = document.createElement("a");
				aLink.href = blob;
				// HTML5新增的属性，指定保存文件名，可以不要后缀，注意，有时候 file:///模式下不会生效
				aLink.download = fileName || "";
				var event;
				if (window.MouseEvent) event = new MouseEvent("click");
				//   移动端
				else {
					event = document.createEvent("MouseEvents");
					event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0,
						null);
				}
				aLink.dispatchEvent(event);
			},
			downExcel(){
				const {
					json_to_sheet,
					book_new,
					book_append_sheet,
					aoa_to_sheet,
				} = XLSX.utils;

				// const sheet1 = json_to_sheet(this.sheet1data);
				// 通过二维数组的方式生成工作表，null标识此列无值
				const sheet1 = aoa_to_sheet([
					['主要信息', null, null, null, '其他信息'],
					['编号', '姓名', '年龄', '性别','注册时间'],
					[1, '张三', 20, '难', '2019年10月21日18:34:34'],
					[2, '李四', 40, '女', '2019年10月21日'],
				]);
				// 合并单元格
				/* s：start、r：row、c：cell、e：end */
				sheet1['!merges'] = [
					// 设置A1-C1的单元格合并
					{s: {r: 0, c: 0}, e: {r: 0, c: 3}}
				];

				// 通过json数据生成工作表
				const sheet2 = json_to_sheet(this.sheet2data);
				const sheet3 = json_to_sheet(this.sheet3data);

				/* create a new blank workbook */
				const wb = book_new();
				book_append_sheet(wb, sheet1, "部门统计");
				book_append_sheet(wb, sheet2, "行政部");
				book_append_sheet(wb, sheet3, "前端部");

				const workbookBlob = this.workbook2blob(wb);

				// 点击下载
				this.openDownloadDialog(workbookBlob, `部门统计.xlsx`);
			},
			fileChangeHandle(ev){
				const [file] = ev.target.files;

				// 读取文件内容
				const reader = new FileReader();
				reader.addEventListener('load', ()=>{
					// 读取文件内容转成 XLSX工作簿 对象
					const workbook = XLSX.read(reader.result, {
						type: 'binary',
					});

					const style = 'background-color: #abcdef;';

					console.log('%c工作簿对象：', style, workbook);
					console.log('%cXLSX对象：', style, XLSX);
					console.log('%c第一张工作表转成json：', style, XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
					console.log('%c第一张工作表转成html：', style, XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]));
					console.log('%c第一张工作表转成二维数组', style, XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]));
				});
				reader.readAsBinaryString(file);
			},
		},
	}
</script>

<style lang="scss">
	.excel-wrapper{
		h3{
			background-color: #abcdef;
		}
	}
</style>