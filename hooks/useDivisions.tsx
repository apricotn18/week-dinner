import { useState } from 'react';
import { Divisions } from '../public/type';

export function useDivisions (): [
	division: Divisions,
] {
	const [divisions, setDivisions] = useState<Divisions>([
		'今日',
		'明日',
		'明後日',
		'3日後',
		'4日後',
		'5日後',
		'6日後'
	]);

	return [divisions]
};
