import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import FetchAPI from "./rakutenAPI";
import { Recipe } from "../../../assets/js/type";

const fetchAPI = new FetchAPI();

export default function useRecipe (): [
	recipe: Recipe[],
	setRecipe: { setRecipe: Dispatch<SetStateAction<Recipe[]>> }
] {
	const [recipe, setRecipe] = useState<Recipe[]>([{},{},{},{},{},{},{}]);

	useEffect(() => {
		let ignore = false;
		if (fetchAPI) {
			fetchAPI.init().then((result) => {
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