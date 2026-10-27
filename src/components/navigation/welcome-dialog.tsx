'use client'

import { createClient } from '@/lib/supabase/client'
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from 'buildgrid-ui'
import { HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Accounts older than this predate the welcome and should not see it.
const NEW_ACCOUNT_DAYS = 7

/** Greets a new user once, pointing to the help area; the flag lives in the user metadata. */
export function WelcomeDialog() {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')
	const supabase = createClient()

	useEffect(() => {
		async function check() {
			const {
				data: { session },
			} = await supabase.auth.getSession()
			const user = session?.user
			if (!user || user.user_metadata.welcomed) return

			const ageInDays = (Date.now() - new Date(user.created_at).getTime()) / 86_400_000
			if (ageInDays > NEW_ACCOUNT_DAYS) return

			const fullName = (user.user_metadata.full_name ?? user.user_metadata.name ?? '') as string
			setName(fullName.split(' ')[0])
			setOpen(true)
		}
		check()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function handleOpenChange(next: boolean) {
		setOpen(next)
		if (!next) {
			supabase.auth.updateUser({ data: { welcomed: true } }).catch(() => {})
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>{name ? `Boas-vindas, ${name}! 🎉` : 'Boas-vindas! 🎉'}</DialogTitle>
					<DialogDescription>
						Que bom ter você no Amigo do Bolso. Para saber como começar a usar, passo a
						passo, acesse a área de ajuda a qualquer momento pelo ícone{' '}
						<HelpCircle className="inline h-4 w-4 align-text-bottom" aria-hidden /> no
						topo da tela.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-2 sm:flex-row">
					<Button asChild size="lg" className="flex-1" onClick={() => handleOpenChange(false)}>
						<Link href="/ajuda">Ver como começar</Link>
					</Button>
					<Button
						type="button"
						variant="outline"
						size="lg"
						className="flex-1"
						onClick={() => handleOpenChange(false)}
					>
						Agora não
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
