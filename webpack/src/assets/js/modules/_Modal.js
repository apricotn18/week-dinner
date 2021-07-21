const ACTIVE_CLASS = 'is-active';

/**
 * モーダル
 *
 */
class Modal {
	constructor (options) {
		this.$modal = $('.' + options.trrigerSelecter);
		this.$button = $('.' + options.trrigerSelecter + '_button');
		this.$close = $('.' + options.trrigerSelecter + '_close');
	}
	/**
	 * イベント
	 *
	 * @return {void}
	*/
	bind () {
		this.$button.on('click', () => {
			this.$modal.toggleClass(ACTIVE_CLASS);
		});
		this.$close.on('click', () => {
			this.$modal.removeClass(ACTIVE_CLASS);
		});
	}
}

export default Modal;