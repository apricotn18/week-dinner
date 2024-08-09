import { memo, useRef } from "react";
import style from "./cassetteButton.module.scss";

type Props = {
	index: number;
	setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
	openModal: () => void;
	children: React.ReactNode;
};

const CassetteButtonComponent = memo(({ index, setCurrentIndex, openModal, children }: Props) => {
	const ref = useRef<HTMLButtonElement>(null!);
	const handleClick = () => {
		setCurrentIndex(index);
		openModal();
	};

	return (
		<button
			type="button"
			ref={ref}
			className={style.wrapper}
			onClick={handleClick}
		>
			{children}
		</button>
	)
});

export default CassetteButtonComponent;