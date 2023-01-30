import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './component/page/index/Index';
import BuyList from './component/page/buyList/BuyList';
import Ranking from './component/page/ranking/Ranking';
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
