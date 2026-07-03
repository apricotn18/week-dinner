export type Recipe = {
	recipeTitle?: string;
	recipeCost?: string;
	recipeDescription?: string;
	recipeIndication?: string;
	recipeUrl?: string;
	foodImageUrl?: string;
	recipeMaterial?: string[];
}

export type Category = {
	categoryId?: string;
	categoryName?: string;
	recipes?: Recipe[];
}

export type Divisions = ['今日', '明日', '明後日', '3日後', '4日後', '5日後', '6日後'];
