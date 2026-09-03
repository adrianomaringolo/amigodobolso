import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

type AuthShellProps = PropsWithChildren<{
	title: string
	description?: string
	showBackToLogin?: boolean
}>

/**
 * The account-desk shell for the secondary auth screens: an institutional-blue
 * panel with the mark on the left (desktop), the form on bill paper on the right.
 */
export const AuthShell = ({
	title,
	description,
	showBackToLogin = true,
	children,
}: AuthShellProps) => (
	<div className="grid min-h-dvh md:grid-cols-[minmax(0,22rem)_1fr]">
		<aside className="hidden flex-col justify-between bg-primary p-8 text-primary-foreground md:flex">
			<Link href="/login" className="flex items-center gap-2 self-start">
				<Image
					src="/logo-letter-white.png"
					alt="Amigo do Bolso"
					width={500}
					height={101}
					className="h-9 w-auto"
				/>
			</Link>
			<div className="space-y-3">
				<p className="notice-label !text-primary-foreground/60">A conta do seu mês</p>
				<p className="text-lg font-bold leading-snug">
					Cada categoria hasteia uma bandeira — verde, amarela ou vermelha.
				</p>
				<p className="text-sm text-primary-foreground/70">
					O mesmo sinal que você já entende da conta de luz, agora para o seu dinheiro.
				</p>
			</div>
			<p className="notice-label !text-primary-foreground/50">
				método em parceria com No Final das Contas
			</p>
		</aside>

		<main className="flex flex-col items-center justify-center px-5 py-10">
			<div className="w-full max-w-sm">
				<Link
					href="/login"
					className="mb-8 flex items-center gap-2 md:hidden"
					aria-label="Amigo do Bolso"
				>
					<Image
						src="/logo.png"
						alt=""
						width={40}
						height={40}
						className="h-10 w-10"
					/>
					<span className="font-bold text-foreground">Amigo do Bolso</span>
				</Link>

				<header className="border-b border-border pb-4">
					<h1 className="text-xl font-bold text-foreground">{title}</h1>
					{description && (
						<p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
					)}
				</header>

				<div className="pt-6">{children}</div>

				{showBackToLogin && (
					<Link
						href="/login"
						className="mt-6 block text-center text-sm font-semibold text-accent hover:underline"
					>
						Voltar para o login
					</Link>
				)}
			</div>
		</main>
	</div>
)
