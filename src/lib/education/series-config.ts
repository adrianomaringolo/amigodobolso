import type { SeriesConfig } from './types'

/** Add a folder under src/content/educacao/<slug> and an entry here to publish a new series. */
export const SERIES_CONFIG: Record<string, SeriesConfig> = {
	'financas-101': {
		title: 'Comportamento Financeiro',
		icon: '🧭',
		level: 'iniciante',
		description:
			'Conteúdos “direto ao ponto” para você saber, se conhecer e melhorar sua relação com o dinheiro. A tranquilidade financeira começa com novos hábitos.',
	},
	sabotadores: {
		title: 'Sabotadores',
		icon: '🪤',
		level: 'iniciante',
		description:
			'Situações e armadilhas da mente que sabotam o controle e a saúde das suas finanças, e como reconhecê-las para sair do ciclo.',
	},
}

export const LEVEL_LABEL: Record<SeriesConfig['level'], string> = {
	iniciante: 'Iniciante',
	intermediario: 'Intermediário',
}
