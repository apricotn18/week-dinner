import React, { useState } from 'react';
import image_logo from './logo.png';
import Image from 'next/image';
import './header.scss';

export default function Header () {
	const [modalShow, setModalShow] = useState(false);

	const toggleModal = () => {
		setModalShow(!modalShow);
	};

	return (
		<header className="header">
			<div className="header-wrapper">
				<a href="/" className="header-img">
					<h1><Image src={image_logo} width="178" alt="week dinner" /></h1>
				</a>
				<button className="header-menu_button" onClick={toggleModal}></button>
			</div>

			<div className={modalShow ? 'menu_modal is-open' : 'menu_modal'}>
				<div className="menu_modal-bg" onClick={toggleModal}></div>
				<div className="menu_modal_wrapper">
					<ul className="menu_modal-list">
						<li className="menu_modal-item">
							<a href="/" className="menu_modal-link">トップ</a>
						</li>
						<li className="menu_modal-item">
							<a href="/list" className="menu_modal-link menu_modal-link--buy">お買い物リスト</a>
						</li>
						<li className="menu_modal-item">
							<a href="/ranking" className="menu_modal-link menu_modal-link--rank">ランキングからレシピ登録</a>
						</li>
					</ul>
				</div>
			</div>
		</header>
	);
}
