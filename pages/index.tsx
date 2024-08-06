import { useState, useEffect } from 'react';
import RecipeCassette from "./component/RecipeCassette/RecipeCassetteComp";
import RecipeModal from "./component/RecipeModal/RecipeModalComp";
import { RakutenRecipeAPI } from "../assets/js/common";
import { Recipe } from "../assets/js/type";

const rakutenRecipeAPI = new RakutenRecipeAPI();

export default function Index () {
	const [recipe, setRecipe] = useState<Recipe[]>([{},{},{},{},{},{},{}]);
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

	const handleModalClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const shouldOpened = !isOpenModal;
		if (shouldOpened) {
			setCurrentIndex(Number(e.currentTarget.dataset.index));
		}
		setIsOpenModal(shouldOpened);
		document.body.style.overflow = shouldOpened ? 'hidden' : '';
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
							handleModalClick={handleModalClick}
						/>
						{/* {item.foodImageUrl && // TODO: ボタン追加
							<div className={style.recipe_update}>
								<button type="button" data-date-num={i}></button>
							</div>
						} */}
					</li>
				))}
			</ul>
			<RecipeModal
				item={recipe[currentIndex]}
				isOpen={isOpenModal}
				handleModalClick={handleModalClick}
			/>
		</>
	)
};