import { cn } from '@/lib/utils'
import { useId } from 'react'

/** The dial runs 0–150% of the category target; anything past that pins the needle. */
const MAX = 150

// A horizontal gradient across the dial. Offsets are where each value lands on
// the arc's x axis (x = cos of its angle), so the pure flag colours sit on the
// flagFor() thresholds: blue up to ~60%, amber at 85–100%, red from ~120%.
const STOPS = [
	{ offset: 0, color: 'hsl(var(--flag-blue))' },
	{ offset: 0.345, color: 'hsl(var(--flag-blue))' }, // 60%
	{ offset: 0.604, color: 'hsl(var(--flag-amber-fill))' }, // 85%
	{ offset: 0.75, color: 'hsl(var(--flag-amber-fill))' }, // 100%
	{ offset: 0.905, color: 'hsl(var(--flag-red))' }, // 120%
	{ offset: 1, color: 'hsl(var(--flag-red))' },
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
 * A criticality dial: a blue → amber → red gradient, the needle at `pct` (spent as
 * a % of the category target). With `pct` undefined (no target yet) the dial
 * is drawn neutral with no needle.
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
