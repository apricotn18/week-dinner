import { memo } from "react";
import CassetteComponent from "./Cassette/CassetteComp";
import ModalComponent from "./Modal/ModalComp";
import { Recipe } from "../../../assets/type";

type Props = {
	index: number;
	item: Recipe;
	insert: 'cassette' | 'modal';
};

const RecipeComponent = memo(({ item, index, insert }: Props) => {
	if (!item) {
		return (
			<></>
		);
	} else if (insert === 'cassette') {
		return (
			<CassetteComponent
				index={index}
				item={item}
			/>
		);
	} else if (insert === 'modal') {
		return (
			<ModalComponent
				index={index}
				item={item}
			/>
		);
	}
});

export default RecipeComponent;