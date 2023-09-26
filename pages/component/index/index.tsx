import React, { useState, useEffect } from 'react';
import { Recipe } from "../../../assets/js/type";
import { division, RakutenRecipeAPI } from "../../../assets/js/common";
import Error from "../error/error";
import style from "./index.module.scss";

type ModalStyle = {
	top: '44px'|'100%';
}

export default function Page() {
	const [recipe, setRecipe] = useState<Recipe[]>([{},{},{},{},{},{},{}]);
	const [modalRecipe, setModalRecipe] = useState<Recipe>(recipe[0]);
	const [modalStyle, setModalStyle] = useState<ModalStyle>({top: '100%'});
	const [isError, setError] = useState<boolean>(false);

	const rakutenRecipeAPI = new RakutenRecipeAPI();

	// レシピ更新
	useEffect(() => {
		if (!rakutenRecipeAPI) {
			setError(true);
			return;
		}

		rakutenRecipeAPI.init()
			.then((result) => {
				if (result) {
					setRecipe(result);
					return;
				}
				setError(true);
			}).catch(() => {
				setError(true);
			});
	}, []);

	/**
	 * レシピモーダル
	 * @return {void}
	*/
	const handleModal = {
		open: (
			e: React.MouseEvent<HTMLButtonElement, MouseEvent>
		) => {
			// レシピ書き換え
			const index: string = e.currentTarget.dataset.dateNum || '0';
			setModalRecipe(recipe[Number.parseInt(index)]);
			setModalStyle({top: '44px'});
			document.body.style.overflow = 'hidden';
		},
		close: () => {
			setModalStyle({top: '100%'});
			document.body.style.overflow = '';
		}
	}

	/**
	 * レシピを変更
	 * @return {void}
	*/
	const updateSingleRecipe = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		const target = e.currentTarget;
		// ボタンを非活性にする（時間に複数回通信するとエラーとなるため）
		target.disabled = true;
		// レシピ書き換え
		const index: string = e.currentTarget.dataset.dateNum || '0';
		rakutenRecipeAPI.fetch(Number.parseInt(index))
			.then((result) => {
				setRecipe(result);
			}).catch(() => {
				setError(true);
			});
		// ボタンを活性に戻す
		setTimeout(() => {
			target.disabled = false;
		}, 1500);
	}

	return (
		<>
			<section className="wrapper">
				<div className="contents">
					<ul className={style.recipe}>
						{recipe.map((item: Recipe, i: number) => {
							{if (i >= 7) return}
							return (
							<li className={style.recipe} key={i}>
								<button type="button" className={style.recipe_button} data-date-num={i} onClick={handleModal.open}>
									<div className={style.recipe_image} style={{backgroundImage: `url(${item.foodImageUrl})`}}></div>
									<div className={style.recipe_info}>
										<div className={style.recipe_head}>
											<p className={style.recipe_division}>{division[i]}のレシピ</p>
											<p className={style.recipe_time}>{item.recipeIndication}</p>
											<p className={style.recipe_price}>{item.recipeCost}</p>
										</div>
										<p className={style.recipe_title}>{item.recipeTitle}</p>
									</div>
								</button>
								{item.foodImageUrl &&
									<div className={style.recipe_update}>
										<button type="button" data-date-num={i} onClick={updateSingleRecipe}></button>
									</div>
								}
							</li>
							)
						})}
					</ul>
				</div>
			</section>

			{/* レシピモーダル */}
			<div className={style.modal} style={modalStyle}>
				<div>
					<div className={style.modal_content}>
						<div className={style.modal_head}>
							<p className={style.modal_title}>{modalRecipe.recipeTitle}</p>
							<button className={style.modal_close} onClick={handleModal.close}></button>
						</div>
						<div>
							<img className={style.modal_image} src={modalRecipe.foodImageUrl||''} alt="レシピ画像" />
						</div>
						<div className={style.modal_info}>
							<div className={style.modal_info_head}>
								<p className={style.modal_time}>{modalRecipe.recipeIndication}</p>
								<p className={style.modal_price}>{modalRecipe.recipeCost}</p>
							</div>
							<p className={style.modal_description}>{modalRecipe.recipeDescription}</p>
							{modalRecipe.recipeMaterial &&
								<table className="table">
									<thead>
										<tr><th>材料</th></tr>
									</thead>
									<tbody>
										{modalRecipe.recipeMaterial.map((item, i: number) => <tr key={i}><td>{item}</td></tr>)}
									</tbody>
								</table>
							}
							<div>
								<a href={modalRecipe.recipeUrl} className={style.modal_button} target="_blank">
									詳しいレシピを見る
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* レシピモーダル */}

			<Error isError={isError}></Error>
		</>
	)}