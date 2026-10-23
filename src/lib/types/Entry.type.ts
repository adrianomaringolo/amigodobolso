export interface FinancialEntry {
	id: string
	amount: number
	description: string
	notes?: string
	times?: string
	isCompleted: boolean
	date: string
	createdAt: string
	category: string
	tags?: string[]
	/** Same uuid on every installment of one split purchase. */
	installmentGroup?: string | null
	/** 1-based position inside `installmentGroup`. */
	installmentNumber?: number | null
}

export interface UserTag {
	tag: string
	uses: number
}

export interface MonthlyEntriesSum {
	year: number
	month: number
	totalIncome: number
	totalExpense: number
}
