const FIXED_CLASS = 'is-fixed';

/**
 * 楽天レシピAPIのデータを取得するクラス
 *
 * @param {string} options.triggerSelector
 */
class MaterialAPI {
	constructor (options) {
		this.recipeData = JSON.parse(localStorage.getItem('week-dinner')) || {};
		this.materialData = JSON.parse(localStorage.getItem('week-dinner-material')) || {};
		this.triggerSelector = options.triggerSelector;
		this.$table = options.$table;
		this.buyListSetting = options.buyListSetting;
	}
	/**
	 * 初期表示
	 *
	 * @return
	*/
	init () {
		const data = [];
		// レシピの日にちに合わせて材料データを上書き
		for (const i in this.recipeData) {
			for (const j in this.materialData) {
				// レシピタイトルが一致しているか
				const matchedTitle = JSON.stringify(this.recipeData[i].recipe.recipeTitle) === JSON.stringify(this.materialData[j].title);
				// 日にちが一致しているか
				const matchedDate = JSON.stringify(this.recipeData[i].date) === JSON.stringify(this.materialData[j].date);
				// 一致してたらコピー
				if (matchedTitle && matchedDate) {
					data[i] = { ...this.materialData[j] };
					break;
				}
			}

			// コピーされず空だったら、材料データをセット
			if (!data[i]) {
				// 材料のオブジェクトを作成
				const material = [];
				for (const j in this.recipeData[i].recipe.recipeMaterial) {
					material[j] = {
						name: this.recipeData[i].recipe.recipeMaterial[j],
						show: 'true',
					}
				};
				// セット
				data[i] = {
					date: JSON.parse(JSON.stringify(this.recipeData[i].date)),
					title: this.recipeData[i].recipe.recipeTitle,
					material,
				};
			}
		}

		// 最新のデータに更新
		this.materialData = data;
		localStorage.setItem('week-dinner-material', JSON.stringify(data));

		// 書き出し
		this.updateTableContents();
	}
	/**
	 * 表示を切り替え
	 *
	 * @return {void}
	*/
	toggleIndex (recipeNum, materialNum) {
		const data = this.materialData;
		const toggleString = data[recipeNum].material[materialNum].show === 'true';
		data[recipeNum].material[materialNum].show = String(!toggleString);
		localStorage.setItem('week-dinner-material', JSON.stringify(data));
	}
	/**
	 * 材料の表示を切り替え
	 *
	 * @return {void}
	*/
	bindScroll () {
		/**
		 * スクロール位置からindex番号を取得
		 *
		 * @return {number} index番号
		*/
		const getHeightNum = () => {
			const scrollTop = $(document).scrollTop();
			if (scrollTop < positions[0]) return null;
			else if (scrollTop < positions[1]) return 0;
			else if (scrollTop < positions[2]) return 1;
			else if (scrollTop < positions[3]) return 2;
			else if (scrollTop < positions[4]) return 3;
			else if (scrollTop < positions[5]) return 4;
			else if (scrollTop < positions[6]) return 5;
			else return 6;
		}

		const $title = $(this.triggerSelector + '_title');
		const $titleItem = $(this.triggerSelector + '_title_item');
		const headerHeight = 44;
		const positions = [];
		for (const item of $title) {
			positions.push($(item).offset().top - headerHeight);
		}

		$(document).on('scroll', () => {
			const num = getHeightNum();
			$titleItem.removeClass(FIXED_CLASS);
			if (num !== null) {
				$titleItem.eq(num).addClass(FIXED_CLASS);
			}
		});
	}
	/**
	 * テーブルのデータを更新
	 *
	 * @return {void}
	*/
	updateTableContents () {
		// 一度リセットする
		this.$table.text('');

		let insertHtml = '';
		const division = ['今日', '明日', '明後日', '3日後', '4日後', '5日後', '6日後'];

		for (const i in this.materialData) {
			const materialDate = this.materialData[i].material;
			insertHtml += `
				<tr>
					<th class="recipe_link js-material_title">
						<a href="javascript:void(0);" class="recipe_link-item js-material_title_item" data-date-num="${i}">
							${division[i]}：${this.materialData[i].title}
						</a>
					</th>
				</tr>
			`;

			for (const j in materialDate) {
				if (materialDate[j].show === this.buyListSetting) {
					insertHtml += `
						<tr>
							<td>
								<div class="buy_list js-material">
									<div class="buy_list-head">
										<div class="form_checkbox">
											<input type="checkbox" id="material${i}_${j}" class="form_line_through js-material_checkbox" data-recipe="${i}" data-material="${j}" />
											<label for="material${i}_${j}">
												${materialDate[j].name}
											</label>
										</div>
									</div>
								</div>
							</td>
						</tr>
					`;
				}
			}
		}
		this.$table.append(insertHtml);
		this.bindScroll();
	}
}

export default MaterialAPI;