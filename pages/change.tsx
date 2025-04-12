import HeaderComp from './component/Header/HeaderComp';
import FooterComp from './component/Footer/FooterComp';
import ChangeRecipeComp from './component/ChangeRecipe/ChangeRecipeComp';

export default function List() {
	return (
		<>
			<HeaderComp></HeaderComp>
			<main>
				<section className='wrapper'>
					<ChangeRecipeComp />
				</section>
			</main>
			<FooterComp></FooterComp>
		</>
	)
}