import style from './style.module.scss';
import { Recipe } from '../../types';

type Props = {
	item: Recipe;
};

export default function RecipeDetail(props: Props) {
	if (!props.item) return;

	return (
		<>
			<div>
				<img
					className={style.image}
					src={props.item.foodImageUrl}
					alt={props.item.recipeTitle + 'レシピ画像'}
				/>
			</div>
			<div className={style.wrapper}>
				<div className={style.header}>
					<div className={style.time}>
						{props.item.recipeIndication}
					</div>
					<div className={style.price}>
						{props.item.recipeCost}
					</div>
				</div>
				<p className={style.description}>
					{props.item.recipeDescription}
				</p>
				{props.item.recipeMaterial &&
					<table className={style.table}>
						<thead>
							<tr><th>材料</th></tr>
						</thead>
						<tbody>
							{props.item.recipeMaterial.map((material, i: number) => (
								<tr key={i}><td>{material}</td></tr>
							))}
						</tbody>
					</table>
				}
				<div className={style.buttonWrapper}>
					<a
						href={props.item.recipeUrl}
						className={style.button}
						target="_blank"
					>
						詳しいレシピを確認
					</a>
				</div>
			</div>
		</>
	)
}
