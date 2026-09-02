import { FinancialEntry } from '@/lib/types/Entry.type'
import { Card, CardContent, CardTitle } from 'buildgrid-ui'
import { IncomeExpensesTotal } from '../reports/income-expenses-total'

type MonthSummaryCardProps = {
	entries: FinancialEntry[]
}

export const MonthSummaryCard = (props: MonthSummaryCardProps) => {
	return (
		<Card className="break-inside-avoid-column inline-blockw-full my-4 p-4">
			<CardTitle>Resumo do mês</CardTitle>
			<CardContent className="px-0 py-2 flex flex-col gap-3">
				<IncomeExpensesTotal entries={props.entries} />
			</CardContent>
		</Card>
	)
}
