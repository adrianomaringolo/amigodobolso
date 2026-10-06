'use client'

import { cn, formatCurrency } from '@/lib/utils'
import { Pencil } from 'lucide-react'
import { useId, useState } from 'react'
import { CATEGORIAS, RENDA_EXEMPLO, RESUMO_CATEGORIA } from './exemplo'
import { useTween } from './movimento'

/** A reading that ticks to its new value instead of jumping. */
function Valor({ value }: { value: number }) {
	return <>{formatCurrency(useTween(value))}</>
}

// Shades of the brand blue for the split bar — identity, not status, so never a flag colour.
const TONS = ['bg-primary', 'bg-primary/40', 'bg-primary/20', 'bg-primary/50', 'bg-primary/25', 'bg-primary/35']

function lerRenda(texto: string) {
	const digitos = texto.replace(/\D/g, '').slice(0, 9)
	return digitos ? Number(digitos) : 0
}

/**
 * The licensed method, made concrete: the visitor's own income split into the
 * six destinations, in reais, recomputed as they type.
 */
export function Metodo() {
	const [texto, setTexto] = useState(RENDA_EXEMPLO.toLocaleString('pt-BR'))
	const renda = lerRenda(texto)
	const [tocou, setTocou] = useState(false)
	const id = useId()

	return (
		<div className="border border-border bg-card shadow-bill">
			<div className="flex flex-col gap-4 border-b border-border px-5 py-5 md:flex-row md:items-end md:justify-between md:px-7">
				<div>
					<div className="flex items-center gap-3">
						<label htmlFor={id} className="notice-label !text-xs text-foreground">
							Sua renda no mês
						</label>
						{!tocou && (
							<span className="hint-nudge flex items-center gap-1.5 bg-foreground px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide text-background" aria-hidden>
								<Pencil className="h-3 w-3" strokeWidth={2.5} />
								Digite
							</span>
						)}
					</div>
					<div
						className={cn(
							'mt-2 flex items-baseline gap-2 border-b-2 border-foreground/80 pb-1 transition-colors focus-within:border-accent',
							!tocou && 'field-hint',
						)}
					>
						<span className="tabular text-2xl font-semibold text-muted-foreground">R$</span>
						<input
							id={id}
							inputMode="numeric"
							autoComplete="off"
							value={texto}
							onFocus={() => setTocou(true)}
							onChange={(e) => {
								const v = lerRenda(e.target.value)
								setTexto(v ? v.toLocaleString('pt-BR') : '')
							}}
							className="tabular w-full min-w-0 bg-transparent text-4xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50 md:w-64"
							placeholder="0"
							style={{ outline: 'none' }}
						/>
					</div>
				</div>
				<p className="max-w-xs text-sm text-muted-foreground">
					Digite a sua renda e veja quanto o método reserva para cada parte da sua vida.
				</p>
			</div>

			{/* one income, six destinations */}
			<div className="bar-grow flex h-10 w-full gap-px bg-card px-5 pt-5 md:px-7" aria-hidden>
				{CATEGORIAS.map(([key, def], i) => (
					<div
						key={key}
						className={cn('flex h-full items-center justify-center', TONS[i])}
						style={{ width: `${def.max}%`, ['--i' as string]: i }}
					>
						<span
							className={cn(
								'tabular text-[0.6875rem] font-bold',
								i === 0 ? 'text-primary-foreground' : 'text-foreground',
								def.max < 10 && 'hidden sm:inline',
							)}
						>
							{def.max}%
						</span>
					</div>
				))}
			</div>

			<ul className="grid px-5 pb-2 pt-3 md:grid-cols-2 md:gap-x-10 md:px-7">
				{CATEGORIAS.map(([key, def], i) => (
					<li key={key} className="flex items-start gap-3 border-b border-border py-3.5 md:[&:nth-last-child(-n+2)]:border-b-0 [&:last-child]:border-b-0">
						<span className={cn('mt-1 h-3 w-3 shrink-0', TONS[i])} aria-hidden />
						<div className="min-w-0 flex-1">
							<div className="flex items-baseline justify-between gap-3">
								<span className="text-sm font-bold text-foreground">{def.label}</span>
								<span className="tabular shrink-0 text-sm font-semibold text-foreground">
									<Valor value={(renda * def.max) / 100} />
								</span>
							</div>
							<div className="mt-0.5 flex items-baseline justify-between gap-3">
								<span className="text-sm text-muted-foreground">{RESUMO_CATEGORIA[key]}</span>
								<span className="tabular shrink-0 text-xs text-muted-foreground">{def.max}%</span>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
