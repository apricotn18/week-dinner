import { useEffect, useRef } from "react";
import style from "./modal.module.scss";
import { Recipe } from "../../../../assets/type";

type Props = {
	title: Recipe['recipeTitle'];
	isOpen: boolean;
	closeModal: () => void;
	children: React.ReactNode;
};

const ModalComponent = ({ title, isOpen, closeModal, children }: Props) => {
	const ref = useRef<HTMLDivElement>(null!);
	const handleClick = () => {
		closeModal();
	};

	useEffect(() => {
		ref.current.scrollTo(0, 0);
	}, [title]);

	return (
		<div className={`${style.wrapper} ${isOpen && style.isOpen}`}>
			<div className={style.inner} ref={ref}>
				<div className={style.header}>
					<p className={style.title}>{title}</p>
					<button className={style.close_button} onClick={handleClick}></button>
				</div>
				<div>
					{children}
				</div>
			</div>
		</div>
	)
};

export default ModalComponent;