'use client'

import { GoogleLoginButton } from '@/components/access/google-login-button'
import { AuthShell } from '@/components/access/auth-shell'
import { PasswordField } from '@/components/access/password-field'
import { createClient } from '@/lib/supabase/client'
import {
	Button,
	Checkbox,
	Input,
	Label,
	toast,
	useDialog,
} from 'buildgrid-ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, Suspense, useState } from 'react'

export default function Register() {
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [confirmation, setConfirmation] = useState('')
	const [agreement, setAgreement] = useState(false)

	const [isLoading, setIsLoading] = useState(false)

	const router = useRouter()
	const dialog = useDialog()

	const supabase = createClient()

	async function handleSubmit(event: FormEvent) {
		event.preventDefault()

		if (!password || password !== confirmation) {
			toast.error('As senhas não coincidem')
			return
		}

		setIsLoading(true)

		await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name,
					full_name: name,
				},
				emailRedirectTo: `${window.location.origin}/inicio`,
			},
		})

		dialog.success({
			title: 'Registro efetuado com sucesso',
			message:
				'Verifique sua caixa de entrada para confirmar sua conta e conhecer o novo amigo do seu bolso.',
		})

		setIsLoading(false)
		router.push('/login')
	}

	return (
		<AuthShell title="Registre sua conta">
			<form onSubmit={handleSubmit} className="md:w-full">
				<div className="grid gap-4">
					<div>
						<label className="notice-label mb-1.5 block">Nome completo</label>
						<Input
							name="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Informe seu nome completo"
						/>
					</div>

					<div>
						<label className="notice-label mb-1.5 block">E-mail</label>
						<Input
							name="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Informe seu e-mail"
						/>
					</div>

					<div>
						<label className="notice-label mb-1.5 block">Senha</label>
						<PasswordField
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Informe sua senha"
						/>
					</div>
					<div>
						<label className="notice-label mb-1.5 block">Confirmação</label>
						<PasswordField showStrengthMeter={false}
							name="cpassword"
							value={confirmation}
							onChange={(e) => setConfirmation(e.target.value)}
							placeholder="Confirme sua senha"
						/>
					</div>

					<div className="flex items-center gap-2">
						<Checkbox
							id="agreement"
							name="agreement"
							checked={agreement}
							onCheckedChange={(checked) =>
								setAgreement(checked === 'indeterminate' ? false : checked)
							}
							className="h-4 w-4"
						/>
						<Label htmlFor="agreement">
							Concordo com os{' '}
							<Link
								href="/termos-de-uso"
								target="_blank"
								rel="noopener noreferrer"
								className="font-semibold text-accent-text hover:underline"
							>
								Termos de uso
							</Link>{' '}
							e a{' '}
							<Link
								href="/politica-de-privacidade"
								target="_blank"
								rel="noopener noreferrer"
								className="font-semibold text-accent-text hover:underline"
							>
								Política de privacidade
							</Link>
						</Label>
					</div>
				</div>

				<div className="!mt-8">
					<Button
						isLoading={isLoading}
						size="lg"
						type="submit"
						className="w-full"
						disabled={!name || !email || !password || !agreement}
					>
						Registrar
					</Button>
				</div>
			</form>

			<div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
				<span className="h-px flex-1 bg-border" />
				ou
				<span className="h-px flex-1 bg-border" />
			</div>

			{/* useSearchParams lives only in this button; the Suspense keeps the rest of the page server-rendered */}
			<Suspense
				fallback={
					<Button type="button" variant="outline" size="lg" className="w-full" disabled />
				}
			>
				<GoogleLoginButton label="Criar conta com Google" />
			</Suspense>
		</AuthShell>
	)
}
