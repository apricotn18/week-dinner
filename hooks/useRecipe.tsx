import { useState, useEffect } from "react";
import RakutenRecipe from "../assets/api/rakutenRecipe";
import { Recipe } from "../assets/type";

const rakutenRecipe = new RakutenRecipe();

export const useRecipe = (): [
	recipe: Recipe[],
	// { setRecipe: React.Dispatch<React.SetStateAction<Recipe[]>> }
] => {
	const [recipe, setRecipe] = useState<Recipe[]>([{},{},{},{},{},{},{}]);

	useEffect(() => {
		let ignore = false;
		if (rakutenRecipe) {
			rakutenRecipe.init().then((result) => {
				if (result && !ignore) {
					setRecipe(result);
				}
			});
		}

		return () => {
			ignore = true;
		};
	}, []);

	return [recipe]
};
