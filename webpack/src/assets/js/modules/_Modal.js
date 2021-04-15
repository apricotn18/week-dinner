const ACTIVE_CLASS = 'is-active';

/**
 * モーダル
 *
 */
class Modal {
	constructor (options) {
		this.$modal = options.$modal;
		this.$modalRecipe = options.$modalRecipe;
		this.$modalMenu = options.$modalMenu;
	}
	/**
	 * モーダル表示
	 *
	 * @param {string} target 'recipe' or 'menu'
	 * @return {void}
	*/
	show (target) {
		if (target === 'recipe') this.$modalRecipe.addClass(ACTIVE_CLASS);
		if (target === 'menu') this.$modalMenu.toggleClass(ACTIVE_CLASS, !this.$modalMenu.hasClass(ACTIVE_CLASS));
		this.$modal.addClass(ACTIVE_CLASS);
	}
	/**
	 * モーダル非表示
	 *
	 * @param {string} target 'recipe' or 'menu'
	 * @return {void}
	*/
	hide (target) {
		if (target === 'recipe') this.$modalRecipe.removeClass(ACTIVE_CLASS);
		if (target === 'menu') this.$modalMenu.removeClass(ACTIVE_CLASS);
		this.$modal.removeClass(ACTIVE_CLASS);
	}
}

export default Modal;