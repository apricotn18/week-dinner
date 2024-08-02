import { useState, useEffect } from 'react';
import RecipeCassette from "./component/RecipeCassette/RecipeCassetteComp";
import { RakutenRecipeAPI } from "../assets/js/common";
import { Recipe } from "../assets/js/type";

const rakutenRecipeAPI = new RakutenRecipeAPI();

export default function Index () {
	const [recipe, setRecipe] = useState<Recipe[]>([{},{},{},{},{},{},{}]);

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
		<ul>
			{recipe.map((item: Recipe, i: number) => (
				<li key={i}>
					<RecipeCassette item={item} index={i} />
					{/* {item.foodImageUrl &&
						<div className={style.recipe_update}>
							<button type="button" data-date-num={i}></button>
						</div>
					} */}
				</li>
			))}
		</ul>
	)
};