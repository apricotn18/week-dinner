import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HeaderMenuComp from '../HeaderMenu/HeaderMenuComp';
import style from './style.module.scss';
import image_logo from './logo.png';

export default function Header() {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<header className={style.wrapper}>
			<div className={style.inner}>
				<Link
					href="/"
					className={style.image}
				>
					<h1>
						<Image
							src={image_logo}
							width={144}
							alt="week dinner"
						/>
					</h1>
				</Link>
				<button
					className={style.button}
					onClick={() => setIsOpen(!isOpen)}
				></button>
			</div>
			<HeaderMenuComp
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			/>
		</header>
	)
}
