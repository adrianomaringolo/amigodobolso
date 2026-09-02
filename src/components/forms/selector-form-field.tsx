import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from 'buildgrid-ui'
import { ReactElement } from 'react'
import { useFormContext } from 'react-hook-form'

type SelectorFormFieldProps = {
	label?: string
	name: string
	options: { value: string; label: string | ReactElement }[]
}

export const SelectorFormField = (props: SelectorFormFieldProps) => {
	const { label, name, options } = props
	const form = useFormContext()

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && <FormLabel>{label}</FormLabel>}
					<Select onValueChange={field.onChange} value={field.value}>
						<FormControl>
							<SelectTrigger>
								<div className="flex items-center">
									<SelectValue placeholder="Selecione" />
								</div>
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{options.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									<div className="flex items-center gap-2">{option.label}</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
