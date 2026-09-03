'use client'

import { cn } from '@/lib/utils'
import { ChartPie, LayoutGrid, Plus, ScrollText, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
	{ icon: LayoutGrid, label: 'Início', href: '/inicio' },
	{ icon: ScrollText, label: 'Lançamentos', href: '/lancamentos' },
	{ icon: ChartPie, label: 'Relatórios', href: '/relatorios' },
	{ icon: User, label: 'Perfil', href: '/perfil' },
]

/** Fixed bottom bar for phones — the daily add-entry loop always one thumb away. */
export function BottomBar() {
	const pathname = usePathname()
	const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

	return (
		<nav
			className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card md:hidden"
			style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
			aria-label="Navegação"
		>
			<div className="edge-perf edge-perf-top absolute inset-x-0 top-0 h-px" aria-hidden />
			<div className="mx-auto grid max-w-md grid-cols-5 items-end px-1">
				{TABS.slice(0, 2).map((t) => (
					<TabLink key={t.href} {...t} active={isActive(t.href)} />
				))}

				<Link
					href="/lancamentos?m=nova"
					className="mx-auto -mt-4 flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-sm bg-accent text-accent-foreground shadow-bill-raised"
					aria-label="Lançar"
				>
					<Plus className="h-6 w-6" strokeWidth={2.5} />
					<span className="text-[0.5625rem] font-bold uppercase tracking-wide">Lançar</span>
				</Link>

				{TABS.slice(2).map((t) => (
					<TabLink key={t.href} {...t} active={isActive(t.href)} />
				))}
			</div>
		</nav>
	)
}

function TabLink({
	icon: Icon,
	label,
	href,
	active,
}: {
	icon: typeof LayoutGrid
	label: string
	href: string
	active: boolean
}) {
	return (
		<Link
			href={href}
			aria-current={active ? 'page' : undefined}
			className={cn(
				'flex flex-col items-center gap-1 py-2.5 text-[0.625rem] font-medium transition-colors',
				active ? 'text-accent' : 'text-muted-foreground',
			)}
		>
			<Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
			{label}
			<span
				className={cn(
					'h-0.5 w-5 rounded-full transition-colors',
					active ? 'bg-accent' : 'bg-transparent',
				)}
			/>
		</Link>
	)
}
