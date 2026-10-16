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
// near-identical blues — a pie needs every slice tellable apart.
const SLICE_COLORS: Partial<Record<CategoryKey, string>> = {
	essential: 'hsl(209 54% 30%)',
	'financial-security': 'hsl(174 55% 32%)',
	charity: 'hsl(4 62% 47%)',
	leisure: 'hsl(43 85% 50%)',
	'long-term': 'hsl(268 32% 48%)',
	'personal-growth': 'hsl(209 22% 60%)',
}

type Slice = { key: string; color: string; pct: number }

/**
 * The plan next to the month — two pies with the same slice order and colours:
 * the Dolfyn split (ideal) and how spending actually split. The legend carries
 * real % vs. ideal % and how much is left in each category. Both are shares
 * of the month's income, so they compare directly; the grey left in "Seu mês"
 * is income not yet spent. With no income lançada, total spending is the base.
 */
export const CategoryChart = ({ entries }: CategoryChartProps) => {
	const { income, expenses, categories } = computeReadings(entries)
	const base = income > 0 ? income : expenses

	const rows = categories.map((c) => ({
		...c,
		sliceColor: SLICE_COLORS[c.key] ?? c.color,
		realPct: base > 0 ? (c.used / base) * 100 : 0,
	}))

	// Spending above income would overflow the circle — scale the slices to fit.
	const realTotal = rows.reduce((acc, r) => acc + r.realPct, 0)
	const fit = realTotal > 100 ? 100 / realTotal : 1

	const ideal: Slice[] = rows.map((r) => ({
		key: r.key,
		color: r.sliceColor,
		pct: r.targetPct,
	}))
	const real: Slice[] = rows.map((r) => ({
		key: r.key,
		color: r.sliceColor,
		pct: r.realPct * fit,
	}))

	return (
		<Painel title="Distribuição de despesas">
			<div className="grid grid-cols-2 gap-4 sm:gap-8">
				<Pie title="Plano ideal" slices={ideal} />
				<Pie
					title="Seu mês"
					slices={real}
					empty={expenses === 0 ? 'Nenhuma despesa lançada' : undefined}
				/>
			</div>

			{/* criticality per category: needle = spent as a % of that category's target */}
			<ul className="mt-6 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3">
				{rows.map((r) => {
					const pct = income > 0 && r.target > 0 ? (r.used / r.target) * 100 : undefined
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
							<Gauge pct={pct} className="max-w-[120px]" />
							<span
								data-reading
								className={cn(
									'tabular -mt-0.5 text-base font-bold',
									pct === undefined
										? 'text-muted-foreground'
										: FLAG_STYLES[r.flag.level].text,
								)}
							>
								{pct === undefined ? '—' : `${Math.round(pct)}%`}
							</span>
							<span className="tabular text-[0.6875rem] text-muted-foreground">
								{pct === undefined
									? 'sem alvo'
									: `${formatCurrency(r.used)} de ${formatCurrency(r.target)}`}
							</span>
							<span className="sr-only">
								{pct === undefined ? '' : `${r.flag.chip}, ${Math.round(pct)}% do alvo`}
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
					Percentuais sobre a receita do mês. Em cinza, o que ainda não foi gasto; valores
					em vermelho passaram do alvo da categoria.
				</p>
			)}
		</Painel>
	)
}

/** A pie drawn as dashed strokes on a circle of circumference 100 — one per slice. */
function Pie({
	title,
	slices,
	empty,
}: {
	title: string
	slices: Slice[]
	empty?: string
}) {
	let offset = 0
	return (
		<figure className="flex flex-col items-center gap-2">
			<svg
				viewBox="0 0 42 42"
				className="w-full max-w-[180px]"
				role="img"
				aria-label={title}
			>
				<circle
					cx="21"
					cy="21"
					r="15.9155"
					fill="none"
					stroke="hsl(var(--border))"
					strokeWidth="10"
				/>
				{!empty &&
					slices
						.filter((s) => s.pct > 0)
						.map((s) => {
							const dash = (
								<circle
									key={s.key}
									cx="21"
									cy="21"
									r="15.9155"
									fill="none"
									stroke={s.color}
									strokeWidth="10"
									strokeDasharray={`${s.pct} ${100 - s.pct}`}
									strokeDashoffset={25 - offset}
								/>
							)
							offset += s.pct
							return dash
						})}
			</svg>
			<figcaption className="notice-label text-center !text-xs text-foreground">
				{title}
			</figcaption>
			{empty && <p className="text-center text-xs text-muted-foreground">{empty}</p>}
		</figure>
	)
}
