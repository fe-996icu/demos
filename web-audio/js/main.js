var audioObj = document.querySelector('#audio');
var canvasObj = document.querySelector('#canvas');
window.vudio = null;

audioObj.addEventListener('canplay', ()=>{
	console.log('可以播放了');
});
audioObj.addEventListener('play', ()=>{
	console.log('播放了');

	if(!window.vudio){
		window.vudio = init();
		window.vudio.dance();
	}
});
audioObj.addEventListener('pause', ()=>{
	console.log('暂停了');
});
audioObj.addEventListener('ended', ()=>{
	console.log('播放完毕，可以考虑暂停vudio');
});
audioObj.addEventListener('loadeddata', ()=>{
	console.log('loadeddata');
});
audioObj.addEventListener('loadedmetadata', ()=>{
	console.log('loadedmetadata');
});

function init(){
	var vudio = new Vudio(audioObj, canvasObj, {
		effect : 'waveform', // waveform, circlewave, circlebar, lighting (4 visual effect)
		accuracy : 128, // number of freqBar, must be pow of 2.
		width : 256, // canvas width
		height : 100, // canvas height
		waveform : {
			maxHeight : 80, // max waveform bar height
			minHeight : 1, // min waveform bar height
			spacing: 1, // space between bars
			color : '#f00', // string | [string] color or waveform bars
			shadowBlur : 0, // blur of bars
			shadowColor : '#f00',
			fadeSide : true, // fading tail
			horizontalAlign : 'center', // left/center/right, only effective in 'waveform'/'lighting'
			verticalAlign: 'middle' // top/middle/bottom, only effective in 'waveform'/'lighting'
		}
	});

	return vudio;
}
