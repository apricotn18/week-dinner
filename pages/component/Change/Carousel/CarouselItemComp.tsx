import { memo } from "react";
import style from "./carousel.module.scss";

type Props = {
	children: React.ReactNode;
};

const CarouselItemComponent = memo(({ children }: Props) => {
	return (
		<div className={style.item}>
			{children}
		</div>
	)
});

export default CarouselItemComponent;