import React from 'react';
import { Link } from 'react-router-dom';

const ACTIVE_CLASS = 'is-active';

export default function Header () {
	const openModal = () => {
		document.querySelectorAll('body')[0].style.overflow = 'hidden';
		document.querySelectorAll('.js-modal_menu')[0].classList.add(ACTIVE_CLASS);
	};

	const closeModal = () => {
		document.querySelectorAll('body')[0].style.overflow = '';
		document.querySelectorAll('.js-modal_menu')[0].classList.remove(ACTIVE_CLASS);
	}

	return (
		<header className="header">
			<div className="header-wrapper">
				<a href="/" className="header-img">
					<h1><img src="/assets/img/logo.png" alt="week dinner" /></h1>
				</a>
				<button className="header-menu_button" onClick={openModal}></button>
			</div>

			<div className="modal js-modal_menu">
				<div className="modal-bg js-modal_menu_close modal-bg--blank" onClick={closeModal}></div>
				<div className="modal-menu_wrapper">
					<div className="modal_menu">
						<ul className="modal_menu-list">
							<li className="modal_menu-item">
								<Link to="/" className="modal_menu-link">トップ</Link>
							</li>
							<li className="modal_menu-item">
								<Link to="/list" className="modal_menu-link modal_menu-link--buy">お買い物リスト</Link>
							</li>
							<li className="modal_menu-item">
								<Link to="/rank" className="modal_menu-link modal_menu-link--rank">ランキングからレシピ登録</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</header>
	)
}
