const ACTIVE_CLASS = 'is-active';

/**
 * モーダル
 *
 */
class Modal {
	constructor (options) {
		this.$modal = $(options.modalClassName);
	}
	/**
	 * モーダル表示
	 *
	 * @return {void}
	*/
	show () {
		this.$modal.addClass(ACTIVE_CLASS);
	}
	/**
	 * モーダル非表示
	 *
	 * @return {void}
	*/
	hide () {
		this.$modal.removeClass(ACTIVE_CLASS);
	}
}

export default Modal;