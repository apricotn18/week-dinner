import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import IndexRecipe from '../components/IndexRecipe/IndexRecipe';

export default function Index() {
	return (
		<>
			<Header></Header>
			<main>
				<section className="wrapper">
					<IndexRecipe />
				</section>
			</main>
			<Footer></Footer>
		</>
	)
}