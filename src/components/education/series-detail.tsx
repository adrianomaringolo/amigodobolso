'use client'

import type { SeriesWithArticles } from '@/lib/education/types'
import { useArticleReads } from '@/services/education/useArticleReads'
import { SeriesCard } from './series-card'

export function SeriesDetail({ series }: { series: SeriesWithArticles }) {
	const { readSlugs } = useArticleReads()
	return <SeriesCard series={series} readSlugs={readSlugs} headerLinks={false} />
}
