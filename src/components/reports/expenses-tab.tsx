'use client'

import { Painel } from '@/components/bandeira/painel'
import { useUser } from '@/lib/hooks/use-user'
import { useGetEntries } from '@/services/entries/useGetEntries'
import { Month, MonthNavigator } from 'buildgrid-ui'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import { CategoryChart } from './category-chart'
import { ExpensesCategoryTotal } from './expenses-category'
import { IncomeExpensesTotal } from './income-expenses-total'

export const ExpensesTab = () => {
	const [year, setYear] = useState(new Date().getFullYear())
	const [month, setMonth] = useState(new Date().getMonth())

	const { user } = useUser()

	const { data: entries = [] } = useGetEntries({
		userId: user?.id as string,
		monthYear: `${year}-${(month + 1).toString().padStart(2, '0')}`,
	})

	return (
		<div className="space-y-5">
			<div className="border border-border bg-card px-3 py-2 shadow-bill">
				<MonthNavigator
					locale={ptBR}
					mode="month"
					currentYear={year}
					currentMonth={month as Month}
					onChangeMonthYear={(m, y) => {
						setMonth(m)
						setYear(y)
					}}
				/>
			</div>

			<IncomeExpensesTotal entries={entries} />

			<Painel title="Gasto por categoria" bodyClassName="px-0 py-0">
				<ExpensesCategoryTotal entries={entries} />
			</Painel>

			<CategoryChart entries={entries} />
		</div>
	)
}
