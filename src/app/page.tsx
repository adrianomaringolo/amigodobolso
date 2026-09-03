'use client'

import { useUser } from '@/lib/hooks/use-user'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
	const router = useRouter()
	const { session, loading } = useUser()

	useEffect(() => {
		if (loading) return
		router.replace(session ? '/inicio' : '/login')
	}, [session, loading, router])

	return (
		<div className="flex min-h-dvh items-center justify-center bg-background">
			<p className="notice-label animate-pulse">Amigo do Bolso</p>
		</div>
	)
}
