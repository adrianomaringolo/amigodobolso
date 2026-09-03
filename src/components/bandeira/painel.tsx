import { cn } from '@/lib/utils'

/**
 * A panel on the bill — a titled section with a ruled header and a paper body.
 * The recurring container of the "A Bandeira" world; replaces the generic card.
 */
export function Painel({
	title,
	aside,
	children,
	bodyClassName,
	className,
}: {
	title: string
	aside?: React.ReactNode
	children: React.ReactNode
	bodyClassName?: string
	className?: string
}) {
	return (
		<section
			className={cn('border border-border bg-card shadow-bill', className)}
		>
			<header className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
				<h2 className="notice-label !text-xs text-foreground">{title}</h2>
				{aside}
			</header>
			<div className={cn('px-4 py-3.5', bodyClassName)}>{children}</div>
		</section>
	)
}

export function PainelVazio({ children }: { children: React.ReactNode }) {
	return (
		<p className="py-4 text-center text-sm text-muted-foreground">{children}</p>
	)
}
