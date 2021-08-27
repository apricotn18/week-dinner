/**
 * 楽天レシピAPIのデータを取得するクラス
 *
 * @param {string} options.triggerSelector
 */
class RakutenRecipeAPI {
	constructor (options) {
		this.data = JSON.parse(localStorage.getItem('week-dinner')) || {};
		// カテゴリID一覧
		this.categoryIdList = [30, 31, 32, 14, 15, 16, 23, 41, 42, 43, 44, 25, 46, 47, 48];
		// 初期表示のエラー回数
		this.initErrorNum = 0;

		this.recipeClassName = '.' + options.triggerSelector;
		this.imageClassName = '.' + options.triggerSelector + '_image';
		this.$image = $(this.imageClassName);
		this.timeClassName = '.' + options.triggerSelector + '_time'
		this.$time = $(this.timeClassName);
		this.priceClassName = '.' + options.triggerSelector + '_price'
		this.$price = $(this.priceClassName);
		this.titleClassName = '.' + options.triggerSelector + '_title'
		this.$title = $(this.titleClassName);
	}
	/**
	 * 初期表示
	 *
	 * @return
	*/
	init () {
		/**
		 * 日にちの差分を取得
		 *
		 * @return {number} 日にちの差分
		*/
		const getDateDifference = () => {
			const CALC_DATE = 1000 * 60 * 60 * 24;
			const newDate = new Date();
			newDate.setHours(0);
			newDate.setMinutes(0);

			// ローカルストレージの[0]のデータから日付を生成
			const getData = this.data[0]['date'];
			const originalDate = new Date(getData['year'], getData['month'], getData['date']);
			// セットされていた日付と今日の差分を求める
			const dateDifference = Math.floor((newDate - originalDate) / CALC_DATE);
			return dateDifference;
		}

		// 取得したいレシピ数
		let getNum = 7;
		if ((this.data[0] !== undefined)) {
			// 日にちの差分
			const date = getDateDifference();
			getNum = date > 7 ? 7 : date;
		}

		if (getNum > 0) {
			// レシピ取得
			this.getRecipe(getNum);
		} else {
			// 書き出し
			this.updateCassetteContents();
		}
	}
	/**
	 * レシピを取得して書き出し
	 *
	 * @param {number} getNum 取得したいレシピ数
	 * @return {Promise}
	*/
	getRecipe (getNum) {
		/**
		 * ローカルストレージにデータをセット
		 *
		 * @param {Array} options.dataList 取得したレシピリスト
		 * @param {string} options.getNum 取得したいレシピ数
		 * @return {void}
		*/
		const setLocalStorage = (options) => {
			let newDate = new Date();
			// 1日前の日付に変更（あとで1日ずつ足していくため）
			newDate.setDate(newDate.getDate() - 1);

			for (let i = 0; i < options.dataList.length; i++) {
				// セットする日付に更新
				newDate.setDate(newDate.getDate() + 1);

				if (i + options.getNum < 7) {
					// 差分が6未満なら、データを移行
					this.data[i] = this.data[i + options.getNum];
				} else {
					// 差分が6以上なら、新しくデータをセット
					this.data[i] = {
						recipe: options.dataList[i],
						date: {
							year: newDate.getFullYear(),
							month: newDate.getMonth(),
							date: newDate.getDate(),
						}
					}
				}
			}
			localStorage.setItem('week-dinner', JSON.stringify(this.data));
		}
		/**
		 * エラーメッセージを出す
		 *
		 * @return {void}
		*/
		const displayErrorMessage = () => {
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

		const dataList = [];
		this.ajaxRecipe().then((data1) => {
			dataList.push(...data1);
			// 1回の通信で4つのレシピしか取得できない
			// 短時間に複数回通信するとエラーとなるので少し時間を空ける
			setTimeout(() => {
				this.ajaxRecipe().then((data2) => {
					dataList.push(...data2);
					// データ更新
					setLocalStorage({dataList, getNum});
					// 書き出し
					this.updateCassetteContents();
				})
				.catch(() => {
					displayErrorMessage();
				});
			}, 1000);
		})
		.catch(() => {
			displayErrorMessage();
		});
	}
	/**
	 * レシピ非同期通信
	 *
	 * @param {string} id
	 * @return {Promise}
	*/
	ajaxRecipe (id) {
		return new Promise((resolve, reject) => {
			// ランダムなカテゴリIDをセットしてJSON取得
			$.getJSON(this.setURL(id), (result) => {
				if (result) {
					resolve(result.result);
				} else {
					reject();
				}
			}).catch(() => {
				reject();
			});
		});
	}
	/**
	 * 非同期でランダムなレシピを1つ取得
	 * 更新ボタンclick
	 *
	 * @param {number} 日にち区分
	 * @return {Promise}
	*/
	fetchRandomRecipe (options) {
		/**
		 * 日にち区分を指定してローカルストレージに保存
		 *
		 * @param {Object} options.data レシピ
		 * @param {number} options.dateNumber 日にち区分
		 * @return {void}
		*/
		const updateLocalStorageSpecifiedDate = (options) => {
			this.data[options.dateNumber]['recipe'] = options.data;
			localStorage.setItem('week-dinner', JSON.stringify(this.data));
		}

		return new Promise(() => {
			// カテゴリIDをセットしてJSON取得
			this.ajaxRecipe().then((data) => {
				// 日にち区分を指定してローカルストレージに保存
				updateLocalStorageSpecifiedDate({
					data: data[this.getRandomNum(4)],
					dateNumber: options.dateNumber,
				});
				this.updateCassetteContents();
			}).catch(() => {
				alert('通信エラーが発生しました。再度お試しください。');
			});
		});
	}
	/**
	 * API取得用のURLを生成
	 *
	 * @param {string} id
	 * @return {string} URL
	*/
	setURL (id) {
		/**
		 * ランダムのカテゴリIDを返却
		 *
		 * @return {number} カテゴリID
		*/
		const setRandomCategoryId = () => {
			return this.categoryIdList[this.getRandomNum(this.categoryIdList.length)];
		}
		let url = 'https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?';
		// カテゴリIDが必要だったらセット
		const params = {
			format: 'json',
			categoryId: id ? id : setRandomCategoryId(),
			applicationId: '1099641121016352250',
		}
		// URL生成
		for (const param in params) {
			const str = param !== null ? `${param}=${params[param]}&` : '';
			url += str;
		}
		return url;
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
	/**
	 * カセットのデータを更新
	 *
	 * @return {void}
	*/
	updateCassetteContents () {
		for (let i = 0; i < 7; i++) {
			const recipeData = this.data[i].recipe;
			const $target = $(`${this.recipeClassName}[data-date-num="${i}"]`);

			// 画像
			$target.find(this.imageClassName).attr('style', `background-image:url(${recipeData.foodImageUrl});`);
			// 時間
			$target.find(this.timeClassName).text(recipeData.recipeIndication);
			// 金額
			$target.find(this.priceClassName).text(recipeData.recipeCost);
			// タイトル
			$target.find(this.titleClassName).text(recipeData.recipeTitle);
		}
	}
	/**
	 * レシピのデータを取得
	 *
	 * @return {object} レシピデータ
	*/
	getData (num) {
		return this.data[num].recipe;
	}
}

export default RakutenRecipeAPI;