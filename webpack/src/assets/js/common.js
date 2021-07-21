import RakutenRecipeAPI from "./modules/_RakutenRecipeAPI.js";
import Modal from "./modules/_Modal.js";

// レシピAPI
const rakutenRecipeAPI = new RakutenRecipeAPI({trrigerSelecter: 'js-recipe'});
// レシピモーダル
const recipeModal = new Modal({trrigerSelecter: 'js-modal_recipe'});
recipeModal.bind();
// ページメニューモーダル
const menuModal = new Modal({trrigerSelecter:'js-modal_menu'});
menuModal.bind();
// ランキングモーダル
const rankModal = new Modal({trrigerSelecter:'js-modal_rank'});
rankModal.bind();

// トップ画面
if ($('.js-recipe').length > 0) {
	rakutenRecipeAPI.init();

	// レシピ更新ボタン
	$('.js-recipe_update_button').on('click', (e) => {
		// ダブルクリック回避
		$(e.target).addClass('is-disabled');

		const $target = $(e.target).closest('.js-recipe');
		rakutenRecipeAPI.fetchRandomRecipe({
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
		$('.js-modal_recipe_content').scrollTop(0);

		rakutenRecipeAPI.updateModalContents({
			num: $(e.target).closest('.js-recipe').data('date-num'),
			trrigerSelecter: 'js-modal',
		});
	});
}
