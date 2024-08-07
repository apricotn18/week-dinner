import { useState, useCallback, useEffect } from "react";
import RecipeWrapperButtonComponent from "./component/RecipeWrapperButton/RecipeWrapperButtonComp";
import RecipeCassetteComponent from "./component/RecipeCassette/RecipeCassetteComp";
import RecipeModalComponent from "./component/RecipeModal/RecipeModalComp";
import { Recipe } from "../assets/type";

type Props = {
	recipe: Recipe[];
}

const IndexComponent = ({ recipe }: Props) => {
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
						<RecipeWrapperButtonComponent
							index={i}
							handleModalClick={handleModalClick}
						>
							<RecipeCassetteComponent
								item={item}
								index={i}
							/>
						</RecipeWrapperButtonComponent>
					</li>
				))}
			</ul>
			<RecipeModalComponent
				item={recipe[currentIndex]}
				isOpen={isOpen}
				handleModalClick={handleModalClick}
			/>
		</>
	)
};

export default IndexComponent;