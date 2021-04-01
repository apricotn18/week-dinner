import RakutenRecipeAPI from "./modules/_RakutenRecipeAPI.js";
import Modal from "./modules/_Modal.js";

const rakutenRecepiAPI = new RakutenRecipeAPI({
	imageClassName: "js-recipe_image",
	timeClassName: "js-recipe_time",
	priceClassName: "js-recipe_price",
	titleClassName: "js-recipe_title",
});
const modal = new Modal({
	$modal: $('.js-modal'),
	$modalRecipe: $('.js-modal_recipe'),
	$modalMenu: $('.js-modal_menu'),
});

if ($('.js-recipe').length > 0) {
	rakutenRecepiAPI.init();

	$(document)
	// レシピ更新ボタン
	.on('click', '.js-recipe_update_button', (e) => {
		// ダブルクリック回避
		$(e.target).css('pointer-events',　'none');

		const $target = $(e.target).closest('.js-recipe');
		rakutenRecepiAPI.updateRandomLecipe({
			dateNumber: $target.attr('data-date-num'),
		});

		// 短時間に複数回通信するとエラーとなるので少し時間を空ける
		setTimeout(() => {
			// ダブルクリック回避のためのスタイルを削除
			$(e.target).css('pointer-events',　'inherit');
		}, 1000);
	})
	// レシピボタン
	.on('click', '.js-modal_recipe_button', (e) => {
		modal.show('recipe');
		rakutenRecepiAPI.updateModalContents({
			$currentTarget: $(e.target),
			recipeClassName: 'js-recipe',
		});
	})
}

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
