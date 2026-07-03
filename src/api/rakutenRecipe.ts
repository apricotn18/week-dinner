import { Recipe, Category } from '../types';

type Data = {
	date: [number, number, number];
	recipe: Recipe[];
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
	init (): Promise<Recipe[] | null> {
		return new Promise((resolve, reject) => {
			const storage: string|null = localStorage.getItem('week-dinner');
			const prevDate: Data = storage !== null ? JSON.parse(storage) : {};
			const date = new Date();
			const today: [number, number, number] = [date.getFullYear(), date.getMonth(), date.getDate()];
			let nextRecipe: Recipe[] = [];

			if (prevDate.date) {
				const CALC_DATE = 1000 * 60 * 60 * 24;
				const originalDate: number = new Date(...(prevDate.date)).getTime(); // ローカルストレージから日付を生成
				const nextDate: number = new Date(...today).getTime(); // 今日
				const elapsedDays = Math.floor((nextDate - originalDate) / CALC_DATE);
				// 経過日数分のレシピを削除
				nextRecipe = prevDate.recipe.slice(elapsedDays);
			}

			if (nextRecipe.length > 6) {
				return resolve(nextRecipe);
			}

			let array: Recipe[] = [];
			const categoryId1 = this.categoryIdList[this.getRandomNum(this.categoryIdList.length)];
			const categoryId2 = this.categoryIdList[this.getRandomNum(this.categoryIdList.length)];

			this.fetch(categoryId1)
				.then((res) => {
					array = res;
					// 短時間に複数回通信するとエラーとなるので少し時間を空ける
					return this.sleep(1000);
				}).then(() => {
					return this.fetch(categoryId2);
				}).then((res: Recipe[]) => {
					array = array.concat(res);
					array.map((item) => {
						if (nextRecipe.length > 6) return false;
						nextRecipe.push(item);
					});

					localStorage.setItem('week-dinner', JSON.stringify({
						date: today,
						recipe: nextRecipe,
					}));
					resolve(nextRecipe);
				}).catch(() => {
					reject();
				});
		});
	}

	/**
	 * カテゴリ別ランキング 取得
	 * @param {number} id
	 * @return {Promise} Recipe
	*/
	fetch (id: string): Promise<Recipe[]> {
		const param: {} = {
			format: 'json',
			categoryId: id,
			applicationId: '1099641121016352250',
		};
		const query = new URLSearchParams(param);
		const requestUrl = 'https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?' + query.toString();

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', requestUrl);
			xhr.send();
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					resolve(JSON.parse(xhr.response).result);
				}
				if (xhr.status !== 200) {
					reject();
				}
			};
		});
	}

	/**
	 * カテゴリ一覧 取得
	 * @return {Promise} Category
	*/
	getCategory (): Promise<Category[]> {
		const param: {} = {
			format: 'json',
			categoryType: 'large',
			applicationId: '1099641121016352250',
		};
		const query = new URLSearchParams(param);
		const url = 'https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?' + query.toString();

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', url);
			xhr.send();
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					resolve(JSON.parse(xhr.response).result.large);
				}
				if (xhr.status !== 200) {
					reject();
				}
			};
		});
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
	 * 最大値のうちランダムな整数を返す
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