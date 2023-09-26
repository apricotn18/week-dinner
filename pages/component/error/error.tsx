import React, { useState, useEffect } from 'react';
import style from "./error.module.scss";

type Props = {
	isError: boolean;
}

export default function Error(props: Props) {
	useEffect(() => {
		if (props.isError) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}, [props.isError]);

	return (
		<div className={style.modal} style={{display: props.isError ? 'block' : 'none'}}>
			<div className={style.modal_wrapper}>
				<div className={style.modal_content}>
					読み込みに失敗しました<br />
					通信状況を確認してください
				</div>
			</div>
		</div>
	)
}
