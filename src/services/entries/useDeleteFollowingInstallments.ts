import { createClient } from '@/lib/supabase/client'
import { FinancialEntry } from '@/lib/types/Entry.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface DeleteFollowingInstallmentsVariables {
	userId: string
}

/** Deletes the installment and every installment after it in the same group. */
const deleteFollowingInstallments = async (userId: string, entry: FinancialEntry) => {
	const supabase = createClient()

	const { error } = await supabase
		.from('entries')
		.delete()
		.eq('user_id', userId)
		.eq('installment_group', entry.installmentGroup)
		.gte('installment_number', entry.installmentNumber)

	if (error) throw new Error(error.message)
}

export const useDeleteFollowingInstallments = (
	variables: DeleteFollowingInstallmentsVariables,
) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (entry: FinancialEntry) =>
			deleteFollowingInstallments(variables.userId, entry),
		onSuccess: () => {
			// installments span several months
			queryClient.invalidateQueries({ queryKey: ['entries'] })
			queryClient.invalidateQueries({ queryKey: ['monthly_income_expense_summary'] })
		},
	})
}
