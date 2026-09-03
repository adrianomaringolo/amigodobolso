/**
 * Bandeira tarifária — the escalation signal from the electric bill, applied to
 * a budget category. Green while comfortably under target, amber approaching it,
 * red past it. The same three levels the whole country reads on `conta de luz`.
 */

export type FlagLevel = 'verde' | 'amarela' | 'vermelha'

export type Flag = {
	level: FlagLevel
	/** spent / target, as a percentage (can exceed 100) */
	pct: number
	/** plain-language label, e.g. "dentro do plano" */
	label: string
	/** short chip label, e.g. "no verde" */
	chip: string
}

const AMBER_AT = 85
const RED_AT = 100

export function flagFor(used: number, target: number): Flag {
	const spent = Math.abs(used)
	const pct = target > 0 ? (spent / target) * 100 : spent > 0 ? 999 : 0

	if (pct > RED_AT) {
		return { level: 'vermelha', pct, label: 'passou do plano', chip: 'no vermelho' }
	}
	if (pct >= AMBER_AT) {
		return { level: 'amarela', pct, label: 'chegando no limite', chip: 'no amarelo' }
	}
	return { level: 'verde', pct, label: 'dentro do plano', chip: 'no verde' }
}

/** The month as a whole: red if any category is red, amber if any is amber. */
export function overallFlag(flags: Flag[]): Flag {
	if (flags.some((f) => f.level === 'vermelha')) {
		return {
			level: 'vermelha',
			pct: 0,
			label: 'Alguma categoria passou do plano',
			chip: 'no vermelho',
		}
	}
	if (flags.some((f) => f.level === 'amarela')) {
		return {
			level: 'amarela',
			pct: 0,
			label: 'Uma categoria está chegando no limite',
			chip: 'no amarelo',
		}
	}
	return { level: 'verde', pct: 0, label: 'Tudo dentro do plano do mês', chip: 'no verde' }
}

export const FLAG_STYLES: Record<
	FlagLevel,
	{ text: string; soft: string; fill: string; border: string; dot: string }
> = {
	verde: {
		text: 'text-flag-green',
		soft: 'bg-flag-green-soft',
		fill: 'bg-flag-green',
		border: 'border-flag-green',
		dot: 'bg-flag-green',
	},
	amarela: {
		text: 'text-flag-amber',
		soft: 'bg-flag-amber-soft',
		fill: 'bg-flag-amber-fill',
		border: 'border-flag-amber-fill',
		dot: 'bg-flag-amber-fill',
	},
	vermelha: {
		text: 'text-flag-red',
		soft: 'bg-flag-red-soft',
		fill: 'bg-flag-red',
		border: 'border-flag-red',
		dot: 'bg-flag-red',
	},
}
