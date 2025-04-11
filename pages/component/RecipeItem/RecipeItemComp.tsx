import style from './style.module.scss';
import { Recipe } from '../../../public/type';

type Props = {
	index: number;
	item: Recipe;
	divisions: string;
	handleClick: (index: number) => void;
};

export default function RecipeItem(props: Props) {
	if (!props.item) return;

	return (
		<button
			onClick={() => props.handleClick(props.index)}
			className={style.wrapper}
		>
			<div
				className={style.image}
				style={{backgroundImage: `url(${props.item.foodImageUrl})`}}
			></div>
			<div className={style.textWrapper}>
				<div className={style.header}>
					<div className={style.division}>
						{props.divisions}のレシピ
					</div>
					<div className={style.time}>
						{props.item.recipeIndication}
					</div>
					<div className={style.price}>
						{props.item.recipeCost}
					</div>
				</div>
				<p className={style.title}>
					{props.item.recipeTitle}
				</p>
			</div>
		</button>
	)
}
