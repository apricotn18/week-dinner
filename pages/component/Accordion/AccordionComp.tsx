import { useState } from 'react';
import style from './style.module.scss';
import { Category } from '../../../public/type';

type Props = {
	style: any;
	text: Category['categoryName'];
	handleClick: () => void;
	disabled: boolean;
	children: React.ReactNode;
}

export default function Accordion(props: Props) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<>
			<button
				className={`${props.style} ${style.button} ${isOpen && style.isOpen}`}
				onClick={() => {
					props.handleClick();
					setIsOpen(!isOpen);
				}}
				disabled={props.disabled}
			>
				{props.text}
			</button>
			<div className={`${style.wrapper} ${isOpen && style.isOpen}`}>
				{props.children}
			</div>
		</>
	)
}
