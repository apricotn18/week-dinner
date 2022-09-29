import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './component/Index';
import BuyList from './component/BuyList';
import Ranking from './component/Ranking';
import './assets/css/common.scss';

function App () {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Index />} />
				<Route path='/list' element={<BuyList />} />
				<Route path='/rank' element={<Ranking />} />
			</Routes>
		</BrowserRouter>
	);
}

ReactDOM.render(<App />, document.getElementById('root'));
