'use client'

import { overallStats } from '@/lib/education/stats'
import type { SeriesWithArticles } from '@/lib/education/types'
import { useArticleReads } from '@/services/education/useArticleReads'
import { BookOpen, Clock, Flame, Target } from 'lucide-react'
import { SeriesCard } from './series-card'

export function EducationOverview({ series }: { series: SeriesWithArticles[] }) {
	const { reads, readSlugs, isError } = useArticleReads()
	const stats = overallStats(series, reads)

	const tiles = [
		{
			icon: BookOpen,
			label: 'Artigos lidos',
			value: stats.readCount,
			note: `de ${stats.totalCount}`,
		},
		{
			icon: Target,
			label: 'Séries completas',
			value: stats.completedSeries,
			note: `de ${stats.totalSeries}`,
		},
		{
			icon: Clock,
			label: 'Tempo de estudo',
			value: `${stats.minutes} min`,
			note: 'investidos',
		},
		{
			icon: Flame,
			label: 'Sequência',
			value: stats.streak,
			note: stats.streak === 1 ? 'dia seguido' : 'dias seguidos',
		},
	]

	return (
		<div className="space-y-6">
			<dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
				{tiles.map(({ icon: Icon, label, value, note }) => (
					<div
						key={label}
						className="border border-border bg-card px-3.5 py-3 shadow-bill"
					>
						<dt className="notice-label flex items-center gap-1.5">
							<Icon className="h-3.5 w-3.5" />
							{label}
						</dt>
						<dd className="mt-1.5 font-mono text-2xl font-medium tabular-nums text-foreground">
							{value}
						</dd>
						<dd className="text-xs text-muted-foreground">{note}</dd>
					</div>
				))}
			</dl>

			{isError && (
				<p className="border border-flag-red/40 bg-flag-red-soft px-3 py-2 text-sm text-flag-red">
					Não foi possível carregar seu progresso agora. Os artigos continuam disponíveis.
				</p>
			)}

			<div className="space-y-4">
				{series.map((s) => (
					<SeriesCard key={s.slug} series={s} readSlugs={readSlugs} />
				))}
			</div>
		</div>
	)
}
