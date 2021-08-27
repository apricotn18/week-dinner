import RecipeAPI from "./modules/_RecipeAPI.js";
import Modal from "./modules/_Modal.js";

// レシピAPI
const recipeAPI = new RecipeAPI({triggerSelector: 'js-recipe'});
// レシピモーダル
const recipeModal = new Modal({triggerSelector: 'js-modal_recipe'});
recipeModal.init();
// ページメニューモーダル
const menuModal = new Modal({triggerSelector:'js-modal_menu'});
menuModal.init();
// ランキングモーダル
const rankModal = new Modal({triggerSelector:'js-modal_rank'});
rankModal.init();

// controller
$('.js-modal_menu_button').on('click', () => {
	menuModal.toggle();
});


// トップ画面
if ($('.js-recipe').length > 0) {
	recipeAPI.init();

	// レシピ更新ボタン
	$('.js-recipe_update_button').on('click', (e) => {
		// ダブルクリック回避
		$(e.target).addClass('is-disabled');

		const $target = $(e.target).closest('.js-recipe');
		recipeAPI.fetchRandomRecipe({
			dateNumber: Number.parseInt($target.attr('data-date-num')),
		});

		// 短時間に複数回通信するとエラーとなるので少し時間を空ける
		setTimeout(() => {
			// ダブルクリック回避のためのスタイルを削除
			$(e.target).removeClass('is-disabled');
		}, 1000);
	});

	// レシピボタン
	$('.js-modal_recipe_button').on('click', (e) => {
		// モーダルを開く度にトップに戻す
		$('.js-modal_recipe_content').animate({scrollTop: 0});

		// モーダルのデータ更新
		const num = $(e.target).closest('.js-recipe').data('date-num');
		const recipeData = recipeAPI.getData(num);
		const division = ['今日', '明日', '明後日', '3日後', '4日後', '5日後', '6日後'];
		const triggerSelector = '.js-modal';

		const $modalSubTitle = $(triggerSelector + '_sub_title');
		const $modalImage = $(triggerSelector + '_image');
		const $modalTime = $(triggerSelector + '_time');
		const $modalPrice = $(triggerSelector + '_price');
		const $modalTitle = $(triggerSelector + '_title');
		const $modalText = $(triggerSelector + '_text');
		const $modalLink = $(triggerSelector + '_link');
		const $modalMaterial = $(triggerSelector + '_material');

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

		recipeModal.open();
	});
}

// ランキング画面
if ($('.js-rank').length > 0) {
	$('.js-modal_rank_button').on('click', (e) => {
		// モーダルを開く度にトップに戻す
		$('.js-modal_rank_content').animate({scrollTop: 0});

		const id = $(e.target).attr('data-id');
		const title = $(e.target).text();
		$('.js-modal_rank_title').text(title);

		recipeAPI.ajaxRecipe(id).then((data) => {
			// モーダルのデータ更新
			for (const index in data) {
				const $target = $('.js-ranking').eq(index);
				const recipeData = data[index];

				const triggerSelector = '.js-ranking';
				const $modalImage = $target.find(triggerSelector + '_image');
				const $modalTime = $target.find(triggerSelector + '_time');
				const $modalPrice = $target.find(triggerSelector + '_price');
				const $modalTitle = $target.find(triggerSelector + '_title');
				const $modalLink = $target.find(triggerSelector + '_link');

				// 画像
				$modalImage.attr('src', recipeData.foodImageUrl).attr('alt', recipeData.recipeTitle);
				// 時間
				$modalTime.text(recipeData.recipeIndication);
				// 金額
				$modalPrice.text(recipeData.recipeCost);
				// タイトル
				$modalTitle.text(recipeData.recipeTitle);
				// リンク
				$modalLink.attr('href', recipeData.recipeUrl);
			}

			rankModal.open();
		}).catch(() => {
			alert('通信エラーが発生しました。再度お試しください。');
		});
	});
}
