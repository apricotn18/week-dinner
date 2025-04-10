import HeaderComp from './component/Header/HeaderComp';
import FooterComp from './component/Footer/FooterComp';

export default function List() {
	return (
		<>
			<HeaderComp></HeaderComp>
			<main>
				<section className='wrapper'>
					List
				</section>
			</main>
			<FooterComp></FooterComp>
		</>
	)
}