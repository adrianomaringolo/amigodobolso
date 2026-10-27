import { subDays } from 'date-fns'
import type { AdminUser } from './users-data-table'

const DAY_WINDOW_SHORT = 7
const DAY_WINDOW_LONG = 30

export function UsersStats({ users }: { users: AdminUser[] }) {
	const now = new Date()
	const since = (days: number) => subDays(now, days)

	const registeredSince = (days: number) =>
		users.filter((u) => new Date(u.created_at) >= since(days)).length

	const activeLong = users.filter(
		(u) => u.last_sign_in_at && new Date(u.last_sign_in_at) >= since(DAY_WINDOW_LONG),
	).length

	const google = users.filter((u) => u.provider === 'google').length

	const stats = [
		{ label: 'Total de usuários', value: users.length },
		{
			label: `Novos em ${DAY_WINDOW_SHORT} dias`,
			value: registeredSince(DAY_WINDOW_SHORT),
		},
		{
			label: `Novos em ${DAY_WINDOW_LONG} dias`,
			value: registeredSince(DAY_WINDOW_LONG),
		},
		{ label: `Ativos em ${DAY_WINDOW_LONG} dias`, value: activeLong },
		{ label: 'Cadastro com Google', value: google },
	]

	return (
		<dl className="grid grid-cols-2 gap-px border border-border bg-border shadow-bill md:grid-cols-5">
			{stats.map((stat) => (
				<div key={stat.label} className="bg-card px-4 py-3.5">
					<dt className="notice-label !text-xs">{stat.label}</dt>
					<dd
						data-reading
						className="mt-1 text-2xl font-bold text-foreground"
						style={{ fontVariantNumeric: 'tabular-nums' }}
					>
						{stat.value}
					</dd>
				</div>
			))}
		</dl>
	)
}
