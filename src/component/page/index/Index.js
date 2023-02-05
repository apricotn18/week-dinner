import React, { useState, useEffect } from 'react';
import Header from "../../common/header/Header";
import Footer from "../../common/footer/Footer";
import RecipeAPI from "../../../assets/api/_RecipeAPI";
import "./index.scss";

export default function Index () {
	const recipeAPI = new RecipeAPI();
	const division = ["今日","明日","明後日","3日後","4日後","5日後","6日後"];
	const [recipe, setRecipe] = useState([{},{},{},{},{},{},{}]);
	const [modalRecipe, setModalRecipe] = useState(recipe[0]);
	const [modalShow, setModalShow] = useState(false);

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
	const openModal = (e) => {
		// レシピ書き換え
		const index = e.currentTarget.dataset.dateNum;
		setModalRecipe(recipe[index]);
		setModalShow(true);
	};

	/**
	 * レシピモーダルを閉じる
	 * @return {void}
	*/
	const closeModal = () => {
		document.querySelectorAll('.js-recipe_modal_content')[0].scrollTop = 0;
		setModalShow(false);
	}

	/**
	 * レシピを変更
	 * @return {void}
	*/
	const updateSingleRecipe = (e) => {
		const target = e.currentTarget;
		// ボタンを非活性にする（時間に複数回通信するとエラーとなるため）
		target.classList.add('is-disabled');
		// レシピ書き換え
		const index = target.dataset.dateNum;
		recipeAPI.fetch(index).then((result) => {
			setRecipe(result);
		});
		// ボタンを活性に戻す
		setTimeout(() => {
			target.classList.remove('is-disabled');
		}, 1500);
	}

	return (
		<div>
			<Header />
			<section className="wrapper">
				<div className="contents">
					<ul className="recipe">
						{recipe.map((item, i) => {
							{if (i >= 7) return}
							return (
								<li className="recipe">
									<button type="button" className="recipe-button" data-date-num={i} onClick={openModal}>
										<div className="recipe-image" style={{backgroundImage: `url(${item.foodImageUrl||''})`}}></div>
										<div className="recipe-info">
											<div className="recipe-head">
												<p className="recipe-division">{division[i]}のレシピ</p>
												<p className="recipe-time">{item.recipeIndication||''}</p>
												<p className="recipe-price">{item.recipeCost||''}</p>
											</div>
											<p className="recipe-title">{item.recipeTitle||''}</p>
										</div>
									</button>
									{!item.foodImageUrl ? "" :
									<div className="recipe-update">
										<button type="button" data-date-num={i} onClick={updateSingleRecipe}></button>
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
			<div className={modalShow ? 'recipe_modal is-open' : 'recipe_modal'}>
				<div className="recipe_modal-wrapper">
					<div className="recipe_modal-content js-recipe_modal_content">
						<div className="recipe_modal-head">
							<p className="recipe_modal-title">{modalRecipe.recipeTitle||''}</p>
							<div className="recipe_modal-close" onClick={closeModal}></div>
						</div>
						<img className="recipe_modal-image" src={modalRecipe.foodImageUrl||''} />
						<div className="recipe_modal-info">
							<div className="recipe_modal-info_head">
								<p className="recipe_modal-time">{modalRecipe.recipeIndication||''}</p>
								<p className="recipe_modal-price">{modalRecipe.recipeCost||''}</p>
							</div>
							<p className="recipe_modal-description">{modalRecipe.recipeDescription||''}</p>
							<table className="table">
								<thead>
									<tr><th>材料</th></tr>
								</thead>
								<tbody>
									{modalRecipe.recipeMaterial ? modalRecipe.recipeMaterial.map((item) => {
										return <tr><td>{item}</td></tr>
									}) : ''}
								</tbody>
							</table>
							<div>
								<a href={modalRecipe.recipeUrl||''} className="recipe_modal-button" target="_blank">
									詳しいレシピを見る
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* レシピモーダル */}
		</div>
	)
}
