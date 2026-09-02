'use client'

import { useFormContext } from 'react-hook-form'

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Textarea } from 'buildgrid-ui'

type TextFormFieldProps = {
	label?: string
	name: string
}

export const TextareaFormField = (
	props: TextFormFieldProps & React.ComponentProps<'textarea'>,
) => {
	const { label, name, ...rest } = props
	const form = useFormContext()

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<Textarea className="resize-none" {...rest} {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
