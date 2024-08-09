import { useState, useEffect } from "react";
import CassetteButtonComponent from "./component/CassetteButton/CassetteButtonComp";
import ModalComponent from "./component/Modal/ModalComp";
import RecipeComponent from "./component/Recipe/RecipeComp";
import { Recipe } from "../assets/type";

type Props = {
	recipe: Recipe[];
}

const IndexComponent = ({ recipe }: Props) => {
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : '';
	}, [isOpen]);

	return (
		<>
			<ul>
				{recipe.map((item: Recipe, i: number) => (
					<li key={i}>
						<CassetteButtonComponent
							index={i}
							setCurrentIndex={setCurrentIndex}
							openModal={() => setIsOpen(true)}
						>
							<RecipeComponent
								index={i}
								item={item}
								insert={'cassette'}
							/>
						</CassetteButtonComponent>
					</li>
				))}
			</ul>
			<ModalComponent
				title={recipe[currentIndex].recipeTitle}
				isOpen={isOpen}
				closeModal={() => setIsOpen(false)}
			>
				<RecipeComponent
					index={currentIndex}
					item={recipe[currentIndex]}
					insert={'modal'}
				/>
			</ModalComponent>
		</>
	)
};

export default IndexComponent;