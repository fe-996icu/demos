import React from 'react';
import logo from './logo.svg';
import './App.css';
import Counter from './components/counter.jsx'
import { Provider } from 'react-redux'
import store from './store/index.js'

function App() {
	return (
		<div className="App">
			<Provider store={ store }>
				<Counter/>
			</Provider>
		</div>
	);
}

export default App;
