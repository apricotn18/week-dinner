import { memo } from "react";
import style from "./RecipeWrapperButton.module.scss";

type Props = {
	index: number;
	handleModalClick: React.MouseEventHandler<HTMLButtonElement>;
	children: React.ReactNode;
};

const RecipeWrapperButtonComponent = memo(({ index, handleModalClick, children }: Props) => {
	return (
		<button
			type="button"
			className={style.wrapper}
			data-index={index}
			onClick={handleModalClick}
		>
			{children}
		</button>
	)
});

export default RecipeWrapperButtonComponent;