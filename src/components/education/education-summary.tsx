'use client'

import { Painel } from '@/components/bandeira/painel'
import { overallStats } from '@/lib/education/stats'
import type { SeriesWithArticles } from '@/lib/education/types'
import { useArticleReads } from '@/services/education/useArticleReads'
import { ArrowRight, BookOpen, Clock, Flame, Target } from 'lucide-react'
import Link from 'next/link'
import { ProgressBar } from './progress-bar'

/** Dashboard card with the user's reading stats from the Dica do Amigo area. */
export function EducationSummary({ series }: { series: SeriesWithArticles[] }) {
	const { reads, isError } = useArticleReads()
	const stats = overallStats(series, reads)
	const percent = stats.totalCount
		? Math.round((stats.readCount / stats.totalCount) * 100)
		: 0

	const tiles = [
		{
			icon: BookOpen,
			label: 'Artigos lidos',
			value: `${stats.readCount}/${stats.totalCount}`,
		},
		{
			icon: Target,
			label: 'Séries completas',
			value: `${stats.completedSeries}/${stats.totalSeries}`,
		},
		{ icon: Clock, label: 'Tempo de estudo', value: `${stats.minutes} min` },
		{
			icon: Flame,
			label: 'Sequência',
			value: `${stats.streak} ${stats.streak === 1 ? 'dia' : 'dias'}`,
		},
	]

	return (
		<Painel
			title="Dica do Amigo"
			aside={
				<Link
					href="/educacao"
					className="notice-label flex items-center gap-1 !normal-case !tracking-normal hover:text-foreground"
				>
					Continuar
					<ArrowRight className="h-3.5 w-3.5" />
				</Link>
			}
		>
			{isError ? (
				<p className="text-sm text-muted-foreground">
					Não foi possível carregar seu progresso agora.
				</p>
			) : (
				<>
					<ProgressBar percent={percent} />
					<dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
						{tiles.map(({ icon: Icon, label, value }) => (
							<div key={label}>
								<dt className="notice-label flex items-center gap-1.5">
									<Icon className="h-3.5 w-3.5" />
									{label}
								</dt>
								<dd className="mt-1 font-mono text-lg font-medium tabular-nums text-foreground">
									{value}
								</dd>
							</div>
						))}
					</dl>
				</>
			)}
		</Painel>
	)
}
