'use client'

import { FinancialEntry } from '@/lib/types/Entry.type'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'buildgrid-ui'
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import {
	availableDays,
	EMPTY_FILTERS,
	isFiltering,
	type EntryFilterState,
} from './entry-filters'
import { AmountTypes, TransactionTypes } from './financial.types'

const categoryOptions = [
	{ value: 'all', label: 'Todas as categorias' },
	...Object.entries(TransactionTypes).map(([key, def]) => ({
		value: key,
		label: def.type === AmountTypes.income ? `${def.label} (receita)` : def.label,
	})),
]

const triggerClass =
	'!h-9 !rounded-none !border-input !bg-card !text-sm data-[placeholder]:!text-muted-foreground'

/** Count of the individual filter dimensions currently in use. */
function activeCount(f: EntryFilterState): number {
	return (
		(f.text.trim() !== '' ? 1 : 0) +
		(f.category !== 'all' ? 1 : 0) +
		(f.day !== 'all' ? 1 : 0) +
		(f.pendingOnly ? 1 : 0)
	)
}

export function EntryFilters({
	entries,
	value,
	onChange,
	resultCount,
	totalCount,
}: {
	entries: FinancialEntry[]
	value: EntryFilterState
	onChange: (next: EntryFilterState) => void
	resultCount: number
	totalCount: number
}) {
	const [open, setOpen] = useState(false)
	const set = (patch: Partial<EntryFilterState>) => onChange({ ...value, ...patch })
	const days = availableDays(entries)
	const filtering = isFiltering(value)
	const count = activeCount(value)

	return (
		<section className="border border-border bg-card shadow-bill">
			<div className="flex items-center border-b border-border">
				<button
					type="button"
					onClick={() => setOpen((o) => !o)}
					aria-expanded={open}
					className="flex flex-1 items-center gap-2 px-4 py-2.5 text-left"
				>
					<SlidersHorizontal className="h-3.5 w-3.5 text-foreground" />
					<span className="notice-label !text-xs text-foreground">Filtrar</span>
					{count > 0 && (
						<span className="tabular flex h-4 min-w-4 items-center justify-center border border-accent bg-accent px-1 text-[0.625rem] font-bold text-accent-foreground">
							{count}
						</span>
					)}
					{!open && filtering && (
						<span className="tabular text-xs text-muted-foreground">
							· {resultCount} de {totalCount}
						</span>
					)}
					<ChevronDown
						className={cn(
							'ml-auto h-4 w-4 text-muted-foreground transition-transform',
							open && 'rotate-180',
						)}
					/>
				</button>
				{filtering && (
					<button
						type="button"
						onClick={() => onChange(EMPTY_FILTERS)}
						className="flex items-center gap-1 border-l border-border px-3 py-2.5 text-xs font-semibold text-accent hover:underline"
					>
						<X className="h-3.5 w-3.5" />
						Limpar
					</button>
				)}
			</div>

			{open && (
				<>
					<div className="grid gap-2.5 px-4 py-3.5 sm:grid-cols-2">
						<div className="relative sm:col-span-2">
							<Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<input
								type="search"
								value={value.text}
								onChange={(e) => set({ text: e.target.value })}
								placeholder="Buscar por descrição, observação ou tag…"
								className="h-9 w-full border border-input bg-card pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-accent"
							/>
						</div>

						<Select value={value.category} onValueChange={(v) => set({ category: v })}>
							<SelectTrigger className={triggerClass}>
								<SelectValue placeholder="Categoria" />
							</SelectTrigger>
							<SelectContent>
								{categoryOptions.map((o) => (
									<SelectItem key={o.value} value={o.value}>
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select value={value.day} onValueChange={(v) => set({ day: v })}>
							<SelectTrigger className={triggerClass}>
								<SelectValue placeholder="Dia" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos os dias</SelectItem>
								{days.map((d) => (
									<SelectItem key={d.value} value={d.value}>
										{d.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<button
							type="button"
							aria-pressed={value.pendingOnly}
							onClick={() => set({ pendingOnly: !value.pendingOnly })}
							className={cn(
								'flex h-9 items-center justify-center gap-2 border px-3 text-sm font-medium transition-colors sm:col-span-2',
								value.pendingOnly
									? 'border-flag-amber bg-flag-amber-soft text-flag-amber'
									: 'border-input bg-card text-muted-foreground hover:text-foreground',
							)}
						>
							<span
								className={cn(
									'h-3.5 w-3.5 border',
									value.pendingOnly
										? 'border-flag-amber bg-flag-amber-fill'
										: 'border-input',
								)}
							/>
							Só pendentes
						</button>
					</div>

					{filtering && (
						<p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
							<span className="tabular font-semibold text-foreground">{resultCount}</span>{' '}
							de <span className="tabular">{totalCount}</span> lançamentos
						</p>
					)}
				</>
			)}
		</section>
	)
}
