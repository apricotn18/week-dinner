import React, { useState, useEffect } from 'react';
import Header from "./modules/Header";
import Footer from "./modules/Footer";
import RecipeAPI from "../aip/_RecipeAPI";
import "./index.scss";

const ACTIVE_CLASS = 'is-active';
const RECIPE_MODAL_CLASS = 'js-modal_recipe';

export default function Index () {
	const recipeAPI = new RecipeAPI();
	const division = ["今日","明日","明後日","3日後","4日後","5日後","6日後"];
	const [recipe, setRecipe] = useState([{},{},{},{},{},{},{}]);
	const [modalRecipe, setModalRecipe] = useState(recipe[0]);

	// レシピ更新
	useEffect(() => {
		recipeAPI.initFetch().then((result) => {
			setRecipe(result);
		});
	}, []);

	/**
	 * レシピモーダルを開く
	 * @return {void}
	*/
	const openRecipeModal = (e) => {
		// レシピ書き換え
		const index = e.currentTarget.dataset.dateNum;
		setModalRecipe(recipe[index]);
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

	/**
	 * レシピを変更
	 * @return {void}
	*/
	const changeRecipe = (e) => {
		const index = e.currentTarget.dataset.dateNum;
		recipeAPI.fetch(index).then((result) => {
			setRecipe(result);
		});
	}

	return (
		<div>
			<Header />
			<section className="wrapper">
				<div className="contents">
					<ul className="recipe_list">
						{recipe.map((item, i) => {
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
									{!item.foodImageUrl ? "" :
									<div className="recipe_list-update">
										<button type="button" className="recipe_list-update_image" data-date-num={i} onClick={changeRecipe}></button>
									</div>
									}
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
							<img className="recipe_list-image" src={modalRecipe.foodImageUrl||''} />
							<div className="recipe_list-wrapper">
								<p className="recipe_list-title">{modalRecipe.recipeTitle||''}</p>
								<div className="recipe_list-modal_info">
									<p className="recipe_list-time">{modalRecipe.recipeIndication||''}</p>
									<p className="recipe_list-price">{modalRecipe.recipeCost||''}</p>
								</div>
								<p className="recipe_list-description">{modalRecipe.recipeDescription||''}</p>
								<table className="table_list">
									<thead>
										<tr><th>材料</th></tr>
									</thead>
									<tbody>
										{modalRecipe.recipeMaterial ? modalRecipe.recipeMaterial.map((item) => {
											return <tr><td>{item}</td></tr>
										}) : ''}
									</tbody>
								</table>
							</div>
							<div className="modal_button">
								<a href={modalRecipe.recipeUrl||''} className="modal_button-item modal_button-item--rakuten" target="_blank">
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
