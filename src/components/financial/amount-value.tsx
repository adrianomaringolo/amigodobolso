import { cn, formatCurrency } from '@/lib/utils'

/**
 * A money reading. Income shows in the institutional blue, expense in the
 * bandeira red; `signed` prefixes a + / − like a movimento line on a bill.
 */
export const AmountValue = (props: {
	value: number
	className?: string
	signed?: boolean
}) => {
	const { value, className, signed } = props
	const color = value >= 0 ? 'text-income' : 'text-expense'
	const sign = signed ? (value > 0 ? '+ ' : value < 0 ? '− ' : '') : ''

	return (
		<span
			data-reading
			className={cn('tabular whitespace-nowrap', color, className)}
		>
			{sign}
			{formatCurrency(Math.abs(value))}
		</span>
	)
}
