import { cn } from '@/lib/utils'
import { useId } from 'react'

/** The dial runs from an empty tank (0%, left) to a full one (100%, right). */
const MAX = 100

// A horizontal gradient across the dial, red at "vazio" and blue at "cheio".
// Offsets are where each value lands on the arc's x axis (x = cos of its angle),
// so the pure flag colours sit on the flagFor() thresholds read as what is left:
// red at 0, amber up to 15% left (85% spent), blue from ~40% left.
const STOPS = [
	{ offset: 0, color: 'hsl(var(--flag-red))' }, // nothing left
	{ offset: 0.055, color: 'hsl(var(--flag-amber-fill))' }, // 15% left
	{ offset: 0.12, color: 'hsl(var(--flag-amber-fill))' }, // ~22% left
	{ offset: 0.345, color: 'hsl(var(--flag-blue))' }, // 40% left
	{ offset: 1, color: 'hsl(var(--flag-blue))' },
]

const CX = 50
const CY = 50
const R = 38

/** Value (0–MAX) → point on the upper semicircle, left to right. */
function point(value: number, radius = R) {
	const angle = Math.PI * (1 - Math.min(Math.max(value, 0), MAX) / MAX)
	return { x: CX + radius * Math.cos(angle), y: CY - radius * Math.sin(angle) }
}

function arc(from: number, to: number) {
	const a = point(from)
	const b = point(to)
	return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`
}

/**
 * A fuel gauge for a category: the needle starts at "cheio" (right, blue) and
 * falls toward "vazio" (left, red) as the target gets spent. `pct` is what is
 * left of the target, in %; an overrun stays pinned at 0. With `pct` undefined
 * (no target yet) the dial is drawn neutral with no needle.
 */
export function Gauge({ pct, className }: { pct?: number; className?: string }) {
	// useId() contains ':' / '«»', which break a url(#…) reference — keep it alphanumeric
	const gradientId = `gauge-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
	const needle = pct === undefined ? null : point(pct, R - 9)
	return (
		<svg viewBox="0 0 100 58" className={cn('w-full', className)} aria-hidden>
			<defs>
				<linearGradient
					id={gradientId}
					gradientUnits="userSpaceOnUse"
					x1={CX - R}
					x2={CX + R}
				>
					{STOPS.map((s) => (
						<stop key={s.offset} offset={s.offset} stopColor={s.color} />
					))}
				</linearGradient>
			</defs>
			<path
				d={arc(0, MAX)}
				fill="none"
				stroke={pct === undefined ? 'hsl(var(--border))' : `url(#${gradientId})`}
				strokeWidth="11"
			/>
			{needle && (
				<>
					<line
						x1={CX}
						y1={CY}
						x2={needle.x}
						y2={needle.y}
						stroke="hsl(var(--foreground))"
						strokeWidth="3"
						strokeLinecap="round"
					/>
					<circle cx={CX} cy={CY} r="4.5" fill="hsl(var(--foreground))" />
				</>
			)}
		</svg>
	)
}
