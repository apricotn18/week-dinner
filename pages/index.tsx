import HeaderComp from './component/Header/HeaderComp';
import FooterComp from './component/Footer/FooterComp';
import IndexRecipeComp from './component/IndexRecipe/IndexRecipeComp';

export default function Index() {
	return (
		<>
			<HeaderComp></HeaderComp>
			<main>
				<section className="wrapper">
					<IndexRecipeComp />
				</section>
			</main>
			<FooterComp></FooterComp>
		</>
	)
}