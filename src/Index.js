import React, { useState } from 'react';
import Header from "./component/Header";
import Footer from "./component/Footer";
import RecipeModal from "./component/modal/Recipe";
import "./assets/css/index.scss";

const ACTIVE_CLASS = 'is-active';
const RECIPE_MODAL_CLASS = 'js-modal_recipe';

export default function Index () {
	const division = ["今日","明日","明後日","3日後","4日後","5日後","6日後"];
	let index = 0;

	const [data, setData] = useState(JSON.parse(JSON.stringify(require('./data.json'))));
	const [modalData, setModalData] = useState(data[index]);

	const clickRecipe = (e) => {
		const $target = $(e.currentTarget).closest('.js-recipe');
		// レシピ書き換え
		const index = parseInt($target.attr('data-date-num'));
		setModalData(data[index]);
		// open
		$('body').css('overflow', 'hidden');
		$('.' + RECIPE_MODAL_CLASS).addClass(ACTIVE_CLASS);
	};

	return (
		<div>
			<Header />
			<section className="wrapper">
				<div className="contents">
					{data.map((obj, i) => {
						const item = obj.recipe;
						return (
							<ul className="recipe_list">
								<li className="recipe_list-item js-recipe" data-date-num={i}>
									<button className="recipe_list-button" onClick={clickRecipe}>
										<div className="recipe_list-image" style={{backgroundImage: `url(${item.foodImageUrl})`}}></div>
										<div className="recipe_info">
											<div className="recipe_list-head">
												<p className="recipe_list-division">{division[i]}のレシピ</p>
												<p className="recipe_list-time">{item.recipeIndication}</p>
												<p className="recipe_list-price">{item.recipeCost}</p>
											</div>
											<p className="recipe_list-title">{item.recipeTitle}</p>
										</div>
									</button>
									<div className="recipe_list-update">
										<a href="javascript:void(0);" className="recipe_list-update_image js-recipe_update_button"></a>
									</div>
								</li>
							</ul>
						)
					})}
				</div>
				<Footer />
			</section>

			<RecipeModal data={modalData.recipe} division={division[index]} modalClass={RECIPE_MODAL_CLASS} />
		</div>
	)
}
