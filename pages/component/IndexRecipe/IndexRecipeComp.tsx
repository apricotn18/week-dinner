import { useState, useEffect } from 'react';
import { useRecipe } from '../../../hooks/useRecipe';
import { useDivisions } from '../../../hooks/useDivisions';
import RecipeCassetteComp from '../RecipeCassette/RecipeCassetteComp';
import FullModalComp from '../FullModal/FullModalComp';

export default function IndexRecipe() {
	const [modalIndex, setModalIndex] = useState<number>(0);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [recipe, setRecipe] = useRecipe();
	const [divisions] = useDivisions();

	const handleClickItem = (index: number) => {
		setModalIndex(index);
		setIsModalOpen(true);
	};

	useEffect(() => {
		document.body.style.overflow = isModalOpen ? 'hidden' : '';
	}, [isModalOpen]);

	return (
		<>
			<ul>
				{recipe.map((item, index) => (
					<li key={index}>
						<RecipeCassetteComp
							index={index}
							item={{
								divisions: divisions[index],
								image: item.foodImageUrl,
								title: item.recipeTitle,
								time: item.recipeIndication,
								price: item.recipeCost,
							}}
							handleClick={handleClickItem}
						/>
					</li>
				))}
			</ul>
			<div>
				<FullModalComp
					item={recipe[modalIndex]}
					isOpen={isModalOpen}
					setIsOpen={setIsModalOpen}
				/>
			</div>
		</>
	)
}
