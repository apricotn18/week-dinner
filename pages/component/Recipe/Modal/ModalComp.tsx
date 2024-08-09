import { memo } from "react";
import ButtonComponent from "../../Button/ButtonComp";
import style from "./modal.module.scss";
import { Recipe } from "../../../../assets/type";

type Props = {
	index: number;
	item: Recipe;
};

const ModalComponent = memo(({ item, index }: Props) => {
	return (
		<>
			<div>
				<img className={style.image} src={item.foodImageUrl||''} alt="レシピ画像" />
			</div>
			<div className={style.wrapper}>
				<div className={style.header}>
					<p className={style.time}>{item.recipeIndication}</p>
					<p className={style.price}>{item.recipeCost}</p>
				</div>
				<p className={style.description}>
					{item.recipeDescription}
				</p>
				{item.recipeMaterial &&
					<table className={style.table}>
						<thead>
							<tr><th>材料</th></tr>
						</thead>
						<tbody>
							{item.recipeMaterial.map((item, i: number) => (
								<tr key={i}><td>{item}</td></tr>
							))}
						</tbody>
					</table>
				}
				<div className={style.button_recipe_wrapper}>
					<ButtonComponent href={item.recipeUrl||''} hasTarget={true}>
						もっと詳しいレシピを見る
					</ButtonComponent>
				</div>
				<div className={style.button_change_wrapper}>
					<ButtonComponent href={'change?' + index}>
						レシピ入れ替え
					</ButtonComponent>
				</div>
			</div>
		</>
	);
});

export default ModalComponent;