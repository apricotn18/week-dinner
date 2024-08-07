import { memo } from 'react';
import style from "./recipeCassette.module.scss";
import { division } from "../../../assets/js/options";;
import { Recipe } from "../../../assets/js/type";

type Props = {
	item: Recipe;
	index: number;
};

const recipeCassette = memo(({ item, index }: Props) => {
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

export default recipeCassette;