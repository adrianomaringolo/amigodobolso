'use client'

import type { CategoryKey } from '@/components/bandeira/use-readings'
import { CategoryChart } from '@/components/reports/category-chart'
import { IncomeExpensesTotal } from '@/components/reports/income-expenses-total'
import { YearBarChart } from '@/components/reports/year-bar-chart'
import type { FinancialEntry, MonthlyEntriesSum } from '@/lib/types/Entry.type'
import { cn } from '@/lib/utils'
import { useId, useMemo, useState } from 'react'
import { GASTOS_EXEMPLO, RENDA_EXEMPLO } from './exemplo'

/**
 * Sample months for the landing page: the real report components fed with a
 * fictitious account (same one as the hero bill, "agosto"). Nothing here is a
 * real user's data.
 */
type Gastos = Partial<Record<CategoryKey, number>>

const MESES: { id: string; label: string; month: number; gastos: Gastos }[] = [
	{
		id: 'jun',
		label: 'Junho',
		month: 6,
		gastos: {
			essential: 2700,
			'financial-security': 200,
			charity: 240,
			leisure: 520,
			'long-term': 150,
			'personal-growth': 480,
		},
	},
	{
		id: 'jul',
		label: 'Julho',
		month: 7,
		gastos: {
			essential: 2310,
			'financial-security': 480,
			charity: 100,
			leisure: 380,
			'long-term': 480,
			'personal-growth': 100,
		},
	},
	{ id: 'ago', label: 'Agosto', month: 8, gastos: GASTOS_EXEMPLO },
]

const total = (g: Gastos) => Object.values(g).reduce((a, v) => a + (v ?? 0), 0)

const ANO = 2026
// Jan–mai are plain fictitious totals; jun–ago come from the months above, so both tabs agree.
const DESPESAS_ANTES = [3620, 3980, 3540, 3760, 3890]
const RESUMO_ANO: MonthlyEntriesSum[] = [
	...DESPESAS_ANTES.map((totalExpense, i) => ({
		year: ANO,
		month: i + 1,
		totalIncome: RENDA_EXEMPLO,
		totalExpense,
	})),
	...MESES.map((m) => ({
		year: ANO,
		month: m.month,
		totalIncome: RENDA_EXEMPLO,
		totalExpense: total(m.gastos),
	})),
]

function entriesDoMes(gastos: Gastos): FinancialEntry[] {
	const base = {
		notes: '',
		isCompleted: true,
		date: `${ANO}-08-10`,
		createdAt: `${ANO}-08-10`,
	}
	return [
		{
			...base,
			id: 'renda',
			amount: RENDA_EXEMPLO,
			description: 'Salário',
			category: 'income',
		},
		...Object.entries(gastos).map(([category, valor]) => ({
			...base,
			id: category,
			amount: -(valor ?? 0),
			description: category,
			category,
		})),
	]
}

const ABAS = [
	{ id: 'mes', label: 'Mês' },
	{ id: 'ano', label: 'Ano' },
] as const

export function RelatoriosExemplo({ className }: { className?: string }) {
	const [aba, setAba] = useState<(typeof ABAS)[number]['id']>('mes')
	const [mesId, setMesId] = useState('ago')
	const base = useId()
	const mes = MESES.find((m) => m.id === mesId) ?? MESES[2]
	const entries = useMemo(() => entriesDoMes(mes.gastos), [mes])

	return (
		<div className={cn('border border-border bg-card shadow-bill', className)}>
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5">
				<div role="tablist" aria-label="Tipo de relatório" className="flex gap-1">
					{ABAS.map((a) => (
						<button
							key={a.id}
							role="tab"
							type="button"
							id={`${base}-${a.id}`}
							aria-selected={aba === a.id}
							aria-controls={`${base}-painel`}
							onClick={() => setAba(a.id)}
							className={cn(
								'notice-label border px-3 py-1.5 !text-xs transition-colors',
								aba === a.id
									? 'border-primary bg-primary text-primary-foreground'
									: 'border-border text-foreground hover:bg-secondary/50',
							)}
						>
							{a.label}
						</button>
					))}
				</div>
				<span className="notice-label tabular !tracking-[0.06em]">
					exemplo · dados fictícios
				</span>
			</div>

			<div
				id={`${base}-painel`}
				role="tabpanel"
				aria-labelledby={`${base}-${aba}`}
				className="space-y-5 p-4 md:p-5"
			>
				{aba === 'mes' ? (
					<>
						<div
							role="group"
							aria-label="Mês do exemplo"
							className="flex flex-wrap items-center gap-2"
						>
							<span className="notice-label mr-1">Escolha o mês</span>
							{MESES.map((m) => (
								<button
									key={m.id}
									type="button"
									aria-pressed={mesId === m.id}
									onClick={() => setMesId(m.id)}
									className={cn(
										'border px-3 py-1.5 text-sm font-semibold transition-colors',
										mesId === m.id
											? 'border-foreground bg-foreground text-background'
											: 'border-border text-foreground hover:bg-secondary/50',
									)}
								>
									{m.label}
								</button>
							))}
						</div>
						<div className="border border-border">
							<IncomeExpensesTotal entries={entries} />
						</div>
						<CategoryChart entries={entries} />
					</>
				) : (
					<>
						<p className="text-sm text-muted-foreground">
							Receitas e despesas mês a mês. Passe o mouse ou toque em um mês para ver os
							valores.
						</p>
						<YearBarChart year={ANO} summary={RESUMO_ANO} />
					</>
				)}
			</div>
		</div>
	)
}
