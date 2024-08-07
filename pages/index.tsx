import { useState, useCallback, useEffect } from 'react';
import RecipeCassette from "./component/RecipeCassette/RecipeCassetteComp";
import RecipeModal from "./component/RecipeModal/RecipeModalComp";
import useRecipe from "./hooks/useRecipe/useRecipe";
import { Recipe } from "../assets/js/type";

const Index = () => {
	const [recipe] = useRecipe();
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleModalClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const shouldOpen = !isOpen;
		if (shouldOpen) {
			setCurrentIndex(Number(e.currentTarget.dataset.index));
		}
		setIsOpen(shouldOpen);
	}, [isOpen]);

	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : '';
	}, [isOpen]);

	return (
		<>
			<ul>
				{recipe.map((item: Recipe, i: number) => (
					<li key={i}>
						<button
							type="button"
							data-index={i}
							onClick={handleModalClick}
							style={{width: '100%'}}
						>
							<RecipeCassette
								item={item}
								index={i}
							/>
						</button>
					</li>
				))}
			</ul>
			<RecipeModal
				item={recipe[currentIndex]}
				isOpen={isOpen}
				handleModalClick={handleModalClick}
			/>
		</>
	)
};

export default Index;