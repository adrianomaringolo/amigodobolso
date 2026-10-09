'use client'

import { cn } from '@/lib/utils'
import {
	useArticleReads,
	useToggleArticleRead,
} from '@/services/education/useArticleReads'
import { toast } from 'buildgrid-ui'
import { Check, Loader2 } from 'lucide-react'

export function MarkAsRead({ slug }: { slug: string }) {
	const { readSlugs, isLoading } = useArticleReads()
	const { mutate, isPending } = useToggleArticleRead()
	const isRead = readSlugs.has(slug)

	return (
		<button
			type="button"
			disabled={isLoading || isPending}
			aria-pressed={isRead}
			onClick={() =>
				mutate(
					{ slug, read: !isRead },
					{
						onSuccess: () => !isRead && toast.success('Leitura registrada!'),
						onError: () => toast.error('Não foi possível salvar. Tente de novo.'),
					},
				)
			}
			className={cn(
				'flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60',
				isRead
					? 'border border-flag-blue bg-flag-blue-soft text-flag-blue'
					: 'bg-accent text-accent-foreground hover:bg-accent/90',
			)}
		>
			{isPending ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Check className="h-4 w-4" strokeWidth={2.5} />
			)}
			{isRead ? 'Lido' : 'Marcar como lido'}
		</button>
	)
}
