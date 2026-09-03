'use client'

import { Painel } from '@/components/bandeira/painel'
import { UsersTable } from '@/components/users/users-table'
import { Lock } from 'lucide-react'

export default function AdminPanel() {
	return (
		<div className="space-y-5">
			<header className="border-b border-border pb-3">
				<h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
					<Lock className="h-5 w-5 text-primary" />
					Administração
				</h1>
				<p className="notice-label mt-0.5 !normal-case !tracking-normal">
					gestão de usuários do Amigo do Bolso
				</p>
			</header>

			<Painel title="Usuários" bodyClassName="px-0 py-0">
				<UsersTable />
			</Painel>
		</div>
	)
}
