import { memo, useEffect } from "react";
import style from "./carousel.module.scss";

type Props = {
	page: 0|1;
	children: React.ReactNode;
};

let width = 0;

const CarouselComponent = memo(({ page, children }: Props) => {
	console.log('CarouselComponent');
	const offset = page === 0 ? 0 : width;

	useEffect(() => {
		width = window.innerWidth;
	}, [])

	return (
		<div className={style.wrapper}>
			<div
				className={style.inner} 
				style={{
					transform: 'translateX(-' + offset + 'px)'
				}}
			>
				{children}
			</div>
		</div>
	)
});

export default CarouselComponent;