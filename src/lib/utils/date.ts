/**
 * Entry dates are plain calendar dates — no time, no timezone. They are stored
 * and passed around as `YYYY-MM-DD` strings. Never build a `Date` straight from
 * one of these strings (`new Date('2026-09-01')` is parsed as UTC midnight and
 * shifts a day in negative-offset timezones like America/Sao_Paulo). Use
 * `parseLocalDate` / `toISODate` instead.
 */

/** `YYYY-MM-DD` (or a longer ISO string) -> a Date at LOCAL midnight. */
export const parseLocalDate = (value: Date | string): Date => {
	if (value instanceof Date) return value
	const [y, m, d] = value.slice(0, 10).split('-').map(Number)
	return new Date(y, (m ?? 1) - 1, d ?? 1)
}

/** Any date -> `YYYY-MM-DD` in LOCAL time. */
export const toISODate = (value: Date | string): string => {
	const date = value instanceof Date ? value : parseLocalDate(value)
	const y = date.getFullYear()
	const m = String(date.getMonth() + 1).padStart(2, '0')
	const d = String(date.getDate()).padStart(2, '0')
	return `${y}-${m}-${d}`
}

/** Today as `YYYY-MM-DD`, local. */
export const todayISODate = (): string => toISODate(new Date())

export const formatDateAndWeekday = (date: Date | string): string =>
	new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: 'long',
		weekday: 'long',
	}).format(parseLocalDate(date))

export const formatDateAndWeekdayAndYear = (date: Date | string): string =>
	new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: 'long',
		weekday: 'long',
		year: 'numeric',
	}).format(parseLocalDate(date))

export const formatDateAndMonth = (date: Date | string): string =>
	new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: 'long',
	}).format(parseLocalDate(date))

/** For real timestamps (e.g. `user.createdAt`), not calendar dates. */
export const formatLongDate = (date: Date): string =>
	new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(date)

export const getMonthYear = (date: string): string => date.slice(0, 7)
