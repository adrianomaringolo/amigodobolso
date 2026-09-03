import { FinancialEntry } from '@/lib/types/Entry.type'
import { formatCurrency } from '@/lib/utils'
import { TransactionTypes } from '../financial/financial.types'

type ExpensesCategoryTotalProps = {
	entries: FinancialEntry[]
}

export const ExpensesCategoryTotal = (props: ExpensesCategoryTotalProps) => {
	const { entries } = props

	const grouped = entries
		.filter((e) => e.amount < 0)
		.reduce<Record<string, number>>((acc, e) => {
			acc[e.category] = (acc[e.category] ?? 0) + e.amount
			return acc
		}, {})

	const rows = Object.entries(grouped).sort((a, b) => a[1] - b[1])

	if (rows.length === 0) {
		return (
			<p className="px-4 py-4 text-center text-sm text-muted-foreground">
				Nenhuma despesa lançada neste mês
			</p>
		)
	}

	return (
		<ul className="divide-y divide-border">
			{rows.map(([category, total]) => {
				const def = TransactionTypes[category as keyof typeof TransactionTypes]
				return (
					<li key={category} className="flex items-center gap-3 px-4 py-2.5">
						<span className="flex h-8 w-8 shrink-0 items-center justify-center border border-border text-muted-foreground">
							{def?.icon('w-4 h-4')}
						</span>
						<span className="flex-1 text-sm text-foreground">{def?.label}</span>
						<span data-reading className="tabular text-sm font-semibold text-expense">
							{formatCurrency(Math.abs(total))}
						</span>
					</li>
				)
			})}
		</ul>
	)
}
