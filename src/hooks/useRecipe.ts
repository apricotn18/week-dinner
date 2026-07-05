import { useState, useEffect } from 'react';
import RakutenRecipe from '../api/fixtures/rakutenRecipe';
import { Recipe } from '../types';

const rakutenRecipe = new RakutenRecipe();

export function useRecipe (): [
	recipe: Recipe[],
	setRecipe: React.Dispatch<React.SetStateAction<Recipe[]>>
] {
	const [recipe, setRecipe] = useState<Recipe[]>([{}, {}, {}, {}, {}, {}, {}]);

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

	return [recipe, setRecipe]
};
