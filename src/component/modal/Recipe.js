import React, { useState } from 'react';

const ACTIVE_CLASS = 'is-active';

export default function RecipeModal (props) {
	const [data, setData] = useState(props.data);

	const closeModal = () => {
		$('body').css('overflow', '');
		$('.js-modal_recipe_content').scrollTop(0);
		$('.' + props.modalClass).removeClass(ACTIVE_CLASS);
	}

	return (
		<div className={'modal ' + props.modalClass}>
			<div className="modal-bg" onClick={closeModal}></div>
			<div className="modal-recipe_wrapper">
				<div className="modal-recipe_content js-modal_recipe_content">
					<div className="recipe_list recipe_list--modal">
						<img className="recipe_list-image" src={data.foodImageUrl} />
						<div className="recipe_list-wrapper">
							<p className="recipe_list-title">{data.recipeTitle}</p>
							<div className="recipe_list-modal_info">
								<p className="recipe_list-time">{data.recipeIndication}</p>
								<p className="recipe_list-price">{data.recipeCost}</p>
							</div>
							<p className="recipe_list-description">{data.recipeDescription}</p>
							<table className="table_list">
								<thead>
									<tr><th>材料</th></tr>
								</thead>
								<tbody>
									{data.recipeMaterial.map((item) => {
										return <tr><td>{item}</td></tr>
									})}
								</tbody>
							</table>
						</div>
						<div className="modal_button">
							<a href={data.recipeUrl} className="modal_button-item modal_button-item--rakuten" target="_blank">
								詳しいレシピを見る
							</a>
							<a href="javascript:void(0);" className="modal_button-item modal_button-item--close" onClick={closeModal}>
								閉じる
							</a>
						</div>
					</div>
				</div>
				<a href="javascript:void(0);" className="modal_close_button" onClick={closeModal}>
					<span className="modal_close_button-item"></span>
				</a>
			</div>
		</div>
	);
}
