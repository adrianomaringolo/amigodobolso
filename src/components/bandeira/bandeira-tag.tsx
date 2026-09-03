import { cn } from '@/lib/utils'
import { FLAG_STYLES, type Flag } from './flag'
import { FlagIcon } from './flag-icon'

/**
 * The flag chip. Colour never carries the meaning alone: the little hoisted
 * flag plus the word ("no verde / amarelo / vermelho") are always there.
 */
export function BandeiraTag({
	flag,
	showPct = true,
	size = 'md',
	className,
}: {
	flag: Flag
	showPct?: boolean
	size?: 'sm' | 'md'
	className?: string
}) {
	const s = FLAG_STYLES[flag.level]
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1.5 border font-semibold',
				s.soft,
				s.text,
				s.border,
				size === 'sm' ? 'px-1.5 py-0.5 text-[0.6875rem]' : 'px-2 py-1 text-xs',
				className,
			)}
		>
			<FlagIcon level={flag.level} size={size === 'sm' ? 13 : 15} />
			<span className="uppercase tracking-wide">{flag.chip}</span>
			{showPct && Number.isFinite(flag.pct) && (
				<span className="tabular font-bold not-italic">
					{flag.pct >= 999 ? '—' : `${Math.round(flag.pct)}%`}
				</span>
			)}
		</span>
	)
}

/** Small standalone flag mark (kept for back-compat imports). */
export function FlagMark({ level, className }: { level: Flag['level']; className?: string }) {
	return <FlagIcon level={level} size={14} className={className} />
}
