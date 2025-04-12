import { useEffect, useRef } from 'react';
import RecipeDetailComp from '../RecipeDetail/RecipeDetailComp';
import style from './style.module.scss';
import { Recipe } from '../../../public/type';

type Props = {
	item?: Recipe;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FullModal(props: Props) {
	const ref = useRef<HTMLDivElement>(null!);
	const recipe = props.item || {
		recipeTitle: '',
		recipeCost: '',
		recipeDescription: '',
		recipeIndication: '',
		recipeUrl: '',
		foodImageUrl: '',
		recipeMaterial: [],
	};

	useEffect(() => {
		ref.current.style.height = window.innerHeight + 'px';
	}, [props.isOpen]);

	useEffect(() => {
		ref.current.scrollTo(0, 0);
	}, [props.item]);

	return (
		<div className={`${style.wrapper} ${props.isOpen && style.isOpen}`}>
			<div className={style.background}></div>
			<div className={style.inner} ref={ref}>
				<div className={style.header}>
					<p className={style.title}>
						{recipe.recipeTitle}
					</p>
					<button
						className={style.close_button}
						onClick={() => props.setIsOpen(false)}
					></button>
				</div>
				<div>
					<RecipeDetailComp item={recipe} />
				</div>
			</div>
		</div>
	)
}
