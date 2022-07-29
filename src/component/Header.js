import React from 'react';
import MenuModal from "./modal/Menu";

const ACTIVE_CLASS = 'is-active';
const MENU_MODAL_CLASS = 'js-modal_menu';

export default function Header () {
	const clickMenu = () => {
		$('body').css('overflow', 'hidden');
		$('.' + MENU_MODAL_CLASS).addClass(ACTIVE_CLASS);
	};

	return (
		<header className="header">
			<div className="header-wrapper">
				<a href="/" className="header-img">
					<h1><img src="/assets/img/logo.png" alt="week dinner" /></h1>
				</a>
				<button className="header-menu_button" onClick={clickMenu}></button>
			</div>

			<MenuModal modalClass={MENU_MODAL_CLASS} />
		</header>
	)
}
