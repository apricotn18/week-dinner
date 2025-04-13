import { useState, useEffect, useRef } from 'react';
import { useRecipe } from '../../../hooks/useRecipe';
import { useDivisions } from '../../../hooks/useDivisions';
import RecipeCassetteComp from '../RecipeCassette/RecipeCassetteComp';
import FullModalComp from '../FullModal/FullModalComp';
import style from './style.module.scss';
import { Recipe } from '../../../public/type';

type Props = {
	nextItem?: Recipe;
	setItem: React.Dispatch<React.SetStateAction<Recipe | null>>;
};

export default function ChangeModal(props: Props) {
	const [recipe] = useRecipe();
	const [divisions] = useDivisions();
	const [index, setIndex] = useState<number>(0);
	const [fullModalItem, setFullModalItem] = useState<Recipe>();
	const [isFullModalOpen, setIsFullModalOpen] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null!);
	const selectbox = useRef<HTMLSelectElement>(null!);

	const prevItem = recipe[index];
	const nextItem = props.nextItem || {
		recipeTitle: '',
		recipeCost: '',
		recipeDescription: '',
		recipeIndication: '',
		recipeUrl: '',
		foodImageUrl: '',
		recipeMaterial: [],
	};

	return (
		<>
			<div className={style.wrapper}>
				<button
					type="button"
					className={style.background}
					onClick={() => props.setItem(null)}
				></button>
				<div className={style.inner} ref={ref}>
					<div className={style.header}>
						<div className={style.selectWrapper}>
							<select
								className={style.select}
								onChange={() => setIndex(parseInt(selectbox.current.value))}
								ref={selectbox}
							>
								{divisions.map((item, index) => (
									<option value={index}>{item}</option>
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
							<RecipeCassetteComp
								item={{
									image: prevItem.foodImageUrl,
									title: prevItem.recipeTitle,
									time: prevItem.recipeIndication,
									price: prevItem.recipeCost,
								}}
								handleClick={() => {
									setFullModalItem(prevItem);
									setIsFullModalOpen(true);
								}}
							/>
						</div>
						<div className={style.arrow}></div>
						<div className={style.cassette}>
							<RecipeCassetteComp
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
							>
								登録する
							</button>
						</div>
					</div>
				</div>
			</div>
			<FullModalComp
				item={fullModalItem}
				isOpen={isFullModalOpen}
				setIsOpen={setIsFullModalOpen}
			/>
		</>
	)
}
