import { useState, useEffect } from 'react';
import RakutenRecipe from '../api/rakutenRecipe';
import { Category } from '../public/type';

const rakutenRecipe = new RakutenRecipe();

export function useCategory (): [
	category: Category[],
] {
	const [category, setCategory] = useState<Category[]>([]);

	useEffect(() => {
		let ignore = false;
		if (rakutenRecipe) {
			rakutenRecipe.getCategory().then((result) => {
				if (result && !ignore) {
					setCategory(result);
				}
			});
		}

		return () => {
			ignore = true;
		};
	}, []);

	return [category]
};
