import type { SeriesConfig } from './types'

/** Add a folder under src/content/educacao/<slug> and an entry here to publish a new series. */
export const SERIES_CONFIG: Record<string, SeriesConfig> = {
	'financas-101': {
		title: 'Educação Financeira 101',
		icon: '🧭',
		level: 'iniciante',
		description:
			'Cinco leituras rápidas para entender para onde vai o seu dinheiro e montar um plano simples, sem complicação.',
	},
}

export const LEVEL_LABEL: Record<SeriesConfig['level'], string> = {
	iniciante: 'Iniciante',
	intermediario: 'Intermediário',
}
