import { useState } from 'react';
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
	const [detailItem, setDetailItem] = useState<Recipe | undefined>(undefined);

	const prevItem = props.recipe[index];
	const nextItem = props.nextItem;

	const handleSwap = () => {
		if (!nextItem) return;
		props.onSwap(index, nextItem);
		props.setItem(null);
	};

	return (
		<>
			<div className={style.wrapper}>
				<button
					type="button"
					className={style.backdrop}
					onClick={() => props.setItem(null)}
				/>
				<div className={style.modal}>
					<div className={style.modalHeader}>
						<span className={style.modalTitle}>レシピを入れ替える</span>
						<button
							type="button"
							className={style.closeButton}
							onClick={() => props.setItem(null)}
						/>
					</div>

					<div className={style.body}>
						<button
							type="button"
							className={style.nextCard}
							onClick={() => setDetailItem(nextItem)}
						>
							{nextItem?.foodImageUrl && (
								<div
									className={style.nextThumb}
									style={{ backgroundImage: `url(${nextItem.foodImageUrl})` }}
								/>
							)}
							<div className={style.nextInfo}>
								<div className={style.titleRow}>
									<span className={style.title}>{nextItem?.recipeTitle}</span>
								</div>
								<div className={style.meta}>
									{nextItem?.recipeIndication && (
										<span className={style.metaItem}>⏱ {nextItem.recipeIndication}</span>
									)}
									{nextItem?.recipeCost && (
										<span className={style.metaItem}>¥ {nextItem.recipeCost}</span>
									)}
								</div>
							</div>
						</button>

						{/* 曜日ピル */}
						<p className={style.sectionLabel}>入れ替えるレシピ</p>
						<div className={style.pills}>
							{props.divisions.map((label, i) => (
								<button
									key={i}
									type="button"
									className={`${style.pill} ${i === index ? style.pillActive : ''}`}
									onClick={() => setIndex(i)}
								>
									{label}
								</button>
							))}
						</div>
						<p className={style.sectionLabel}>現在のレシピ</p>
						<button
							type="button"
							className={style.currentRow}
							onClick={() => setDetailItem(prevItem)}
						>
							{prevItem?.foodImageUrl && (
								<div
									className={style.currentThumb}
									style={{ backgroundImage: `url(${prevItem.foodImageUrl})` }}
								/>
							)}
							<span className={style.currentTitle}>{prevItem?.recipeTitle}</span>
						</button>

						<button
							type="button"
							className={style.swapButton}
							onClick={handleSwap}
						>
							登録する
						</button>
					</div>
				</div>
			</div>

			<RecipeDetailModal
				item={detailItem}
				isOpen={!!detailItem}
				setIsOpen={(open) => { if (!open) setDetailItem(undefined); }}
			/>
		</>
	);
}
