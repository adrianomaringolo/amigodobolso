import { cn, formatCurrency } from '@/lib/utils'
import { FLAG_STYLES, type Flag } from './flag'
import { FlagIcon } from './flag-icon'

/**
 * The month's overall bandeira — the headline of the bill. It answers "estou
 * dentro do plano?" before any number: a raised flag at display scale, one
 * plain line, then the plano / gasto / sobra readings in mono.
 */

export function BandeiraGeral({
	flag,
	income,
	expenses,
	className,
}: {
	flag: Flag
	income: number
	expenses: number
	className?: string
}) {
	const s = FLAG_STYLES[flag.level]
	const left = income - expenses

	return (
		<section
			className={cn(
				'flex flex-col overflow-hidden border border-border bg-card shadow-bill sm:flex-row',
				className,
			)}
			aria-label="Bandeira do mês"
		>
			{/* the hoisted flag */}
			<div
				className={cn(
					'flex items-center gap-4 border-b border-border px-5 py-4 sm:w-44 sm:flex-col sm:items-start sm:justify-center sm:gap-3.5 sm:border-b-0 sm:border-r sm:py-5',
					s.soft,
				)}
			>
				<span className="animate-flag-raise origin-bottom">
					<FlagIcon level={flag.level} size={52} />
				</span>
				<div>
					<p className="notice-label !text-[0.625rem]">Bandeira do mês</p>
					<p className={cn('text-base font-bold uppercase tracking-wide', s.text)}>
						{flag.chip}
					</p>
				</div>
			</div>

			<div className="flex flex-1 flex-col justify-center gap-2 px-5 py-4">
				<p className="text-lg font-bold leading-snug text-foreground">{flag.label}</p>
				<div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
					<Reading label="plano" value={income} />
					<Reading label="gasto" value={expenses} />
					<Reading
						label="sobra"
						value={left}
						tone={left >= 0 ? 'green' : 'red'}
					/>
				</div>
			</div>
		</section>
	)
}

function Reading({
	label,
	value,
	tone,
}: {
	label: string
	value: number
	tone?: 'green' | 'red'
}) {
	return (
		<span data-reading className="tabular text-muted-foreground">
			{label}{' '}
			<span
				className={cn(
					'font-bold',
					tone === 'green' && 'text-flag-green',
					tone === 'red' && 'text-flag-red',
					!tone && 'text-foreground',
				)}
			>
				{formatCurrency(value)}
			</span>
		</span>
	)
}
