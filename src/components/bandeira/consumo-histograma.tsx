import { cn } from '@/lib/utils'

/**
 * The consumption histogram from the back of a `conta de luz`: a short row of
 * bars, one per recent month, the current month marked. Bars encode how full
 * the category ran that month (spent / target); over-target bars turn red.
 */

export type ConsumoPonto = {
	label: string // "set", "out"...
	ratio: number // spent / target
	current?: boolean
}

export function ConsumoHistograma({
	pontos,
	className,
	barHeight = 22,
}: {
	pontos: ConsumoPonto[]
	className?: string
	barHeight?: number
}) {
	if (pontos.length === 0) return null
	// scale so a full target (ratio 1) fills ~65% of the height, leaving headroom
	const scaleMax = Math.max(1.15, ...pontos.map((p) => p.ratio))

	return (
		<div className={cn('flex items-end gap-[3px]', className)}>
			{pontos.map((p, i) => {
				const h = Math.max(2, (Math.min(p.ratio, scaleMax) / scaleMax) * barHeight)
				const over = p.ratio > 1
				return (
					<div key={i} className="flex flex-1 flex-col items-center gap-1">
						<div
							className="flex w-full items-end"
							style={{ height: barHeight }}
							title={`${p.label}: ${Math.round(p.ratio * 100)}% do alvo`}
						>
							<div
								className={cn(
									'w-full',
									over
										? 'bg-flag-red/70'
										: p.current
											? 'bg-primary/70'
											: 'bg-primary/20',
								)}
								style={{ height: h }}
							/>
						</div>
						<span
							className={cn(
								'text-[0.5rem] uppercase leading-none tracking-wide',
								p.current ? 'font-semibold text-foreground' : 'text-muted-foreground/70',
							)}
						>
							{p.label}
						</span>
					</div>
				)
			})}
		</div>
	)
}
