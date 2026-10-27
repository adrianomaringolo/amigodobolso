import { PainelVazio } from '@/components/bandeira/painel'
import { UsersStats } from '@/components/users/users-stats'
import { getAdminUsers, UsersTable } from '@/components/users/users-table'
import { Lock } from 'lucide-react'

export default async function AdminPanel() {
	const { users, error } = await getAdminUsers()

	return (
		<div className="space-y-5">
			<header className="border-b border-border pb-3">
				<h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
					<Lock className="h-5 w-5 text-primary" />
					Administração
				</h1>
				<p className="notice-label mt-0.5 !normal-case !tracking-normal">
					usuários cadastrados no Amigo do Bolso
				</p>
			</header>

			{error ? (
				<PainelVazio>Não foi possível carregar os usuários.</PainelVazio>
			) : (
				<>
					<UsersStats users={users} />
					<UsersTable users={users} />
				</>
			)}
		</div>
	)
}
