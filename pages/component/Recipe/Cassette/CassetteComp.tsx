import { memo } from "react";
import style from "./cassette.module.scss";
import { divisions } from "../../../../assets/options";;
import { Recipe } from "../../../../assets/type";

type Props = {
	index: number;
	item: Recipe;
};

const CassetteComponent = memo(({item, index}: Props) => {
	return (
		<>
			<div className={style.image} style={{backgroundImage: `url(${item.foodImageUrl})`}}></div>
			<div className={style.wrapper}>
				<div className={style.header}>
					<p className={style.division}>{divisions[index]}のレシピ</p>
					<p className={style.time}>{item.recipeIndication}</p>
					<p className={style.price}>{item.recipeCost}</p>
				</div>
				<p className={style.title}>{item.recipeTitle}</p>
			</div>
		</>
	);
});

export default CassetteComponent;