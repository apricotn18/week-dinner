/**
 * 楽天レシピAPIのデータを取得するクラス
 *
 */
class RakutenRecipeAPI {
	constructor (options) {
		this.data = JSON.parse(localStorage.getItem('week-dinner')) || {};
		// カテゴリID一覧
		this.categoryIdList = [30, 31, 32, 14, 15, 16, 23, 41, 42, 43, 44, 25, 46, 47, 48];
		// 新しく取得するレシピ数
		this.createNum = 7;
		// エラー回数
		this.errorNum = 0;
		// 取得したレシピデータを一時格納
		this.recipeData = [];

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
			// レシピを取得してページ更新
			this.ajaxRecipe().then((data1) => {
				this.recipeData.push(...data1);
				// 短時間に複数回通信するとエラーとなるので少し時間を空ける
				setTimeout(() => {
					this.ajaxRecipe().then((data2) => {
						this.recipeData.push(...data2);
						// 更新
						this.setLocalStorage(this.recipeData);
						this.updateCassetteContents();
					});
				}, 1000);
			})
			.catch(() => {
				this.displayErrorMessage();
			});
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
	 * 非同期でレシピを取得
	 *
	 * @return {Promise}
	*/
	ajaxRecipe () {
		return new Promise((resolve) => {
			// ランダムなカテゴリIDをセットしてJSON取得
			$.getJSON(this.setURL({isSetId: true}), (result) => {
				if (!result) this.displayErrorMessage();
				resolve(result.result);
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
				this.ajaxRecipe();
				this.errorNum++;
			}, 1000);
		}
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
			this.ajaxRecipe().then((data) => {
				// 日にち区分を指定してローカルストレージに保存
				this.updateLocalStorageSpecifiedDate({
					data: data[this.getRandomNum(4)],
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
	 * 非同期でランキング一覧を取得（ランキングページ）
	 *
	 * @param {Number} レシピID
	 * @return {Promise}
	*/
	fetchRecipeRanking ({id}) {
		return new Promise((resolve) => {
			// カテゴリIDをセットしてJSON取得
			$.getJSON(this.setURL({isSetId: true, id}), (result) => {
				resolve(result.result);
			}).catch(() => {
				alert('通信エラーが発生しました。再度お試しください。');
			});
		});
	}

	/**
	 * API取得用のURLを生成
	 *
	 * @param {boolean} isSetId カテゴリIDをセットするか
	 * @return {string} URL
	*/
	setURL ({isSetId, id}) {
		let url = 'https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?';
		// カテゴリIDが必要だったらセット
		const params = {
			format: 'json',
			categoryId: isSetId ? (id ? id : this.setRandomCategoryId()) : null,
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
	/**
	 * ランキングモーダルのデータを更新
	 *
	 * @return {void}
	*/
	updateModalRanking({data, title, $modalRankTitle, $modalItem, modalTitleClassName, modalImageClassName, modalTimeClassName, modalPriceClassName, modalLinkClassName}) {
		// ランキングタイトル
		$modalRankTitle.text(title + 'のランキング');

		for (let i = 0; i < data.length; i++) {
			const rankingData = data[i];
			const $item = $modalItem.eq(i);

			// タイトル
			$item.find(modalTitleClassName).text(rankingData.recipeTitle);
			// 画像
			$item.find(modalImageClassName).attr('src', rankingData.foodImageUrl).attr('alt', rankingData.recipeTitle);
			// 時間
			$item.find(modalTimeClassName).text(rankingData.recipeIndication);
			// 金額
			$item.find(modalPriceClassName).text(rankingData.recipeCost);
			// リンク
			$item.find(modalLinkClassName).attr('href', rankingData.recipeUrl);
		}
	}
}

export default RakutenRecipeAPI;