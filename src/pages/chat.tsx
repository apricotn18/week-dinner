import { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RecipeSwapModal from '../components/RecipeSwapModal';
import { useRecipe } from '../hooks/useRecipe';
import { useDivisions } from '../hooks/useDivisions';
import { Recipe } from '../types';
import style from './chat.module.scss';

type Message = {
	role: 'user' | 'ai';
	text: string;
	recipe?: Recipe;
};

export default function Chat() {
	const [recipe, setRecipe] = useRecipe();
	const [divisions] = useDivisions();
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [swapTarget, setSwapTarget] = useState<Recipe | null>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, loading]);

	useEffect(() => {
		document.body.style.overflow = swapTarget ? 'hidden' : '';
	}, [swapTarget]);

	const handleSwap = (targetIndex: number, newRecipe: Recipe) => {
		const next = [...recipe];
		next[targetIndex] = newRecipe;
		setRecipe(next);

		const storage = localStorage.getItem('week-dinner');
		if (storage) {
			try {
				const data = JSON.parse(storage);
				data.recipe[targetIndex] = newRecipe;
				localStorage.setItem('week-dinner', JSON.stringify(data));
			} catch {}
		}
	};

	const handleSend = async () => {
		const text = input.trim();
		if (!text || loading) return;

		setMessages(prev => [...prev, { role: 'user', text }]);
		setInput('');
		setLoading(true);

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: text,
					currentRecipeTitles: recipe.map(r => r.recipeTitle ?? ''),
				}),
			});
			const data = await res.json();

			if (data.error) {
				setMessages(prev => [...prev, { role: 'ai', text: data.error }]);
			} else {
				setMessages(prev => [...prev, {
					role: 'ai',
					text: data.reason,
					recipe: data.recipe ?? undefined,
				}]);
			}
		} catch {
			setMessages(prev => [...prev, { role: 'ai', text: 'エラーが発生しました。もう一度お試しください。' }]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Header />
			<main className={style.main}>
				<div className={style.messages}>
					{messages.length === 0 && (
						<p className={style.empty}>どんなレシピにしたいか教えてください</p>
					)}
					{messages.map((msg, i) => (
						<div key={i} className={`${style.bubble} ${msg.role === 'user' ? style.bubbleUser : style.bubbleAi}`}>
							<p className={style.bubbleText}>{msg.text}</p>
							{msg.recipe && (
								<button
									type="button"
									className={style.recipeCard}
									onClick={() => setSwapTarget(msg.recipe!)}
								>
									{msg.recipe.foodImageUrl && (
										<div
											className={style.recipeThumb}
											style={{ backgroundImage: `url(${msg.recipe.foodImageUrl})` }}
										/>
									)}
									<div className={style.recipeInfo}>
										<span className={style.recipeTitle}>{msg.recipe.recipeTitle}</span>
										<span className={style.recipeMeta}>タップして入れ替える →</span>
									</div>
								</button>
							)}
						</div>
					))}
					{loading && (
						<div className={`${style.bubble} ${style.bubbleAi}`}>
							<p className={style.bubbleText}>考え中...</p>
						</div>
					)}
					<div ref={bottomRef} />
				</div>

				<div className={style.inputArea}>
					<input
						className={style.input}
						type="text"
						value={input}
						placeholder="例：魚料理がいい、時短でできるもの"
						onChange={e => setInput(e.target.value)}
						onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
					/>
					<button
						type="button"
						className={style.sendButton}
						onClick={handleSend}
						disabled={loading || !input.trim()}
					>
						送信
					</button>
				</div>
			</main>
			<Footer />

			{swapTarget && (
				<RecipeSwapModal
					recipe={recipe}
					divisions={divisions}
					nextItem={swapTarget}
					setItem={setSwapTarget}
					onSwap={handleSwap}
				/>
			)}
		</>
	);
}
