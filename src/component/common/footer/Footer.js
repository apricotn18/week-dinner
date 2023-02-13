import React from 'react';
import "./footer.scss";

export default function Footer () {
	return (
		<footer className="footer">
			<div className="footer-wrapper">
				<p><small className="footer-text">&copy;{new Date().getFullYear()} KYOKO NOZAKI</small></p>
				<p className="footer-text">
					<a href="https://webservice.rakuten.co.jp/" target="_blank">
						Supported by Rakuten Developers
					</a>
				</p>
			</div>
		</footer>
	)
}