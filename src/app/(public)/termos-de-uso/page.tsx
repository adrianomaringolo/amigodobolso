import { Terms } from '@/components/terms'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Termos de uso | Amigo do Bolso',
	description: 'Termos de uso do aplicativo Amigo do Bolso',
}

export default function TermsPage() {
	return <Terms />
}
