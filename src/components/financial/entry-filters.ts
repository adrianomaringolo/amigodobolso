import { FinancialEntry } from '@/lib/types/Entry.type'
import { parseLocalDate } from '@/lib/utils/date'

export type EntryFilterState = {
	text: string
	category: string // 'all' | category key
	day: string // 'all' | 'YYYY-MM-DD'
	pendingOnly: boolean
}

export const EMPTY_FILTERS: EntryFilterState = {
	text: '',
	category: 'all',
	day: 'all',
	pendingOnly: false,
}

export function isFiltering(f: EntryFilterState): boolean {
	return (
		f.text.trim() !== '' ||
		f.category !== 'all' ||
		f.day !== 'all' ||
		f.pendingOnly
	)
}

export function filterEntries(
	entries: FinancialEntry[],
	f: EntryFilterState,
): FinancialEntry[] {
	const q = f.text.trim().toLowerCase()

	return entries.filter((e) => {
		if (f.pendingOnly && e.isCompleted) return false
		if (f.category !== 'all' && e.category !== f.category) return false
		if (f.day !== 'all' && e.date.slice(0, 10) !== f.day) return false
		if (q) {
			const haystack = [
				e.description,
				e.notes ?? '',
				...(e.tags ?? []),
			]
				.join(' ')
				.toLowerCase()
			if (!haystack.includes(q)) return false
		}
		return true
	})
}

/** Distinct days present in the month's entries, as { value, label }, newest first. */
export function availableDays(entries: FinancialEntry[]): { value: string; label: string }[] {
	const days = new Set(entries.map((e) => e.date.slice(0, 10)))
	return [...days]
		.sort((a, b) => b.localeCompare(a))
		.map((d) => ({
			value: d,
			label: new Intl.DateTimeFormat('pt-BR', {
				day: '2-digit',
				month: 'short',
			}).format(parseLocalDate(d)),
		}))
}
