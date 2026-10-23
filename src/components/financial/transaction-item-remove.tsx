import { useUser } from '@/lib/hooks/use-user'
import { FinancialEntry } from '@/lib/types/Entry.type'
import { hasFollowingInstallments } from '@/lib/utils/installments'
import { useDeleteEntry } from '@/services/entries/useDeleteEntry'
import { useDeleteFollowingInstallments } from '@/services/entries/useDeleteFollowingInstallments'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	toast,
} from 'buildgrid-ui'
import { Trash2 } from 'lucide-react'
import { LoadButton } from '../forms/load-button'

type TransactionItemRemoveProps = {
	transaction: FinancialEntry
}

export const TransactionItemRemove = (props: TransactionItemRemoveProps) => {
	const { user } = useUser()
	const { transaction } = props

	const monthYear = transaction.date.split('-').slice(0, 2).join('-')

	const deleteMutation = useDeleteEntry({
		userId: user?.id as string,
		monthYear,
	})
	const deleteFollowingMutation = useDeleteFollowingInstallments({
		userId: user?.id as string,
	})

	const hasFollowing = hasFollowingInstallments(transaction)

	const onRemove = () => {
		deleteMutation.mutateAsync(transaction.id).then(() => {
			toast.success('Lançamento removido com sucesso')
		})
	}

	const onRemoveFollowing = () => {
		deleteFollowingMutation.mutateAsync(transaction).then(() => {
			toast.success('Parcelas removidas com sucesso')
		})
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<LoadButton
					variant="destructive"
					isLoading={deleteMutation.isPending || deleteFollowingMutation.isPending}
				>
					<Trash2 className="mr-1.5 h-4 w-4" />
					Remover
				</LoadButton>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
					<AlertDialogDescription>
						{hasFollowing
							? `Essa ação não pode ser desfeita. Esta é a parcela ${transaction.installmentNumber} de ${transaction.times}: excluir só ela ou ela e as seguintes?`
							: 'Essa ação não pode ser desfeita. Você tem certeza que deseja excluir esse lançamento?'}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="gap-2">
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					{hasFollowing ? (
						<>
							<AlertDialogAction onClick={onRemove}>Só esta</AlertDialogAction>
							<AlertDialogAction onClick={onRemoveFollowing}>
								Esta e as seguintes
							</AlertDialogAction>
						</>
					) : (
						<AlertDialogAction onClick={onRemove}>Excluir</AlertDialogAction>
					)}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
