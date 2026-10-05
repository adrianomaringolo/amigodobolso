import { EducationHeader } from '@/components/education/page-header'
import { SeriesDetail } from '@/components/education/series-detail'
import { getSeries } from '@/lib/education/content'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function SeriePage({
	params,
}: {
	params: Promise<{ serie: string }>
}) {
	const { serie } = await params
	const found = getSeries(serie)
	if (!found) notFound()

	const series = {
		...found,
		articles: found.articles.map((a) => ({ ...a, content: '' })),
	}

	return (
		<div className="space-y-5">
			<EducationHeader subtitle={series.title} />
			<Link
				href="/educacao"
				className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft className="h-4 w-4" />
				Todas as séries
			</Link>
			<SeriesDetail series={series} />
		</div>
	)
}
