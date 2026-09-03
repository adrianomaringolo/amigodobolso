'use client'

import { Painel } from '@/components/bandeira/painel'
import { FinancialEntry } from '@/lib/types/Entry.type'
import { formatCurrency } from '@/lib/utils'
import { AmountTypes, TransactionTypes } from '../financial/financial.types'

type CategoryChartProps = {
	entries: FinancialEntry[]
}

/**
 * How the month's spending split across categories — one horizontal bar
 * (segments to scale) plus a keyed list. On-world for "A Bandeira": a reading,
 * not a pie.
 */
export const CategoryChart = ({ entries }: CategoryChartProps) => {
	const grouped = entries
		.filter((e) => e.amount < 0)
		.reduce<Record<string, number>>((acc, e) => {
			acc[e.category] = (acc[e.category] ?? 0) + Math.abs(e.amount)
			return acc
		}, {})

	const rows = (Object.entries(TransactionTypes) as [string, (typeof TransactionTypes)[keyof typeof TransactionTypes]][])
		.filter(([, def]) => def.type === AmountTypes.expanses)
		.map(([key, def]) => ({ key, label: def.label, color: def.color, value: grouped[key] ?? 0 }))
		.filter((r) => r.value > 0)
		.sort((a, b) => b.value - a.value)

	const total = rows.reduce((acc, r) => acc + r.value, 0)

	if (total === 0) {
		return (
			<Painel title="Distribuição de despesas">
				<p className="py-4 text-center text-sm text-muted-foreground">
					Nenhuma despesa lançada neste mês
				</p>
			</Painel>
		)
	}

	return (
		<Painel title="Distribuição de despesas">
			<div className="flex h-4 w-full overflow-hidden border border-border">
				{rows.map((r) => (
					<div
						key={r.key}
						style={{ width: `${(r.value / total) * 100}%`, backgroundColor: r.color }}
						title={`${r.label}: ${formatCurrency(r.value)}`}
					/>
				))}
			</div>
			<ul className="mt-4 space-y-2">
				{rows.map((r) => (
					<li key={r.key} className="flex items-center gap-2.5 text-sm">
						<span
							className="h-2.5 w-2.5 shrink-0"
							style={{ backgroundColor: r.color }}
						/>
						<span className="flex-1 text-foreground">{r.label}</span>
						<span data-reading className="tabular text-muted-foreground">
							{Math.round((r.value / total) * 100)}%
						</span>
						<span
							data-reading
							className="tabular w-24 text-right font-semibold text-foreground"
						>
							{formatCurrency(r.value)}
						</span>
					</li>
				))}
			</ul>
		</Painel>
	)
}
