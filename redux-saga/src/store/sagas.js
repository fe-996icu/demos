import { put, call, take, fork, takeEvery, takeLatest } from 'redux-saga/effects'

export const delay = ms=>new Promise(resolve=>setTimeout(()=>{
	resolve({
		a:1,
		b:2,
	});
}, ms));

function* incrementAsync(){
	const a = yield call(delay, 1000);
	console.log(a, 3333);
	yield put({
		type: 'INCREMENT',
	});
}

export default function* rootSaga(){
	yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}