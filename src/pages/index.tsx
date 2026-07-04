import Header from '../components/Header';
import Footer from '../components/Footer';
import WeeklyMenu from '../components/WeeklyMenu';

export default function Index() {
	return (
		<>
			<Header></Header>
			<main>
				<section className="wrapper">
					<WeeklyMenu />
				</section>
			</main>
			<Footer></Footer>
		</>
	)
}
