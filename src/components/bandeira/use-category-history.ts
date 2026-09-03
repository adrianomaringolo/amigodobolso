import { createClient } from '@/lib/supabase/client'
import { FinancialEntry } from '@/lib/types/Entry.type'
import { objectToCamel } from '@/lib/utils/convertCase'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { TransactionTypes } from '../financial/financial.types'
import type { ConsumoPonto } from './consumo-histograma'
import type { CategoryKey } from './use-readings'

const MONTH_LABELS = [
	'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
	'jul', 'ago', 'set', 'out', 'nov', 'dez',
]

function monthKeys(count: number, ref: Date): { key: string; label: string }[] {
	const out: { key: string; label: string }[] = []
	for (let i = count - 1; i >= 0; i--) {
		const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1)
		out.push({
			key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
			label: MONTH_LABELS[d.getMonth()],
		})
	}
	return out
}

const fetchMonth = async (userId: string, monthYear: string) => {
	const supabase = createClient()
	const { data, error } = await supabase
		.from('entries')
		.select()
		.eq('user_id', userId)
		.like('date', `${monthYear}%`)
	if (error) throw new Error(error.message)
	return objectToCamel(data) as FinancialEntry[]
}

/**
 * Per-category consumption history — spent / target for the last `count` months,
 * for the small conta-de-luz histogram on each medidor.
 */
export function useCategoryHistory(
	userId: string | undefined,
	count = 6,
	ref: Date = new Date(),
) {
	const months = useMemo(() => monthKeys(count, ref), [count, ref])

	const results = useQueries({
		queries: months.map((m) => ({
			queryKey: ['entries', { userId, monthYear: m.key }],
			enabled: !!userId,
			staleTime: 5 * 60 * 1000,
			queryFn: () => fetchMonth(userId as string, m.key),
		})),
	})

	return useMemo(() => {
		const byCategory: Record<string, ConsumoPonto[]> = {}
		for (const key of Object.keys(TransactionTypes) as CategoryKey[]) {
			byCategory[key] = []
		}

		months.forEach((m, i) => {
			const entries = results[i]?.data ?? []
			const income = entries
				.filter((e) => e.amount > 0)
				.reduce((acc, e) => acc + e.amount, 0)
			const spent = entries.reduce<Record<string, number>>((acc, e) => {
				acc[e.category] = (acc[e.category] ?? 0) + e.amount
				return acc
			}, {})

			for (const [key, def] of Object.entries(TransactionTypes)) {
				if (def.type !== 'expanses') continue
				const target = income * (def.max / 100)
				const used = Math.abs(spent[key] ?? 0)
				byCategory[key].push({
					label: m.label,
					ratio: target > 0 ? used / target : 0,
					current: i === months.length - 1,
				})
			}
		})

		return {
			history: byCategory as Record<CategoryKey, ConsumoPonto[]>,
			isLoading: results.some((r) => r.isLoading),
		}
	}, [months, results])
}
