import { createClient } from '@/lib/supabase/client'
import { FinancialEntry } from '@/lib/types/Entry.type'
import { objectToCamel, objectToSnake } from '@/lib/utils/convertCase'
import { parseLocalDate, toISODate } from '@/lib/utils/date'
import { stripInstallmentSuffix, withInstallmentSuffix } from '@/lib/utils/installments'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addMonths } from 'date-fns'

export interface UpdateFollowingInstallmentsVariables {
	userId: string
}

/**
 * Applies the edited installment to it and every installment after it in the
 * same group. Dates are laid out again from the edited one (one month apart),
 * so moving the first installment moves the whole series. Paid/pending stays
 * per installment.
 */
const updateFollowingInstallments = async (userId: string, entry: FinancialEntry) => {
	const supabase = createClient()

	const { data, error } = await supabase
		.from('entries')
		.select()
		.eq('user_id', userId)
		.eq('installment_group', entry.installmentGroup)
		.gte('installment_number', entry.installmentNumber)
		.order('installment_number', { ascending: true })

	if (error) throw new Error(error.message)

	const installments = objectToCamel(data) as FinancialEntry[]
	const start = entry.installmentNumber as number
	const total = parseInt(entry.times ?? '1')
	const base = stripInstallmentSuffix(entry.description)
	const updatedAt = new Date().toISOString()

	const results = await Promise.all(
		installments.map((installment) => {
			const number = installment.installmentNumber as number
			const fields: Partial<FinancialEntry> & { updatedAt: string } = {
				amount: entry.amount,
				description: withInstallmentSuffix(base, number, total),
				category: entry.category,
				notes: entry.notes,
				tags: entry.tags,
				date: toISODate(addMonths(parseLocalDate(entry.date), number - start)),
				updatedAt,
			}
			if (installment.id === entry.id) fields.isCompleted = entry.isCompleted

			return supabase
				.from('entries')
				.update(objectToSnake(fields))
				.eq('id', installment.id)
				.eq('user_id', userId)
		}),
	)

	const failed = results.find((r) => r.error)
	if (failed?.error) throw new Error(failed.error.message)
}

export const useUpdateFollowingInstallments = (
	variables: UpdateFollowingInstallmentsVariables,
) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (entry: FinancialEntry) =>
			updateFollowingInstallments(variables.userId, entry),
		onSuccess: () => {
			// installments span several months
			queryClient.invalidateQueries({ queryKey: ['entries'] })
			queryClient.invalidateQueries({ queryKey: ['monthly_income_expense_summary'] })
		},
	})
}
