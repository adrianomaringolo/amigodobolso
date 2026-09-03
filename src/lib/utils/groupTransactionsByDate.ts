import { FinancialEntry } from '../types/Entry.type'

type GroupedTransaction = {
	date: string // YYYY-MM-DD
	previousAmount: number
	transactions: FinancialEntry[]
}

/**
 * Group entries by calendar day (YYYY-MM-DD), oldest first, tracking the running
 * balance so each day knows the balance it started from.
 */
export function groupTransactionsByDate(
	transactions: FinancialEntry[],
): GroupedTransaction[] {
	const day = (t: FinancialEntry) => t.date.slice(0, 10)

	const sorted = [...transactions].sort((a, b) => day(a).localeCompare(day(b)))

	const grouped: Record<string, GroupedTransaction> = {}
	let cumulativeAmount = 0

	for (const transaction of sorted) {
		const key = day(transaction)
		if (!grouped[key]) {
			grouped[key] = { date: key, previousAmount: cumulativeAmount, transactions: [] }
		}
		cumulativeAmount += transaction.amount ?? 0
		grouped[key].transactions.push(transaction)
	}

	return Object.values(grouped)
}
