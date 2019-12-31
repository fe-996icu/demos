import React, { useState } from 'react'
import { connect } from 'react-redux'
import { incrementNum, incrementNumAsync } from '../store/actions/index.js'
import store from '../store/index.js'

console.log(store, 'store');

function Counter(props){
	const [num, setNum] = useState(0);

	function clickHandle(){
		setNum(num+1);
	}

	// console.log(props);

	return (
		<>
			<p>{ props.num }</p>
			<button onClick={ props.incrementNumAsync }>click me</button>
		</>
	);
}

export default connect(({ num })=>({
	num,
}), {
	incrementNum,
	incrementNumAsync,
})(Counter);