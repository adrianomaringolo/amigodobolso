import { FinancialEntry } from '@/lib/types/Entry.type'
import { Card, CardContent, CardTitle } from 'buildgrid-ui'
import { ExpensesCategoryTotal } from '../reports/expenses-category'

type ExpansesCategoryCardProps = {
	entries: FinancialEntry[]
}

export const ExpansesCategoryCard = (props: ExpansesCategoryCardProps) => {
	return (
		<Card className="break-inside-avoid-column inline-blockw-full my-4 p-4">
			<CardTitle>Gastos por categoria</CardTitle>
			<CardContent className="px-0 py-2">
				{props.entries.length === 0 ? (
					<div className="text-center text-gray-500 mt-4">
						Ainda não foram lançadas despesas esse mês
					</div>
				) : (
					<ExpensesCategoryTotal entries={props.entries} />
				)}
			</CardContent>
		</Card>
	)
}
