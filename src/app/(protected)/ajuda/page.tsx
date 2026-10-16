import { getTutorials } from '@/lib/tutorials/content'
import { HelpContent } from './help-content'

export const metadata = { title: 'Como usar' }

const TABS = ['bandeira', 'categorias', 'tutoriais']

export default async function Help({
	searchParams,
}: {
	searchParams: Promise<{ t?: string }>
}) {
	const { t } = await searchParams
	const tutorials = getTutorials().map(({ slug, title, description }) => ({
		slug,
		title,
		description,
	}))
	return (
		<HelpContent
			tutorials={tutorials}
			defaultTab={t && TABS.includes(t) ? t : 'bandeira'}
		/>
	)
}
