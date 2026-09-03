'use client'

import { billTabsList, billTabsTrigger } from '@/components/bandeira/bill-tabs'
import { AnnualChart } from '@/components/reports/anual-chart'
import { ExpensesTab } from '@/components/reports/expenses-tab'
import { MapsCategories } from '@/components/reports/maps-categories'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'buildgrid-ui'
import { CalendarRange, Flag, HandCoins, PieChart } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export default function Reports() {
	const searchParams = useSearchParams()

	return (
		<Suspense fallback={<p className="notice-label">Carregando…</p>}>
			<div className="space-y-5">
				<header className="border-b border-border pb-3">
					<h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
						<PieChart className="h-5 w-5 text-primary" />
						Relatórios
					</h1>
					<p className="notice-label mt-0.5 !normal-case !tracking-normal">
						o histórico da sua conta
					</p>
				</header>

				<Tabs defaultValue={searchParams.get('t') ?? 'despesas'}>
					<TabsList className={billTabsList}>
						{[
							{ v: 'despesas', label: 'Despesas', icon: HandCoins },
							{ v: 'mapa', label: 'Mapa', icon: Flag },
							{ v: 'anual', label: 'Anual', icon: CalendarRange },
						].map(({ v, label, icon: Icon }) => (
							<TabsTrigger key={v} value={v} className={billTabsTrigger}>
								<Icon className="h-4 w-4" />
								{label}
							</TabsTrigger>
						))}
					</TabsList>
					<TabsContent value="despesas" className="mt-5">
						<ExpensesTab />
					</TabsContent>
					<TabsContent value="mapa" className="mt-5">
						<MapsCategories />
					</TabsContent>
					<TabsContent value="anual" className="mt-5">
						<AnnualChart />
					</TabsContent>
				</Tabs>
			</div>
		</Suspense>
	)
}
