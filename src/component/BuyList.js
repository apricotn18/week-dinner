import React, { useState } from 'react';
import Header from "./modules/Header";
import Footer from "./modules/Footer";

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
