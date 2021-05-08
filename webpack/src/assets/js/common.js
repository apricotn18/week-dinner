import RakutenRecipeAPI from "./modules/_RakutenRecipeAPI.js";
import Modal from "./modules/_Modal.js";

const rakutenRecipeAPI = new RakutenRecipeAPI({
	recipeClassName: '.js-recipe',
	imageClassName: '.js-recipe_image',
	timeClassName: '.js-recipe_time',
	priceClassName: '.js-recipe_price',
	titleClassName: '.js-recipe_title',
});
const modal = new Modal({
	$modal: $('.js-modal'),
	$modalRecipe: $('.js-modal_recipe'),
	$modalMenu: $('.js-modal_menu'),
});

// トップ画面
if ($('.js-recipe').length > 0) {
	rakutenRecipeAPI.init();

	$(document)
		// レシピ更新ボタン
		.on('click', '.js-recipe_update_button', (e) => {
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
		})
		// レシピボタン
		.on('click', '.js-modal_recipe_button', (e) => {
			modal.show('recipe');
			rakutenRecipeAPI.updateModalContents({
				num: $(e.target).closest('.js-recipe').data('date-num'),
				$modalSubTitle: $('.js-modal_sub_title'),
				$modalImage: $('.js-modal_image'),
				$modalTime: $('.js-modal_time'),
				$modalPrice: $('.js-modal_price'),
				$modalTitle: $('.js-modal_title'),
				$modalText: $('.js-modal_text'),
				$modalLink: $('.js-modal_link'),
				$modalMaterial: $('.js-modal_material'),
			});
		});
}

// ランキング画面
if ($('.js-rank_button').length > 0) {
	console.log('ランキング');
}

// モーダル
$(document)
	// メニューボタン
	.on('click', '.js-modal_menu_button', (e) => {
		modal.show('menu');
	})
	// レシピクローズボタン
	.on('click', '.js-modal_recipe_close', (e) => {
		modal.hide('recipe');
	})
	// メニュークローズボタン
	.on('click', '.js-modal_menu_close', (e) => {
		modal.hide('menu');
	});
