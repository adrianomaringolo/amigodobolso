'use client'

import { Painel } from '@/components/bandeira/painel'
import { useUser } from '@/lib/hooks/use-user'
import { formatLongDate } from '@/lib/utils/date'
import {
	AlertDialog,
	AlertDialogAction,
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
} from 'buildgrid-ui'
import { User } from 'lucide-react'
import { useState } from 'react'

export default function UserProfile() {
	const { user } = useUser()
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
	const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false)

	const handleChangePassword = (event: React.FormEvent) => {
		event.preventDefault()
		setIsChangePasswordOpen(false)
	}

	const handleDeleteAccount = () => {
		setIsDeleteAccountOpen(false)
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
						onOpenChange={setIsChangePasswordOpen}
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
									<Input id="new-password" type="password" required />
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="confirm-password">Confirme a nova senha</Label>
									<Input id="confirm-password" type="password" required />
								</div>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancelar</AlertDialogCancel>
									<AlertDialogAction type="submit">Salvar</AlertDialogAction>
								</AlertDialogFooter>
							</form>
						</AlertDialogContent>
					</AlertDialog>

					<AlertDialog open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen}>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">Excluir conta</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
								<AlertDialogDescription>
									Esta ação é irreversível. Todos os seus dados serão apagados.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancelar</AlertDialogCancel>
								<AlertDialogAction onClick={handleDeleteAccount}>
									Excluir conta
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</Painel>
		</div>
	)
}
