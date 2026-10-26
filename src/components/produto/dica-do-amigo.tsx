import { LEVEL_LABEL } from '@/lib/education/series-config'
import type { SeriesWithArticles } from '@/lib/education/types'
import { ArrowRight, GraduationCap } from 'lucide-react'
import Link from 'next/link'

/**
 * The education corner, as a teaser: the real series and its article titles
 * (read at build time, so new content shows up on its own). Reading the
 * articles stays behind the account.
 */
export function DicaDoAmigo({ serie }: { serie: SeriesWithArticles | undefined }) {
	return (
		<div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
			<div className="reveal">
				<p className="notice-label flex items-center gap-2 text-foreground">
					<GraduationCap
						className="h-[18px] w-[18px] text-primary"
						strokeWidth={1.75}
						aria-hidden
					/>
					Dica do Amigo
				</p>
				<h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.025em] md:text-[2.5rem]">
					Sempre tem uma dica nova por aqui.
				</h2>
				<p className="mt-4 text-base leading-relaxed text-muted-foreground">
					Além de lançar, você aprende. A Dica do Amigo é o espaço de educação financeira
					do app: textos curtos, em linguagem simples, para entender o seu dinheiro sem
					complicação.
				</p>
				<p className="mt-4 text-base leading-relaxed text-muted-foreground">
					<strong className="text-foreground">E o conteúdo não para.</strong> Novas dicas
					são publicadas o tempo todo, então sempre há algo novo para ler quando você
					voltar.
				</p>
				<Link
					href="/register"
					className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-4 hover:decoration-foreground"
				>
					Criar conta e ler as dicas
					<ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden />
				</Link>
			</div>

			{serie && (
				<div className="reveal border border-border bg-card shadow-bill">
					<div className="flex items-start gap-3 border-b border-border px-4 py-4">
						<span className="text-3xl leading-none" aria-hidden>
							{serie.icon}
						</span>
						<div className="min-w-0">
							<div className="flex flex-wrap items-center gap-2">
								<h3 className="text-base font-bold tracking-tight text-foreground">
									{serie.title}
								</h3>
								<span className="notice-label border border-border px-1.5 py-0.5">
									{LEVEL_LABEL[serie.level]}
								</span>
							</div>
							<p className="mt-1 text-sm text-muted-foreground">{serie.description}</p>
						</div>
					</div>
					<ol className="stagger">
						{serie.articles.map((a, i) => (
							<li
								key={a.slug}
								style={{ ['--i' as string]: i }}
								className="flex items-center gap-3 border-b border-border px-4 py-3"
							>
								<span className="tabular w-5 shrink-0 text-sm font-bold text-primary">
									{i + 1}
								</span>
								<span className="min-w-0 flex-1 text-sm font-semibold text-foreground">
									{a.title}
								</span>
								<span className="notice-label shrink-0 !normal-case !tracking-normal">
									{a.readingMinutes} min
								</span>
							</li>
						))}
						<li className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground">
							<span className="tabular w-5 shrink-0 text-sm font-bold text-accent-text">
								+
							</span>
							Novas dicas a caminho: o conteúdo cresce o tempo todo.
						</li>
					</ol>
				</div>
			)}
		</div>
	)
}
