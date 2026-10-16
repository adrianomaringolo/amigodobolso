import { Markdown } from '@/components/education/markdown'
import { getTutorial, getTutorials } from '@/lib/tutorials/content'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type TutorialParams = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
	return getTutorials().map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: TutorialParams) {
	const { slug } = await params
	const found = getTutorial(slug)
	return { title: found ? `${found.tutorial.title} · Tutoriais` : 'Tutoriais' }
}

export default async function TutorialPage({ params }: TutorialParams) {
	const { slug } = await params
	const found = getTutorial(slug)
	if (!found) notFound()

	const { tutorial, previous, next } = found
	const total = getTutorials().length

	return (
		<article className="mx-auto max-w-2xl space-y-5">
			<Link
				href="/ajuda?t=tutoriais"
				className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft className="h-4 w-4" />
				Tutoriais
			</Link>

			<header className="space-y-2 border-b border-border pb-4">
				<p className="notice-label">
					Tutorial {tutorial.order} de {total}
				</p>
				<h1 className="text-2xl font-bold tracking-tight text-foreground">
					{tutorial.title}
				</h1>
				<p className="text-sm text-muted-foreground">{tutorial.description}</p>
			</header>

			<Markdown content={tutorial.content} />

			<nav
				className="grid grid-cols-2 gap-3 border-t border-border pt-4"
				aria-label="Navegação entre tutoriais"
			>
				{previous ? (
					<Link
						href={`/ajuda/tutoriais/${previous.slug}`}
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
						href={`/ajuda/tutoriais/${next.slug}`}
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
