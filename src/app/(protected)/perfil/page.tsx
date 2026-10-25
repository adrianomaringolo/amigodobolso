'use client'

import { PasswordField } from '@/components/access/password-field'
import { Painel } from '@/components/bandeira/painel'
import { useUser } from '@/lib/hooks/use-user'
import { createClient } from '@/lib/supabase/client'
import { formatLongDate } from '@/lib/utils/date'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Input,
	Label,
	toast,
} from 'buildgrid-ui'
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

const MIN_PASSWORD_LENGTH = 6
const DELETE_CONFIRMATION_WORD = 'EXCLUIR'

const passwordErrorMessage = (code?: string) => {
	switch (code) {
		case 'same_password':
			return 'A nova senha deve ser diferente da atual'
		case 'weak_password':
			return 'Senha muito fraca. Escolha uma senha mais forte'
		case 'reauthentication_needed':
			return 'Por segurança, entre novamente no app antes de alterar a senha'
		default:
			return 'Não foi possível alterar a senha. Tente novamente'
	}
}

export default function UserProfile() {
	const { user } = useUser()
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
	const [password, setPassword] = useState('')
	const [confirmation, setConfirmation] = useState('')
	const [isSavingPassword, setIsSavingPassword] = useState(false)
	const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false)
	const [deleteConfirmation, setDeleteConfirmation] = useState('')
	const [isDeletingAccount, setIsDeletingAccount] = useState(false)

	const router = useRouter()
	const supabase = createClient()

	const handleChangePasswordOpenChange = (open: boolean) => {
		setIsChangePasswordOpen(open)
		if (!open) {
			setPassword('')
			setConfirmation('')
		}
	}

	const handleChangePassword = async (event: FormEvent) => {
		event.preventDefault()

		if (password.length < MIN_PASSWORD_LENGTH) {
			toast.error(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`)
			return
		}

		if (password !== confirmation) {
			toast.error('As senhas não coincidem')
			return
		}

		setIsSavingPassword(true)
		const { error } = await supabase.auth.updateUser({ password })
		setIsSavingPassword(false)

		if (error) {
			toast.error(passwordErrorMessage(error.code))
			return
		}

		toast.success('Senha alterada com sucesso')
		handleChangePasswordOpenChange(false)
	}

	const handleDeleteAccountOpenChange = (open: boolean) => {
		if (isDeletingAccount) return
		setIsDeleteAccountOpen(open)
		if (!open) setDeleteConfirmation('')
	}

	const handleDeleteAccount = async (event: FormEvent) => {
		event.preventDefault()
		if (deleteConfirmation !== DELETE_CONFIRMATION_WORD) return

		setIsDeletingAccount(true)
		const { error } = await supabase.rpc('delete_own_account')

		if (error) {
			setIsDeletingAccount(false)
			toast.error('Não foi possível excluir a conta. Tente novamente')
			return
		}

		// The auth user no longer exists; drop the local session too.
		await supabase.auth.signOut({ scope: 'local' })
		toast.success('Sua conta e todos os seus dados foram excluídos')
		router.push('/produto')
		router.refresh()
	}

	const userNames = user?.name?.split(' ') ?? []
	const userInitials =
		`${userNames[0]?.[0] ?? ''}${userNames.length > 1 ? (userNames[userNames.length - 1]?.[0] ?? '') : ''}`.toUpperCase()

	const Field = ({ label, value }: { label: string; value?: string }) => (
		<div className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-b-0">
			<span className="notice-label">{label}</span>
			<span className="text-sm font-medium text-foreground">{value ?? '—'}</span>
		</div>
	)

	return (
		<div className="mx-auto max-w-xl space-y-5">
			<header className="border-b border-border pb-3">
				<h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
					<User className="h-5 w-5 text-primary" />
					Meu perfil
				</h1>
			</header>

			<Painel title="Titular da conta">
				<div className="flex items-center gap-4">
					<Avatar className="h-16 w-16 border border-border">
						<AvatarImage src={user?.picture as string} alt="" />
						<AvatarFallback className="bg-primary text-primary-foreground">
							{userInitials || <User className="h-6 w-6" />}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0">
						<p className="truncate font-bold text-foreground">{user?.name}</p>
						<p className="truncate text-sm text-muted-foreground">{user?.email}</p>
					</div>
				</div>
				<div className="mt-4">
					<Field label="Nome" value={user?.name as string} />
					<Field label="E-mail" value={user?.email} />
					<Field
						label="Membro desde"
						value={user?.createdAt ? formatLongDate(new Date(user.createdAt)) : undefined}
					/>
				</div>
			</Painel>

			<Painel title="Segurança">
				<div className="flex flex-wrap gap-3">
					<AlertDialog
						open={isChangePasswordOpen}
						onOpenChange={handleChangePasswordOpenChange}
					>
						<AlertDialogTrigger asChild>
							<Button variant="outline">Alterar senha</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Alterar senha</AlertDialogTitle>
								<AlertDialogDescription>
									Insira sua nova senha abaixo.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<form onSubmit={handleChangePassword} className="space-y-4 py-2">
								<div className="space-y-1.5">
									<Label htmlFor="new-password">Nova senha</Label>
									<PasswordField
										id="new-password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										autoComplete="new-password"
										required
									/>
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="confirm-password">Confirme a nova senha</Label>
									<PasswordField showStrengthMeter={false}
										id="confirm-password"
										value={confirmation}
										onChange={(e) => setConfirmation(e.target.value)}
										autoComplete="new-password"
										required
									/>
								</div>
								<AlertDialogFooter>
									<AlertDialogCancel disabled={isSavingPassword}>Cancelar</AlertDialogCancel>
									<Button type="submit" isLoading={isSavingPassword}>
										Salvar
									</Button>
								</AlertDialogFooter>
							</form>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</Painel>

			<Painel title="Excluir conta">
				<p className="text-sm text-muted-foreground">
					Apaga sua conta e todos os seus dados — lançamentos, tags e histórico de leitura.
					Não dá para desfazer.
				</p>
				<div className="mt-4">
					<AlertDialog open={isDeleteAccountOpen} onOpenChange={handleDeleteAccountOpenChange}>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">Excluir conta</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Excluir conta definitivamente?</AlertDialogTitle>
								<AlertDialogDescription>
									Todos os seus lançamentos, tags e histórico de leitura serão apagados para
									sempre. Esta ação não pode ser desfeita.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<form onSubmit={handleDeleteAccount} className="space-y-4 py-2">
								<div className="space-y-1.5">
									<Label htmlFor="delete-confirmation">
										Digite {DELETE_CONFIRMATION_WORD} para confirmar
									</Label>
									<Input
										id="delete-confirmation"
										value={deleteConfirmation}
										onChange={(e) => setDeleteConfirmation(e.target.value)}
										autoComplete="off"
										autoCapitalize="characters"
									/>
								</div>
								<AlertDialogFooter>
									<AlertDialogCancel disabled={isDeletingAccount}>Cancelar</AlertDialogCancel>
									<Button
										type="submit"
										variant="destructive"
										isLoading={isDeletingAccount}
										disabled={deleteConfirmation !== DELETE_CONFIRMATION_WORD}
									>
										Excluir conta
									</Button>
								</AlertDialogFooter>
							</form>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</Painel>
		</div>
	)
}
