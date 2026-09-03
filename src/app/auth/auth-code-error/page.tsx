import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Erro de autenticação | Amigo do Bolso',
	description: 'Não foi possível concluir o acesso à sua conta.',
}

export default function AuthCodeErrorPage() {
	return (
		<div className="flex min-h-dvh flex-col items-center justify-center bg-background p-6">
			<div className="w-full max-w-sm border border-border bg-card p-6 text-center shadow-bill">
				<Image
					src="/logo.png"
					alt=""
					width={64}
					height={64}
					className="mx-auto mb-4 h-16 w-16"
				/>
				<p className="notice-label text-flag-red">Falha na autenticação</p>
				<h1 className="mt-1 text-base font-bold text-foreground">
					Não foi possível concluir o acesso
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					O link de autenticação é inválido ou já expirou. Tente entrar novamente ou
					solicitar um novo e-mail.
				</p>
				<Link
					href="/login"
					className="mt-6 inline-flex items-center gap-2 border border-accent bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
				>
					Voltar para o login
				</Link>
			</div>
		</div>
	)
}
