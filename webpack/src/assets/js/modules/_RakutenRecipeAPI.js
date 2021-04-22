/**
 * 楽天レシピAPIのデータを取得するクラス
 *
 */
class RakutenRecepiAPI {
	constructor (options) {
		this.data = JSON.parse(localStorage.getItem('week-dinner')) || {};
		// カテゴリID一覧
		this.categoryIdList = [31, 32, 33, 14, 15, 16, 17, 23, 10, 11, 38, 39, 41, 42, 43, 44, 25, 46];
		// 新しく取得するレシピ数
		this.createNum = 7;
		// エラー回数
		this.errorNum = 0;

		this.$image = $('.' + options.imageClassName);
		this.$time = $('.' + options.timeClassName);
		this.$price = $('.' + options.priceClassName);
		this.$title = $('.' + options.titleClassName);
	}
	/**
	 * 初期表示
	 *
	 * @return
	*/
	init () {
		if ((this.data[0] !== undefined)) {
			// 日にちの差分から新しく取得するレシピ数を取得
			this.createNum = this.getDateDifference() > 7 ? 7 : this.getDateDifference();
		}

		if (this.createNum > 0) {
			this.fetchAllRecipe();
		} else {
			// 書き出し
			this.updateCassetteContents();
		}
	}
	/**
	 * 日にちの差分を取得
	 *
	 * @return {Number} 日にちの差分
	*/
	getDateDifference () {
		const CALC_DATE = 1000 * 60 * 60 * 24;
		const newDate = new Date(2021,4,23);
		newDate.setHours(0);
		newDate.setMinutes(0);

		// ローカルストレージの[0]のデータから日付を生成
		const getData = this.data[0]['date'];
		const originalDate = new Date(getData['year'], getData['month'], getData['date']);
		// セットされていた日付と今日の差分を求める
		const dateDifference = Math.floor((newDate - originalDate) / CALC_DATE);
		return dateDifference;
	}
	/**
	 * 非同期でレシピを7つ取得（ページ読み込み時）
	 *
	 * @return {Promise}
	*/
	fetchAllRecipe () {
		return new Promise((resolve, _reject) => {
			// ランダムなカテゴリIDをセットしてJSON取得
			$.getJSON(this.setURL({isSetId: true}), (result) => {
				if (!result) this.displayErrorMessage();

				// レシピが1度に4つまでしか取得できないため、2回目のajax通信を行う
				// 短時間に複数回通信するとエラーとなるので少し時間を空ける
				setTimeout(() => {
					$.getJSON(this.setURL({isSetId: true}), (result2) => {
						if (!result2) this.displayErrorMessage();

						const recipeData = this.integratedAcquiredData({
							sourceData: result.result,
							integrateData: result2.result
						});
						this.setLocalStorage(recipeData);
						this.updateCassetteContents();
						resolve();
					});
				}, 1000);
			}).catch(() => {
				this.displayErrorMessage();
			});
		});
	}
	/**
	 * ローカルストレージにデータをセット
	 *
	 * @param {Array} dataList 取得したレシピリスト
	 * @return
	*/
	setLocalStorage (dataList) {
		let num = this.createNum;
		let newDate = new Date();
		// 1日前の日付に変更（あとで1日ずつ足していくため）
		newDate.setDate(newDate.getDate() - 1);

		for (let i = 0; i < dataList.length; i++) {
			// セットする日付に更新
			newDate.setDate(newDate.getDate() + 1);

			if (i + num < 6) {
				// 差分が6未満なら、データを移行
				this.data[i] = this.data[i + num + 1];
			} else {
				// 差分が6以上なら、新しくデータをセット
				this.data[i] = {
					recipe: dataList[i],
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
	 * 非同期でランダムなレシピを1つ取得
	 *
	 * @param {Number} 日にち区分
	 * @return {Promise}
	*/
	fetchRandomRecipe ({dateNumber}) {
		return new Promise(() => {
			// カテゴリIDをセットしてJSON取得
			$.getJSON(this.setURL({isSetId: true}), (result) => {
				// 日にち区分を指定してローカルストレージに保存
				this.updateLocalStorageSpecifiedDate({
					data: result.result[this.setRandomNum(4)],
					dateNumber,
				});
				this.updateCassetteContents();
			}).catch(() => {
				alert('通信エラーが発生しました。再度お試しください。');
			});
		});
	}
	/**
	 * 日にち区分を指定してローカルストレージに保存
	 *
	 * @return {void}
	*/
	updateLocalStorageSpecifiedDate ({data, dateNumber}) {
		this.data[dateNumber]['recipe'] = data;
		localStorage.setItem('week-dinner', JSON.stringify(this.data));
	}
	/**
	 * エラーメッセージを出す（3回以上でアラート）
	 *
	 * @return {object}
	*/
	displayErrorMessage () {
		if (this.errorNum > 2) {
			alert('通信状況を確認してください。');
			this.errorNum = 0;
		} else if (confirm('読み込みに失敗しました。再試行しますか？')) {
			// 短時間に複数回通信するとエラーとなるので少し時間を空ける
			setTimeout(() => {
				this.fetchAllRecipe();
				this.errorNum++;
			}, 1000);
		}
	}
	/**
	 * 1回目に取得したデータに、2回目に取得したデータを統合する
	 *
	 * @param {object} sourceData 1回目に取得したデータ
	 * @param {object} integrateData 2回目に取得したデータ
	 * @return {object} レシピ一覧
	*/
	integratedAcquiredData ({sourceData, integrateData}) {
		sourceData[4] = integrateData[0];
		sourceData[5] = integrateData[1];
		sourceData[6] = integrateData[2];
		return sourceData;
	}
	/**
	 * URLを生成
	 *
	 * @param {boolean} isSetId カテゴリIDをセットするか
	 * @return {string} URL
	*/
	setURL ({isSetId}) {
		let url = 'https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?';
		// カテゴリIDが必要だったらセット
		const params = {
			format: 'json',
			categoryId: isSetId ? this.setRandomCategoryId() : null,
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
	 * ランダムのカテゴリIDを返却
	 *
	 * @return {Number} カテゴリID
	*/
	setRandomCategoryId () {
		return this.categoryIdList[this.setRandomNum(this.categoryIdList.length)];
	}
	/**
	 * 最大値のうちランダムな整数を返す
	 *
	 * @param {Number} maxNumber 最大値
	 * @return {Number} ランダム数字
	*/
	setRandomNum (maxNumber) {
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
			const $target = $(`.js-recipe[data-date-num="${i}"]`);

			// 画像
			$target.find('.js-recipe_image').attr('style', `background-image:url(${recipeData.foodImageUrl});`);
			// 時間
			$target.find('.js-recipe_time').text(recipeData.recipeIndication);
			// 金額
			$target.find('.js-recipe_price').text(recipeData.recipeCost);
			// タイトル
			$target.find('.js-recipe_title').text(recipeData.recipeTitle);
		}
	}
	/**
	 * モーダルのデータを更新
	 *
	 * @param {object} $currentTarget $(e.target)
	 * @param {void} recipeClassName 'js-recipe'
	 * @return {void}
	*/
	updateModalContents ({$currentTarget, recipeClassName}) {
		// 日にち区分の数字を取得
		const num = $currentTarget.closest('.' + recipeClassName).data('date-num');

		const recipeData = this.data[num].recipe;
		const $target = $('.js-modal_recipe');
		const division = ['今日', '明日', '明後日', '3日後', '4日後', '5日後', '6日後'];

		// 日にち区分
		$('.js-modal_sub_title').text(`${division[num]}のレシピ`);
		// 画像
		$target.find('.js-modal_image').attr('src', recipeData.foodImageUrl).attr('alt', recipeData.recipeTitle);
		// 時間
		$target.find('.js-modal_time').text(recipeData.recipeIndication);
		// 金額
		$target.find('.js-modal_price').text(recipeData.recipeCost);
		// タイトル
		$target.find('.js-modal_title').text(recipeData.recipeTitle);
		// 説明
		$target.find('.js-modal_text').text(recipeData.recipeDescription);
		// リンク
		$target.find('.js-modal_link').attr('href', recipeData.recipeUrl);
		// 材料
		const $material = $target.find('.js-modal_material');
		for (var i = 0; i < recipeData.recipeMaterial.length; i++) {
			const insertHtml = `
				<tr><td>${recipeData.recipeMaterial[i]}</td></tr>
			`;
			$material.append(insertHtml);
		}
	}
}

export default RakutenRecepiAPI;