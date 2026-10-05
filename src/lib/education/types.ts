export interface Article {
	/** "serie/arquivo" — also the key stored in article_reads.article_slug */
	slug: string
	series: string
	title: string
	description: string
	order: number
	readingMinutes: number
	content: string
}

export interface SeriesConfig {
	title: string
	icon: string
	level: 'iniciante' | 'intermediario'
	description: string
}

export interface SeriesWithArticles extends SeriesConfig {
	slug: string
	articles: Article[]
}

export interface ArticleRead {
	articleSlug: string
	readAt: string
}
