import type { ArticleRead, SeriesWithArticles } from './types'

const DAY_MS = 86_400_000

const dayKey = (d: Date) =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** Consecutive days with at least one read, counting back from today (or yesterday). */
export function readingStreak(reads: ArticleRead[], now = new Date()): number {
	const days = new Set(reads.map((r) => dayKey(new Date(r.readAt))))
	let cursor = new Date(now)
	if (!days.has(dayKey(cursor))) cursor = new Date(cursor.getTime() - DAY_MS)

	let streak = 0
	while (days.has(dayKey(cursor))) {
		streak++
		// midday avoids DST edge cases when stepping back one calendar day
		cursor = new Date(new Date(cursor).setHours(12) - DAY_MS)
	}
	return streak
}

export function seriesProgress(series: SeriesWithArticles, readSlugs: Set<string>) {
	const read = series.articles.filter((a) => readSlugs.has(a.slug)).length
	const total = series.articles.length
	return { read, total, percent: total ? Math.round((read / total) * 100) : 0 }
}

export function overallStats(series: SeriesWithArticles[], reads: ArticleRead[]) {
	const readSlugs = new Set(reads.map((r) => r.articleSlug))
	const all = series.flatMap((s) => s.articles)
	const readArticles = all.filter((a) => readSlugs.has(a.slug))

	return {
		readCount: readArticles.length,
		totalCount: all.length,
		completedSeries: series.filter((s) => seriesProgress(s, readSlugs).percent === 100)
			.length,
		totalSeries: series.length,
		minutes: readArticles.reduce((sum, a) => sum + a.readingMinutes, 0),
		streak: readingStreak(reads),
	}
}
