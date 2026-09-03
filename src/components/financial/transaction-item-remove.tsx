import { useUser } from '@/lib/hooks/use-user'
import { FinancialEntry } from '@/lib/types/Entry.type'
import { useDeleteEntry } from '@/services/entries/useDeleteEntry'
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
} from 'buildgrid-ui'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
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

	const onRemove = () => {
		deleteMutation.mutateAsync(transaction.id).then(() => {
			toast.success('Lançamento removido com sucesso')
		})
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<LoadButton variant="destructive" isLoading={deleteMutation.isPending}>
					<Trash2 className="mr-1.5 h-4 w-4" />
					Remover
				</LoadButton>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
					<AlertDialogDescription>
						Essa ação não pode ser desfeita. Você tem certeza que deseja excluir esse
						lançamento?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction onClick={onRemove}>Excluir</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
