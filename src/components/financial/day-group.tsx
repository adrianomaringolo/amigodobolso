import { FinancialEntry } from '@/lib/types/Entry.type'
import { cn, formatCurrency } from '@/lib/utils'
import { formatDateAndWeekday } from '@/lib/utils/date'
import { TransactionItem } from './transaction-item'

export interface DayGroupProps {
	previousAmount: number
	date: string
	transactions: FinancialEntry[]
}

/** A day inside the continuous ledger: a ruled sub-header row, then its lines. */
export const DayGroup = ({ previousAmount, date, transactions }: DayGroupProps) => {
	const balance = transactions.reduce(
		(acc, curr) =>
			curr.amount > 0 ? acc + Math.abs(curr.amount) : acc - Math.abs(curr.amount),
		0,
	)
	const running = previousAmount + balance

	return (
		<>
			<div className="flex items-center justify-between gap-3 bg-secondary/40 px-4 py-1.5">
				<h3 className="notice-label !text-[0.6875rem] text-foreground">
					{formatDateAndWeekday(date)}
				</h3>
				<span data-reading className="tabular text-[0.6875rem] text-muted-foreground">
					saldo{' '}
					<span
						className={cn(
							'font-semibold',
							running >= 0 ? 'text-foreground' : 'text-flag-red',
						)}
					>
						{formatCurrency(running)}
					</span>
				</span>
			</div>
			{transactions.map((transaction) => (
				<TransactionItem key={transaction.id} transaction={transaction} />
			))}
		</>
	)
}
