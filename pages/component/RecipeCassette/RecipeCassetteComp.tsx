import { memo } from "react";
import style from "./recipeCassette.module.scss";
import { division } from "../../../assets/options";;
import { Recipe } from "../../../assets/type";

type Props = {
	item: Recipe;
	index: number;
};

const RecipeCassetteComponent = memo(({ item, index }: Props) => {
	if (!item) return;

	return (
		<>
			<div className={style.image} style={{backgroundImage: `url(${item.foodImageUrl})`}}></div>
			<div className={style.info}>
				<div className={style.head}>
					<p className={style.division}>{division[index]}のレシピ</p>
					<p className={style.time}>{item.recipeIndication}</p>
					<p className={style.price}>{item.recipeCost}</p>
				</div>
				<p className={style.title}>{item.recipeTitle}</p>
			</div>
		</>
	)
});

export default RecipeCassetteComponent;