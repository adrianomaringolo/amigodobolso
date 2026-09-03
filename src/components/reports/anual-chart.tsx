import { useGetMonthlyEntrySums } from '@/services/entries/useGetMonthlyEntrySums'
import { MonthNavigator } from 'buildgrid-ui'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import { YearBarChart } from './year-bar-chart'

export const AnnualChart = () => {
	const { data: entries } = useGetMonthlyEntrySums()

	const [year, setYear] = useState(new Date().getFullYear())

	if (!entries) {
		return null
	}

	return (
		<div className="space-y-4">
			<div className="border border-border bg-card px-3 py-2 shadow-bill">
				<MonthNavigator
					locale={ptBR}
					mode="year"
					currentYear={year}
					onChangeMonthYear={(_, year) => setYear(year)}
					currentMonth={0}
				/>
			</div>
			<div className="border border-border bg-card p-4 shadow-bill">
				<YearBarChart summary={entries} year={year} />
			</div>
		</div>
	)
}
