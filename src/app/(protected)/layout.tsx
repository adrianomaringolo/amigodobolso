'use client'

import { BottomBar } from '@/components/navigation/bottom-bar'
import { ContaMasthead } from '@/components/navigation/conta-masthead'
import { FooterComponent } from '@/components/navigation/footer'
import { createClient } from '@/lib/supabase/client'
import { authErrors } from '@/lib/types/Auth.type'
import { useDialog } from 'buildgrid-ui'
import { FileKey, Loader, MailCheck } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
	const supabase = createClient()
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const router = useRouter()

	const dialog = useDialog()
	const searchParams = useSearchParams()

	const validateAccess = async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession()

		if (session) {
			setIsAuthenticated(true)
		} else {
			router.push('/login')
		}
	}

	const checkError = () => {
		const errorCode = searchParams.get('error_code')
		if (errorCode) {
			dialog.confirm({
				icon: FileKey,
				title: 'Erro ao acessar sua conta',
				message: authErrors[errorCode as keyof typeof authErrors],
				confirmButton: {
					label: 'Ir para login',
					onClick: () => router.push('/login'),
				},
			})
			return true
		}
	}

	const checkCodeVerification = () => {
		const code = searchParams.get('code')
		if (code) {
			dialog.confirm({
				icon: MailCheck,
				title: 'Sua conta foi verificada 🎉',
				message:
					'Agora você já pode acessar sua conta e começar a controlar suas finanças.',
				confirmButton: {
					label: 'Ir para meu início',
					onClick: () => router.push('/inicio'),
				},
			})
			return true
		}
	}

	useEffect(() => {
		if (checkError()) return
		if (checkCodeVerification()) return
		validateAccess()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams])

	if (!isAuthenticated) {
		return (
			<div className="flex h-dvh w-full flex-col items-center justify-center gap-3 bg-background">
				<Loader className="h-10 w-10 animate-spin text-primary" />
				<p className="notice-label">Carregando sua conta</p>
			</div>
		)
	}

	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<ContaMasthead />
			<main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-6 md:px-6 md:pb-14 md:pt-8">
				{children}
			</main>
			<FooterComponent />
			<BottomBar />
		</div>
	)
}
