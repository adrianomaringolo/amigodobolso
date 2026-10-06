'use client'

import { BandeiraGeral } from '@/components/bandeira/bandeira-geral'
import { Medidor } from '@/components/bandeira/medidor'
import { cn } from '@/lib/utils'
import {
	BANDEIRA_EXEMPLO,
	GASTO_TOTAL_EXEMPLO,
	LEITURAS_EXEMPLO,
	RENDA_EXEMPLO,
} from './exemplo'

const EM_DESTAQUE = ['essential', 'leisure', 'financial-security']

/**
 * The hero's proof: a month's bill, read in seconds. The month flag on top,
 * three category meters under it, the whole sheet stamped EXEMPLO.
 */
export function ContaExemplo({ className }: { className?: string }) {
	const leituras = EM_DESTAQUE.map((k) => LEITURAS_EXEMPLO.find((c) => c.key === k)!)

	return (
		<figure
			className={cn('flag-wave-hero relative border border-border bg-card text-foreground shadow-bill-raised', className)}
			aria-label="Exemplo de conta do mês no Amigo do Bolso"
		>
			<header className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-2.5">
				<span className="notice-label !text-xs text-foreground">Conta do mês</span>
				<span className="notice-label tabular !tracking-[0.06em]">agosto</span>
			</header>

			<BandeiraGeral
				flag={BANDEIRA_EXEMPLO}
				income={RENDA_EXEMPLO}
				expenses={GASTO_TOTAL_EXEMPLO}
				className="border-0 border-b shadow-none"
			/>

			<div className="meter-reveal [&_h3]:overflow-visible [&_h3]:whitespace-normal">
				{leituras.map((reading) => (
					<Medidor key={reading.key} reading={reading} />
				))}
			</div>

			<figcaption className="flex items-center justify-between gap-3 border-t border-border px-4 py-2 text-xs text-muted-foreground">
				<span>+ 3 categorias do plano</span>
				<span className="tabular">dados fictícios</span>
			</figcaption>

			{/* rubber stamp — this is a sample, not a real account */}
			<span
				aria-hidden
				className="pointer-events-none absolute -top-4 right-16 rotate-[-6deg] border-2 border-flag-red/70 bg-card px-2.5 py-0.5 text-[0.8125rem] font-extrabold uppercase tracking-[0.18em] text-flag-red"
			>
				Exemplo
			</span>
		</figure>
	)
}
