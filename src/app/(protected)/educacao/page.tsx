import { EducationOverview } from '@/components/education/education-overview'
import { EducationHeader } from '@/components/education/page-header'
import { getAllSeries } from '@/lib/education/content'

export const metadata = { title: 'Dica de Amigo' }

export default function EducacaoPage() {
	// Article bodies stay on the server; the overview only needs titles and metadata.
	const series = getAllSeries().map((s) => ({
		...s,
		articles: s.articles.map((a) => ({ ...a, content: '' })),
	}))

	return (
		<div className="space-y-5">
			<EducationHeader subtitle="leituras curtas para você entender e organizar seu dinheiro" />
			<EducationOverview series={series} />
		</div>
	)
}
