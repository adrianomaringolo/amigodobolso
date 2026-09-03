'use client'

import { Painel } from '@/components/bandeira/painel'
import { useUser } from '@/lib/hooks/use-user'
import { groupTransactionsByDate } from '@/lib/utils/groupTransactionsByDate'
import { useGetEntries } from '@/services/entries/useGetEntries'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Skeleton,
} from 'buildgrid-ui'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { DayGroup } from './day-group'
import {
	EMPTY_FILTERS,
	filterEntries,
	isFiltering,
	type EntryFilterState,
} from './entry-filters'
import { EntryFilters } from './entry-filters-bar'
import { MonthSummary } from './month-summary'
import { TransactionForm } from './transaction-form'

type FinancialTrackerProps = {
	monthYear: string
}

export function FinancialTracker(props: FinancialTrackerProps) {
	const { user } = useUser()

	const searchParams = useSearchParams()
	const [isOpen, setIsOpen] = useState(searchParams.get('m') === 'nova')
	const [filters, setFilters] = useState<EntryFilterState>(EMPTY_FILTERS)

	const { data: entries = [], isLoading } = useGetEntries({
		userId: user?.id as string,
		monthYear: props.monthYear,
	})

	const filtered = useMemo(() => filterEntries(entries, filters), [entries, filters])
	const groupedTransactions = groupTransactionsByDate(filtered)
	const filtering = isFiltering(filters)

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-11 w-full" />
				<div className="border border-border bg-card">
					{[0, 1, 2].map((i) => (
						<div key={i} className="flex items-center gap-3 border-b border-border p-4">
							<Skeleton className="h-9 w-9" />
							<Skeleton className="h-5 w-full" />
							<Skeleton className="h-5 w-24" />
						</div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-5">
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="flex w-full items-center justify-center gap-2 bg-accent px-4 py-3 text-sm font-bold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90"
			>
				<Plus className="h-4 w-4" strokeWidth={2.75} />
				Lançar receita ou despesa
			</button>

			<Dialog modal open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
				<DialogContent>
					<DialogHeader className="sr-only">
						<DialogTitle>Adicionar lançamento</DialogTitle>
						<DialogDescription>Adicione os dados do novo lançamento</DialogDescription>
					</DialogHeader>
					<TransactionForm
						handleClose={() => setIsOpen(false)}
						monthYear={props.monthYear}
					/>
				</DialogContent>
			</Dialog>

			{entries.length > 0 && (
				<EntryFilters
					entries={entries}
					value={filters}
					onChange={setFilters}
					resultCount={filtered.length}
					totalCount={entries.length}
				/>
			)}

			{groupedTransactions.length === 0 ? (
				<div className="border border-dashed border-border bg-card px-4 py-10 text-center">
					<p className="text-sm text-muted-foreground">
						{filtering
							? 'Nenhum lançamento corresponde aos filtros.'
							: 'Ainda não há lançamentos neste mês.'}
					</p>
				</div>
			) : (
				<div className="border border-border bg-card shadow-bill">
					{groupedTransactions.map(({ date, previousAmount, transactions }) => (
						<DayGroup
							key={date}
							previousAmount={previousAmount}
							date={date}
							transactions={transactions}
						/>
					))}
				</div>
			)}

			<Painel title="Fechamento do mês">
				<MonthSummary transactions={entries} />
			</Painel>
		</div>
	)
}
