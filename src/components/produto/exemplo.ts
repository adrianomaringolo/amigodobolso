import { flagFor, overallFlag } from '@/components/bandeira/flag'
import type { CategoryKey, CategoryReading } from '@/components/bandeira/use-readings'
import { type AmountType, AmountTypes, TransactionTypes } from '@/components/financial/financial.types'

/**
 * A synthetic month for the landing page. Every figure here is illustrative and
 * is shown to the visitor stamped "exemplo" — no real user data.
 */

export const RENDA_EXEMPLO = 4800

export const GASTOS_EXEMPLO: Partial<Record<CategoryKey, number>> = {
	essential: 2198.4,
	'financial-security': 300,
	charity: 120,
	leisure: 431.9,
	'long-term': 210,
	'personal-growth': 150,
}

export const CATEGORIAS = (
	Object.entries(TransactionTypes) as [CategoryKey, (typeof TransactionTypes)[CategoryKey]][]
).filter(([, def]) => def.type === AmountTypes.expanses)

export function leituraExemplo(key: CategoryKey, used: number, renda = RENDA_EXEMPLO): CategoryReading {
	const def = TransactionTypes[key]
	const target = renda * (def.max / 100)
	return {
		key,
		label: def.label,
		type: def.type as AmountType,
		targetPct: def.max,
		target,
		used,
		flag: flagFor(used, target),
		icon: def.icon,
		color: def.color,
	}
}

export const LEITURAS_EXEMPLO = CATEGORIAS.map(([key]) =>
	leituraExemplo(key, GASTOS_EXEMPLO[key] ?? 0),
)

export const GASTO_TOTAL_EXEMPLO = LEITURAS_EXEMPLO.reduce((acc, c) => acc + c.used, 0)

export const BANDEIRA_EXEMPLO = overallFlag(LEITURAS_EXEMPLO.map((c) => c.flag))

/** One plain line per category, in the method's own spirit. */
export const RESUMO_CATEGORIA: Partial<Record<CategoryKey, string>> = {
	essential: 'Aluguel, mercado, contas de água, luz e telefone. O básico para viver.',
	'financial-security': 'Uma reserva para o futuro. Encare como uma conta obrigatória do mês.',
	charity: 'Doações, presentes, ajudar alguém. Gratidão também entra no plano.',
	leisure: 'Passeios, cinema, comer fora. Se divertir faz parte da vida.',
	'long-term': 'Carro, viagem, imóvel: o que precisa de planejamento e tempo.',
	'personal-growth': 'Cursos, livros, academia. Investir em você mesmo.',
}
