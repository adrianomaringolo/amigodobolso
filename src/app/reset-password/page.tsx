'use client'

import { AuthShell } from '@/components/access/auth-shell'
import { PasswordField } from '@/components/access/password-field'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, toast, useDialog } from 'buildgrid-ui'
import { Key } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

export default function ResetPassword() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmation, setConfirmation] = useState('')

	const [isLoading, setIsLoading] = useState(true)

	const router = useRouter()
	const dialog = useDialog()

	const supabase = createClient()

	async function handleSubmit(event: FormEvent) {
		event.preventDefault()
		setIsLoading(true)

		if (password !== confirmation) {
			toast.error('As senhas não coincidem')
			return
		}

		await supabase.auth.updateUser({ password })

		dialog.success({
			icon: Key,
			title: 'Senha atualizada',
			message: 'Você será redirecionado para a página de login',
		})
		setIsLoading(false)

		supabase.auth.signOut()
		router.push('/login')
	}

	useEffect(() => {
		supabase.auth.onAuthStateChange(async (_event, session) => {
			if (session) {
				setEmail(session?.user?.email as string)
				setIsLoading(false)
			} else {
				router.push('/login')
			}
		})

		return () => {
			supabase.auth.signOut()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<AuthShell title="Recuperação da senha" description="Defina sua nova senha abaixo">
			<form onSubmit={handleSubmit} className="md:w-full">
				<div className="grid gap-4">
					<div>
						<label className="notice-label mb-1.5 block">Email</label>
						<Input
							name="email"
							type="text"
							disabled
							value={email}
							placeholder="Informe seu email"
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
						<Input
							name="cpassword"
							type="password"
							value={confirmation}
							onChange={(e) => setConfirmation(e.target.value)}
							placeholder="Confirme sua senha"
						/>
					</div>
				</div>

				<div className="!mt-8">
					<Button size="lg" type="submit" className="w-full" isLoading={isLoading}>
						Alterar senha
					</Button>
				</div>
			</form>
		</AuthShell>
	)
}
