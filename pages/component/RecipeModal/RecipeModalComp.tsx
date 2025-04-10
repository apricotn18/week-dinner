import { useEffect, useRef } from 'react';
import style from './style.module.scss';
import ContentsStyle from './styleContents.module.scss';
import { Recipe } from '../../../public/type';

type Props = {
	item: Recipe;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RecipeModal(props: Props) {
	const ref = useRef<HTMLDivElement>(null!);

	useEffect(() => {
		ref.current.scrollTo(0, 0);
	}, [props.item]);

	return (
		<div className={`${style.wrapper} ${props.isOpen && style.isOpen}`}>
			<div className={style.background}></div>
			<div className={style.inner} ref={ref}>
				<div className={style.header}>
					<p className={style.title}>
						{props.item.recipeTitle}
					</p>
					<button
						className={style.close_button}
						onClick={() => props.setIsOpen(false)}
					></button>
				</div>
				<div>
					<Contents item={props.item} />
				</div>
			</div>
		</div>
	)
}

function Contents({ item }: {
	item: Recipe;
}) {
	const style = ContentsStyle;

	return (
		<>
			<div>
				<img
					className={style.image}
					src={item.foodImageUrl}
					alt={item.recipeTitle + 'レシピ画像'}
				/>
			</div>
			<div className={style.wrapper}>
				<div className={style.header}>
					<p className={style.time}>
						{item.recipeIndication}
					</p>
					<p className={style.price}>
						{item.recipeCost}
					</p>
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
				<div className={style.buttonWrapper}>
					<a
						href={item.recipeUrl}
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
