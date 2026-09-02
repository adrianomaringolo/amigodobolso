'use client'

import { AuthShell } from '@/components/access/auth-shell'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, toast, useDialog } from 'buildgrid-ui'
import { MailCheck } from 'lucide-react'
import { FormEvent, useState } from 'react'

export default function Recover() {
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const supabase = createClient()
	const dialog = useDialog()

	async function handleSubmit(event: FormEvent) {
		event.preventDefault()

		if (!email) {
			toast.error('Informe seu email')
			return
		}

		setIsLoading(true)

		await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/reset-password`,
		})

		dialog.success({
			icon: MailCheck,
			title: 'E-mail enviado',
			message: `Verifique sua caixa de entrada em ${email} para recuperar sua senha.`,
		})

		setIsLoading(false)
	}

	return (
		<AuthShell
			title="Recuperação da senha"
			description="Insira seu e-mail de cadastro abaixo para receber as orientações de recuperação da senha."
		>
			<form onSubmit={handleSubmit} className="md:w-full">
				<div className="grid gap-4">
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
				</div>

				<div className="!mt-12">
					<Button
						size="lg"
						type="submit"
						className="w-full"
						isLoading={isLoading}
						disabled={!email}
					>
						Enviar
					</Button>
				</div>
			</form>
		</AuthShell>
	)
}
