/**
 * 楽天レシピAPIのデータを取得するクラス
 *
 */
class RakutenRecipeAPI {
	constructor (options) {
		this.data = JSON.parse(localStorage.getItem('week-dinner')) || {};
		// カテゴリID一覧
		this.categoryIdList = [31, 32, 33, 14, 15, 16, 17, 23, 10, 11, 38, 39, 41, 42, 43, 44, 25, 46];
		// 新しく取得するレシピ数
		this.createNum = 7;
		// エラー回数
		this.errorNum = 0;

		this.recipeClassName = options.recipeClassName
		this.imageClassName = options.imageClassName;
		this.$image = $(this.imageClassName);
		this.timeClassName = options.timeClassName;
		this.$time = $(this.timeClassName);
		this.priceClassName = options.priceClassName;
		this.$price = $(this.priceClassName);
		this.titleClassName = options.titleClassName;
		this.$title = $(this.titleClassName);
	}
	/**
	 * 初期表示
	 *
	 * @return
	*/
	init () {
		if ((this.data[0] !== undefined)) {
			// 日にちの差分から新しく取得するレシピ数を取得
			const date = this.getDateDifference();
			this.createNum = date > 7 ? 7 : date;
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

						// resultデータの統合
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

			if (i + num < 7) {
				// 差分が6未満なら、データを移行
				this.data[i] = this.data[i + num];
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
	 * 非同期でランダムなレシピを1つ取得（更新ボタンclick）
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
					data: result.result[this.getRandomNum(4)],
					dateNumber,
				});
				this.updateCassetteContents();
			}).catch(() => {
				alert('通信エラーが発生しました。再度お試しください。');
			});
		});
	}
	/**
	 * 日にち区分を指定してローカルストレージに保存（更新ボタンclick）
	 *
	 * @return {void}
	*/
	updateLocalStorageSpecifiedDate ({data, dateNumber}) {
		this.data[dateNumber]['recipe'] = data;
		localStorage.setItem('week-dinner', JSON.stringify(this.data));
	}
	/**
	* 非同期でURL登録（URL登録ボタンclick）
	*
	* @param {Number} 日にち区分
	* @return {Promise}
	*/
	fetchURLRank () {
		console.log('ランキング');
	}

	/**
	 * API取得用のURLを生成
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
		return this.categoryIdList[this.getRandomNum(this.categoryIdList.length)];
	}
	/**
	 * 最大値のうちランダムな整数を返す
	 *
	 * @param {Number} maxNumber 最大値
	 * @return {Number} ランダム数字
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

		// カセットの高さを合わせる
		var $title = $(this.titleClassName);
		for (let i = 1; i < $title.length; i++) {
			const $obj1 = $title.eq(i);
			const $obj2 = $title.eq(++i);
			if ($obj1.height() !== $obj2.height()) {
				const num = Math.max($obj1.height(), $obj2.height());
				$obj1.css('height', num + 'px');
				$obj2.css('height', num + 'px');
			}
		}
	}
	/**
	 * モーダルのデータを更新
	 *
	 * @param {number} num
	 * @param {object} $modalSubTitle
	 * @param {object} $modalImage
	 * @param {object} $modalTime
	 * @param {object} $modalPrice
	 * @param {object} $modalTitle
	 * @param {object} $modalText
	 * @param {object} $modalLink
	 * @param {object} $modalMaterial
	 * @return {void}
	*/
	updateModalContents ({num, $modalSubTitle, $modalImage, $modalTime, $modalPrice, $modalTitle, $modalText, $modalLink, $modalMaterial}) {
		const recipeData = this.data[num].recipe;
		const division = ['今日', '明日', '明後日', '3日後', '4日後', '5日後', '6日後'];

		// 日にち区分
		$modalSubTitle.text(`${division[num]}のレシピ`);
		// 画像
		$modalImage.attr('src', recipeData.foodImageUrl).attr('alt', recipeData.recipeTitle);
		// 時間
		$modalTime.text(recipeData.recipeIndication);
		// 金額
		$modalPrice.text(recipeData.recipeCost);
		// タイトル
		$modalTitle.text(recipeData.recipeTitle);
		// 説明
		$modalText.text(recipeData.recipeDescription);
		// リンク
		$modalLink.attr('href', recipeData.recipeUrl);
		// 材料
		for (var i = 0; i < recipeData.recipeMaterial.length; i++) {
			const insertHtml = `
				<tr><td>${recipeData.recipeMaterial[i]}</td></tr>
			`;
			$modalMaterial.append(insertHtml);
		}
	}
}

export default RakutenRecipeAPI;