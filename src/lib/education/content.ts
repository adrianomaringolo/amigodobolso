import 'server-only'

import fs from 'fs'
import path from 'path'
import { SERIES_CONFIG } from './series-config'
import type { Article, SeriesWithArticles } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'src/content/educacao')
const WORDS_PER_MINUTE = 200

/** Minimal `key: "value"` frontmatter parser — enough for our flat article headers. */
function parseFrontmatter(raw: string) {
	const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
	if (!match) return { data: {} as Record<string, string>, content: raw.trim() }

	const data: Record<string, string> = {}
	for (const line of match[1].split('\n')) {
		const i = line.indexOf(':')
		if (i <= 0) continue
		data[line.slice(0, i).trim()] = line
			.slice(i + 1)
			.trim()
			.replace(/^["']|["']$/g, '')
	}
	return { data, content: match[2].trim() }
}

function readSeriesArticles(series: string): Article[] {
	const dir = path.join(CONTENT_DIR, series)
	if (!fs.existsSync(dir)) return []

	return fs
		.readdirSync(dir)
		.filter((f) => f.endsWith('.md') && !f.startsWith('_'))
		.map((file) => {
			const { data, content } = parseFrontmatter(
				fs.readFileSync(path.join(dir, file), 'utf8'),
			)
			const words = content.split(/\s+/).filter(Boolean).length
			return {
				slug: `${series}/${file.replace(/\.md$/, '')}`,
				series,
				title: data.title || file,
				description: data.description || '',
				order: Number(data.seriesOrder) || 0,
				readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
				content,
			}
		})
		.sort((a, b) => a.order - b.order)
}

export function getAllSeries(): SeriesWithArticles[] {
	return Object.entries(SERIES_CONFIG)
		.map(([slug, config]) => ({ slug, ...config, articles: readSeriesArticles(slug) }))
		.filter((s) => s.articles.length > 0)
}

export function getSeries(slug: string): SeriesWithArticles | null {
	return getAllSeries().find((s) => s.slug === slug) ?? null
}

export function getArticle(series: string, article: string) {
	const s = getSeries(series)
	if (!s) return null
	const index = s.articles.findIndex((a) => a.slug === `${series}/${article}`)
	if (index === -1) return null
	return {
		series: s,
		article: s.articles[index],
		previous: s.articles[index - 1] ?? null,
		next: s.articles[index + 1] ?? null,
	}
}
