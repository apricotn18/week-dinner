import { useState, useEffect } from 'react';
import RakutenRecipe from '../../api/fixtures/rakutenRecipe';
import RecipeCard from '../RecipeCard';
import RecipeSwapModal from '../RecipeSwapModal';
import style from './style.module.scss';
import { Recipe, Divisions } from '../../types';

const rakutenRecipe = new RakutenRecipe();

type Props = {
	recipe: Recipe[];
	divisions: Divisions;
	onSwap: (targetIndex: number, newRecipe: Recipe) => void;
};

export default function RecipeSwapList(props: Props) {
	const [rawRecipes, setRawRecipes] = useState<Recipe[]>([]);
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [modalItem, setModalItem] = useState<Recipe | null>(null);

	useEffect(() => {
		const ids = rakutenRecipe.categoryIdList;
		const id1 = ids[Math.floor(Math.random() * ids.length)];
		const id2 = ids[Math.floor(Math.random() * ids.length)];

		Promise.all([
			rakutenRecipe.fetchRanking(id1),
			rakutenRecipe.fetchRanking(id2),
		]).then(([r1, r2]) => {
			setRawRecipes([...r1, ...r2]);
		});
	}, []);

	useEffect(() => {
		const indexIds = new Set(props.recipe.map(r => r.recipeId));
		const seen = new Set<string>();
		const merged = rawRecipes.filter(r => {
			if (seen.has(r.recipeId) || indexIds.has(r.recipeId)) return false;
			seen.add(r.recipeId);
			return true;
		});
		setRecipes(merged);
	}, [rawRecipes, props.recipe]);

	useEffect(() => {
		document.body.style.overflow = !!modalItem ? 'hidden' : '';
	}, [modalItem]);

	return (
		<>
			<ul className={style.list}>
				{recipes.map((item, index) => (
					<li key={index} className={style.cassette}>
						<RecipeCard
							item={{
								image: item.foodImageUrl,
								title: item.recipeTitle,
								time: item.recipeIndication,
								price: item.recipeCost,
							}}
							handleClick={() => setModalItem(item)}
						/>
					</li>
				))}
			</ul>
			{modalItem &&
				<RecipeSwapModal
					recipe={props.recipe}
					divisions={props.divisions}
					nextItem={modalItem}
					setItem={setModalItem}
					onSwap={props.onSwap}
				/>
			}
		</>
	)
}
