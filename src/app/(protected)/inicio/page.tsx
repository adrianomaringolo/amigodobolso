import { getAllSeries } from '@/lib/education/content'
import Dashboard from './dashboard'

export default function InicioPage() {
	// Article bodies stay on the server; the dashboard card only needs counts and minutes.
	const series = getAllSeries().map((s) => ({
		...s,
		articles: s.articles.map((a) => ({ ...a, content: '' })),
	}))

	return <Dashboard series={series} />
}
