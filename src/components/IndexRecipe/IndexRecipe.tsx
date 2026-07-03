import { useState, useEffect } from 'react';
import { useRecipe } from '../../hooks/useRecipe';
import { useDivisions } from '../../hooks/useDivisions';
import RecipeCassette from '../RecipeCassette/RecipeCassette';
import FullModal from '../FullModal/FullModal';
import { Recipe } from '../../types';

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
						<RecipeCassette
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
			<FullModal
				item={modalItem}
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
			/>
		</>
	)
}
