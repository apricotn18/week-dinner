import { useState, useEffect } from 'react';
import RakutenRecipe from '../api/rakutenRecipe';
import { Category } from '../types';

const rakutenRecipe = new RakutenRecipe();

export function useCategory (): [
	category: Category[],
	getCategoryRecipe: (id: string) => Category[]
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

	const getCategoryRecipe = (id: string) => {
		const shouldFetch = category.some((item) => {
			if (item.categoryId === id) {
				return !item['recipes'];
			};
		});

		if (shouldFetch && rakutenRecipe) {
			rakutenRecipe.fetchRanking(id).then((result) => {
				if (result) {
					const nextCategory = [...category];
					nextCategory.map((item) => {
						if (item.categoryId === id) {
							item['recipes'] = result;
						}
					});
					setCategory(nextCategory);
				}
			});
		}

		return category;
	}

	return [category, getCategoryRecipe]
};
