import Header from '../components/Header';
import Footer from '../components/Footer';
import RecipeSwapList from '../components/RecipeSwapList';
import { useRecipe } from '../hooks/useRecipe';
import { useDivisions } from '../hooks/useDivisions';
import { Recipe } from '../types';
import style from './change.module.scss';

export default function Change() {
	const [recipe, setRecipe] = useRecipe();
	const [divisions] = useDivisions();

	const handleSwap = (targetIndex: number, newRecipe: Recipe) => {
		const next = [...recipe];
		next[targetIndex] = newRecipe;
		setRecipe(next);

		const storage = localStorage.getItem('week-dinner');
		if (storage) {
			try {
				const data = JSON.parse(storage);
				data.recipe[targetIndex] = newRecipe;
				localStorage.setItem('week-dinner', JSON.stringify(data));
			} catch {
				// localStorageが壊れていた場合は無視
			}
		}
	};

	return (
		<>
			<Header></Header>
			<main>
				<section className="wrapper">
					<p className={style.lead}>入れ替えたいレシピを選んでください</p>
					<RecipeSwapList
						recipe={recipe}
						divisions={divisions}
						onSwap={handleSwap}
					/>
				</section>
			</main>
			<Footer></Footer>
		</>
	)
}
