import { MarkAsRead } from '@/components/education/mark-as-read'
import { Markdown } from '@/components/education/markdown'
import { getArticle } from '@/lib/education/content'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ArtigoPage({
	params,
}: {
	params: Promise<{ serie: string; artigo: string }>
}) {
	const { serie, artigo } = await params
	const found = getArticle(serie, artigo)
	if (!found) notFound()

	const { series, article, previous, next } = found

	return (
		<article className="mx-auto max-w-2xl space-y-5">
			<Link
				href={`/educacao/${series.slug}`}
				className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft className="h-4 w-4" />
				{series.title}
			</Link>

			<header className="space-y-2 border-b border-border pb-4">
				<p className="notice-label">
					Artigo {article.order} de {series.articles.length}
				</p>
				<h1 className="text-2xl font-bold tracking-tight text-foreground">
					{article.title}
				</h1>
				<p className="text-sm text-muted-foreground">{article.description}</p>
				<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<Clock className="h-3.5 w-3.5" />
					{article.readingMinutes} min de leitura
				</p>
			</header>

			<Markdown content={article.content} />

			<div className="border-t border-border pt-4">
				<MarkAsRead slug={article.slug} />
			</div>

			<nav className="grid grid-cols-2 gap-3" aria-label="Navegação entre artigos">
				{previous ? (
					<Link
						href={`/educacao/${previous.slug}`}
						className="flex min-h-11 flex-col border border-border bg-card px-3 py-2 text-left hover:bg-secondary/40"
					>
						<span className="notice-label flex items-center gap-1">
							<ArrowLeft className="h-3 w-3" /> Anterior
						</span>
						<span className="text-sm font-medium text-foreground">{previous.title}</span>
					</Link>
				) : (
					<span />
				)}
				{next ? (
					<Link
						href={`/educacao/${next.slug}`}
						className="flex min-h-11 flex-col items-end border border-border bg-card px-3 py-2 text-right hover:bg-secondary/40"
					>
						<span className="notice-label flex items-center gap-1">
							Próximo <ArrowRight className="h-3 w-3" />
						</span>
						<span className="text-sm font-medium text-foreground">{next.title}</span>
					</Link>
				) : (
					<span />
				)}
			</nav>
		</article>
	)
}
