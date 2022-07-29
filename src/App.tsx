import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./Index";
import BuyList from "./BuyList";

function App () {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={'/'} element={<Index />} />
				<Route path={'/list.html'} element={<BuyList />} />
			</Routes>
		</BrowserRouter>
	);
}

ReactDOM.render(<App />, document.getElementById('root'));
