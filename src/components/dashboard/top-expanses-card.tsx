import { FinancialEntry } from '@/lib/types/Entry.type'
import { formatDateAndMonth } from '@/lib/utils/date'
import { Card, CardContent, CardTitle } from 'buildgrid-ui'
import { AmountValue } from '../financial/amount-value'
import { TransactionTypes } from '../financial/financial.types'

type TopExpansesCardProps = {
	entries: FinancialEntry[]
}

export const TopExpansesCard = (props: TopExpansesCardProps) => {
	const topExpanses = props.entries
		.filter((entry) => entry.amount < 0)
		.sort((a, b) => a.amount - b.amount)
		.slice(0, 5)

	return (
		<Card className="break-inside-avoid-column inline-block w-full my-4 mt-0 p-4">
			<CardTitle>Top 5 despesas</CardTitle>

			<CardContent className="px-0 py-4">
				{topExpanses.length === 0 && (
					<div className="text-center text-gray-500 mt-4">Nenhuma despesa lançada</div>
				)}
				{topExpanses.map((entry) => {
					const typeDefinition =
						TransactionTypes[entry.category as keyof typeof TransactionTypes]

					return (
						<div key={entry.id} className="w-full">
							<div className="flex items-center justify-between cursor-pointer py-1 ">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
										{typeDefinition?.icon()}
									</div>
									<div>
										<p>{entry.description}</p>
										<p className="text-xs italic">{formatDateAndMonth(entry.date)}</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<AmountValue value={entry.amount} />
								</div>
							</div>
						</div>
					)
				})}
			</CardContent>
		</Card>
	)
}
