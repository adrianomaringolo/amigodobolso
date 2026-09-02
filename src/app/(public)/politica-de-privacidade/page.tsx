import { Privacy } from '@/components/privacy'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Política de privacidade | Amigo do Bolso',
	description: 'Política de privacidade do aplicativo Amigo do Bolso',
}

export default function PrivacyPage() {
	return <Privacy />
}
