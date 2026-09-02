'use client'

import { UsersTable } from '@/components/users/users-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'buildgrid-ui'
import { Lock } from 'lucide-react'

export default function AdminPanel() {
	// const { user } = useUser()
	// const isAdmin = false

	// const router = useRouter()

	// if (!isAdmin) {
	// 	router.push('/')
	// }

	// if (!user) {
	// 	return null
	// }

	return (
		<section>
			<h2 className="text-2xl font-semibold flex gap-2 items-center">
				<Lock /> Administração
			</h2>
			<Tabs defaultValue="usuarios" className="mt-8">
				<TabsList>
					<TabsTrigger value="usuarios" className="px-4 py-3 gap-2 bg-gray-50">
						Usuários
					</TabsTrigger>
				</TabsList>
				<TabsContent value="usuarios" className="p-2">
					<UsersTable />
				</TabsContent>
			</Tabs>
		</section>
	)
}
