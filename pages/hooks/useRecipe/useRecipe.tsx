import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import RakutenRecipe from "./RakutenRecipe";
import { Recipe } from "../../../assets/js/type";

const rakutenRecipe = new RakutenRecipe();

export default function useRecipe (): [
	recipe: Recipe[],
	setRecipe: { setRecipe: Dispatch<SetStateAction<Recipe[]>> }
] {
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

	return [recipe, { setRecipe }]
};