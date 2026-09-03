import { cn } from '@/lib/utils'

/** Read-only tag chips, in the bill world's neutral chip style. */
export function TagList({
	tags,
	className,
	size = 'sm',
}: {
	tags?: string[]
	className?: string
	size?: 'xs' | 'sm'
}) {
	if (!tags || tags.length === 0) return null
	return (
		<span className={cn('flex flex-wrap gap-1', className)}>
			{tags.map((tag) => (
				<span
					key={tag}
					className={cn(
						'inline-flex items-center border border-border bg-secondary font-medium text-muted-foreground',
						size === 'xs' ? 'px-1 py-px text-[0.625rem]' : 'px-1.5 py-0.5 text-[0.6875rem]',
					)}
				>
					#{tag}
				</span>
			))}
		</span>
	)
}
