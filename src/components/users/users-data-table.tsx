'use client'

import { DataTable, type DataTableColumn } from 'buildgrid-ui'
import { format } from 'date-fns'

export type AdminUser = {
	id: string
	email: string | null
	full_name: string | null
	provider: string | null
	created_at: string
	last_sign_in_at: string | null
	entries_count: number
	last_entry_at: string | null
}

const providerLabel: Record<string, string> = {
	email: 'E-mail',
	google: 'Google',
}

const formatDate = (value: string | null) =>
	value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : '—'

const columns: DataTableColumn<AdminUser>[] = [
	{
		key: 'full_name',
		title: 'Nome',
		sortable: true,
		customRenderer: (value: string | null) => value ?? '—',
	},
	{
		key: 'email',
		title: 'E-mail',
		sortable: true,
		customRenderer: (value: string | null) => value ?? '—',
	},
	{
		key: 'provider',
		title: 'Acesso',
		sortable: true,
		customRenderer: (value: string | null) =>
			value ? (providerLabel[value] ?? value) : '—',
	},
	{
		key: 'created_at',
		title: 'Cadastro',
		sortable: true,
		cellClassName: 'whitespace-nowrap',
		customRenderer: formatDate,
	},
	{
		key: 'last_sign_in_at',
		title: 'Último acesso',
		sortable: true,
		cellClassName: 'whitespace-nowrap',
		customRenderer: formatDate,
	},
	{
		key: 'entries_count',
		title: 'Lançamentos',
		sortable: true,
		align: 'right',
	},
	{
		key: 'last_entry_at',
		title: 'Último lançamento',
		sortable: true,
		cellClassName: 'whitespace-nowrap',
		customRenderer: formatDate,
	},
]

export function UsersDataTable({ users }: { users: AdminUser[] }) {
	return (
		<DataTable
			data={users}
			columns={columns}
			searchFields={['full_name', 'email']}
			pageSize={20}
			tools={{
				search: { placeholder: 'Buscar por nome ou e-mail' },
				rowSelector: { hide: true },
			}}
			labels={{
				searchPlaceholder: 'Buscar por nome ou e-mail',
				exportButton: 'Exportar CSV',
				clearAllButton: 'Limpar',
				paginationCounter:
					'Mostrando {{startIndex}} a {{endIndex}} de {{totalItems}} usuários',
				noDataAvailable: 'Nenhum usuário cadastrado.',
				noResultsWithFilters: 'Nenhum usuário encontrado para a busca.',
				columnsButton: 'Colunas',
				toggleColumnsMenuLabel: 'Exibir colunas',
				resetColumnsButton: 'Restaurar colunas',
				searchBadgePrefix: 'Busca',
				sortBadgePrefix: 'Ordem',
			}}
		/>
	)
}
