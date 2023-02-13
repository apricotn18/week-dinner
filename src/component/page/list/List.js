import React, { useState } from 'react';
import Header from "../../common/header/Header";
import Footer from "../../common/footer/Footer";

export default function List () {
	return (
		<div>
			<Header />
			<section className="wrapper">
				<div className="contents">
					<h2 class="contents-title">お買い物リスト</h2>
					<p class="contents-description">
						チェックを入れて更新すると、お買い物リストから非表示になります
					</p>
					<form action="" method="">
						<table class="table js-material_table"></table>
						<a href="<%= path %>/delete.html" class="link mt20">非表示にしたお買い物リスト</a>
					</form>
				</div>
				<Footer />
			</section>
		</div>
	)
}
