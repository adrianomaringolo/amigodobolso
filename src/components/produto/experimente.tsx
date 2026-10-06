'use client'

import { BandeiraTag } from '@/components/bandeira/bandeira-tag'
import { FLAG_STYLES, type FlagLevel } from '@/components/bandeira/flag'
import { FlagIcon } from '@/components/bandeira/flag-icon'
import { GastoAlvo } from '@/components/bandeira/leitura'
import { MedidorBar } from '@/components/bandeira/medidor-bar'
import { cn, formatCurrency } from '@/lib/utils'
import { MoveHorizontal } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { GASTOS_EXEMPLO, leituraExemplo } from './exemplo'
import { prefersReducedMotion, useOnceInView } from './movimento'

const NIVEIS: { level: FlagLevel; chip: string; faixa: string; texto: string }[] = [
	{
		level: 'azul',
		chip: 'no azul',
		faixa: 'até 84% do alvo',
		texto: 'Dentro do plano. Pode seguir o mês tranquilo.',
	},
	{
		level: 'amarela',
		chip: 'no amarelo',
		faixa: 'de 85% a 100%',
		texto: 'Chegando no limite. Hora de segurar um pouco.',
	},
	{
		level: 'vermelha',
		chip: 'no vermelho',
		faixa: 'acima de 100%',
		texto: 'Passou do plano. Você vê na hora, não no fim do mês.',
	},
]

const MAX = 720
const INICIAL = GASTOS_EXEMPLO.leisure ?? 0

// The one-time demo: the slider drags itself through all three flags and back.
const ROTEIRO = [
	{ para: 250, ms: 900 },
	{ para: 600, ms: 1400 },
	{ para: INICIAL, ms: 900 },
]
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * The signature interaction: the visitor drags one category's spending and
 * watches its flag change, exactly as it would during a real month.
 */
export function Experimente() {
	const [gasto, setGasto] = useState(INICIAL)
	const [tocou, setTocou] = useState(false)
	const [demonstrando, setDemonstrando] = useState(false)
	const frame = useRef(0)
	const reading = leituraExemplo('leisure', gasto)
	const s = FLAG_STYLES[reading.flag.level]
	const id = useId()

	const parar = () => {
		cancelAnimationFrame(frame.current)
		setDemonstrando(false)
	}

	const ref = useOnceInView<HTMLDivElement>(() => {
		if (prefersReducedMotion()) return
		setDemonstrando(true)
		let etapa = 0
		let origem = INICIAL
		let inicio = performance.now() + 350
		const passo = (agora: number) => {
			const { para, ms } = ROTEIRO[etapa]
			const t = Math.max(0, Math.min((agora - inicio) / ms, 1))
			setGasto(Math.round((origem + (para - origem) * easeInOut(t)) * 10) / 10)
			if (t >= 1) {
				etapa++
				if (etapa >= ROTEIRO.length) return setDemonstrando(false)
				origem = para
				inicio = agora + 450
			}
			frame.current = requestAnimationFrame(passo)
		}
		frame.current = requestAnimationFrame(passo)
	})

	useEffect(() => () => cancelAnimationFrame(frame.current), [])

	const assumir = () => {
		if (demonstrando) parar()
		setTocou(true)
	}

	return (
		<div ref={ref} className="grid gap-px border border-border bg-border shadow-bill lg:grid-cols-[1fr_1.1fr]">
			{/* the legend — the back of the bill */}
			<ol className="flex flex-col bg-card" aria-label="Como ler as bandeiras">
				{NIVEIS.map((n) => {
					const ativo = n.level === reading.flag.level
					const ns = FLAG_STYLES[n.level]
					return (
						<li
							key={n.level}
							className={cn(
								'flex flex-1 items-center gap-4 border-b border-border px-5 py-4 transition-colors duration-300 last:border-b-0',
								ativo ? ns.soft : 'bg-card',
							)}
							aria-current={ativo ? 'true' : undefined}
						>
							<span key={ativo ? 'on' : 'off'} className={cn('mt-0.5', ativo && 'flag-wave animate-flag-raise')}>
								<FlagIcon level={n.level} size={40} />
							</span>
							<div className="min-w-0">
								<p className="flex flex-wrap items-baseline gap-x-3">
									<span className={cn('text-base font-extrabold uppercase tracking-wide', ns.text)}>
										{n.chip}
									</span>
									<span className="tabular text-xs text-muted-foreground">{n.faixa}</span>
								</p>
								<p className="mt-1 text-sm text-foreground/85">{n.texto}</p>
							</div>
						</li>
					)
				})}
			</ol>

			{/* the live meter */}
			<div className="flex flex-col justify-between gap-6 bg-card px-5 py-5 md:px-7 md:py-6">
				<div>
					<label htmlFor={id} className="text-lg font-bold leading-snug text-foreground">
						Quanto você gastou com lazer este mês?
					</label>
					<p className="mt-1 text-sm text-muted-foreground">
						Arraste. Com uma renda de {formatCurrency(4800)}, o plano reserva{' '}
						<span className="tabular font-semibold text-foreground">
							{formatCurrency(reading.target)}
						</span>{' '}
						para o lazer.
					</p>
				</div>

				<div className={cn('border px-4 py-4 transition-colors duration-300', s.border, s.soft)}>
					<div className="flex flex-wrap items-center justify-between gap-3">
						<span className="flex items-center gap-2.5">
							<span className={cn('flex h-9 w-9 items-center justify-center border bg-card', s.border, s.text)}>
								{reading.icon('w-[18px] h-[18px]')}
							</span>
							<span className="notice-label !text-xs text-foreground">Lazer</span>
						</span>
						<span key={reading.flag.level} className="tag-pop inline-flex">
							<BandeiraTag flag={reading.flag} />
						</span>
					</div>
					<GastoAlvo used={gasto} target={reading.target} className="mt-3 block !text-base" />
					<MedidorBar flag={reading.flag} className="mt-3" height="h-3.5" />
				</div>

				<div className="relative">
					{!tocou && (
						<span
							className="hint-nudge pointer-events-none absolute -top-9 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap bg-foreground px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-background after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-x-[5px] after:border-t-[5px] after:border-x-transparent after:border-t-foreground"
							style={{ left: `clamp(3.5rem, ${(gasto / MAX) * 100}%, calc(100% - 3.5rem))` }}
							aria-hidden
						>
							<MoveHorizontal className="h-3.5 w-3.5" strokeWidth={2.5} />
							Arraste
						</span>
					)}
					<input
						id={id}
						type="range"
						min={0}
						max={MAX}
						step={10}
						value={gasto}
						onChange={(e) => {
							assumir()
							setGasto(Number(e.target.value))
						}}
						onPointerDown={assumir}
						onKeyDown={assumir}
						aria-valuetext={`${formatCurrency(gasto)}, ${reading.flag.chip}`}
						className={cn('leitura-range w-full', !tocou && 'is-hint')}
					/>
					<div className="tabular mt-1.5 flex justify-between text-[0.6875rem] text-muted-foreground">
						<span>{formatCurrency(0)}</span>
						<span>{formatCurrency(MAX)}</span>
					</div>
				</div>
			</div>
		</div>
	)
}
