import { useState, useEffect } from 'react';
import { useRecipe } from '../../../hooks/useRecipe';
import RecipeItemComp from '../RecipeItem/RecipeItemComp';
import RecipeModalComp from '../RecipeModal/RecipeModalComp';

const divisions = ['今日', '明日', '明後日', '3日後', '4日後', '5日後', '6日後'];

export default function RecipeList() {
	const [modalIndex, setModalIndex] = useState<number>(0);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [recipe, setRecipe] = useRecipe();

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
						<RecipeItemComp
							index={index}
							item={item}
							divisions={divisions[index]}
							handleClick={handleClickItem}
						/>
					</li>
				))}
			</ul>
			<div>
				<RecipeModalComp
					item={recipe[modalIndex]}
					isOpen={isModalOpen}
					setIsOpen={setIsModalOpen}
				/>
			</div>
		</>
	)
}
