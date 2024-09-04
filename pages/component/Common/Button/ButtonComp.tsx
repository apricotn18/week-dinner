import Link from "next/link";
import style from "./button.module.scss";

type Props = {
	href: string;
	hasTarget?: boolean;
	children: React.ReactNode;
};

const ButtonComponent = ({ href, hasTarget, children }: Props) => {
	return hasTarget ? (
		// 外部サイト
		<a href={href} className={style.outside} target="_blank">
			{children}
		</a>
	) : (
		// 内部サイト
		<Link href={href} legacyBehavior>
			<a className={style.inside}>
				{children}
			</a>
		</Link>
	)
};

export default ButtonComponent;