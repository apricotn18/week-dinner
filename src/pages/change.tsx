import Header from '../components/Header';
import Footer from '../components/Footer';
import RecipeSwapList from '../components/RecipeSwapList';

export default function List() {
	return (
		<>
			<Header></Header>
			<main>
				<section className='wrapper'>
					<RecipeSwapList />
				</section>
			</main>
			<Footer></Footer>
		</>
	)
}
