'use client'

import { BandeiraGeral } from '@/components/bandeira/bandeira-geral'
import { Medidor } from '@/components/bandeira/medidor'
import { Painel, PainelVazio } from '@/components/bandeira/painel'
import { useCategoryHistory } from '@/components/bandeira/use-category-history'
import { useReadings } from '@/components/bandeira/use-readings'
import { AmountValue } from '@/components/financial/amount-value'
import { TransactionTypes } from '@/components/financial/financial.types'
import { useUser } from '@/lib/hooks/use-user'
import { authErrors } from '@/lib/types/Auth.type'
import { formatDateAndMonth } from '@/lib/utils/date'
import { useGetEntries } from '@/services/entries/useGetEntries'
import { useDialog } from 'buildgrid-ui'
import { BadgeAlert } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const monthKey = new Date().toISOString().slice(0, 7)
const monthName = new Intl.DateTimeFormat('pt-BR', {
	month: 'long',
	year: 'numeric',
}).format(new Date())

export default function Dashboard() {
	const { user } = useUser()
	const searchParams = useSearchParams()
	const dialog = useDialog()

	useEffect(() => {
		const errorCode = searchParams.get('error_code')
		if (errorCode) {
			dialog.error({
				title: 'Erro ao acessar sua conta',
				message: authErrors[errorCode as keyof typeof authErrors],
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams])

	const { data: entries = [] } = useGetEntries({
		userId: user?.id as string,
		monthYear: monthKey,
	})

	const readings = useReadings(entries)
	const { history } = useCategoryHistory(user?.id, 6)

	const topExpenses = [...entries]
		.filter((e) => e.amount < 0)
		.sort((a, b) => a.amount - b.amount)
		.slice(0, 5)

	const pending = entries
		.filter((e) => !e.isCompleted)
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

	const firstName = user?.name?.split(' ')[0]

	return (
		<div className="space-y-6">
			<header className="flex items-end justify-between gap-3 border-b border-border pb-3">
				<div>
					<p className="text-xl font-bold text-foreground">
						Olá{firstName ? `, ${firstName}` : ''}
					</p>
					<p className="notice-label mt-1 !normal-case !tracking-normal">
						a conta do seu mês
					</p>
				</div>
				<p className="notice-label text-right leading-tight">
					Mês de referência
					<span className="mt-1 block text-sm font-bold normal-case tracking-normal text-foreground">
						{monthName}
					</span>
				</p>
			</header>

			<BandeiraGeral
				flag={readings.overall}
				income={readings.income}
				expenses={readings.expenses}
			/>

			<div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
				<section className="border border-border bg-card shadow-bill">
					<header className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
						<h2 className="notice-label !text-xs text-foreground">Os seis medidores</h2>
						<span className="notice-label !normal-case !tracking-normal">
							gasto / alvo do mês
						</span>
					</header>

					{readings.income <= 0 ? (
						<div className="px-4 py-10 text-center">
							<p className="text-sm text-muted-foreground">
								Lance sua <strong className="text-foreground">receita</strong> do mês
								para o plano dividir os alvos das categorias.
							</p>
							<Link
								href="/lancamentos?m=nova"
								className="mt-4 inline-flex items-center gap-2 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
							>
								Lançar receita
							</Link>
						</div>
					) : (
						readings.categories.map((reading) => (
							<Medidor
								key={reading.key}
								reading={reading}
								history={history?.[reading.key]}
								href="/relatorios?t=mapa"
							/>
						))
					)}
				</section>

				<div className="space-y-6">
					<Painel title="Maiores despesas do mês" bodyClassName="px-0 py-0">
						{topExpenses.length === 0 ? (
							<div className="px-4 py-3.5">
								<PainelVazio>Nenhuma despesa lançada ainda</PainelVazio>
							</div>
						) : (
							<ul className="divide-y divide-border">
								{topExpenses.map((entry) => {
									const def =
										TransactionTypes[entry.category as keyof typeof TransactionTypes]
									return (
										<li key={entry.id} className="flex items-center gap-3 px-4 py-2.5">
											<span className="flex h-8 w-8 shrink-0 items-center justify-center border border-border text-muted-foreground">
												{def?.icon('w-4 h-4')}
											</span>
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm text-foreground">
													{entry.description}
												</p>
												<p className="notice-label !normal-case !tracking-normal">
													{formatDateAndMonth(entry.date)}
												</p>
											</div>
											<AmountValue
												value={entry.amount}
												className="text-sm font-semibold"
											/>
										</li>
									)
								})}
							</ul>
						)}
					</Painel>

					<Painel
						title="Lançamentos pendentes"
						bodyClassName="px-0 py-0"
						aside={
							pending.length > 0 ? (
								<span className="tabular text-xs font-bold text-flag-amber">
									{pending.length}
								</span>
							) : null
						}
					>
						{pending.length === 0 ? (
							<div className="px-4 py-3.5">
								<PainelVazio>Tudo em dia, nada pendente</PainelVazio>
							</div>
						) : (
							<ul className="divide-y divide-border">
								{pending.map((entry) => {
									const def =
										TransactionTypes[entry.category as keyof typeof TransactionTypes]
									return (
										<li key={entry.id} className="flex items-center gap-3 px-4 py-2.5">
											<BadgeAlert className="h-4 w-4 shrink-0 text-flag-amber" />
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm text-foreground">
													{entry.description}
												</p>
												<p className="notice-label !normal-case !tracking-normal">
													{def?.label} · {formatDateAndMonth(entry.date)}
												</p>
											</div>
											<AmountValue
												value={entry.amount}
												className="text-sm font-semibold"
											/>
										</li>
									)
								})}
							</ul>
						)}
					</Painel>
				</div>
			</div>
		</div>
	)
}
