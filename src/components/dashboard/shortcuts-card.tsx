'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardTitle } from 'buildgrid-ui'
import { BadgePlus, DollarSign, Gauge, List } from 'lucide-react'
import Link from 'next/link'

export const ShortcutsCard = () => {
	return (
		<Card className="break-inside-avoid-column inline-block w-full mt-0 p-4">
			<CardTitle>Atalhos</CardTitle>
			<CardContent className="flex flex-wrap px-0 pt-2 gap-2">
				<Link href="/lancamentos?m=nova" className="flex-1 min-w-32">
					<div
						className={cn(
							'border p-3 rounded my-1 flex flex-col gap-2 justify-center items-center',
							'text-blue-400 cursor-pointer transition-all',
							'hover:bg-blue-400 hover:text-white hover:border-blue-400',
						)}
					>
						<BadgePlus size={40} />
						<p className="text-gray-900 text-center text-sm">Adicionar</p>
					</div>
				</Link>
				<Link href="/lancamentos" className="flex-1 min-w-32">
					<div
						className={cn(
							'border p-3 rounded my-1 flex flex-col gap-2 justify-center items-center',
							'text-gray-400 cursor-pointer transition-all',
							'hover:bg-gray-400 hover:text-white hover:border-gray-400',
						)}
					>
						<DollarSign size={40} />
						<p className="text-gray-900 text-center text-sm">Lançamentos</p>
					</div>
				</Link>
				<Link href="/relatorios?t=despesas" className="flex-1 min-w-32">
					<div
						className={cn(
							'border p-3 rounded my-1 flex flex-col gap-2 justify-center items-center',
							'text-orange-400 cursor-pointer transition-all',
							'hover:bg-orange-400 hover:text-white hover:border-orange-400',
						)}
					>
						<List size={40} />
						<p className="text-gray-900 text-center text-sm">Relatório despesas</p>
					</div>
				</Link>
				<Link href="/relatorios?t=mapa" className="flex-1 min-w-32">
					<div
						className={cn(
							'border p-3 rounded my-1 flex flex-col gap-2 justify-center items-center',
							'text-red-400 cursor-pointer transition-all',
							'hover:bg-red-400 hover:text-white hover:border-red-400',
						)}
					>
						<Gauge size={40} />
						<p className="text-gray-900 text-center text-sm">Mapa de categorias</p>
					</div>
				</Link>
			</CardContent>
		</Card>
	)
}
