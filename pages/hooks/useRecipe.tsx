import { useState, useEffect } from 'react';
import RakutenRecipe from '../api/rakutenRecipe';
import { Recipe } from '../../public/type';

const rakutenRecipe = new RakutenRecipe();

export const divisions = ['今日', '明日', '明後日', '3日後', '4日後', '5日後', '6日後'];

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
