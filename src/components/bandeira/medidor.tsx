'use client'

import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { BandeiraTag } from './bandeira-tag'
import { ConsumoHistograma, type ConsumoPonto } from './consumo-histograma'
import { FLAG_STYLES } from './flag'
import { GastoAlvo } from './leitura'
import { MedidorBar } from './medidor-bar'
import type { CategoryReading } from './use-readings'

/**
 * One category, read like a line on the conta de luz: the flag it flies, the
 * name in official caps, the gasto / alvo reading, the meter bar against the
 * shared target tick, and the last months' consumption.
 */

export function Medidor({
	reading,
	history,
	href,
	onOpen,
	className,
}: {
	reading: CategoryReading
	history?: ConsumoPonto[]
	href?: string
	onOpen?: () => void
	className?: string
}) {
	const s = FLAG_STYLES[reading.flag.level]
	const Wrapper: React.ElementType = onOpen ? 'button' : href ? 'a' : 'div'
	const interactive = !!(onOpen || href)

	return (
		<Wrapper
			{...(href ? { href } : {})}
			{...(onOpen ? { onClick: onOpen, type: 'button' } : {})}
			className={cn(
				'group relative block w-full bg-card px-4 py-3 text-left',
				'border-b border-border last:border-b-0',
				interactive &&
					'transition-colors hover:bg-secondary/40 focus-visible:bg-secondary/40',
				className,
			)}
		>
			<div className="flex items-start gap-3">
				<span
					className={cn(
						'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border',
						s.soft,
						s.text,
						s.border,
					)}
				>
					{reading.icon('w-[18px] h-[18px]')}
				</span>

				<div className="min-w-0 flex-1">
					<div className="flex items-baseline justify-between gap-2">
						<h3 className="notice-label truncate !text-xs text-foreground">
							{reading.label}
						</h3>
						<span className="notice-label shrink-0 !normal-case !tracking-normal">
							{reading.targetPct}% da renda
						</span>
					</div>

					<div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
						<GastoAlvo used={reading.used} target={reading.target} />
						<BandeiraTag flag={reading.flag} size="sm" />
					</div>

					<MedidorBar flag={reading.flag} className="mt-3" />

					{history && history.filter((h) => h.ratio > 0).length > 1 && (
						<div className="mt-4 flex items-end gap-3">
							<span className="notice-label shrink-0 !text-[0.5625rem] leading-none">
								consumo
							</span>
							<ConsumoHistograma pontos={history} className="flex-1" />
						</div>
					)}
				</div>

				{interactive && (
					<ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
				)}
			</div>
		</Wrapper>
	)
}
