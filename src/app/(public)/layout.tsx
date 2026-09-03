import { FooterComponent } from '@/components/navigation/footer'
import Image from 'next/image'
import Link from 'next/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<header className="bg-primary text-primary-foreground">
				<div className="mx-auto flex h-14 max-w-3xl items-center px-4 md:px-6">
					<Link href="/login" className="flex items-center gap-2.5" aria-label="Amigo do Bolso">
						<Image
							src="/logo-letter-white.png"
							alt=""
							width={132}
							height={40}
							className="h-8 w-auto"
						/>
					</Link>
				</div>
				<div className="edge-perf edge-perf-bottom h-px w-full" aria-hidden />
			</header>

			<main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 md:px-6">
				<article className="border border-border bg-card px-5 py-6 shadow-bill md:px-8 md:py-8">
					{children}
				</article>
				<Link
					href="/login"
					className="mt-6 inline-block text-sm font-semibold text-accent hover:underline"
				>
					← Voltar para o login
				</Link>
			</main>

			<FooterComponent />
		</div>
	)
}
