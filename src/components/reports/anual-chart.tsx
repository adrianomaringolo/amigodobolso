import { useGetMonthlyEntrySums } from '@/services/entries/useGetMonthlyEntrySums'
import { MonthNavigator } from 'buildgrid-ui'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import { YearBarChart } from './year-bar-chart'

export const AnnualChart = () => {
	const { data: entries, isLoading, isError } = useGetMonthlyEntrySums()

	const [year, setYear] = useState(new Date().getFullYear())

	if (isLoading) {
		return <p className="notice-label">Carregando…</p>
	}

	if (isError || !entries) {
		return (
			<p className="border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
				Não foi possível carregar o resumo anual. Tente novamente em instantes.
			</p>
		)
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
