import Link from 'next/link';
import style from './style.module.scss';

type Props = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const meun: {
	href: string;
	text: string;
}[] = [
	{
		href: '/',
		text: 'トップ',
	},
	{
		href: '/chat',
		text: 'チャットからレシピ変更',
	},
	{
		href: '/change',
		text: 'ランキングからレシピ変更',
	}
];

export default function NavMenu(props: Props) {
	return (
		<div
			className={style.wrapper}
			style={{'display': props.isOpen ? 'block' : 'none'}}
		>
			<button
				type="button"
				className={style.background}
				onClick={() => props.setIsOpen(false)}
			></button>
			<nav className={style.inner}>
				<ul className={style.list}>
					{meun.map((item, index) => (
						<li
							key={index}
							className={style.item}
						>
							<Link href={item.href}>
								<span
									className={style.link}
									onClick={() => props.setIsOpen(false)}
								>
									{item.text}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</div>
	)
}
