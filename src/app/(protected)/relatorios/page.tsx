'use client'

import { AnnualChart } from '@/components/reports/anual-chart'
import { ExpensesTab } from '@/components/reports/expenses-tab'
import { MapsCategories } from '@/components/reports/maps-categories'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'buildgrid-ui'
import { ChartColumn, Gauge, HandCoins, PieChart } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export default function Reports() {
	const searchParams = useSearchParams()

	return (
		<Suspense fallback={<div>Carregando...</div>}>
			<section>
				<h2 className="text-2xl font-semibold flex gap-2 items-center">
					<PieChart /> Relatórios
				</h2>
				<Tabs defaultValue={searchParams.get('t') ?? 'despesas'} className="mt-8">
					<TabsList>
						<TabsTrigger value="despesas" className="px-4 py-3 gap-2 bg-gray-50">
							<HandCoins />
							Despesas
						</TabsTrigger>
						<TabsTrigger value="mapa" className="px-4 py-3 gap-2 bg-gray-50">
							<Gauge />
							Mapa
						</TabsTrigger>
						<TabsTrigger value="anual" className="px-4 py-3 gap-2 bg-gray-50">
							<ChartColumn />
							Anual
						</TabsTrigger>
					</TabsList>
					<TabsContent value="despesas" className="p-2">
						<ExpensesTab />
					</TabsContent>
					<TabsContent value="mapa" className="p-2">
						<MapsCategories />
					</TabsContent>
					<TabsContent value="anual" className="p-2">
						<AnnualChart />
					</TabsContent>
				</Tabs>
			</section>
		</Suspense>
	)
}
