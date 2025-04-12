import { useState, useEffect } from 'react';
import RakutenRecipe from '../api/rakutenRecipe';
import { Recipe } from '../public/type';

const rakutenRecipe = new RakutenRecipe();

export function useRanking (): [
	ranking: Recipe[],
	setRanking: React.Dispatch<React.SetStateAction<Recipe[]>>
] {
	const [ranking, setRanking] = useState<Recipe[]>([]);

	useEffect(() => {
		let ignore = false;
		if (rakutenRecipe) {
			rakutenRecipe.getRanking(30).then((result) => {
				if (result && !ignore) {
					console.log(result);
					// setRanking(result);
				}
			});
		}

		return () => {
			ignore = true;
		};
	}, []);

	return [ranking, setRanking]
};
