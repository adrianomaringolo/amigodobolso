'use client'

import { MonthlyEntriesSum } from '@/lib/types/Entry.type'
import { cn, formatCurrency } from '@/lib/utils'
import { useState } from 'react'

const MONTH_NAMES = [
	'Janeiro',
	'Fevereiro',
	'Março',
	'Abril',
	'Maio',
	'Junho',
	'Julho',
	'Agosto',
	'Setembro',
	'Outubro',
	'Novembro',
	'Dezembro',
]

const MONTHS = [
	'jan',
	'fev',
	'mar',
	'abr',
	'mai',
	'jun',
	'jul',
	'ago',
	'set',
	'out',
	'nov',
	'dez',
]

type YearBarChartProps = {
	year: number
	summary: MonthlyEntriesSum[]
}

/**
 * The year at a glance — receitas vs. despesas per month, drawn as paired
 * bars in the bill palette. Plain markup so it reads the same everywhere.
 * Hovering (desktop) or tapping (touch) a month opens its details.
 */
export function YearBarChart({ year, summary }: YearBarChartProps) {
	const [active, setActive] = useState<number | null>(null)

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
			<div
				className="flex gap-1 sm:gap-2"
				style={{ height: 200 }}
				onMouseLeave={() => setActive(null)}
			>
				{data.map((d, i) => (
					<button
						key={d.label}
						type="button"
						aria-label={`${MONTH_NAMES[i]}: receitas ${formatCurrency(d.income)}, despesas ${formatCurrency(d.expense)}`}
						aria-expanded={active === i}
						onMouseEnter={() => setActive(i)}
						onFocus={() => setActive(i)}
						onBlur={() => setActive(null)}
						// a tap fires mouseenter and then click — toggling here would close it at once
						onClick={() => setActive(i)}
						className={cn(
							'relative flex h-full flex-1 flex-col items-center gap-1.5 pt-1 outline-none transition-colors',
							active === i ? 'bg-muted/70' : 'hover:bg-muted/40',
						)}
					>
						<div className="flex min-h-0 w-full flex-1 items-end justify-center gap-[3px]">
							<Bar value={d.income} max={max} tone="income" />
							<Bar value={d.expense} max={max} tone="expense" />
						</div>
						<span className="notice-label pb-1 !text-[0.5625rem] leading-none">
							{d.label}
						</span>
						{active === i && (
							<Details
								month={`${MONTH_NAMES[i]} ${year}`}
								income={d.income}
								expense={d.expense}
								align={i < 3 ? 'left' : i > 7 ? 'right' : 'center'}
							/>
						)}
					</button>
				))}
			</div>
			<div className="mt-4 flex gap-5 border-t border-border pt-3 text-xs">
				<Key tone="income" label="Receitas" />
				<Key tone="expense" label="Despesas" />
			</div>
		</div>
	)
}

function Details({
	month,
	income,
	expense,
	align,
}: {
	month: string
	income: number
	expense: number
	align: 'left' | 'center' | 'right'
}) {
	const balance = income - expense
	return (
		<div
			role="tooltip"
			className={cn(
				'pointer-events-none absolute bottom-full z-10 mb-2 w-48 border border-border bg-card px-3 py-2.5 text-left shadow-bill',
				align === 'left' && 'left-0',
				align === 'center' && 'left-1/2 -translate-x-1/2',
				align === 'right' && 'right-0',
			)}
		>
			<p className="notice-label mb-1.5 !text-[0.625rem] text-foreground">{month}</p>
			<Row tone="income" label="Receitas" value={formatCurrency(income)} />
			<Row tone="expense" label="Despesas" value={formatCurrency(expense)} />
			<div className="mt-1.5 flex justify-between border-t border-border pt-1.5 text-xs">
				<span className="text-muted-foreground">Saldo</span>
				<span
					data-reading
					className={cn(
						'tabular font-semibold',
						balance < 0 ? 'text-expense' : 'text-foreground',
					)}
				>
					{formatCurrency(balance)}
				</span>
			</div>
		</div>
	)
}

function Row({
	tone,
	label,
	value,
}: {
	tone: 'income' | 'expense'
	label: string
	value: string
}) {
	return (
		<div className="flex items-center justify-between gap-3 py-0.5 text-xs">
			<span className="flex items-center gap-1.5 text-muted-foreground">
				<span className={cn('h-2 w-2', tone === 'income' ? 'bg-income' : 'bg-expense')} />
				{label}
			</span>
			<span data-reading className="tabular font-semibold text-foreground">
				{value}
			</span>
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
