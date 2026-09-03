'use client'

import { MonthlyEntriesSum } from '@/lib/types/Entry.type'
import { cn, formatCurrency } from '@/lib/utils'

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

type YearBarChartProps = {
	year: number
	summary: MonthlyEntriesSum[]
}

/**
 * The year at a glance — receitas vs. despesas per month, drawn as paired
 * bars in the bill palette. Plain markup so it reads the same everywhere.
 */
export function YearBarChart({ year, summary }: YearBarChartProps) {
	const data = MONTHS.map((label, i) => {
		const item = summary.find((s) => s.month === i + 1 && s.year === year)
		return {
			label,
			income: Math.abs(item?.totalIncome ?? 0),
			expense: Math.abs(item?.totalExpense ?? 0),
		}
	})

	const max = Math.max(1, ...data.flatMap((d) => [d.income, d.expense]))
	const hasData = data.some((d) => d.income > 0 || d.expense > 0)

	if (!hasData) {
		return (
			<div className="flex h-56 items-center justify-center border border-dashed border-border text-sm text-muted-foreground">
				Nenhum lançamento encontrado para {year}
			</div>
		)
	}

	return (
		<div>
			<div className="flex items-end gap-2 sm:gap-3" style={{ height: 200 }}>
				{data.map((d) => (
					<div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
						<div className="flex h-full w-full items-end justify-center gap-[3px]">
							<Bar value={d.income} max={max} tone="income" />
							<Bar value={d.expense} max={max} tone="expense" />
						</div>
						<span className="notice-label !text-[0.5625rem] leading-none">{d.label}</span>
					</div>
				))}
			</div>
			<div className="mt-4 flex gap-5 border-t border-border pt-3 text-xs">
				<Key tone="income" label="Receitas" />
				<Key tone="expense" label="Despesas" />
			</div>
		</div>
	)
}

function Bar({
	value,
	max,
	tone,
}: {
	value: number
	max: number
	tone: 'income' | 'expense'
}) {
	const h = value > 0 ? Math.max(2, (value / max) * 100) : 0
	return (
		<div
			className={cn('w-1/2 max-w-[14px]', tone === 'income' ? 'bg-income' : 'bg-expense')}
			style={{ height: `${h}%` }}
			title={`${tone === 'income' ? 'Receitas' : 'Despesas'}: ${formatCurrency(value)}`}
		/>
	)
}

function Key({ tone, label }: { tone: 'income' | 'expense'; label: string }) {
	return (
		<span className="flex items-center gap-1.5 text-muted-foreground">
			<span
				className={cn('h-2.5 w-2.5', tone === 'income' ? 'bg-income' : 'bg-expense')}
			/>
			{label}
		</span>
	)
}
