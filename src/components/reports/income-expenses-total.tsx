import { FinancialEntry } from '@/lib/types/Entry.type'
import { cn, formatCurrency } from '@/lib/utils'
import { ArrowDownRight, ArrowUpRight, Equal } from 'lucide-react'

type IncomeExpensesTotalProps = {
	entries: FinancialEntry[]
}

export const IncomeExpensesTotal = (props: IncomeExpensesTotalProps) => {
	const { entries } = props

	const income = entries.filter((e) => e.amount > 0).reduce((a, e) => a + e.amount, 0)
	const expenses = entries.filter((e) => e.amount < 0).reduce((a, e) => a + e.amount, 0)
	const total = income + expenses

	const Cell = ({
		label,
		value,
		icon: Icon,
		tone,
	}: {
		label: string
		value: number
		icon: typeof Equal
		tone: 'green' | 'red' | 'foreground'
	}) => (
		<div className="flex items-center gap-3 px-4 py-3">
			<span
				className={cn(
					'flex h-9 w-9 shrink-0 items-center justify-center border',
					tone === 'green' && 'border-flag-green text-flag-green',
					tone === 'red' && 'border-flag-red text-flag-red',
					tone === 'foreground' && 'border-border text-foreground',
				)}
			>
				<Icon className="h-4 w-4" />
			</span>
			<div>
				<p className="notice-label">{label}</p>
				<p
					data-reading
					className={cn(
						'tabular text-lg font-bold',
						tone === 'green' && 'text-flag-green',
						tone === 'red' && 'text-flag-red',
						tone === 'foreground' && 'text-foreground',
					)}
				>
					{formatCurrency(value)}
				</p>
			</div>
		</div>
	)

	return (
		<div className="grid divide-y divide-border border border-border bg-card md:grid-cols-3 md:divide-x md:divide-y-0">
			<Cell label="Receitas" value={income} icon={ArrowUpRight} tone="green" />
			<Cell label="Despesas" value={Math.abs(expenses)} icon={ArrowDownRight} tone="red" />
			<Cell
				label="Balanço"
				value={total}
				icon={Equal}
				tone={total >= 0 ? 'green' : 'red'}
			/>
		</div>
	)
}
