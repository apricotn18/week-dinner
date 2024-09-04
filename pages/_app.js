import Header from './component/header/Header';
import Footer from './component/footer/Footer';
import '../assets/css/reset.scss';
import '../assets/css/common.scss';

export default function MyApp({ Component, pageProps }) {
	return (
		<>
			<Header></Header>
			<main>
				<Component {...pageProps} />
			</main>
			<Footer></Footer>
		</>
	);
}
