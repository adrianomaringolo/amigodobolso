'use client'

import { FinancialTracker } from '@/components/financial/financial-tracker'
import { Month, MonthNavigator } from 'buildgrid-ui'
import { ptBR } from 'date-fns/locale'
import { ScrollText } from 'lucide-react'
import { useState } from 'react'

export default function Entries() {
	const [currentMonth, setCurrentMonth] = useState<Month>(new Date().getMonth() as Month)
	const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())

	return (
		<div className="space-y-5">
			<header className="border-b border-border pb-3">
				<h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
					<ScrollText className="h-5 w-5 text-primary" />
					Lançamentos
				</h1>
				<p className="notice-label mt-0.5 !normal-case !tracking-normal">
					tudo o que entrou e saiu, dia a dia
				</p>
			</header>

			<div className="border border-border bg-card px-3 py-2 shadow-bill">
				<MonthNavigator
					locale={ptBR}
					currentMonth={currentMonth}
					currentYear={currentYear}
					onChangeMonthYear={(month, year) => {
						setCurrentMonth(month)
						setCurrentYear(year)
					}}
				/>
			</div>

			<FinancialTracker
				monthYear={`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`}
			/>
		</div>
	)
}
