'use client'

import { GoogleLoginButton } from '@/components/access/google-login-button'
import { BandeiraTag } from '@/components/bandeira/bandeira-tag'
import { flagFor } from '@/components/bandeira/flag'
import { createClient } from '@/lib/supabase/client'
import { authErrors } from '@/lib/types/Auth.type'
import { Button, Input, useDialog } from 'buildgrid-ui'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, Suspense, useState } from 'react'

const SAMPLE = [
	{ label: 'Necessidades essenciais', used: 1980, target: 2475 },
	{ label: 'Lazer', used: 520, target: 450 },
	{ label: 'Tranquilidade financeira', used: 300, target: 450 },
]

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const router = useRouter()

	const supabase = createClient()
	const dialog = useDialog()

	async function handleSubmit(event: FormEvent) {
		event.preventDefault()

		const response = await supabase.auth.signInWithPassword({ email, password })

		if (response.error) {
			dialog.error({
				title: 'Erro ao acessar sua conta',
				message: authErrors[response.error.code as keyof typeof authErrors],
			})
			console.warn(response.error)
			return
		}

		if (response.data.session) {
			router.push('/')
		}
	}

	return (
		<Suspense>
			<div className="grid min-h-dvh md:grid-cols-2">
				{/* Left — the pitch, in the world */}
				<aside className="flex flex-col justify-between gap-10 bg-primary px-6 py-10 text-primary-foreground md:px-12 md:py-14">
					<Image
						src="/logo-letter-white.png"
						alt="Amigo do Bolso"
						width={170}
						height={50}
						className="h-10 w-auto"
						priority
					/>

					<div className="space-y-5">
						<p className="notice-label !text-primary-foreground/60">A conta do seu mês</p>
						<h2 className="text-3xl font-bold leading-tight md:text-4xl">
							Cada categoria hasteia uma bandeira. Você vê na hora se passou do plano.
						</h2>
						<p className="max-w-md text-sm text-primary-foreground/75">
							Verde, amarela, vermelha — o mesmo sinal que o Brasil inteiro entende da
							conta de luz, agora aplicado ao seu dinheiro. Sem planilha.
						</p>

						<div className="mt-2 border border-white/15 bg-white/[0.06] p-4">
							<p className="notice-label !text-primary-foreground/55">
								Exemplo · agosto
							</p>
							<ul className="mt-3 space-y-2.5">
								{SAMPLE.map((s) => {
									const flag = flagFor(s.used, s.target)
									return (
										<li key={s.label} className="flex items-center justify-between gap-3">
											<span className="text-sm text-primary-foreground/85">
												{s.label}
											</span>
											<BandeiraTag flag={flag} size="sm" />
										</li>
									)
								})}
							</ul>
						</div>
					</div>

					<p className="notice-label !text-primary-foreground/45">
						método em parceria com No Final das Contas
					</p>
				</aside>

				{/* Right — the form */}
				<main className="flex flex-col items-center justify-center px-5 py-10">
					<div className="w-full max-w-sm">
						<h1 className="text-2xl font-bold text-foreground">Acesse sua conta</h1>
						<p className="mt-1.5 text-sm text-muted-foreground">
							Bom te ver de novo.{' '}
							<Link
								href="/register"
								className="font-semibold text-accent hover:underline"
							>
								Criar uma conta
							</Link>
						</p>

						<form className="mt-7 space-y-4" onSubmit={handleSubmit}>
							<label className="block">
								<span className="notice-label">E-mail</span>
								<Input
									sizing="lg"
									name="email"
									type="email"
									autoComplete="email"
									required
									placeholder="voce@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="mt-1.5"
								/>
							</label>

							<label className="block">
								<span className="notice-label">Senha</span>
								<Input
									sizing="lg"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="mt-1.5"
								/>
							</label>

							<div className="flex justify-end">
								<Link
									href="/recover"
									className="text-sm font-medium text-accent hover:underline"
								>
									Esqueci minha senha
								</Link>
							</div>

							<Button type="submit" size="lg" className="w-full">
								Entrar
							</Button>
						</form>

						<div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
							<span className="h-px flex-1 bg-border" />
							ou
							<span className="h-px flex-1 bg-border" />
						</div>

						<GoogleLoginButton />

						<p className="mt-8 text-center text-xs text-muted-foreground">
							Ao continuar, você concorda com os{' '}
							<Link
								href="/termos-de-uso"
								className="font-semibold text-accent hover:underline"
							>
								Termos de uso
							</Link>{' '}
							e a{' '}
							<Link
								href="/politica-de-privacidade"
								className="font-semibold text-accent hover:underline"
							>
								Política de privacidade
							</Link>
							.
						</p>
					</div>
				</main>
			</div>
		</Suspense>
	)
}
