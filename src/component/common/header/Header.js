import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./header.scss";

export default function Header () {
	const [modalShow, setModalShow] = useState(false);

	const toggleModal = () => {
		setModalShow(!modalShow);
	};

	return (
		<header className="header">
			<div className="header-wrapper">
				<Link to="/" className="header-img">
					<h1><img src="/assets/img/logo.png" alt="week dinner" /></h1>
				</Link>
				<button className="header-menu_button" onClick={toggleModal}></button>
			</div>

			<div className={modalShow ? 'menu_modal is-open' : 'menu_modal'}>
				<div className="menu_modal-bg" onClick={toggleModal}></div>
				<div className="menu_modal_wrapper">
					<ul className="menu_modal-list">
						<li className="menu_modal-item">
							<Link to="/" className="menu_modal-link">トップ</Link>
						</li>
						<li className="menu_modal-item">
							<Link to="/list" className="menu_modal-link menu_modal-link--buy">お買い物リスト</Link>
						</li>
						<li className="menu_modal-item">
							<Link to="/rank" className="menu_modal-link menu_modal-link--rank">ランキングからレシピ登録</Link>
						</li>
					</ul>
				</div>
			</div>
		</header>
	)
}
