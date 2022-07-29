import React from 'react';

export default function EntryModal () {
	return (
		<div class="modal js-modal_entry">
			<div class="modal-bg js-modal_entry_close"></div>
			<div class="modal_entry">
				<div class="modal_entry-content">
					<form class="js-modal_entry_form">
						<select name="division" class="modal_entry-select">
							<option value="0">今日</option>
							<% for (var i = 1; i < 7; i++) { %>
							<option value=<%- i %>>
								<%- include('./dateDivision.ejs', {dateNum: i}) %>
							</option>
							<% } %>
						</select>
						のレシピに登録しますか？
						<div class="modal_entry-button_wrapper">
							<a href="javascript:void(0);" class="modal_entry-button modal_entry-button--blank js-modal_entry_close">キャンセル</a>
							<a href="javascript:void(0);" class="modal_entry-button js-modal_entry_button">登録</a>
						</div>
					</form>
				</div>
			</div>
		</div>
		<!-- /登録しますか？モーダル -->

		<!-- 通知 -->
		<div class="message js-message"></div>
		<!-- /通知 -->

		<!-- メニュー -->
		<div class="modal js-modal_menu">
			<div class="modal-bg js-modal_menu_close modal-bg--blank"></div>
			<div class="modal-menu_wrapper">
				<div class="modal_menu">
					<ul class="modal_menu-list">
						<li class="modal_menu-item">
							<a href="<%= path %>/index.html" class="modal_menu-link modal_menu-link--top">トップ</a>
						</li>
						<li class="modal_menu-item">
							<a href="<%= path %>/buy.html" class="modal_menu-link modal_menu-link--buy">お買い物リスト</a>
							</li>
						<li class="modal_menu-item">
							<a href="<%= path %>/rank.html" class="modal_menu-link modal_menu-link--rank">ランキングからレシピ登録</a></li>
					</ul>
				</div>
			</div>
		</div> */}
}

export default