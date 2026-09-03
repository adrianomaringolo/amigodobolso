import { FinancialEntry } from '@/lib/types/Entry.type'
import { cn, formatCurrency } from '@/lib/utils'

export const MonthSummary = ({ transactions }: { transactions: FinancialEntry[] }) => {
	const income = transactions
		.filter((t) => t.amount > 0)
		.reduce((acc, curr) => acc + curr.amount, 0)

	const expenses = transactions
		.filter((t) => t.amount <= 0)
		.reduce((acc, curr) => acc - curr.amount, 0)

	const total = income - expenses

	const Row = ({
		label,
		value,
		tone = 'foreground',
		strong,
		border,
	}: {
		label: string
		value: number
		tone?: 'foreground' | 'green' | 'red'
		strong?: boolean
		border?: boolean
	}) => (
		<div
			className={cn(
				'flex items-center justify-between py-2',
				border && 'border-t border-border pt-3',
			)}
		>
			<span
				className={cn(
					'text-sm',
					strong ? 'font-semibold text-foreground' : 'text-muted-foreground',
				)}
			>
				{label}
			</span>
			<span
				data-reading
				className={cn(
					'tabular text-sm',
					strong ? 'text-base font-bold' : 'font-semibold',
					tone === 'green' && 'text-flag-green',
					tone === 'red' && 'text-flag-red',
					tone === 'foreground' && 'text-foreground',
				)}
			>
				{formatCurrency(value)}
			</span>
		</div>
	)

	return (
		<div className="divide-y divide-border/60">
			<Row label="Entradas" value={income} tone="green" />
			<Row label="Saídas" value={-expenses} tone="red" />
			<Row
				label="Sobrou no mês"
				value={total}
				tone={total >= 0 ? 'green' : 'red'}
				strong
				border
			/>
		</div>
	)
}
