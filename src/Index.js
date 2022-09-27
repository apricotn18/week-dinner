import React, { useState, useEffect } from 'react';
import Header from "./component/Header";
import Footer from "./component/Footer";
import RecipeAPI from "./assets/js/modules/_RecipeAPI.js";

const localstorageData = JSON.parse(localStorage.getItem('week-dinner')) || {};
const recipeAPI = new RecipeAPI({
	data: localstorageData,
});

const ACTIVE_CLASS = 'is-active';
const RECIPE_MODAL_CLASS = 'js-modal_recipe';

export default function Index () {
	const division = ["今日","明日","明後日","3日後","4日後","5日後","6日後"];
	let index = 0;

	const [data, setData] = useState([{},{},{},{},{},{},{}]);
	const [modalData, setModalData] = useState(data[index]);

	// レシピ更新
	useEffect(() => {
		recipeAPI.initFetch().then((result) => {
			setData(result);
		});
	}, []);

	/**
	 * レシピモーダルを開く
	 * @return {void}
	*/
	const openRecipeModal = (e) => {
		// レシピ書き換え
		const index = e.currentTarget.dataset.dateNum;
		setModalData(data[index]);
		// open
		document.querySelectorAll('body')[0].style.overflow = 'hidden';
		document.querySelectorAll('.' + RECIPE_MODAL_CLASS)[0].classList.add(ACTIVE_CLASS);
	};

	/**
	 * レシピモーダルを閉じる
	 * @return {void}
	*/
	const closeRecipeModal = () => {
		document.querySelectorAll('body')[0].style.overflow = '';
		document.querySelectorAll('.' + RECIPE_MODAL_CLASS + '_content')[0].scrollTop = 0;
		document.querySelectorAll('.' + RECIPE_MODAL_CLASS)[0].classList.remove(ACTIVE_CLASS);
	}

	return (
		<div>
			<Header />
			<section className="wrapper">
				<div className="contents">
					<ul className="recipe_list">
						{data.map((item, i) => {
							return (
								<li className="recipe_list-item">
									<button type="button" className="recipe_list-button" data-date-num={i} onClick={openRecipeModal}>
										<div className="recipe_list-image" style={{backgroundImage: `url(${item.foodImageUrl||''})`}}></div>
										<div className="recipe_info">
											<div className="recipe_list-head">
												<p className="recipe_list-division">{division[i]}のレシピ</p>
												<p className="recipe_list-time">{item.recipeIndication||''}</p>
												<p className="recipe_list-price">{item.recipeCost||''}</p>
											</div>
											<p className="recipe_list-title">{item.recipeTitle||''}</p>
										</div>
									</button>
									<div className="recipe_list-update">
										<a href="javascript:void(0);" className="recipe_list-update_image js-recipe_update_button"></a>
									</div>
								</li>
							)
						})}
					</ul>
				</div>
				<Footer />
			</section>

			{/* レシピモーダル */}
			<div className={'modal ' + RECIPE_MODAL_CLASS}>
				<div className="modal-bg" onClick={closeRecipeModal}></div>
				<div className="modal-recipe_wrapper">
					<div className={'modal-recipe_content ' + RECIPE_MODAL_CLASS + '_content'}>
						<div className="recipe_list recipe_list--modal">
							<button type="button" className="modal_close_button" onClick={closeRecipeModal}>
								<span className="modal_close_button-item"></span>
							</button>
							<img className="recipe_list-image" src={modalData.foodImageUrl||''} />
							<div className="recipe_list-wrapper">
								<p className="recipe_list-title">{modalData.recipeTitle||''}</p>
								<div className="recipe_list-modal_info">
									<p className="recipe_list-time">{modalData.recipeIndication||''}</p>
									<p className="recipe_list-price">{modalData.recipeCost||''}</p>
								</div>
								<p className="recipe_list-description">{modalData.recipeDescription||''}</p>
								<table className="table_list">
									<thead>
										<tr><th>材料</th></tr>
									</thead>
									<tbody>
										{modalData.recipeMaterial ? modalData.recipeMaterial.map((item) => {
											return <tr><td>{item}</td></tr>
										}) : ''}
									</tbody>
								</table>
							</div>
							<div className="modal_button">
								<a href={modalData.recipeUrl||''} className="modal_button-item modal_button-item--rakuten" target="_blank">
									詳しいレシピを見る
								</a>
								<button type="button" className="modal_button-item modal_button-item--close" onClick={closeRecipeModal}>
									閉じる
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* レシピモーダル */}
		</div>
	)
}
