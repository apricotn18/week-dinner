import { useState, useEffect } from 'react';
import RecipeCassette from "./component/RecipeCassette/RecipeCassetteComp";
import RecipeModal from "./component/RecipeModal/RecipeModalComp";
import { RakutenRecipeAPI } from "../assets/js/common";
import { Recipe } from "../assets/js/type";

const rakutenRecipeAPI = new RakutenRecipeAPI();

export default function Index () {
	const [recipe, setRecipe] = useState<Recipe[]>([{},{},{},{},{},{},{}]);
	const [isOpenModal, setIsOpenModal] = useState<boolean>(true);

	const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		setIsOpenModal(!isOpenModal);
		document.body.style.overflow = isOpenModal ? '' : 'hidden';
	}

	useEffect(() => { // TODO: カスタムフックに
		let ignore = false;

		if (rakutenRecipeAPI) {
			rakutenRecipeAPI.init().then((result) => {
				if (result && !ignore) {
					setRecipe(result);
				}
			});
		}

		return () => {
			ignore = true;
		};
	}, []);

	return (
		<>
			<ul>
				{recipe.map((item: Recipe, i: number) => (
					<li key={i}>
						<RecipeCassette
							item={item}
							index={i}
							handleOpenModal={handleOpenModal}
						/>
						{/* {item.foodImageUrl &&
							<div className={style.recipe_update}>
								<button type="button" data-date-num={i}></button>
							</div>
						} */}
					</li>
				))}
			</ul>
			<RecipeModal
				item={recipe[0]}
				isOpen={isOpenModal}
				handleOpenModal={handleOpenModal}
			/>
		</>
	)
};