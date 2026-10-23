import { FinancialEntry } from '@/lib/types/Entry.type'

const INSTALLMENT_SUFFIX = /\s*\(\d+\/\d+\)\s*$/

/** "Celular (3/10)" -> "Celular" */
export const stripInstallmentSuffix = (description: string): string =>
	description.replace(INSTALLMENT_SUFFIX, '')

/** ("Celular", 3, 10) -> "Celular (3/10)" */
export const withInstallmentSuffix = (base: string, number: number, total: number) =>
	`${base} (${number}/${total})`

/** True when the entry is a linked installment with others after it. */
export const hasFollowingInstallments = (entry: FinancialEntry): boolean =>
	!!entry.installmentGroup &&
	!!entry.installmentNumber &&
	entry.installmentNumber < parseInt(entry.times ?? '1')
