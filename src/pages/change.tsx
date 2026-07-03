import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ChangeRecipe from '../components/ChangeRecipe/ChangeRecipe';

export default function List() {
	return (
		<>
			<Header></Header>
			<main>
				<section className='wrapper'>
					<ChangeRecipe />
				</section>
			</main>
			<Footer></Footer>
		</>
	)
}