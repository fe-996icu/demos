/*
	参考
	github: https://github.com/Alicunde/Videoconference-Dish-CSS-JS
	demo: https://alicunde.github.io/Videoconference-Dish-CSS-JS/
 */
<template>
	<header>
		<a-space>
			<a-button @click="onAdd" type="primary">添加</a-button>
			<a-button @click="onRemove">删除</a-button>
		</a-space>
	</header>

	<main class="wrap">
		<div ref="videoWrap" class="videos-wrap">
			<div ref="videos" class="video-item" v-for="item of list" :key="item.id">
				{{item.name}}
			</div>
		</div>
	</main>
</template>

<script setup>
	import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'

	// 16:9 = 9/16=0.5625
	const _rate = 0.5625;
	const _margin = 10;

	let _count = 1;

	const videoWrap = ref();
	const videos = ref();

	const list = reactive([]);

	const onAdd = ()=>{
		if(list.length >= 9){
			return;
		}

		list.push({
			id: _count,
			name: _count,
		});

		_count++;

		reLayout();
	};
	const onRemove = ()=>{
		list.splice(0, 1);

		reLayout();
	};

	onMounted(()=>{
		const len = 1;
		for(let i = 0; i < len; i++){
			list.push({
				id: _count,
				name: _count,
			});

			_count++;
		}

		console.log('ref:', videos);
		reLayout();

		window.addEventListener('resize', ()=>{
			reLayout();
		});
	});
	onUnmounted(()=>{
		window.removeEventListener('resize', reLayout);
	});

	const reLayout = ()=>{
		nextTick(resize);
	};

	const resize = ()=>{
		const wrapRect = videoWrap.value.getBoundingClientRect();
		const {
			width: wrapWidth,
			height: wrapHeight,
		} = wrapRect;

		console.log('父节点rect：', wrapRect);


		const maxWidth = utils.getVideoMaxWidth(videoWrap.value);
		const maxHeight = maxWidth * _rate;

		console.log('计算后的单个视频尺寸：', maxWidth, maxHeight);

		for(const video of videos.value){
			video.style = `
				width: ${ maxWidth }px;
				height: ${ maxHeight }px;
			`;
		}
	};

	console.log('list:', list);

	const utils = {
		_ratio: _rate,
		getVideoMaxWidth(wrapEl){
			let max = 0
			let i = 1
			// 5000：单个视频的最大宽度
			while (i < 5000) {
				let area = this.area(i, wrapEl);
				if (area === false) {
					max = i - 1;
					break;
				}
				i++;
			}

			// remove margins
			max = max - (_margin * 2);
			console.log('max:', max);

			return max;
		},
		// calculate area of dish:
		area(increment, wrapEl){
			let wrapRect = wrapEl.getBoundingClientRect();
			const {
				width: _width,
				height: _height,
			} = wrapRect;

			let i = 0;
			let w = 0;
			let h = increment * this._ratio + (_margin * 2);
			while (i < (wrapEl.children.length)) {
				if ((w + increment) > _width) {
					w = 0;
					h = h + (increment * this._ratio) + (_margin * 2);
				}
				w = w + increment + (_margin * 2);
				i++;
			}
			if (h > _height || increment > _width) return false;
			else return increment;
		}
	};
</script>

<style lang="scss">
	html, body, #app{
		margin: 0;
		padding: 0;
		height: 100%;
	}

	#app{
		display: flex;
		flex-direction: column;
	}

	.wrap{
		height: 100%;
		padding: 8px;
		overflow: hidden;

		.videos-wrap{
			height: 100%;
			border: 1px solid red;
			flex: 1;
			display: flex;
			gap: 8px;


			// overflow: scroll;
			align-content: center;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			vertical-align: middle;
			border-radius: 10px;
			background: rgba(0, 0, 0, 0.3);
		}

		.video-item{
			position: relative;
			vertical-align: middle;
			align-self: center;
			border-radius: 10px;
			overflow: hidden;
			background-color: #fff;
			box-sizing: border-box;
			border: 1px solid pink;
			// transition: all 0.1s;
		}
	}
</style>