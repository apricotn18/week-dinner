/**
 * 楽天レシピAPIのデータを取得するクラス
 *
 * @param {object} options.data
 */
class RakutenRecipeAPI {
	constructor () {
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
		let numberOfRecipes = 7;
		let newRecipe = [];

		// 取得したいレシピ数を計算
		if (this.data.date) {
			const CALC_DATE = 1000 * 60 * 60 * 24;
			const originalDate = new Date(...(this.data.date)); // ローカルストレージから日付を生成
			const newDate = new Date(...today); // 今日
			// 取得したいレシピ数を更新
			const dateDifference = Math.floor((newDate - originalDate) / CALC_DATE);
			numberOfRecipes = dateDifference > 7 ? 7 : dateDifference;
			// 日にちが過ぎて不要になったレシピを削除
			newRecipe = this.data.recipe.slice(numberOfRecipes);
		}

		// レシピ取得
		return new Promise((resolve, reject) => {
			// 取得したいレシピ数0の場合、処理終了
			if (numberOfRecipes === 0) {
				resolve(newRecipe);
				return;
			}

			this.ajaxRecipe().then((res1) => {
				// 短時間に複数回通信するとエラーとなるので少し時間を空ける
				setTimeout(() => {
					this.ajaxRecipe().then((res2) => {
						// 新しいレシピデータを作成
						let array = res1.concat(res2);
						array.map((item) => {
							if (newRecipe.length > 6) return false;
							newRecipe.push(item);
						})

						// 保存
						const newData = {
							date: today,
							recipe: newRecipe,
						}
						localStorage.setItem('week-dinner', JSON.stringify(newData));
						this.data = newData;

						resolve(newRecipe);
					});
				}, 1000);
			}).catch(() => {
				console.log('失敗');
				// TODO: エラーメッセージを出す
				reject();
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
			xhr.onreadystatechange = function() {
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
			this.ajaxRecipe().then((res) => {
				// 新しいレシピデータを作成
				const newRecipe = this.data.recipe;
				newRecipe[index] = res[this.getRandomNum(4)];

				// 保存
				this.data.recipe = newRecipe;
				localStorage.setItem('week-dinner', JSON.stringify(this.data));

				resolve(newRecipe);
			}).catch(() => {
				console.log('失敗');
				// TODO: エラーメッセージを出す
				reject();
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
}

export default RakutenRecipeAPI;