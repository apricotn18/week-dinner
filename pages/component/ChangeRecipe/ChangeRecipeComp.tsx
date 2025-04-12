import { useState, useEffect } from 'react';
import { useRecipe } from '../../../hooks/useRecipe';
import { useRanking } from '../../../hooks/useRanking';
import { useCategory } from '../../../hooks/useCategory';
import { useDivisions } from '../../../hooks/useDivisions';
import RecipeCassetteComp from '../RecipeCassette/RecipeCassetteComp';
import FullModalComp from '../FullModal/FullModalComp';

export default function ChangeRecipe() {
	const [modalIndex, setModalIndex] = useState<number>(0);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [recipe, setRecipe] = useRecipe();
	// const [ranking, setRanking] = useRanking();
	const [category] = useCategory();
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
				{category.map((item, index) => (
					<li key={item.categoryId}>
						<button
							onClick={() => console.log(item.categoryId)}
						>
							{item.categoryName}
						</button>
					</li>
				))}
			</ul>
		</>
	)
}
