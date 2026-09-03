import { cn } from '@/lib/utils'
import { FLAG_STYLES, type FlagLevel } from './flag'

// Literal values (mirrors the --flag-* tokens in globals.css) so the SVG
// paints correctly even outside a CSS-variable context.
const FILL: Record<FlagLevel, string> = {
	verde: '#29704f',
	amarela: '#f0a017',
	vermelha: '#be2f26',
}

/**
 * A raised flag on a pole, drawn as inline SVG so it renders identically
 * everywhere. `size` is the pole height in px.
 */
export function FlagIcon({
	level,
	size = 44,
	className,
}: {
	level: FlagLevel
	size?: number
	className?: string
}) {
	const w = size * 0.92
	return (
		<svg
			width={w}
			height={size}
			viewBox="0 0 46 48"
			fill="none"
			className={cn('shrink-0', FLAG_STYLES[level].text, className)}
			aria-hidden
		>
			{/* pole */}
			<rect x="3" y="0" width="3.2" height="48" rx="1" fill="currentColor" opacity="0.45" />
			{/* flag — swallowtail pennant */}
			<path
				d="M6.2 3H44l-9.5 10.5L44 24H6.2z"
				fill={FILL[level]}
				stroke={FILL[level]}
				strokeWidth="1"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
