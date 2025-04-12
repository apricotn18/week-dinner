import { useState, useEffect } from 'react';
import { useCategory } from '../../../hooks/useCategory';
import RecipeCassetteComp from '../RecipeCassette/RecipeCassetteComp';
import FullModalComp from '../FullModal/FullModalComp';
import style from './style.module.scss';
import { Recipe } from '../../../public/type';

export default function ChangeRecipe() {
	const [modalItem, setModalItem] = useState<Recipe>();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [category, getCategoryRecipe] = useCategory();

	useEffect(() => {
		document.body.style.overflow = isModalOpen ? 'hidden' : '';
	}, [isModalOpen]);

	return (
		<>
			<ul>
				{category.map((item) => (
					<li key={item.categoryId} className={style.wrapper}>
						<button
							onClick={() => {
								if (item.categoryId) {
									setDisabled(true);
									getCategoryRecipe(item.categoryId);
									setTimeout(() => setDisabled(false), 1000);
								}
							}}
							disabled={disabled}
						>
							{item.categoryName}
						</button>
						{item.recipes ?
							<ul className={style.cassetteWrapper}>
								{item.recipes.map((recipe, index) => (
									<li key={index} className={style.cassette}>
										<RecipeCassetteComp
											item={{
												image: recipe.foodImageUrl,
												title: recipe.recipeTitle,
												time: recipe.recipeIndication,
												price: recipe.recipeCost,
											}}
											handleClick={() => {
												setModalItem(recipe);
												setIsModalOpen(true);
											}}
										/>
									</li>
								))}
							</ul>
						: ''}
					</li>
				))}
			</ul>
			<div>
				<FullModalComp
					item={modalItem}
					isOpen={isModalOpen}
					setIsOpen={setIsModalOpen}
				/>
			</div>
		</>
	)
}
