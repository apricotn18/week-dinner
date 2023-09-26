import { Recipe } from "./type";

type Data = {
	date: [number, number, number];
	recipe: Recipe[];
}

/**
 * 日付区分
 */
export const division = ["今日","明日","明後日","3日後","4日後","5日後","6日後"];

/**
 * 楽天レシピAPIのデータを取得するクラス
 */
export class RakutenRecipeAPI {
	categoryIdList: number[];

	constructor() {
		// カテゴリID一覧
		this.categoryIdList = [30, 31, 32, 14, 15, 16, 23, 41, 42, 43, 44, 25, 46, 47, 48];
	}

	/**
	 * 初期表示
	 * @return {Promise} Recipe
	*/
	init (): Promise<Recipe[]|null> {
		return new Promise((resolve, reject) => {
			const storage: string|null = localStorage.getItem('week-dinner');
			const oldData: Data = storage !== null ? JSON.parse(storage) : {};
			const date = new Date();
			const today: [number, number, number] = [date.getFullYear(), date.getMonth(), date.getDate()];
			let newRecipe: Recipe[] = [];

			if (oldData.date) {
				const CALC_DATE = 1000 * 60 * 60 * 24;
				const originalDate: number = new Date(...(oldData.date)).getTime(); // ローカルストレージから日付を生成
				const newDate: number = new Date(...today).getTime(); // 今日
				const elapsedDays = Math.floor((newDate - originalDate) / CALC_DATE);
				// 経過日数分のレシピを削除
				newRecipe = oldData.recipe.slice(elapsedDays);
			}

			// 新しいレシピを取得
			if (newRecipe.length > 6) {
				return resolve(newRecipe);
			}

			let array: Recipe[] = [];
			this.ajax()
				.then((res) => {
					array = res;
					// 短時間に複数回通信するとエラーとなるので少し時間を空ける
					return this.sleep(1000);
				}).then(() => {
					return this.ajax();
				}).then((res: Recipe[]) => {
					array = array.concat(res);
					array.map((item) => {
						if (newRecipe.length > 6) return false;
						newRecipe.push(item);
					});

					localStorage.setItem('week-dinner', JSON.stringify({
						date: today,
						recipe: newRecipe,
					}));
					resolve(newRecipe);
				}).catch(() => {
					reject();
				});
		});
	}

	/**
	 * 非同期でランダムなレシピを1つ取得
	 * 更新ボタンclick
	 * @param {number} index
	 * @return {Promise} Recipe
	*/
	fetch (index: number): Promise<Recipe[]> {
		return new Promise((resolve, reject) => {
			const storage: string|null = localStorage.getItem('week-dinner');
			if (storage === null) {
				reject(null);
				return;
			}

			const data: Data = JSON.parse(storage);
			const newRecipe = data.recipe;

			this.ajax()
				.then((res) => {
					newRecipe[index] = res[this.getRandomNum(4)];
					data.recipe = newRecipe;

					localStorage.setItem('week-dinner', JSON.stringify(data));
					resolve(newRecipe);
				}).catch(() => {
					reject();
				});
		});
	}

	/**
	 * レシピ非同期通信
	 * @param {string|undefined} id
	 * @return {Promise} Recipe
	*/
	ajax (id?: number): Promise<Recipe[]> {
		const param: {
			format: 'json',
			categoryId: number,
			applicationId: '1099641121016352250',
		} = {
			format: 'json',
			// idがない場合、ランダムなカテゴリIDを返却
			categoryId: id ? id : this.categoryIdList[this.getRandomNum(this.categoryIdList.length)],
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
