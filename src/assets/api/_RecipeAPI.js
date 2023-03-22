/**
 * 楽天レシピAPIのデータを取得するクラス
 *
 * @param {object} options.data
 */
class RakutenRecipeAPI {
	constructor() {
		this.data = JSON.parse(localStorage.getItem('week-dinner')) || {};
		// カテゴリID一覧
		this.categoryIdList = [30, 31, 32, 14, 15, 16, 23, 41, 42, 43, 44, 25, 46, 47, 48];
	}

	/**
	 * 初期表示
	 * @return {Promise}
	*/
	initFetch () {
		const date = new Date();
		const today = [date.getFullYear(), date.getMonth(), date.getDate()];
		let newRecipe = [];

		// 経過日数分のレシピを削除
		if (this.data.date) {
			const CALC_DATE = 1000 * 60 * 60 * 24;
			const originalDate = new Date(...(this.data.date)); // ローカルストレージから日付を生成
			const newDate = new Date(...today); // 今日
			const elapsedDays = Math.floor((newDate - originalDate) / CALC_DATE);
			newRecipe = this.data.recipe.slice(elapsedDays);
		}

		// 新しいレシピを取得
		return new Promise((resolve, reject) => {
			if (newRecipe.length > 6) {
				return resolve(newRecipe);
			}

			let array = [];
			this.ajaxRecipe()
				.then((res) => {
					array = res;
					// 短時間に複数回通信するとエラーとなるので少し時間を空ける
					return this.sleep(1000);
				}).then(() => {
					return this.ajaxRecipe();
				}).then((res) => {
					array = array.concat(res);
					array.map((item) => {
						if (newRecipe.length > 6) return false;
						newRecipe.push(item);
					});

					const newData = {
						date: today,
						recipe: newRecipe,
					}
					localStorage.setItem('week-dinner', JSON.stringify(newData));
					this.data = newData;

					resolve(newRecipe);
				}).catch(() => {
					reject(this.data.recipe);
				});
		});
	}

	/**
	 * レシピ非同期通信
	 * @param {string|undefined} id
	 * @return {Promise}
	*/
	ajaxRecipe (id) {
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
	 * 非同期でランダムなレシピを1つ取得
	 * 更新ボタンclick
	 * @param {number} index
	 * @return {Promise}
	*/
	fetch (index) {
		return new Promise((resolve, reject) => {
			this.ajaxRecipe()
				.then((res) => {
					const newRecipe = this.data.recipe;
					newRecipe[index] = res[this.getRandomNum(4)];

					this.data.recipe = newRecipe;
					localStorage.setItem('week-dinner', JSON.stringify(this.data));

					resolve(newRecipe);
				}).catch(() => {
					reject(this.data.recipe);
				});
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

export default RakutenRecipeAPI;