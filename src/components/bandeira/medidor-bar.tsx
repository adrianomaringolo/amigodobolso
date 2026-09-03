import { cn } from '@/lib/utils'
import { FLAG_STYLES, type Flag } from './flag'

/**
 * The meter bar. One shared scale for every category: 0 at the left, the target
 * sits at a fixed 72% of the track so there is always headroom to show an
 * overrun, and the fill runs green/amber/red under the target tick.
 */

const TARGET_AT = 72 // % of the track width where every category's target line sits

export function MedidorBar({
	flag,
	className,
	height = 'h-2.5',
}: {
	flag: Flag
	className?: string
	height?: string
}) {
	const s = FLAG_STYLES[flag.level]
	// map spend-vs-target onto the track: at 100% of target -> TARGET_AT of track
	const raw = Number.isFinite(flag.pct) ? flag.pct : 100
	const fill = Math.min((raw / 100) * TARGET_AT, 100)

	return (
		<div className={cn('relative w-full', className)}>
			<div className={cn('w-full bg-secondary', height)}>
				<div
					className={cn('h-full transition-[width] duration-500 ease-out', s.fill)}
					style={{ width: `${fill}%` }}
				/>
			</div>
			{/* target tick — the fixed point every category's spending is read against */}
			<div
				className="absolute -bottom-1 -top-1 w-[2px] bg-primary"
				style={{ left: `${TARGET_AT}%` }}
				aria-hidden
			/>
		</div>
	)
}
