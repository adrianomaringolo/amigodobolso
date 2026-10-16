'use client'

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { parseLocalDate, toISODate } from '@/lib/utils/date'
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from 'buildgrid-ui'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

type DateFormFieldProps = {
	label?: string
	name?: string
}

const formatDisplay = (value: string) =>
	new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(parseLocalDate(value))

/**
 * A pt-BR calendar picker bound to a plain `YYYY-MM-DD` string — the format
 * entries are stored in. The native `<input type="date">` follows the OS locale
 * (MM/DD/YYYY on an English desktop), so it is not used here. Conversion goes
 * through `parseLocalDate` / `toISODate` to avoid timezone drift.
 */
export const DateFormField = ({ label, name = 'date' }: DateFormFieldProps) => {
	const form = useFormContext()
	const [open, setOpen] = useState(false)

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-col">
					{label && <FormLabel>{label}</FormLabel>}
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									type="button"
									variant="outline"
									className="w-full justify-start gap-2 font-normal"
									onBlur={field.onBlur}
									ref={field.ref}
								>
									<CalendarIcon className="size-4 opacity-60" />
									{field.value ? (
										formatDisplay(field.value)
									) : (
										<span className="text-muted-foreground">Selecione a data</span>
									)}
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								language="ptBR"
								selectedDate={field.value ? parseLocalDate(field.value) : undefined}
								onChange={(date) => {
									field.onChange(toISODate(date))
									setOpen(false)
								}}
							/>
						</PopoverContent>
					</Popover>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
