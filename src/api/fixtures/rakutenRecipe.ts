import { Recipe, Category } from '../../types';

const APPLICATION_ID = '1099641121016352250';
const CATEGORY_RANKING_URL = 'https://openapi.rakuten.co.jp/recipems/api/Recipe/CategoryRanking/20170426';
const CATEGORY_LIST_URL = 'https://openapi.rakuten.co.jp/recipems/api/Recipe/CategoryList/20170426';
const FIXTURE = process.env.NEXT_PUBLIC_SAMPLE_DATA ? JSON.parse(process.env.NEXT_PUBLIC_SAMPLE_DATA) : null;

type Data = {
	date: [number, number, number];
	recipe: Recipe[];
}

function isStorageData(value: unknown): value is Data {
	if (typeof value !== 'object' || value === null) return false;
	const data = value as { date?: unknown; recipe?: unknown };

	return (
		Array.isArray(data.date) &&
		data.date.length === 3 &&
		data.date.every((n) => typeof n === 'number') &&
		Array.isArray(data.recipe)
	);
}

/**
 * 楽天レシピAPI
 */
class RakutenRecipe {
	categoryIdList: string[];

	constructor() {
		// カテゴリID一覧
		this.categoryIdList = ['30', '31', '32', '14', '15', '16', '23', '41', '42', '43', '44', '25', '46', '47', '48'];
	}

	/**
	 * 初期表示
	 * @return {Promise} Recipe
	*/
	async init (): Promise<Recipe[]> {
		const storage: string | null = localStorage.getItem('week-dinner');
		let prevData: Data | null = null;

		if (storage !== null) {
			try {
				const parsed: unknown = JSON.parse(storage);
				if (isStorageData(parsed)) {
					prevData = parsed;
				}
			} catch {
				prevData = null;
			}
		}

		const date = new Date();
		const today: [number, number, number] = [date.getFullYear(), date.getMonth(), date.getDate()];
		let nextRecipe: Recipe[] = [];

		if (prevData) {
			const CALC_DATE = 1000 * 60 * 60 * 24;
			// ローカルストレージから日付を生成
			const originalDate = new Date(...prevData.date).getTime();
			const nextDate = new Date(...today).getTime(); // 今日
			const elapsedDays = Math.floor((nextDate - originalDate) / CALC_DATE);
			// 経過日数分のレシピを削除
			nextRecipe = prevData.recipe.slice(elapsedDays);
		}

		if (nextRecipe.length > 6) {
			return nextRecipe;
		}

		const categoryId1 = this.categoryIdList[this.getRandomNum(this.categoryIdList.length)];
		const categoryId2 = this.categoryIdList[this.getRandomNum(this.categoryIdList.length)];

		const firstResult = await this.fetchRanking(categoryId1);
		// 短時間に複数回通信するとエラーとなるので少し時間を空ける
		await this.sleep(1000);
		const secondResult = await this.fetchRanking(categoryId2);

		for (const item of firstResult.concat(secondResult)) {
			if (nextRecipe.length > 6) break;
			nextRecipe.push(item);
		}

		localStorage.setItem('week-dinner', JSON.stringify({
			date: today,
			recipe: nextRecipe,
		}));

		return nextRecipe;
	}

	/**
	 * カテゴリ別ランキング 取得
	 * @param {string} id
	 * @return {Promise} Recipe
	*/
	async fetchRanking (id: string): Promise<Recipe[]> {
		const param: Record<string, string> = {
			format: 'json',
			categoryId: id,
			applicationId: APPLICATION_ID,
		};
		const query = new URLSearchParams(param);

		try {
			const response = await fetch(`${CATEGORY_RANKING_URL}?${query.toString()}`);

			if (!response.ok) {
				throw new Error(`楽天レシピランキングの取得に失敗しました (status: ${response.status})`);
			}

			const data = await response.json();
			return data.result as Recipe[];
		} catch {
			const all = FIXTURE.result as Recipe[];
			const shuffled = [...all].sort(() => Math.random() - 0.5);
			return shuffled.slice(0, 8);
		}
	}

	async getCategory (): Promise<Category[]> {
		const param: Record<string, string> = {
			format: 'json',
			categoryType: 'large',
			applicationId: APPLICATION_ID,
		};
		const query = new URLSearchParams(param);

		try {
			const response = await fetch(`${CATEGORY_LIST_URL}?${query.toString()}`);

			if (!response.ok) {
				throw new Error(`楽天レシピカテゴリの取得に失敗しました (status: ${response.status})`);
			}

			const data = await response.json();
			return data.result.large as Category[];
		} catch {
			return [];
		}
	}

	/**
	 * 最大値のうちランダムな整数を返す
	 * @param {number} maxNumber 最大値
	 * @return {number} ランダム数字
	*/
	getRandomNum (maxNumber: number): number {
		return Math.floor(Math.random() * maxNumber);
	}

	/**
	 * 指定時間待機する
	 * @param {number} ms 待つ時間
	 * @return {Promise} void
	*/
	sleep (ms: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, ms);
		});
	}
}

export default RakutenRecipe;
