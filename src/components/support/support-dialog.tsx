'use client'

import { useUser } from '@/lib/hooks/use-user'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from 'buildgrid-ui'
import { Check, Copy, Mail } from 'lucide-react'
import { createContext, useContext, useState, type ReactNode } from 'react'

export const SUPPORT_EMAIL = 'contato@dolfyn.com.br'

interface SupportContextValue {
	openSupport: () => void
}

const SupportContext = createContext<SupportContextValue>({ openSupport: () => {} })

export const useSupport = () => useContext(SupportContext)

/** Mounts the support modal once so any screen can open it through `useSupport()`. */
export function SupportProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false)

	return (
		<SupportContext.Provider value={{ openSupport: () => setOpen(true) }}>
			{children}
			<SupportDialog open={open} onOpenChange={setOpen} />
		</SupportContext.Provider>
	)
}

function SupportDialog({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const { user } = useUser()
	const [copied, setCopied] = useState(false)

	const body = `Olá! Meu e-mail na conta é ${user?.email ?? ''}.\n\n`
	const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
		'Amigo do Bolso: dúvida ou sugestão',
	)}&body=${encodeURIComponent(body)}`

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(SUPPORT_EMAIL)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch {
			// clipboard unavailable: the address stays visible for manual copy
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Fale com a gente</DialogTitle>
					<DialogDescription>
						Ficou com alguma dúvida ou tem uma sugestão? Envie um e-mail para o endereço
						abaixo que respondemos o quanto antes.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<p className="break-all border border-border bg-muted/60 px-3 py-2.5 text-center text-sm font-semibold text-foreground">
						{SUPPORT_EMAIL}
					</p>

					<div className="flex flex-col gap-2 sm:flex-row">
						<a
							href={mailto}
							className="flex min-h-11 flex-1 items-center justify-center gap-2 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
						>
							<Mail className="h-4 w-4" />
							Escrever e-mail
						</a>
						<button
							type="button"
							onClick={copyEmail}
							className="flex min-h-11 items-center justify-center gap-2 border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
						>
							{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
							{copied ? 'Copiado' : 'Copiar e-mail'}
						</button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
