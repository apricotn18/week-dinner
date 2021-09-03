import RecipeAPI from "./modules/_RecipeAPI.js";
import Modal from "./modules/_Modal.js";

const ACTIVE_CLASS = 'is-active';

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
// 登録モーダル
const entryModal = new Modal({triggerSelector:'js-modal_entry'});
entryModal.init();
// 通知
const $message = $('.js-message');

/**
 * 通知を更新して実行
 *
 * @param {string} text 通知する文言
 * @return {void}
*/
const executionMessage = (text) => {
	$message.text(text);
	$message.addClass(ACTIVE_CLASS);
	setTimeout(() => { $message.removeClass(ACTIVE_CLASS); }, 2500);
};
/**
 * モーダルを更新
 *
 * @param {Object} $target
 * @param {string} triggerSelector
 * @param {Object} recipeData レシピデータ
 * @param {Boolean|null} writeMaterial 材料を書くかどうか
 * @return {void}
*/
const updateModal = (options) => {
	const data = options.recipeData;
	const $target = options.$target;
	const $modalImage = $target.find(options.triggerSelector + '_image');
	const $modalTime = $target.find(options.triggerSelector + '_time');
	const $modalPrice = $target.find(options.triggerSelector + '_price');
	const $modalTitle = $target.find(options.triggerSelector + '_title');
	const $modalText = $target.find(options.triggerSelector + '_text');
	const $modalLink = $target.find(options.triggerSelector + '_link');

	// 画像
	$modalImage.attr('src', data.foodImageUrl).attr('alt', data.recipeTitle);
	// 時間
	$modalTime.text(data.recipeIndication);
	// 金額
	$modalPrice.text(data.recipeCost);
	// タイトル
	$modalTitle.text(data.recipeTitle);
	// 説明
	$modalText.text(data.recipeDescription);
	// リンク
	$modalLink.attr('href', data.recipeUrl);
	// 材料
	if (!!options.writeMaterial) {
		const $modalMaterial = $target.find(options.triggerSelector + '_material');
		for (var i = 0; i < data.recipeMaterial.length; i++) {
			const insertHtml = `
				<tr><td>${data.recipeMaterial[i]}</td></tr>
			`;
			$modalMaterial.append(insertHtml);
		}
	}
}

// controller ===========================

$('.js-modal_menu_button').on('click', () => {
	menuModal.toggle();
});

// トップ画面
if ($('.js-recipe').length > 0) {
	recipeAPI.init();

	// レシピ更新ボタンclick
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

	// レシピカセットclick
	$('.js-modal_recipe_button').on('click', (e) => {
		// モーダルを開く度にトップに戻す
		$('.js-modal_recipe_content').animate({scrollTop: 0});
		// モーダルのデータ更新
		const num = $(e.target).closest('.js-recipe').data('date-num');
		updateModal({
			$target: $('.js-modal_recipe_content'),
			triggerSelector: '.js-modal',
			recipeData: recipeAPI.getData(num),
			writeMaterial: true,
		});
		// モーダルを開く
		recipeModal.open();
	});
}

// ランキング画面
if ($('.js-rank').length > 0) {
	// ランキング一覧click
	$('.js-modal_rank_button').on('click', (e) => {
		// ダブルクリック回避
		$(e.target).addClass('is-disabled');
		// モーダルを開く度にトップに戻す
		$('.js-modal_rank_content').animate({scrollTop: 0});

		const id = $(e.target).attr('data-id');
		// モーダルのタイトル更新
		const title = $(e.target).text();
		$('.js-modal_rank_title').text(title);

		recipeAPI.ajaxRecipe(id).then((data) => {
			// モーダルのデータ更新
			for (const index in data) {
				const $target = $('.js-ranking').eq(index);
				const recipeData = data[index];
				updateModal({
					$target,
					triggerSelector: '.js-ranking',
					recipeData,
				});
				$target.find('.js-ranking_data').val(JSON.stringify(recipeData));
			}
		}).then(() => {
			rankModal.open();
		}).catch(() => {
			alert('通信エラーが発生しました。再度お試しください。');
		}).then(() => {
			// ダブルクリック回避のためのスタイルを削除
			$(e.target).removeClass('is-disabled');
		});
	});

	// レシピデータを一時格納
	let recipeDate;

	// ランキングのレシピ登録ボタンclick
	$('.js-ranking_entry').on('click', (e) => {
		const $target = $(e.target).closest('.js-ranking');
		recipeDate = $target.find('.js-ranking_data').val();
		entryModal.open();
	});

	// レシピ登録ボタンclick
	$('.js-modal_entry_button').on('click', () => {
		const dateNumber = $('.js-modal_entry_form')[0].division.value;
		new Promise((resolve) => {
			// ローカルストレージに保存
			recipeAPI.updateLocalStorageSpecifiedDate({
				data: JSON.parse(recipeDate),
				dateNumber,
			});
			resolve();
		}).then(() => {
			executionMessage('レシピを登録しました');
			entryModal.close();
		}).catch((e) => {
			executionMessage('レシピの登録に失敗しました');
		});
	});
}
