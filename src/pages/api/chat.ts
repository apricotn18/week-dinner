import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { Recipe } from '../../types';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).end();

	const { message, currentRecipeTitles } = req.body as {
		message: string;
		currentRecipeTitles: string[];
	};

	const fixture = process.env.NEXT_PUBLIC_SAMPLE_DATA
		? JSON.parse(process.env.NEXT_PUBLIC_SAMPLE_DATA)
		: null;

	if (!fixture) return res.status(500).json({ error: 'レシピデータが見つかりません' });

	const allRecipes: Recipe[] = fixture.result;
	const candidates = allRecipes.filter(r => !currentRecipeTitles.includes(r.recipeTitle ?? ''));
	const candidateList = candidates.map(r => `- ${r.recipeTitle}`).join('\n');

	try {
		const result = await openai.responses.create({
			model: 'gpt-4o-mini',
			store: true,
			input: [
				{
					role: 'system',
					content: `あなたは夕食レシピ提案アシスタントです。以下の候補の中からユーザーのリクエストに最も合うレシピを1つ選び、必ずJSON形式のみで返してください。\n\n【候補レシピ】\n${candidateList}\n\n返答形式（これ以外は含めないこと）:\n{"recipeTitle": "タイトル", "reason": "おすすめ理由（1〜2文）"}`,
				},
				{
					role: 'user',
					content: message,
				},
			],
		} as Parameters<typeof openai.responses.create>[0]);

		const text = (result as { output_text: string }).output_text;
		const match = text.match(/\{[\s\S]*\}/);
		if (!match) throw new Error('JSON not found in response');

		const parsed = JSON.parse(match[0]) as { recipeTitle: string; reason: string };
		const recipe = allRecipes.find(r => r.recipeTitle === parsed.recipeTitle) ?? null;

		return res.status(200).json({ reason: parsed.reason, recipe });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'エラーが発生しました。もう一度お試しください。' });
	}
}
