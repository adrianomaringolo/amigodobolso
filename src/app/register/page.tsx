'use client'

import { AuthShell } from '@/components/access/auth-shell'
import { PasswordField } from '@/components/access/password-field'
import { Terms } from '@/components/terms'
import { createClient } from '@/lib/supabase/client'
import {
	Button,
	Checkbox,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Input,
	Label,
	toast,
	useDialog,
} from 'buildgrid-ui'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function Register() {
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [confirmation, setConfirmation] = useState('')
	const [agreement, setAgreement] = useState(false)

	const [isLoading, setIsLoading] = useState(false)
	const [open, setOpen] = useState(false)

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
						<label className="mb-2 block text-sm text-gray-800">Nome completo</label>
						<Input
							name="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Informe seu nome completo"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm text-gray-800">E-mail</label>
						<Input
							name="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Informe seu e-mail"
						/>
					</div>

					<div>
						<label className="mb-2 block text-sm text-gray-800">Senha</label>
						<PasswordField
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Informe sua senha"
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm text-gray-800">Confirmação</label>
						<Input
							name="cpassword"
							type="password"
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
							className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<Label htmlFor="agreement">
							Concordo com os{' '}
							<Button
								type="button"
								variant="link"
								onClick={() => setOpen(true)}
								className="px-0 underline"
							>
								termos
							</Button>
						</Label>
					</div>
				</div>

				<div className="!mt-12">
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

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-h-screen">
					<DialogHeader className="sr-only">
						<DialogTitle>Termos de uso</DialogTitle>
						<DialogDescription>
							Termos de uso do aplicativo Amigo do Bolso
						</DialogDescription>
					</DialogHeader>
					<Terms />
				</DialogContent>
			</Dialog>
		</AuthShell>
	)
}
