import React, { useState } from 'react';
import Header from "./component/Header";
import Footer from "./component/Footer";

export default function BuyList () {
	return (
		<div>
			<Header />
			<section className="wrapper">
				<div className="contents">
					お買い物リスト
				</div>
			</section>
		</div>
	)
}