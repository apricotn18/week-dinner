import { useState, useRef } from 'react';
import RecipeCard from '../RecipeCard';
import RecipeDetailModal from '../RecipeDetailModal';
import style from './style.module.scss';
import { Recipe, Divisions } from '../../types';

type Props = {
	recipe: Recipe[];
	divisions: Divisions;
	nextItem?: Recipe;
	setItem: React.Dispatch<React.SetStateAction<Recipe | null>>;
	onSwap: (targetIndex: number, newRecipe: Recipe) => void;
};

export default function RecipeSwapModal(props: Props) {
	const [index, setIndex] = useState<number>(0);
	const [fullModalItem, setFullModalItem] = useState<Recipe>();
	const [isFullModalOpen, setIsFullModalOpen] = useState<boolean>(false);
	const selectbox = useRef<HTMLSelectElement>(null!);

	const prevItem = props.recipe[index];
	const nextItem = props.nextItem || {
		recipeTitle: '',
		recipeCost: '',
		recipeDescription: '',
		recipeIndication: '',
		recipeUrl: '',
		foodImageUrl: '',
		recipeMaterial: [],
	};

	const handleSwap = () => {
		if (!props.nextItem) return;
		props.onSwap(index, props.nextItem);
		props.setItem(null);
	};

	return (
		<>
			<div className={style.wrapper}>
				<button
					type="button"
					className={style.background}
					onClick={() => props.setItem(null)}
				></button>
				<div className={style.inner}>
					<div className={style.header}>
						<div className={style.selectWrapper}>
							<select
								className={style.select}
								onChange={() => setIndex(parseInt(selectbox.current.value))}
								ref={selectbox}
							>
								{props.divisions.map((item, i) => (
									<option key={i} value={i}>{item}</option>
								))}
							</select>
							のレシピと入れ替え
						</div>
						<div className={style.closeButtonWrapper}>
							<button
								type="button"
								className={style.closeButton}
								onClick={() => props.setItem(null)}
							></button>
						</div>
					</div>
					<div className={style.contents}>
						<div className={style.cassette}>
							<RecipeCard
								item={{
									image: prevItem?.foodImageUrl,
									title: prevItem?.recipeTitle,
									time: prevItem?.recipeIndication,
									price: prevItem?.recipeCost,
								}}
								handleClick={() => {
									setFullModalItem(prevItem);
									setIsFullModalOpen(true);
								}}
							/>
						</div>
						<div className={style.arrow}></div>
						<div className={style.cassette}>
							<RecipeCard
								item={{
									image: nextItem.foodImageUrl,
									title: nextItem.recipeTitle,
									time: nextItem.recipeIndication,
									price: nextItem.recipeCost,
								}}
								handleClick={() => {
									setFullModalItem(nextItem);
									setIsFullModalOpen(true);
								}}
							/>
						</div>
						<div className={style.buttonWrapper}>
							<button
								type="button"
								className={style.button}
								onClick={handleSwap}
							>
								登録する
							</button>
						</div>
					</div>
				</div>
			</div>
			<RecipeDetailModal
				item={fullModalItem}
				isOpen={isFullModalOpen}
				setIsOpen={setIsFullModalOpen}
			/>
		</>
	)
}
