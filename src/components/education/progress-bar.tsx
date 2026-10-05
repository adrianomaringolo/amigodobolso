import { cn } from '@/lib/utils'

/** Thin ruled progress bar; turns flag-green once the series is finished. */
export function ProgressBar({
	percent,
	className,
}: {
	percent: number
	className?: string
}) {
	return (
		<div
			role="progressbar"
			aria-valuenow={percent}
			aria-valuemin={0}
			aria-valuemax={100}
			className={cn('h-2 w-full bg-secondary', className)}
		>
			<div
				className={cn(
					'h-full transition-[width] duration-500 ease-out',
					percent === 100 ? 'bg-flag-green' : 'bg-accent',
				)}
				style={{ width: `${percent}%` }}
			/>
		</div>
	)
}
