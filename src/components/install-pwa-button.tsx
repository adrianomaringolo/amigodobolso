'use client'

import { usePWAInstall } from 'buildgrid-ui'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { IOSInstallGuide } from './ios-install-guide'

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
				<IOSInstallGuide open={showIOSPrompt} onOpenChange={setShowIOSPrompt} />
			</>
		)
	}

	return trigger(showInstallPrompt)
}

export default InstallPWAButton
