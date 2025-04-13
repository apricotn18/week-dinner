import { useState, useEffect } from 'react';
import { useCategory } from '../../../hooks/useCategory';
import AccordionComp from '../Accordion/AccordionComp';
import RecipeCassetteComp from '../RecipeCassette/RecipeCassetteComp';
import ChangeModalComp from '../ChangeModal/ChangeModalomp';
import style from './style.module.scss';
import { Recipe } from '../../../public/type';

export default function ChangeRecipe() {
	const [modalItem, setModalItem] = useState<Recipe | null>(null);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [category, getCategoryRecipe] = useCategory();

	useEffect(() => {
		document.body.style.overflow = !!modalItem ? 'hidden' : '';
	}, [modalItem]);

	return (
		<>
			<ul>
				{category.map((item) => (
					<li key={item.categoryId} className={style.wrapper}>
						<AccordionComp
							style={style.button}
							text={item.categoryName}
							handleClick={async () => {
								if (item.categoryId) {
									setDisabled(true);
									await getCategoryRecipe(item.categoryId);
									setDisabled(false);
								}
							}}
							disabled={disabled}
						>
							{item.recipes ?
								<ul className={style.cassetteList}>
									{item.recipes.map((recipe, index) => (
										<li key={index} className={style.cassette}>
											<RecipeCassetteComp
												item={{
													image: recipe.foodImageUrl,
													title: recipe.recipeTitle,
													time: recipe.recipeIndication,
													price: recipe.recipeCost,
												}}
												handleClick={() => setModalItem(recipe)}
											/>
										</li>
									))}
								</ul>
							: ''}
						</AccordionComp>
					</li>
				))}
			</ul>
			{modalItem ?
				<ChangeModalComp
					nextItem={modalItem}
					setItem={setModalItem}
				/>
			: ''}
		</>
	)
}
