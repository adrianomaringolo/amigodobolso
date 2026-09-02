import { useUser } from '@/lib/hooks/use-user'
import { FinancialEntry } from '@/lib/types/Entry.type'
import { formatDateAndWeekdayAndYear, getMonthYear } from '@/lib/utils/date'
import { useUpdateEntry } from '@/services/entries/useUpdateEntry'
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from 'buildgrid-ui'
import { BadgeAlert, BadgeCheck, Edit, Repeat2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { TooltipMessage } from '../helpers/tooltip-message'
import { AmountValue } from './amount-value'
import { TransactionTypes } from './financial.types'
import { TransactionForm } from './transaction-form'
import { TransactionItemRemove } from './transaction-item-remove'

type TransactionItemProps = {
	transaction: FinancialEntry
}

export const TransactionItem = (props: TransactionItemProps) => {
	const { user } = useUser()
	const { transaction } = props

	const [isDetailOpen, setIsDetailOpen] = useState(false)
	const [isEditing, setIsEditing] = useState(false)

	const { category, date, description, amount, isCompleted, times } = transaction

	const typeDefinition = TransactionTypes[category as keyof typeof TransactionTypes]

	const updateEntryMutation = useUpdateEntry({
		userId: user?.id as string,
		monthYear: getMonthYear(transaction.date),
	})

	const handleComplete = async () => {
		await updateEntryMutation.mutateAsync({
			...transaction,
			isCompleted: !isCompleted,
		})
		toast.success('Lançamento atualizado com sucesso')
	}

	const handleEdit = () => {
		setIsEditing(true)
	}

	return (
		<>
			<div className="flex items-center justify-between py-3 cursor-pointer gap-3">
				<div
					className="flex items-center gap-4 flex-1"
					onClick={() => setIsDetailOpen(true)}
				>
					<TooltipMessage message={typeDefinition.label}>
						<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
							{typeDefinition?.icon()}
						</div>
					</TooltipMessage>
					<span className="text-lg">{description}</span>
					{times && parseInt(times) > 1 && (
						<TooltipMessage message={`Parcelado em ${times} vezes`}>
							<Repeat2 className="w-4 h-4 text-muted-foreground" />
						</TooltipMessage>
					)}
					<div className="flex items-center gap-2 ml-auto">
						<AmountValue value={amount} className="text-lg font-medium" />
					</div>
				</div>

				<TooltipMessage message={isCompleted ? 'Efetivada' : 'Pendente'}>
					<button
						onClick={(e) => {
							e.preventDefault()
							handleComplete()
						}}
						className="hover:border-gray-400 hover:bg-gray-50 p-1 rounded-full"
					>
						{isCompleted ? (
							<BadgeCheck className="w-6 h-6 text-blue-500" />
						) : (
							<BadgeAlert className="w-6 h-6 text-gray-300" />
						)}
					</button>
				</TooltipMessage>
			</div>
			<Dialog open={isDetailOpen} onOpenChange={(open) => setIsDetailOpen(open)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{description}</DialogTitle>
						<DialogDescription>{formatDateAndWeekdayAndYear(date)}</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<AmountValue value={amount} className="text-2xl font-semibold" />
						{times && parseInt(times) > 1 && (
							<div className="text-muted-foreground flex items-center gap-1 mb-4">
								<Repeat2 className="w-4 h-4" />
								Parcelado em {times} vezes de <AmountValue value={amount} />
							</div>
						)}

						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
								{typeDefinition?.icon()}
							</div>

							<div>{typeDefinition?.label}</div>
						</div>
					</div>
					<DialogFooter>
						<Button onClick={handleEdit} className="my-1">
							<Edit className="w-4 h-4" />
							Editar
						</Button>
						<TransactionItemRemove transaction={transaction} />
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog modal open={isEditing} onOpenChange={(open) => setIsEditing(open)}>
				<DialogHeader className="sr-only">
					<DialogTitle>Editar Lançamento</DialogTitle>
					<DialogDescription>Edite os dados do lançamento</DialogDescription>
				</DialogHeader>
				<DialogContent>
					<TransactionForm
						handleClose={() => {
							setIsEditing(false)
							setIsDetailOpen(false)
						}}
						monthYear={getMonthYear(transaction.date)}
						transactionToEdit={transaction}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}
