import React from 'react';

const ACTIVE_CLASS = 'is-active';

export default function MenuModal (props) {
	const closeModal = () => {
		$('body').css('overflow', '');
		$('.' + props.modalClass).removeClass(ACTIVE_CLASS);
	}

	return (
		<div className={'modal ' + props.modalClass}>
			<div className="modal-bg js-modal_menu_close modal-bg--blank" onClick={closeModal}></div>
			<div className="modal-menu_wrapper">
				<div className="modal_menu">
					<ul className="modal_menu-list">
						<li className="modal_menu-item">
							<a href="/" className="modal_menu-link modal_menu-link--top">トップ</a>
						</li>
						<li className="modal_menu-item">
							<a href="" className="modal_menu-link modal_menu-link--buy">お買い物リスト</a>
						</li>
						<li className="modal_menu-item">
							<a href="" className="modal_menu-link modal_menu-link--rank">ランキングからレシピ登録</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
