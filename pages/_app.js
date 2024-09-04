import { useRecipe } from "../hooks/useRecipe";
import HeaderComponent from "./component/Common/Header/HeaderComp";
import FooterComponent from "./component/Common/Footer/FooterComp";
import "../assets/style/reset.scss";
import "../assets/style/common.scss";

const MyApp = ({ Component, pageProps }) => {
	const [recipe] = useRecipe();

	return (
		<>
			<HeaderComponent></HeaderComponent>
			<main>
				<section className="wrapper">
					<Component {...pageProps} recipe={recipe} />
				</section>
			</main>
			<FooterComponent></FooterComponent>
		</>
	);
}

export default MyApp;