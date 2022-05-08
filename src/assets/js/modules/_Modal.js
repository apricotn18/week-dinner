const ACTIVE_CLASS = 'is-active';

/**
 * モーダル
 *
 */
class Modal {
	constructor (options) {
		this.$modal = $('.' + options.triggerSelector);
		this.$close = $('.' + options.triggerSelector + '_close');
	}
	/**
	 * 初期表示
	 *
	 * @return {void}
	*/
	init () {
		this.$close.on('click', () => {
			this.close();
		});
	}
	/**
	 * モーダルを表示
	 *
	 * @return {void}
	*/
	toggle () {
		this.$modal.toggleClass(ACTIVE_CLASS);
	}
	/**
	 * モーダル開く
	 *
	 * @return {void}
	*/
	open () {
		this.$modal.addClass(ACTIVE_CLASS);
	}
	/**
	 * モーダルを閉じる
	 *
	 * @return {void}
	*/
	close () {
		this.$modal.removeClass(ACTIVE_CLASS);
	}
}

export default Modal;