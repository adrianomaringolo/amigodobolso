/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { AmountTypes, TransactionTypes } from '@/components/financial/financial.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'buildgrid-ui'
import { HelpCircle } from 'lucide-react'

export default function Help() {
	// convert Object.entries(TransactionTypes) to an array of objects filtering by type === expanses
	const categories = Object.entries(TransactionTypes)
		.filter(([_, value]) => value.type === AmountTypes.expanses)
		.map(([_, value]) => value)

	return (
		<section>
			<h2 className="text-2xl font-semibold flex gap-2 items-center">
				<HelpCircle /> Ajuda
			</h2>
			<Tabs defaultValue="categorias" className="mt-8">
				<TabsList>
					<TabsTrigger value="categorias" className="px-4 py-3 gap-2 bg-gray-50">
						Categorias
					</TabsTrigger>
					<TabsTrigger value="transacoes" className="px-4 py-3 gap-2 bg-gray-50">
						Lançamentos
					</TabsTrigger>
					<TabsTrigger value="graficos" className="px-4 py-3 gap-2 bg-gray-50">
						Gráficos
					</TabsTrigger>
				</TabsList>
				<TabsContent value="categorias" className="p-2">
					<section className="mt-4">
						{categories.map((category) => (
							<div
								key={category.label}
								className="flex justify-between py-4 border-b hover:bg-gray-50"
							>
								<div className="flex gap-5">
									{category.icon('min-w-20 min-h-20')}
									<div>
										<p className="text-lg mb-2 font-semibold">{category.label}</p>
										<div dangerouslySetInnerHTML={{ __html: category.help }} />
									</div>
								</div>
							</div>
						))}
					</section>
				</TabsContent>
				<TabsContent value="lancamentos" className="p-2">
					<section className="mt-4">Explicação sobre os lançamentos</section>
				</TabsContent>
				<TabsContent value="graficos" className="p-2">
					<section className="mt-4">Explicação sobre os gráficos</section>
				</TabsContent>
			</Tabs>
		</section>
	)
}
