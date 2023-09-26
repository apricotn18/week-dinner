/**
 * 楽天レシピAPIのデータを取得するクラス
 *
 * @param {object} options.data
 */
export default class RakutenRecipeAPI {
	constructor() {
		// カテゴリID一覧
		this.categoryIdList = [30, 31, 32, 14, 15, 16, 23, 41, 42, 43, 44, 25, 46, 47, 48];
	}

	/**
	 * 初期表示
	 * @return {Promise}
	*/
	initFetch () {
		const oldData = JSON.parse(localStorage.getItem('week-dinner')) || {};
		const date = new Date();
		const today = [date.getFullYear(), date.getMonth(), date.getDate()];
		let newRecipe = [];

		if (oldData.date) {
			const CALC_DATE = 1000 * 60 * 60 * 24;
			const originalDate = new Date(...(oldData.date)); // ローカルストレージから日付を生成
			const newDate = new Date(...today); // 今日
			const elapsedDays = Math.floor((newDate - originalDate) / CALC_DATE);
			// 経過日数分のレシピを削除
			newRecipe = oldData.recipe.slice(elapsedDays);
		}

		// 新しいレシピを取得
		return new Promise((resolve, reject) => {
			if (newRecipe.length > 6) {
				return resolve(newRecipe);
			}

			let array = [];
			this.ajax()
				.then((res) => {
					array = res;
					// 短時間に複数回通信するとエラーとなるので少し時間を空ける
					return this.sleep(1000);
				}).then(() => {
					return this.ajax();
				}).then((res) => {
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
	 * @return {Promise}
	*/
	fetch (index) {
		const data = JSON.parse(localStorage.getItem('week-dinner')) || {};
		const newRecipe = data.recipe;

		return new Promise((resolve, reject) => {
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
	 * @return {Promise}
	*/
	ajax (id) {
		const param = {
			format: 'json',
			// idがない場合、ランダムなカテゴリIDを返却
			categoryId: id ? id : this.categoryIdList[this.getRandomNum(this.categoryIdList.length)],
			applicationId: '1099641121016352250',
		};
		const query = new URLSearchParams(param).toString();
		const requestUrl = 'https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?' + query;

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
	getRandomNum (maxNumber) {
		return Math.floor(Math.random() * maxNumber);
	}

	/**
	 * 最大値のうちランダムな整数を返す
	 * @param {number} ms 待つ時間
	 * @return {Promise}
	*/
	sleep (ms) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, ms);
		});
	}
}
