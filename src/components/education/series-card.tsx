'use client'

import { LEVEL_LABEL } from '@/lib/education/series-config'
import { seriesProgress } from '@/lib/education/stats'
import type { SeriesWithArticles } from '@/lib/education/types'
import { cn } from '@/lib/utils'
import { Check, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { ProgressBar } from './progress-bar'

export function SeriesCard({
	series,
	readSlugs,
	headerLinks = true,
}: {
	series: SeriesWithArticles
	readSlugs: Set<string>
	/** Turn the header into a link to the series page (off when already on it). */
	headerLinks?: boolean
}) {
	const Header = headerLinks ? Link : 'div'
	const headerProps = headerLinks
		? {
				href: `/educacao/${series.slug}`,
				className: 'block space-y-3 px-4 py-4 transition-colors hover:bg-secondary/40',
			}
		: { className: 'block space-y-3 px-4 py-4' }
	const { read, total, percent } = seriesProgress(series, readSlugs)

	return (
		<section className="border border-border bg-card shadow-bill">
			<Header {...(headerProps as { href: string; className: string })}>
				<div className="flex items-start gap-3">
					<span className="text-3xl leading-none" aria-hidden>
						{series.icon}
					</span>
					<div className="min-w-0 flex-1">
						<div className="flex flex-wrap items-center gap-2">
							<h2 className="text-base font-bold tracking-tight text-foreground">
								{series.title}
							</h2>
							<span className="notice-label border border-border px-1.5 py-0.5">
								{LEVEL_LABEL[series.level]}
							</span>
						</div>
						<p className="mt-1 text-sm text-muted-foreground">{series.description}</p>
					</div>
					{headerLinks && (
						<ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
					)}
				</div>
				<div className="space-y-1.5">
					<ProgressBar percent={percent} />
					<p className="text-xs text-muted-foreground">
						{read} de {total} artigos lidos · {percent}%
					</p>
				</div>
			</Header>

			<ol className="border-t border-border">
				{series.articles.map((a, i) => {
					const isRead = readSlugs.has(a.slug)
					return (
						<li key={a.slug} className="border-b border-border/70 last:border-b-0">
							<Link
								href={`/educacao/${a.slug}`}
								className="flex min-h-11 items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-secondary/40"
							>
								<span
									className={cn(
										'flex h-6 w-6 shrink-0 items-center justify-center text-xs font-bold',
										isRead
											? 'bg-flag-green text-primary-foreground'
											: 'border border-border text-muted-foreground',
									)}
								>
									{isRead ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
								</span>
								<span className="flex-1 font-medium text-foreground">{a.title}</span>
								<span className="shrink-0 text-xs text-muted-foreground">
									{a.readingMinutes} min
								</span>
							</Link>
						</li>
					)
				})}
			</ol>
		</section>
	)
}
