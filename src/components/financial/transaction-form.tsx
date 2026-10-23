'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { useUser } from '@/lib/hooks/use-user'
import { FinancialEntry } from '@/lib/types/Entry.type'
import { formatCurrency } from '@/lib/utils'
import { parseLocalDate, toISODate, todayISODate } from '@/lib/utils/date'
import { hasFollowingInstallments } from '@/lib/utils/installments'
import { useAddEntry } from '@/services/entries/useAddEntry'
import { useGetTags } from '@/services/entries/useGetTags'
import { useUpdateEntry } from '@/services/entries/useUpdateEntry'
import { useUpdateFollowingInstallments } from '@/services/entries/useUpdateFollowingInstallments'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	Switch,
	ToggleGroup,
	ToggleGroupItem,
	toast,
} from 'buildgrid-ui'
import { addMonths } from 'date-fns'
import { CurrencyField } from '../forms/currency-field'
import { DateFormField } from '../forms/date-form-field'
import { LoadButton } from '../forms/load-button'
import { SelectorFormField } from '../forms/selector-form-field'
import { TextFormField } from '../forms/text-form-field'
import { TextareaFormField } from '../forms/textarea-form-field'
import { AmountType, AmountTypes, TransactionTypes } from './financial.types'
import { TagField } from './tag-field'

const formSchema = z.object({
	type: z.enum([AmountTypes.expanses, AmountTypes.income]),
	amount: z.string().min(1, 'Preencha o valor'),
	description: z.string().min(1, 'Preencha a descrição'),
	category: z.string().min(1, 'Selecione a categoria'),
	times: z.string().optional(),
	notes: z.string().optional(),
	tags: z.array(z.string()).default([]),
	date: z.string().min(1, 'Selecione uma data'), // YYYY-MM-DD
	completed: z.boolean().default(true),
})

type TransactionFormProps = {
	transactionToEdit?: FinancialEntry
	monthYear: string
	handleClose: () => void
}

type TransactionFormValues = Omit<FinancialEntry, 'id'>

export const TransactionForm = (props: TransactionFormProps) => {
	const { monthYear, handleClose, transactionToEdit } = props
	const { user } = useUser()

	const initialType: AmountType =
		(transactionToEdit?.amount ?? 0) > 0 ? AmountTypes.income : AmountTypes.expanses
	const [formType, setFormType] = useState<AmountType>(initialType)

	const isEditing = !!transactionToEdit

	const { data: userTags } = useGetTags()
	const tagSuggestions = userTags.map((t) => t.tag)

	const addEntryMutation = useAddEntry({ userId: user?.id as string, monthYear })
	const editUpdateMutation = useUpdateEntry({ userId: user?.id as string, monthYear })
	const updateFollowingMutation = useUpdateFollowingInstallments({
		userId: user?.id as string,
	})

	// edit of an installment waiting for "only this one" / "this and the following"
	const [pendingEdit, setPendingEdit] = useState<FinancialEntry | null>(null)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: initialType,
			amount: Math.abs(transactionToEdit?.amount ?? 0).toString() ?? '',
			description: transactionToEdit?.description ?? '',
			category:
				transactionToEdit?.category ??
				(initialType === AmountTypes.income ? AmountTypes.income : ''),
			times: transactionToEdit?.times ?? '1',
			notes: transactionToEdit?.notes ?? '',
			tags: transactionToEdit?.tags ?? [],
			date: transactionToEdit?.date ? toISODate(transactionToEdit.date) : todayISODate(),
			completed: transactionToEdit?.isCompleted ?? true,
		},
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const { type, amount, description, category, notes, date, completed, times, tags } =
			values

		const correctAmount =
			type === AmountTypes.expanses
				? -Math.abs(parseFloat(amount))
				: Math.abs(parseFloat(amount))

		const newTransaction: TransactionFormValues = {
			amount: correctAmount,
			description,
			category,
			notes,
			times,
			tags,
			isCompleted: completed,
			date, // plain YYYY-MM-DD
			createdAt: new Date().toISOString(),
		}

		if (transactionToEdit) {
			const edited: FinancialEntry = {
				...transactionToEdit,
				...newTransaction,
				createdAt: transactionToEdit.createdAt,
			}
			if (hasFollowingInstallments(transactionToEdit)) {
				setPendingEdit(edited)
			} else {
				await saveEdit(edited, false)
			}
		} else {
			handleAddingTimes(newTransaction)
		}
	}

	const saveEdit = async (entry: FinancialEntry, includeFollowing: boolean) => {
		if (includeFollowing) {
			await updateFollowingMutation.mutateAsync(entry)
		} else {
			await editUpdateMutation.mutateAsync(entry)
		}
		toast.success(
			includeFollowing
				? 'Parcelas atualizadas com sucesso'
				: 'Lançamento atualizado com sucesso',
		)
		setPendingEdit(null)
		handleClose()
		form.reset()
	}

	const handleAddingTimes = async (transaction: TransactionFormValues) => {
		const times = Math.max(1, parseInt(transaction.times ?? '1'))
		const installmentGroup = times > 1 ? crypto.randomUUID() : null

		for (let i = 0; i < times; i++) {
			await addEntryMutation.mutate({
				...transaction,
				date: toISODate(addMonths(parseLocalDate(transaction.date), i)),
				description:
					times > 1
						? `${transaction.description} (${i + 1}/${times})`
						: transaction.description,
				installmentGroup,
				installmentNumber: times > 1 ? i + 1 : null,
			})
		}

		toast.success('Lançamento criado com sucesso')
		handleClose()
		form.reset()
	}

	const handleTypeChange = (value: string) => {
		if (value === AmountTypes.expanses || value === AmountTypes.income) {
			setFormType(value as AmountType)
			form.setValue('type', value as AmountType)
			if (value === AmountTypes.income) {
				// only one income category — select it automatically
				form.setValue('category', AmountTypes.income, { shouldValidate: true })
			} else if (form.getValues('category') === AmountTypes.income) {
				form.setValue('category', '')
			}
		}
	}

	const getTypeCategories = (type: AmountType) => {
		return Object.entries(TransactionTypes)
			.map(([key, value]) => {
				if (value.type === type) {
					return {
						value: key,
						label: (
							<>
								{value.icon()}
								<span>{value.label}</span>
							</>
						),
					}
				}
				return undefined
			})
			.filter(Boolean) as { value: string; label: string | ReactElement }[]
	}

	const expensesCategories = getTypeCategories(AmountTypes.expanses as AmountType)

	//  create an array of options to select the amount of times an expense is divided. It will go from 1 to 24. the label of 1 should be "A vista"
	const timesOptions = Array.from({ length: 24 }, (_, i) => ({
		value: (i + 1).toString(),
		label: i === 0 ? 'À vista' : `${i + 1} vezes`,
	}))

	return (
		<div className="w-full max-w-md mx-auto p-2 md:p-6 space-y-6">
			<ToggleGroup
				type="single"
				value={formType}
				onValueChange={handleTypeChange}
				className="mb-6 w-full justify-center"
			>
				<ToggleGroupItem
					value={AmountTypes.expanses}
					className={`min-w-0 transition-all ${
						formType === AmountTypes.expanses
							? '!bg-expense !text-white hover:!bg-expense/80 flex-1'
							: '!bg-expense/30 !text-expense hover:!bg-expense/50'
					}`}
				>
					Despesa
				</ToggleGroupItem>
				<ToggleGroupItem
					value={AmountTypes.income}
					className={`min-w-0 transition-all ${
						formType === AmountTypes.income
							? '!bg-income !text-white hover:!bg-income/80 flex-1'
							: '!bg-income/30 !text-income hover:!bg-income/50'
					}`}
				>
					Receita
				</ToggleGroupItem>
			</ToggleGroup>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="amount"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<CurrencyField
										sizing="2xl"
										className={`${
											formType === AmountTypes.expanses
												? 'border-expense'
												: 'border-income'
										}`}
										decimalSeparator=","
										thousandSeparator="."
										value={field.value}
										onValueChange={(value: number) => {
											field.onChange(value.toString())
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<TextFormField name="description" placeholder="Descrição" />

					<DateFormField />

					{formType === AmountTypes.expanses && (
						<SelectorFormField
							key={'expanses-category-' + formType}
							name="category"
							options={expensesCategories}
						/>
					)}
					<TextareaFormField
						name="notes"
						placeholder="Adicione observações se necessário"
					/>

					<FormField
						control={form.control}
						name="tags"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="notice-label">Tags</FormLabel>
								<FormControl>
									<TagField
										value={field.value ?? []}
										onChange={field.onChange}
										suggestions={tagSuggestions}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{formType === AmountTypes.expanses && !isEditing && (
						<>
							<SelectorFormField
								key={'times-' + formType}
								label="Parcelas"
								name="times"
								options={timesOptions}
							/>
							{+(form.watch('times') ?? 1) > 1 ? (
								<p className="!mt-1 text-xs text-muted-foreground">
									Você pagará em {form.watch('times')} parcelas de{' '}
									<span className="tabular font-medium text-foreground">
										{formatCurrency(+form.watch('amount'))}
									</span>
								</p>
							) : null}
						</>
					)}

					<FormField
						control={form.control}
						name="completed"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center justify-between border border-border p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-sm font-semibold">Já foi pago</FormLabel>
									<p className="text-xs text-muted-foreground">
										Desmarque para deixar como pendente
									</p>
								</div>
								<FormControl>
									<Switch checked={field.value} onCheckedChange={field.onChange} />
								</FormControl>
							</FormItem>
						)}
					/>

					{/* pinned to the bottom of the scrolling dialog; no side bleed, so the form never
					    gets wider than the dialog on phones (where its padding is only p-2) */}
					<div className="sticky -bottom-6 -mb-6 bg-background pb-6 pt-3">
						<LoadButton
							type="submit"
							size="xl"
							className={`w-full ${
								formType === AmountTypes.expanses
									? 'bg-expense/90 hover:bg-expense'
									: 'bg-income/90 hover:bg-income'
							}`}
							isLoading={
								addEntryMutation.isPending ||
								editUpdateMutation.isPending ||
								updateFollowingMutation.isPending
							}
						>
							Salvar
						</LoadButton>
					</div>
				</form>
			</Form>

			<AlertDialog
				open={!!pendingEdit}
				onOpenChange={(open) => !open && setPendingEdit(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Alterar quais parcelas?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta é a parcela {transactionToEdit?.installmentNumber} de{' '}
							{transactionToEdit?.times}. Se mudar a data, as seguintes acompanham, uma
							por mês.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="gap-2">
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<Button
							variant="outline"
							disabled={editUpdateMutation.isPending || updateFollowingMutation.isPending}
							onClick={() => pendingEdit && saveEdit(pendingEdit, false)}
						>
							Só esta
						</Button>
						<LoadButton
							isLoading={updateFollowingMutation.isPending}
							disabled={editUpdateMutation.isPending}
							onClick={() => pendingEdit && saveEdit(pendingEdit, true)}
						>
							Esta e as seguintes
						</LoadButton>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
