'use client'

import { cn } from '@/lib/utils'
import { Tag, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

const normalize = (s: string) =>
	s
		.trim()
		.toLowerCase()
		.replace(/\s+/g, ' ')
		.slice(0, 32)

type TagFieldProps = {
	value: string[]
	onChange: (tags: string[]) => void
	/** every tag the user has already used, for the autocomplete */
	suggestions: string[]
	placeholder?: string
	id?: string
}

/**
 * Creatable tag autocomplete in the "A Bandeira" world. Type to filter the
 * user's existing tags; Enter (or a click) adds an existing one or creates a
 * new one; Backspace on an empty field removes the last tag.
 */
export function TagField({
	value,
	onChange,
	suggestions,
	placeholder = 'Adicionar tag…',
	id,
}: TagFieldProps) {
	const [draft, setDraft] = useState('')
	const [open, setOpen] = useState(false)
	const [active, setActive] = useState(0)
	const inputRef = useRef<HTMLInputElement>(null)

	const draftNorm = normalize(draft)

	const matches = useMemo(() => {
		const pool = suggestions.filter((t) => !value.includes(t))
		if (!draftNorm) return pool.slice(0, 8)
		return pool
			.filter((t) => t.includes(draftNorm))
			.sort((a, b) => Number(b.startsWith(draftNorm)) - Number(a.startsWith(draftNorm)))
			.slice(0, 8)
	}, [suggestions, value, draftNorm])

	const canCreate =
		draftNorm.length > 0 && !value.includes(draftNorm) && !suggestions.includes(draftNorm)

	const options = [
		...matches.map((t) => ({ kind: 'existing' as const, tag: t })),
		...(canCreate ? [{ kind: 'create' as const, tag: draftNorm }] : []),
	]

	const addTag = (tag: string) => {
		const t = normalize(tag)
		if (!t || value.includes(t)) {
			setDraft('')
			return
		}
		onChange([...value, t])
		setDraft('')
		setActive(0)
		inputRef.current?.focus()
	}

	const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag))

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault()
			const pick = options[active]
			addTag(pick ? pick.tag : draft)
		} else if (e.key === 'Backspace' && draft === '' && value.length) {
			removeTag(value[value.length - 1])
		} else if (e.key === 'ArrowDown') {
			e.preventDefault()
			setActive((a) => Math.min(a + 1, options.length - 1))
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setActive((a) => Math.max(a - 1, 0))
		} else if (e.key === 'Escape') {
			setOpen(false)
		}
	}

	return (
		<div className="relative">
			<div
				className={cn(
					'flex flex-wrap items-center gap-1.5 border border-input bg-card px-2 py-2',
					'focus-within:border-accent',
				)}
				onClick={() => inputRef.current?.focus()}
			>
				<Tag className="ml-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
				{value.map((tag) => (
					<span
						key={tag}
						className="inline-flex items-center gap-1 border border-border bg-secondary px-1.5 py-0.5 text-xs font-medium text-foreground"
					>
						{tag}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								removeTag(tag)
							}}
							className="text-muted-foreground hover:text-flag-red"
							aria-label={`Remover tag ${tag}`}
						>
							<X className="h-3 w-3" />
						</button>
					</span>
				))}
				<input
					ref={inputRef}
					id={id}
					value={draft}
					onChange={(e) => {
						setDraft(e.target.value)
						setOpen(true)
						setActive(0)
					}}
					onFocus={() => setOpen(true)}
					onBlur={() => setTimeout(() => setOpen(false), 120)}
					onKeyDown={onKeyDown}
					placeholder={value.length === 0 ? placeholder : ''}
					className="min-w-[7rem] flex-1 bg-transparent py-0.5 text-sm outline-none placeholder:text-muted-foreground"
					autoComplete="off"
				/>
			</div>

			{open && options.length > 0 && (
				<ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto border border-border bg-popover shadow-bill">
					{options.map((opt, i) => (
						<li key={opt.kind + opt.tag}>
							<button
								type="button"
								onMouseDown={(e) => {
									e.preventDefault()
									addTag(opt.tag)
								}}
								onMouseEnter={() => setActive(i)}
								className={cn(
									'flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
									i === active ? 'bg-secondary text-foreground' : 'text-foreground',
								)}
							>
								<Tag className="h-3.5 w-3.5 text-muted-foreground" />
								{opt.kind === 'create' ? (
									<>
										Criar{' '}
										<span className="font-semibold">«{opt.tag}»</span>
									</>
								) : (
									opt.tag
								)}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
