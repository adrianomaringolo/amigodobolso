'use client'

import { useUser } from '@/lib/hooks/use-user'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	useDialog,
} from 'buildgrid-ui'
import { ChartPie, HelpCircle, LayoutGrid, Lock, LogOut, ScrollText, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import InstallPWAButton from '../install-pwa-button'

export const NAV_ITEMS = [
	{ icon: LayoutGrid, label: 'Início', href: '/inicio' },
	{ icon: ScrollText, label: 'Lançamentos', href: '/lancamentos' },
	{ icon: ChartPie, label: 'Relatórios', href: '/relatorios' },
	{ icon: HelpCircle, label: 'Como usar', href: '/ajuda' },
]

export function ContaMasthead({ isAdmin = false }: { isAdmin?: boolean }) {
	const router = useRouter()
	const pathname = usePathname()
	const supabase = createClient()
	const dialog = useDialog()
	const { user } = useUser()

	const userNames = user?.name?.split(' ') ?? []
	const userInitials =
		`${userNames[0]?.[0] ?? ''}${userNames.length > 1 ? (userNames[userNames.length - 1]?.[0] ?? '') : ''}`.toUpperCase()

	async function handleLogoutClick() {
		dialog.confirm({
			icon: LogOut,
			title: 'Encerrar sessão',
			message: 'Deseja realmente sair do Amigo do Bolso?',
			confirmButton: {
				label: 'Encerrar',
				onClick: async () => {
					await supabase.auth.signOut()
					router.push('/login')
					router.refresh()
				},
			},
			cancelButton: { label: 'Cancelar' },
		})
	}

	return (
		<header className="sticky top-0 z-40 bg-primary text-primary-foreground">
			<div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4 md:px-6">
				<Link href="/inicio" className="flex shrink-0 items-center gap-2.5" aria-label="Amigo do Bolso">
					<Image
						src="/logo-letter-white.png"
						alt=""
						width={132}
						height={40}
						className="h-8 w-auto"
						priority
					/>
				</Link>

				<nav className="ml-2 hidden items-center md:flex">
					{NAV_ITEMS.map(({ icon: Icon, label, href }) => {
						const active = pathname === href || pathname.startsWith(href + '/')
						return (
							<Link
								key={href}
								href={href}
								aria-current={active ? 'page' : undefined}
								className={cn(
									'flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-[1.05rem] text-sm font-medium transition-colors',
									active
										? 'border-accent text-primary-foreground'
										: 'border-transparent text-primary-foreground/70 hover:text-primary-foreground',
								)}
							>
								<Icon className="h-4 w-4" strokeWidth={2} />
								{label}
							</Link>
						)
					})}
				</nav>

				<div className="ml-auto flex shrink-0 items-center gap-1">
					<div className="hidden sm:block">
						<InstallPWAButton />
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								className="flex items-center gap-2 rounded-sm px-1.5 py-1 outline-none hover:bg-white/10 focus-visible:bg-white/10"
								aria-label="Sua conta"
							>
								<Avatar className="h-8 w-8 border border-white/25">
									<AvatarImage src={user?.picture as string} alt="" />
									<AvatarFallback className="bg-accent text-xs font-bold text-accent-foreground">
										{userInitials || <User className="h-4 w-4" />}
									</AvatarFallback>
								</Avatar>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-60" align="end">
							<DropdownMenuLabel className="font-normal">
								<p className="text-sm font-semibold text-foreground">
									{user?.name ?? 'Sua conta'}
								</p>
								<p className="truncate text-xs text-muted-foreground">{user?.email}</p>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{isAdmin && (
								<DropdownMenuItem asChild>
									<Link href="/admin">
										<Lock className="mr-2 h-4 w-4" />
										Administração
									</Link>
								</DropdownMenuItem>
							)}
							<DropdownMenuItem asChild>
								<Link href="/perfil">
									<User className="mr-2 h-4 w-4" />
									Meu perfil
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleLogoutClick}>
								<LogOut className="mr-2 h-4 w-4" />
								Encerrar sessão
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="edge-perf edge-perf-bottom h-px w-full" aria-hidden />
		</header>
	)
}
