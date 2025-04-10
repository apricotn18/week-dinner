import style from './style.module.scss';

export default function Footer() {
	return (
		<footer className={style.wrapper}>
			<p>
				<small className={style.footer_text}>&copy;{new Date().getFullYear()} KYOKO NOZAKI</small>
			</p>
			<p>
				<a href="https://webservice.rakuten.co.jp/" target="_blank">
					Supported by Rakuten Developers
				</a>
			</p>
		</footer>
	)
}
