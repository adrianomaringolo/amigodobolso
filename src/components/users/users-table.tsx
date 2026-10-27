import { PainelVazio } from '@/components/bandeira/painel'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

type AdminUser = {
	id: string
	email: string | null
	full_name: string | null
	provider: string | null
	created_at: string
	last_sign_in_at: string | null
}

const providerLabel: Record<string, string> = {
	email: 'E-mail',
	google: 'Google',
}

const formatDate = (value: string | null) =>
	value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : '—'

export async function UsersTable() {
	const supabase = await createClient()
	const { data, error } = await supabase.rpc('admin_list_users')

	if (error) {
		return <PainelVazio>Não foi possível carregar os usuários.</PainelVazio>
	}

	const users = (data ?? []) as AdminUser[]

	if (users.length === 0) {
		return <PainelVazio>Nenhum usuário cadastrado.</PainelVazio>
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left text-sm">
				<thead>
					<tr className="notice-label border-b border-border">
						<th className="px-4 py-2 font-medium">Nome</th>
						<th className="px-4 py-2 font-medium">E-mail</th>
						<th className="px-4 py-2 font-medium">Acesso</th>
						<th className="px-4 py-2 font-medium">Cadastro</th>
						<th className="px-4 py-2 font-medium">Último acesso</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id} className="border-b border-border last:border-0">
							<td className="px-4 py-2.5 text-foreground">{user.full_name ?? '—'}</td>
							<td className="px-4 py-2.5">{user.email ?? '—'}</td>
							<td className="px-4 py-2.5">
								{user.provider ? (providerLabel[user.provider] ?? user.provider) : '—'}
							</td>
							<td className="whitespace-nowrap px-4 py-2.5">
								{formatDate(user.created_at)}
							</td>
							<td className="whitespace-nowrap px-4 py-2.5">
								{formatDate(user.last_sign_in_at)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
