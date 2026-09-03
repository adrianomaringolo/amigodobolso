import Link from 'next/link'

export function FooterComponent() {
	return (
		<footer className="mt-6 border-t border-border bg-card">
			<div className="edge-perf edge-perf-top h-px w-full" aria-hidden />
			<div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
				<p className="tabular">
					© {new Date().getFullYear()} Amigo do Bolso ·{' '}
					<span className="whitespace-nowrap">
						método em parceria com{' '}
						<span className="font-semibold text-foreground">No Final das Contas</span>
					</span>
				</p>
				<nav className="flex gap-4">
					<Link href="/termos-de-uso" className="hover:text-foreground hover:underline">
						Termos de uso
					</Link>
					<Link
						href="/politica-de-privacidade"
						className="hover:text-foreground hover:underline"
					>
						Política de privacidade
					</Link>
					<Link href="/ajuda" className="hover:text-foreground hover:underline">
						Ajuda
					</Link>
				</nav>
			</div>
		</footer>
	)
}
