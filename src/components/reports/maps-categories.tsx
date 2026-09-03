'use client'

import { Medidor } from '@/components/bandeira/medidor'
import { useCategoryHistory } from '@/components/bandeira/use-category-history'
import { computeReadings } from '@/components/bandeira/use-readings'
import { useUser } from '@/lib/hooks/use-user'
import { useGetEntries } from '@/services/entries/useGetEntries'
import { Month, MonthNavigator } from 'buildgrid-ui'
import { ptBR } from 'date-fns/locale'
import { useMemo, useState } from 'react'

export const MapsCategories = () => {
	const [year, setYear] = useState(new Date().getFullYear())
	const [month, setMonth] = useState(new Date().getMonth())

	const { user } = useUser()
	const ref = useMemo(() => new Date(year, month, 1), [year, month])

	const { data: entries = [] } = useGetEntries({
		userId: user?.id as string,
		monthYear: `${year}-${(month + 1).toString().padStart(2, '0')}`,
	})

	const readings = useMemo(() => computeReadings(entries), [entries])
	const { history } = useCategoryHistory(user?.id, 6, ref)

	return (
		<div className="space-y-4">
			<div className="border border-border bg-card px-3 py-2 shadow-bill">
				<MonthNavigator
					locale={ptBR}
					currentYear={year}
					currentMonth={month as Month}
					onChangeMonthYear={(m, y) => {
						setMonth(m)
						setYear(y)
					}}
				/>
			</div>

			<section className="border border-border bg-card shadow-bill">
				<header className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
					<h2 className="notice-label !text-xs text-foreground">Mapa de categorias</h2>
					<span className="notice-label !normal-case !tracking-normal">
						gasto / alvo · últimos 6 meses
					</span>
				</header>
				{readings.income <= 0 ? (
					<p className="px-4 py-8 text-center text-sm text-muted-foreground">
						Sem receita lançada neste mês — os alvos das categorias dependem dela.
					</p>
				) : (
					readings.categories.map((reading) => (
						<Medidor
							key={reading.key}
							reading={reading}
							history={history?.[reading.key]}
						/>
					))
				)}
			</section>
		</div>
	)
}
