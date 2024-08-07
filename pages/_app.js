import Header from './component/Header/HeaderComp';
import Footer from './component/Footer/FooterComp';
import '../assets/css/reset.scss';
import '../assets/css/common.scss';

const MyApp = ({ Component, pageProps }) => {
	return (
		<>
			<Header></Header>
			<main>
				<section className="wrapper">
					<Component {...pageProps} />
				</section>
			</main>
			<Footer></Footer>
		</>
	);
}

export default MyApp;