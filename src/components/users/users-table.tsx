import { PainelVazio } from '@/components/bandeira/painel'
import { createClient } from '@/lib/supabase/server'
import { UsersDataTable, type AdminUser } from './users-data-table'

export async function getAdminUsers() {
	const supabase = await createClient()
	const { data, error } = await supabase.rpc('admin_list_users')

	return { users: (data ?? []) as AdminUser[], error }
}

export function UsersTable({ users }: { users: AdminUser[] }) {
	if (users.length === 0) {
		return <PainelVazio>Nenhum usuário cadastrado.</PainelVazio>
	}

	return <UsersDataTable users={users} />
}
