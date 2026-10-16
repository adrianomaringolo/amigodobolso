import { FlagIcon } from '@/components/bandeira/flag-icon'
import { computeReadings } from '@/components/bandeira/use-readings'
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

	// Fixed method order (NE, TF, FPO, DIV, CLP, DP) — the order TransactionTypes declares.
	const rows = Object.keys(TransactionTypes)
		.filter((key) => grouped[key] !== undefined)
		.map((key) => [key, grouped[key]] as const)

	// The flag needs a target, and targets come from income — no income, no flag.
	const { income, categories } = computeReadings(entries)
	const flagOf = (key: string) =>
		income > 0 ? categories.find((c) => c.key === key)?.flag : undefined

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
				const flag = flagOf(category)
				return (
					<li key={category} className="flex items-center gap-3 px-4 py-2.5">
						<span className="flex h-8 w-8 shrink-0 items-center justify-center border border-border text-muted-foreground">
							{def?.icon('w-4 h-4')}
						</span>
						{flag && (
							<span
								className="-ml-1 flex shrink-0 items-center"
								title={`${flag.chip} · ${Math.round(flag.pct)}% do alvo`}
							>
								<FlagIcon level={flag.level} size={20} />
								<span className="sr-only">
									{flag.chip}, {Math.round(flag.pct)}% do alvo
								</span>
							</span>
						)}
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
