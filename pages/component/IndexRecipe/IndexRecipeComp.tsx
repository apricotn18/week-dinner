import { useState, useEffect } from 'react';
import { useRecipe } from '../../../hooks/useRecipe';
import { useDivisions } from '../../../hooks/useDivisions';
import RecipeCassetteComp from '../RecipeCassette/RecipeCassetteComp';
import FullModalComp from '../FullModal/FullModalComp';
import { Recipe } from '../../../public/type';

export default function IndexRecipe() {
	const [recipe] = useRecipe();
	const [divisions] = useDivisions();
	const [modalItem, setModalItem] = useState<Recipe>();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	useEffect(() => {
		document.body.style.overflow = isModalOpen ? 'hidden' : '';
	}, [isModalOpen]);

	return (
		<>
			<ul>
				{recipe.map((item, index) => (
					<li key={index}>
						<RecipeCassetteComp
							item={{
								divisions: divisions[index],
								image: item.foodImageUrl,
								title: item.recipeTitle,
								time: item.recipeIndication,
								price: item.recipeCost,
							}}
							handleClick={() => {
								setModalItem(item);
								setIsModalOpen(true);
							}}
						/>
					</li>
				))}
			</ul>
			<FullModalComp
				item={modalItem}
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
			/>
		</>
	)
}
