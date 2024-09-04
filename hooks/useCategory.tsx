import { useState, useEffect } from "react";
import RakutenRecipe from "../assets/api/rakutenRecipe";
import { Category } from "../assets/type";

const rakutenRecipe = new RakutenRecipe();

export const useCategory = (): [
	ranking: Category[],
] => {
	const [category, setCategory] = useState<Category[]>([]);

	useEffect(() => {
		let ignore = false;

		if (rakutenRecipe) {
			rakutenRecipe.fetchCategory().then((result) => {
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
