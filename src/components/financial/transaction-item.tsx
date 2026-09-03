import { useUser } from '@/lib/hooks/use-user'
import { FinancialEntry } from '@/lib/types/Entry.type'
import { cn } from '@/lib/utils'
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
import { BadgeAlert, BadgeCheck, Pencil, Repeat2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { TooltipMessage } from '../helpers/tooltip-message'
import { AmountValue } from './amount-value'
import { TransactionTypes } from './financial.types'
import { TagList } from './tag-list'
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

	const { category, date, description, amount, isCompleted, times, tags } = transaction
	const typeDefinition = TransactionTypes[category as keyof typeof TransactionTypes]

	const updateEntryMutation = useUpdateEntry({
		userId: user?.id as string,
		monthYear: getMonthYear(transaction.date),
	})

	const handleComplete = async () => {
		await updateEntryMutation.mutateAsync({ ...transaction, isCompleted: !isCompleted })
		toast.success('Lançamento atualizado')
	}

	return (
		<div className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0">
			<button
				type="button"
				onClick={() => setIsDetailOpen(true)}
				className="flex min-w-0 flex-1 items-center gap-3 text-left"
			>
				<span className="flex h-9 w-9 shrink-0 items-center justify-center border border-border text-muted-foreground">
					{typeDefinition?.icon('w-[18px] h-[18px]')}
				</span>
				<span className="min-w-0 flex-1">
					<span className="flex items-center gap-1.5">
						<span className="truncate text-sm text-foreground">{description}</span>
						{times && parseInt(times) > 1 && (
							<Repeat2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
						)}
					</span>
					<span className="notice-label !normal-case !tracking-normal">
						{typeDefinition?.label}
					</span>
					<TagList tags={tags} className="mt-1" size="xs" />
				</span>
			</button>

			<AmountValue value={amount} className="tabular text-sm font-semibold" signed />

			<TooltipMessage message={isCompleted ? 'Efetivado' : 'Marcar como pago'}>
				<button
					type="button"
					onClick={handleComplete}
					className={cn(
						'shrink-0 rounded-sm p-1 transition-colors',
						isCompleted ? 'text-flag-green' : 'text-muted-foreground hover:text-foreground',
					)}
					aria-label={isCompleted ? 'Efetivado' : 'Marcar como pago'}
				>
					{isCompleted ? (
						<BadgeCheck className="h-5 w-5" />
					) : (
						<BadgeAlert className="h-5 w-5" />
					)}
				</button>
			</TooltipMessage>

			<Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{description}</DialogTitle>
						<DialogDescription>{formatDateAndWeekdayAndYear(date)}</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-2">
						<AmountValue
							value={amount}
							className="tabular text-2xl font-bold"
							signed
						/>
						{times && parseInt(times) > 1 && (
							<p className="flex items-center gap-1.5 text-sm text-muted-foreground">
								<Repeat2 className="h-4 w-4" />
								Parcelado em {times}x de <AmountValue value={amount} className="tabular" />
							</p>
						)}
						<div className="flex items-center gap-3 border-t border-border pt-4">
							<span className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground">
								{typeDefinition?.icon('w-5 h-5')}
							</span>
							<div>
								<p className="notice-label">Categoria</p>
								<p className="text-sm font-medium text-foreground">
									{typeDefinition?.label}
								</p>
							</div>
						</div>
						{tags && tags.length > 0 && (
							<div>
								<p className="notice-label mb-1.5">Tags</p>
								<TagList tags={tags} />
							</div>
						)}
					</div>
					<DialogFooter className="flex-row items-center justify-end gap-2 sm:gap-2">
						<Button variant="outline" onClick={() => setIsEditing(true)}>
							<Pencil className="mr-1.5 h-4 w-4" />
							Editar
						</Button>
						<TransactionItemRemove transaction={transaction} />
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog modal open={isEditing} onOpenChange={setIsEditing}>
				<DialogContent>
					<DialogHeader className="sr-only">
						<DialogTitle>Editar lançamento</DialogTitle>
						<DialogDescription>Edite os dados do lançamento</DialogDescription>
					</DialogHeader>
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
		</div>
	)
}
