import { FinancialEntry } from '@/lib/types/Entry.type'
import { useMemo } from 'react'
import {
	AmountType,
	AmountTypes,
	TransactionTypes,
} from '../financial/financial.types'
import { flagFor, overallFlag, type Flag } from './flag'

export type CategoryKey = keyof typeof TransactionTypes

export type CategoryReading = {
	key: CategoryKey
	label: string
	type: AmountType
	/** target % of income for this category, from the licensed method */
	targetPct: number
	/** R$ the plan allows this month (income * targetPct/100) */
	target: number
	/** R$ spent so far this month */
	used: number
	flag: Flag
	icon: (className?: string) => React.ReactNode
	color: string
}

export type MonthReadings = {
	income: number
	expenses: number
	planned: number
	balance: number
	categories: CategoryReading[]
	overall: Flag
}

export function computeReadings(entries: FinancialEntry[]): MonthReadings {
	const income = entries
		.filter((e) => e.amount > 0)
		.reduce((acc, e) => acc + e.amount, 0)

	const expenses = entries
		.filter((e) => e.amount < 0)
		.reduce((acc, e) => acc + Math.abs(e.amount), 0)

	const byCategory = entries.reduce<Record<string, number>>((acc, e) => {
		acc[e.category] = (acc[e.category] ?? 0) + e.amount
		return acc
	}, {})

	const categories = (Object.entries(TransactionTypes) as [CategoryKey, (typeof TransactionTypes)[CategoryKey]][])
		.filter(([, def]) => def.type === AmountTypes.expanses)
		.map(([key, def]) => {
			const target = income * (def.max / 100)
			const used = Math.abs(byCategory[key] ?? 0)
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
		})

	return {
		income,
		expenses,
		planned: income,
		balance: income - expenses,
		categories,
		overall: overallFlag(categories.map((c) => c.flag)),
	}
}

export function useReadings(entries: FinancialEntry[]): MonthReadings {
	return useMemo(() => computeReadings(entries), [entries])
}
