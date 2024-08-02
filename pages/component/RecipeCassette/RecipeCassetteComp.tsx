import style from "./recipeCassette.module.scss";
import { division } from "../../../assets/js/common";
import { Recipe } from "../../../assets/js/type";

type Props = {
	item: Recipe;
	index: number;
};

export default function recipeCassette (props: Props) {
	const item = props.item;
	const index = props.index;

	return (
		<button type="button" className={style.wrapper} data-date-num={index}>
			<div className={style.image} style={{backgroundImage: `url(${item.foodImageUrl})`}}></div>
			<div className={style.info}>
				<div className={style.head}>
					<p className={style.division}>{division[index]}のレシピ</p>
					<p className={style.time}>{item.recipeIndication}</p>
					<p className={style.price}>{item.recipeCost}</p>
				</div>
				<p className={style.title}>{item.recipeTitle}</p>
			</div>
		</button>
	)
}