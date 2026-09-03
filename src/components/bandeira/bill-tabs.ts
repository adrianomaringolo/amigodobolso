/**
 * Shared classes to make buildgrid's Tabs read as ruled bill tabs: a bottom
 * hairline for the list, an orange underline for the active tab, no pill / box.
 */
export const billTabsList =
	'!w-full !justify-start !gap-0 !rounded-none !border-b !border-border !bg-transparent !p-0'

export const billTabsTrigger =
	'flex items-center gap-1.5 !rounded-none !border-0 !border-b-2 !border-transparent !bg-transparent !px-3 !py-2.5 !text-sm !font-medium !text-muted-foreground !shadow-none data-[state=active]:!border-accent data-[state=active]:!bg-transparent data-[state=active]:!text-foreground data-[state=active]:!shadow-none'
