'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	usePWAInstall,
} from 'buildgrid-ui'
import { Download, Share } from 'lucide-react'
import { useState } from 'react'

/**
 * Install-app affordance for the masthead. Styled for the institutional-blue bar
 * (a quiet outline on dark), not the generic `secondary` button which is built
 * for light surfaces and renders low-contrast here.
 */
const InstallPWAButton = () => {
	const { isPromptReady, isInstalled, showInstallPrompt } = usePWAInstall()
	const [showIOSPrompt, setShowIOSPrompt] = useState(false)

	const isIOSDevice =
		typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

	if (isInstalled || (!isPromptReady && !isIOSDevice)) return null

	const trigger = (onClick: () => void) => (
		<button
			type="button"
			onClick={onClick}
			className="flex items-center gap-2 border border-white/25 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-white/20"
		>
			<Download className="h-4 w-4" strokeWidth={2} />
			Instalar app
		</button>
	)

	if (isIOSDevice) {
		return (
			<>
				{trigger(() => setShowIOSPrompt(true))}
				<Dialog open={showIOSPrompt} onOpenChange={setShowIOSPrompt}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Instalar no iPhone ou iPad</DialogTitle>
							<DialogDescription>
								O Safari não instala apps automaticamente. É rápido:
							</DialogDescription>
						</DialogHeader>
						<ol className="mt-2 space-y-3 text-sm text-foreground">
							<li className="flex gap-3">
								<span className="notice-label mt-0.5 shrink-0 !text-xs">1</span>
								<span>
									Toque no botão{' '}
									<Share className="inline h-4 w-4 align-text-bottom" /> {'"'}
									Compartilhar{'"'} na barra do Safari.
								</span>
							</li>
							<li className="flex gap-3">
								<span className="notice-label mt-0.5 shrink-0 !text-xs">2</span>
								<span>
									Escolha{' '}
									<strong className="font-semibold">Adicionar à Tela de Início</strong>.
								</span>
							</li>
							<li className="flex gap-3">
								<span className="notice-label mt-0.5 shrink-0 !text-xs">3</span>
								<span>Confirme em Adicionar.</span>
							</li>
						</ol>
					</DialogContent>
				</Dialog>
			</>
		)
	}

	return trigger(showInstallPrompt)
}

export default InstallPWAButton
