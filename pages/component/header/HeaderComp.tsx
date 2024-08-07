import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import style from "./header.module.scss";
import image_logo from "./logo.png";

const HeaderComponent = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<header className={style.header}>
			<div className={style.header_wrapper}>
				<Link href="/" legacyBehavior>
					<a
						className={style.header_img}
						onClick={() => setIsOpen(false)}
					>
						<h1><Image src={image_logo} width="144" alt="week dinner" /></h1>
					</a>
				</Link>
				<button
					className={style.header_menuButton}
					onClick={() => setIsOpen(!isOpen)}
				></button>
			</div>

			<div className={style.modal} style={{'display': isOpen ? 'block' : 'none'}}>
				<button type="button"
					className={style.modal_bg}
					onClick={() => setIsOpen(false)}
				></button>
				<div className={style.modal_wrapper}>
					<ul className={style.modal_list}>
						<li id={style.index} className={style.modal_item}>
							<Link href="/" legacyBehavior>
								<a
									className={style.modal_link}
									onClick={() => setIsOpen(false)}
								>トップ</a>
							</Link>
						</li>
						{/* <li id={style.list} className={style.modal_item}>
							<Link href="/list" legacyBehavior>
								<a
									className={style.modal_link}
									onClick={() => setIsOpen(false)}
								>お買い物リスト</a>
							</Link>
						</li> */}
						<li id={style.ranking} className={style.modal_item}>
							<Link href="/ranking" legacyBehavior>
								<a
									className={style.modal_link}
									onClick={() => setIsOpen(false)}
								>ランキングからレシピ登録</a>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</header>
	);
};

export default HeaderComponent;