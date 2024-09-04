import { useState } from "react";
import { useCategory } from "../hooks/useCategory";
import { useSearchParams } from "next/navigation";
import CarouselComp from "./component/Change/Carousel/CarouselComp";
import CarouselItemComp from "./component/Change/Carousel/CarouselItemComp";
import RakutenRecipe from "../assets/api/rakutenRecipe";
import { Recipe } from "../assets/type";

type Props = {
	recipe: Recipe[];
}

const rakutenRecipe = new RakutenRecipe();

const ChangeComponent = ({ recipe }: Props) => {
	const ID = useSearchParams().get('id');
	const [category] = useCategory();
	const [page, setPage] = useState<0|1>(0);
	const [items, setItems] = useState<Recipe[]>([]);

	const handleClickCategory = (e: React.MouseEvent<HTMLAnchorElement>) => {
		const id = e.currentTarget.dataset.id;
		rakutenRecipe.fetchItems(Number(id))
			.then((result) => {
				if (result) {
					setItems(result);
				}
			})
			.catch(() => {
				alert('レシピの取得に失敗しました');
				setPage(0);
			});
		setPage(1);
	}

	const handleClickBackButton = () => {
		setPage(0);
		setTimeout(() => setItems([]), 300);
	}

	return (
		<div>
			<CarouselComp page={page}>
				<CarouselItemComp>
					<div>
						カテゴリを選択してください
					</div>
					<ul>
						{category && category.map((item, i: number) => (
							<li key={i}>
								<a onClick={handleClickCategory} data-id={item.categoryId}>
									{item.categoryName}
								</a>
							</li>
						))}
					</ul>
				</CarouselItemComp>
				<CarouselItemComp>
					<div>
						<a onClick={handleClickBackButton}>
							＜ 戻る
						</a>
					</div>
					<div>
						レシピを選択してください
					</div>
					<ul>
						{items && items.map((item: Recipe, i: number) => (
							<li key={i}>
								<img src={item.foodImageUrl||''} alt="レシピ画像" />
								{item.recipeTitle}
							</li>
						))}
					</ul>
				</CarouselItemComp>
			</CarouselComp>
		</div>
	);
};

export default ChangeComponent;