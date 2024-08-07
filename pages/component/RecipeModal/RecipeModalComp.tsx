import { memo } from 'react';
import { useEffect, useRef } from 'react';
import style from "./recipeModal.module.scss";
import { Recipe } from "../../../assets/js/type";

type Props = {
	item: Recipe;
	isOpen: boolean;
	handleModalClick: React.MouseEventHandler<HTMLButtonElement>;
};

const recipeModal = memo(({ item, isOpen, handleModalClick }: Props) => {
	const ref = useRef<HTMLDivElement>(null!);
	console.log('recipeModal');

	useEffect(() => {
		ref.current.scrollTo(0, 0);
	}, [item]);

	return (
		<div className={`${style.wrapper} ${isOpen && style.isOpen}`}>
			<div className={style.content} ref={ref}>
				<div className={style.head}>
					<p className={style.title}>{item.recipeTitle}</p>
					<button className={style.close} onClick={handleModalClick}></button>
				</div>
				<div>
					<img className={style.image} src={item.foodImageUrl||''} alt="レシピ画像" />
				</div>
				<div className={style.info}>
					<div className={style.infoHead}>
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
				</div>
				<div className={style.button_wrapper}>
					<a href={item.recipeUrl} className={style.button} target="_blank">
						もっと詳しいレシピを見る
					</a>
				</div>
			</div>
		</div>
	)
});

export default recipeModal;