export function incrementNum(){
	return {
		type: 'incrementNum',
		payload: 11,
	};
}

export function incrementNumAsync(){
	return {
		type: 'INCREMENT_ASYNC',
		// payload: 22,
	};
}

// export const incrementNumAsync = incrementNum;
