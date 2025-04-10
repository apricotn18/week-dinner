import Head from 'next/head';
import '../public/css/reset.scss';
import '../public/css/common.scss';

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
