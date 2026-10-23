'use client'

import { FLAG_STYLES } from '@/components/bandeira/flag'
import { Gauge } from '@/components/bandeira/gauge'
import { Painel } from '@/components/bandeira/painel'
import { computeReadings, type CategoryKey } from '@/components/bandeira/use-readings'
import { FinancialEntry } from '@/lib/types/Entry.type'
import { cn, formatCurrency } from '@/lib/utils'

type CategoryChartProps = {
	entries: FinancialEntry[]
}

// The category hues in financial.types are tuned for flags, and two of them are
// near-identical blues — the legend needs every category tellable apart.
const SLICE_COLORS: Partial<Record<CategoryKey, string>> = {
	essential: 'hsl(209 54% 30%)',
	'financial-security': 'hsl(174 55% 32%)',
	charity: 'hsl(4 62% 47%)',
	leisure: 'hsl(43 85% 50%)',
	'long-term': 'hsl(268 32% 48%)',
	'personal-growth': 'hsl(209 22% 60%)',
}

/**
 * The plan next to the month: a fuel gauge per category, then a legend with
 * real % vs. ideal % and how much is left in each one. Both percentages are
 * shares of the month's income, so they compare directly. With no income
 * lançada, total spending is the base.
 */
export const CategoryChart = ({ entries }: CategoryChartProps) => {
	const { income, expenses, categories } = computeReadings(entries)
	const base = income > 0 ? income : expenses

	const rows = categories.map((c) => ({
		...c,
		sliceColor: SLICE_COLORS[c.key] ?? c.color,
		realPct: base > 0 ? (c.used / base) * 100 : 0,
	}))

	return (
		<Painel title="Distribuição de despesas">
			{/* a fuel tank per category: needle = what is left of that category's target */}
			<ul className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3">
				{rows.map((r) => {
					const hasTarget = income > 0 && r.target > 0
					const left = Math.max(r.target - r.used, 0)
					const over = hasTarget && r.used > r.target
					return (
						<li
							key={r.key}
							className="flex flex-col items-center bg-card px-3 pb-3 pt-2.5"
						>
							<span className="mb-1 flex items-center gap-1.5 self-start text-xs font-semibold text-foreground">
								<span
									className="h-2 w-2 shrink-0"
									style={{ backgroundColor: r.sliceColor }}
								/>
								{r.label}
							</span>
							<Gauge
								pct={hasTarget ? (left / r.target) * 100 : undefined}
								className="max-w-[120px]"
							/>
							<span
								data-reading
								className={cn(
									'tabular -mt-0.5 text-base font-bold',
									hasTarget ? FLAG_STYLES[r.flag.level].text : 'text-muted-foreground',
								)}
							>
								{hasTarget ? (
									<>
										<span className="text-[0.6875rem] font-normal text-muted-foreground">
											restam{' '}
										</span>
										{formatCurrency(left)}
									</>
								) : (
									'—'
								)}
							</span>
							<span className="tabular text-[0.6875rem] text-muted-foreground">
								{hasTarget ? (
									<>
										<span className={cn(over && 'font-semibold text-expense')}>
											{formatCurrency(r.used)}
										</span>{' '}
										de {formatCurrency(r.target)}
									</>
								) : (
									'sem alvo'
								)}
							</span>
							<span className="sr-only">
								{hasTarget
									? `${r.flag.chip}, restam ${formatCurrency(left)} do alvo`
									: ''}
							</span>
						</li>
					)
				})}
			</ul>

			<ul className="mt-5 divide-y divide-border border-t border-border">
				<li className="notice-label grid grid-cols-[1fr_auto_auto] gap-3 py-2 !text-[0.625rem]">
					<span>Categoria</span>
					<span className="w-24 whitespace-nowrap text-right">Real / ideal</span>
					<span className="w-28 text-right">{income > 0 ? 'A completar' : ''}</span>
				</li>
				{rows.map((r) => {
					const left = r.target - r.used
					return (
						<li
							key={r.key}
							className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2 text-sm"
						>
							<span className="flex min-w-0 items-center gap-2.5">
								<span
									className="h-2.5 w-2.5 shrink-0"
									style={{ backgroundColor: r.sliceColor }}
								/>
								<span className="text-foreground">{r.label}</span>
							</span>
							<span
								data-reading
								className="tabular w-24 whitespace-nowrap text-right text-muted-foreground"
							>
								{Math.round(r.realPct)}% / {r.targetPct}%
							</span>
							<span
								data-reading
								className={cn(
									'tabular w-28 whitespace-nowrap text-right font-semibold',
									left < 0 ? 'text-expense' : 'text-foreground',
								)}
							>
								{income <= 0
									? '—'
									: left < 0
										? `+${formatCurrency(-left)}`
										: formatCurrency(left)}
							</span>
						</li>
					)
				})}
			</ul>
			{income <= 0 ? (
				<p className="mt-3 text-xs text-muted-foreground">
					Sem receita lançada: o real mostra a fatia de cada categoria no total gasto.
					Lance a receita do mês para comparar com o plano e ver quanto falta.
				</p>
			) : (
				<p className="mt-3 text-xs text-muted-foreground">
					Percentuais sobre a receita do mês. Valores em vermelho passaram do alvo da
					categoria.
				</p>
			)}
		</Painel>
	)
}
