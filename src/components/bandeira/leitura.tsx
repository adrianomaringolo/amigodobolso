import { cn, formatCurrency } from '@/lib/utils'

/**
 * A "leitura" — a meter reading. Every monetary or measured value in the app is
 * set in the mono face, tabular, right-alignable, like the readings printed on
 * a utility bill.
 */

export function Leitura({
	value,
	signed = false,
	className,
	prefix,
}: {
	value: number
	/** show +/- like a movimento line */
	signed?: boolean
	className?: string
	prefix?: string
}) {
	const sign = signed ? (value > 0 ? '+ ' : value < 0 ? '− ' : '') : ''
	return (
		<span
			data-reading
			className={cn('tabular whitespace-nowrap', className)}
			style={{ fontVariantNumeric: 'tabular-nums' }}
		>
			{prefix}
			{sign}
			{formatCurrency(Math.abs(value))}
		</span>
	)
}

/** gasto / alvo, the two-part reading under every category */
export function GastoAlvo({
	used,
	target,
	className,
}: {
	used: number
	target: number
	className?: string
}) {
	return (
		<span data-reading className={cn('tabular text-sm', className)}>
			<span className="font-semibold text-foreground">
				{formatCurrency(Math.abs(used))}
			</span>
			<span className="mx-1 text-muted-foreground">/</span>
			<span className="text-muted-foreground">{formatCurrency(Math.abs(target))}</span>
		</span>
	)
}
