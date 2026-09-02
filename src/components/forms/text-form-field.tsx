'use client'

import { useFormContext } from 'react-hook-form'

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { AdaptiveInput } from 'buildgrid-ui'

type TextFormFieldProps = {
	label?: string
}

export const TextFormField = (
	props: TextFormFieldProps & React.ComponentProps<'input'>,
) => {
	const { label, name, ...rest } = props

	const form = useFormContext()

	return (
		<FormField
			control={form.control}
			name={name as string}
			render={({ field }) => (
				<FormItem>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<AdaptiveInput {...rest} {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
