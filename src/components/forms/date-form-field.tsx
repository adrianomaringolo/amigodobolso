'use client'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { AdaptiveInput } from 'buildgrid-ui'
import { useFormContext } from 'react-hook-form'

type DateFormFieldProps = {
	label?: string
	name?: string
}

/**
 * A native date picker bound to a plain `YYYY-MM-DD` string — the exact format
 * `<input type="date">` expects and the format entries are stored in. No Date /
 * ISO juggling, so no timezone drift.
 */
export const DateFormField = ({ label, name = 'date' }: DateFormFieldProps) => {
	const form = useFormContext()

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-col">
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<AdaptiveInput
							type="date"
							value={(field.value ?? '').slice(0, 10)}
							onChange={(e) => field.onChange(e.target.value)}
							onBlur={field.onBlur}
							name={field.name}
							ref={field.ref}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
