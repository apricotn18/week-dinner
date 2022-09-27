/**
 * 楽天レシピAPIのデータを取得するクラス
 *
 * @param {object} options.data
 */
class RakutenRecipeAPI {
	constructor (options) {
		this.data = options.data || [];
		const today = new Date();
		this.today = [today.getFullYear(), today.getMonth(), today.getDate()];
		// カテゴリID一覧
		this.categoryIdList = [30, 31, 32, 14, 15, 16, 23, 41, 42, 43, 44, 25, 46, 47, 48];
		// 初期表示のエラー回数
		this.initErrorNum = 0;
	}
	/**
	 * 初期表示
	 *
	 * @return {Promise}
	*/
	initFetch () {
		return new Promise((resolve, reject) => {
			let numberOfRecipes = 7; // 取得したいレシピ数
			if (this.data.length > 0) {
				const CALC_DATE = 1000 * 60 * 60 * 24;
				const originalDate = new Date(...(this.data[0].date)); // ローカルストレージから今日の日付を生成
				const newDate = new Date(...this.today); // 今日

				// 取得したいレシピ数を更新
				const dateDifference = Math.floor((newDate - originalDate) / CALC_DATE);
				numberOfRecipes = dateDifference > 7 ? 7 : dateDifference;

				// 不要になったデータを削除
				this.data = this.data.slice(numberOfRecipes);
			}

			// レシピ取得
			return this.ajaxRecipe().then((res1) => {
				// 短時間に複数回通信するとエラーとなるので少し時間を空ける
				setTimeout(() => {
					this.ajaxRecipe().then((res2) => {
						let array = res1.concat(res2);
						// TODO: 見直す　ここから↓
						array = array.filter((_, i) => i < numberOfRecipes);

						// 新しいレシピデータを作成
						const originalRecipe = this.data.length > 0 ? this.data.map(item => item.recipe) : [];
						const newRecipe = originalRecipe.concat(array);

						// ローカルストレージに保存
						const today = new Date(...this.today);
						localStorage.setItem('week-dinner', JSON.stringify(
							newRecipe.map((item, index) => {
								return {
									date: [today.getFullYear(), today.getMonth(), today.getDate() + index],
									recipe: item,
								};
							})
						));
						// TODO: 見直す　ここまで↑

						resolve(newRecipe);
					});
				}, 1000);
			}).catch(() => {
				console.log('失敗');
			});
		});
	}
	/**
	 * エラーメッセージを出す
	 * TODO: 直す
	 *
	 * @return {void}
	*/
	displayErrorMessage () {
		if (this.initErrorNum > 2) {
			// エラー3回以上でアラート
			alert('通信状況を確認してください。');
			this.initErrorNum = 0;
		} else if (confirm('読み込みに失敗しました。再試行しますか？')) {
			// 短時間に複数回通信するとエラーとなるので少し時間を空ける
			setTimeout(() => {
				this.getRecipe();
				this.initErrorNum++;
			}, 1000);
		}
	}
	/**
	 * レシピ非同期通信
	 *
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
	 * TODO: 直す
	 *
	 * @param {number} 日にち区分
	 * @return {Promise}
	*/
	fetchRandomRecipe (options) {
		// カテゴリIDをセットしてJSON取得
		this.ajaxRecipe().then((data) => {
			// 日にち区分を指定してローカルストレージに保存
			this.updateLocalStorageSpecifiedDate({
				data: data[this.getRandomNum(4)],
				dateNumber: options.dateNumber,
			});
			this.updateCassetteContents();
		}).catch(() => {
			alert('通信エラーが発生しました。再度お試しください。');
		});
	}
	/**
	 * 日にち区分を指定してローカルストレージに保存
	 *
	 * @param {Object} options.data レシピ
	 * @param {number} options.dateNumber 日にち区分
	 * @return {void}
	*/
	updateLocalStorageSpecifiedDate (options) {
		this.recipe[options.dateNumber]['recipe'] = options.data;
		localStorage.setItem('week-dinner', JSON.stringify(this.recipe));
	}
	/**
	 * 最大値のうちランダムな整数を返す
	 *
	 * @param {number} maxNumber 最大値
	 * @return {number} ランダム数字
	*/
	getRandomNum (maxNumber) {
		return Math.floor(Math.random() * maxNumber);
	}
}

export default RakutenRecipeAPI;