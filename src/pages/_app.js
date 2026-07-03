import Head from 'next/head';
import '../styles/reset.scss';
import '../styles/common.scss';

export default function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>week-dinner</title>
			</Head>
			<Component {...pageProps} />
		</>
	);
}
