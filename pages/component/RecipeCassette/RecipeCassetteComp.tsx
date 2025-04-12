import style from './style.module.scss';
import { Recipe, Divisions } from '../../../public/type';

type Props = {
	index: number;
	item: {
		divisions?: Divisions[number];
		image: Recipe['foodImageUrl']
		title: Recipe['recipeTitle'];
		time: Recipe['recipeIndication'];
		price: Recipe['recipeCost'];
	}
	handleClick: (index: number) => void;
};

export default function RecipeCassette(props: Props) {
	if (!props.item) return;

	return (
		<button
			onClick={() => props.handleClick(props.index)}
			className={style.wrapper}
		>
			<div
				className={style.image}
				style={{backgroundImage: `url(${props.item.image})`}}
			></div>
			<div className={style.textWrapper}>
				<div className={style.header}>
					{props.item.divisions ?
						<div className={style.division}>
							{props.item.divisions}のレシピ
						</div>
					: ''}
					<div className={style.time}>
						{props.item.time}
					</div>
					<div className={style.price}>
						{props.item.price}
					</div>
				</div>
				<p className={style.title}>
					{props.item.title}
				</p>
			</div>
		</button>
	)
}
