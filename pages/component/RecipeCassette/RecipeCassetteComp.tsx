import style from "./recipeCassette.module.scss";
import { division } from "../../../assets/js/options";;
import { Recipe } from "../../../assets/js/type";

type Props = {
	item: Recipe;
	index: number;
	handleModalClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function recipeCassette ({ item, index, handleModalClick }: Props) {
	return (
		<button type="button" className={style.wrapper} data-index={index} onClick={handleModalClick}>
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