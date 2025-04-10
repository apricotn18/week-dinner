import HeaderComp from './component/Header/HeaderComp';
import FooterComp from './component/Footer/FooterComp';
import RecipeListComp from './component/RecipeList/RecipeComp';

export default function Index() {
	return (
		<>
			<HeaderComp></HeaderComp>
			<main>
				<section className="wrapper">
					<RecipeListComp />
				</section>
			</main>
			<FooterComp></FooterComp>
		</>
	)
}