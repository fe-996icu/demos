const initState = {
	num: 10,
};

export default function reducer(state=initState, { type, payload }){
	const newState = { ...state };

	switch(type){
		case 'incrementNum':
			newState.num = newState.num + 1;
			break;
		case 'INCREMENT':
			newState.num = newState.num + 1;
			break;
		case 'INCREMENT_ASYNC':
			// newState.num = newState.num + 1;
			// newstate
			break;
	}

	return newState;
}