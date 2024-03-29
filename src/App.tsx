import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './component/page/index/Index';
import List from './component/page/list/List';
import Ranking from './component/page/ranking/Ranking';

function App () {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Index />} />
				<Route path='/list' element={<List />} />
				<Route path='/rank' element={<Ranking />} />
			</Routes>
		</BrowserRouter>
	);
}

ReactDOM.render(<App />, document.getElementById('root'));
