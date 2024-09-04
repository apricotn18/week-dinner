import React, { useState } from 'react';
import Link from 'next/link';
import image_logo from './logo.png';
import Image from 'next/image';
import style from './header.module.scss';

export default function Header () {
	const [modalShow, setModalShow] = useState(false);
	const [modalStyle, setModalStyle] = useState({display: 'none'});

	const handleModal = {
		close: () => {
			setModalShow(false);
			setModalStyle({display: 'none'});
		},
		toggle: () => {
			setModalShow(!modalShow);
			setModalStyle({display: modalShow ? 'none' : 'block'});
		}
	}

	return (
		<header className={style.header}>
			<div className={style.header_wrapper}>
				<Link href="/" legacyBehavior>
					<a className={style.header_img} onClick={handleModal.close}>
						<h1><Image src={image_logo} width="144" alt="week dinner" /></h1>
					</a>
				</Link>
				<button className={style.header_menuButton} onClick={handleModal.toggle}></button>
			</div>

			<div className={style.modal} style={modalStyle}>
				<div className={style.modal_bg} onClick={handleModal.close}></div>
				<div className={style.modal_wrapper}>
					<ul className={style.modal_list}>
						<li className={style.modal_item}>
							<Link href="/" legacyBehavior>
								<a className={style.modal_link} onClick={handleModal.close}>トップ</a>
							</Link>
						</li>
						<li className={style.modal_item}>
							<Link href="/list" legacyBehavior>
								<a className={style.modal_link} onClick={handleModal.close}>お買い物リスト</a>
							</Link>
						</li>
						<li className={style.modal_item}>
							<Link href="/ranking" legacyBehavior>
								<a className={style.modal_link} onClick={handleModal.close}>ランキングからレシピ登録</a>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</header>
	);
}
