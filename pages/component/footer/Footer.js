import React from 'react';
import style from './footer.module.scss';

export default function Footer () {
	return (
		<footer className={style.footer}>
			<div className={style.footer_wrapper}>
				<p><small className={style.footer_text}>&copy;{new Date().getFullYear()} KYOKO NOZAKI</small></p>
				<p className={style.footer_text}>
					<a href="https://webservice.rakuten.co.jp/" target="_blank">
						Supported by Rakuten Developers
					</a>
				</p>
			</div>
		</footer>
	)
}