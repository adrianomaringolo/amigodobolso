'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from 'buildgrid-ui'
import {
	ChevronLeft,
	ChevronRight,
	Ellipsis,
	Plus,
	Share,
	SquarePlus,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState, type ReactNode } from 'react'

/** Phone-ish frame that holds a simplified drawing of each iOS screen. */
const Frame = ({ children }: { children: ReactNode }) => (
	<div
		aria-hidden
		className="relative mx-auto h-44 w-full max-w-[17rem] overflow-hidden border border-border bg-muted/60"
	>
		{children}
	</div>
)

/** Pulsing ring that points at the control the user has to tap. */
const Ping = ({ className = '' }: { className?: string }) => (
	<span className={`absolute flex h-9 w-9 ${className}`}>
		<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50" />
		<span className="relative inline-flex h-full w-full rounded-full border-2 border-accent" />
	</span>
)

const StepOne = () => (
	<Frame>
		<div className="space-y-2 p-3">
			<div className="h-3 w-2/3 bg-border" />
			<div className="h-2 w-full bg-border/70" />
			<div className="h-2 w-5/6 bg-border/70" />
			<div className="h-2 w-4/6 bg-border/70" />
		</div>
		{/* Safari bottom toolbar */}
		<div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-border bg-card px-4 py-3 text-primary">
			<ChevronLeft className="h-5 w-5 opacity-60" />
			<ChevronRight className="h-5 w-5 opacity-60" />
			<span className="relative flex h-9 w-9 items-center justify-center">
				<Ping className="inset-0" />
				<Share className="relative h-5 w-5" />
			</span>
			<span className="h-4 w-4 border-2 border-primary/60" />
			<Ellipsis className="h-5 w-5 opacity-60" />
		</div>
	</Frame>
)

const StepTwo = () => (
	<Frame>
		<div className="absolute inset-x-0 bottom-0 space-y-1.5 bg-card p-3 pt-4 shadow-[0_-4px_12px_rgb(0_0_0/0.12)]">
			<div className="mx-auto mb-1 h-1 w-10 rounded-full bg-border" />
			<div className="flex items-center justify-between border border-border px-3 py-2 text-[11px] text-muted-foreground">
				Copiar <span className="h-3 w-3 border border-muted-foreground/60" />
			</div>
			<div className="relative flex items-center justify-between border-2 border-accent bg-accent/10 px-3 py-2 text-[11px] font-semibold text-foreground">
				Adicionar à Tela de Início
				<SquarePlus className="h-4 w-4" />
			</div>
			<div className="flex items-center justify-between border border-border px-3 py-2 text-[11px] text-muted-foreground">
				Buscar na página <span className="h-3 w-3 border border-muted-foreground/60" />
			</div>
		</div>
	</Frame>
)

const StepThree = () => (
	<Frame>
		<div className="absolute inset-0 bg-card p-3">
			<div className="mb-3 flex items-center justify-between text-[11px]">
				<span className="text-primary">Cancelar</span>
				<span className="font-semibold">Adicionar à Tela de Início</span>
				<span className="animate-pulse border-2 border-accent bg-accent/10 px-1.5 py-0.5 font-bold text-primary">
					Adicionar
				</span>
			</div>
			<div className="flex items-center gap-3 border border-border p-2">
				<Image
					src="/web-app-manifest-192x192.png"
					alt=""
					width={44}
					height={44}
					className="h-11 w-11 shrink-0 object-contain"
					unoptimized
				/>
				<div className="text-[11px] leading-tight">
					<p className="font-semibold">Amigo do Bolso</p>
					<p className="text-muted-foreground">amigodobolso.app</p>
				</div>
			</div>
		</div>
	</Frame>
)

const STEPS = [
	{
		title: 'Toque em Compartilhar',
		body: (
			<>
				Na barra inferior do Safari, toque no ícone{' '}
				<Share className="inline h-4 w-4 align-text-bottom" />{' '}
				<strong>Compartilhar</strong>.
			</>
		),
		illustration: <StepOne />,
	},
	{
		title: 'Adicionar à Tela de Início',
		body: (
			<>
				Role a lista de opções e escolha <strong>Adicionar à Tela de Início</strong>{' '}
				<Plus className="inline h-4 w-4 align-text-bottom" />.
			</>
		),
		illustration: <StepTwo />,
	},
	{
		title: 'Confirme em Adicionar',
		body: (
			<>
				Toque em <strong>Adicionar</strong>, no canto superior direito. O Amigo do Bolso
				aparece na sua tela de início como um app.
			</>
		),
		illustration: <StepThree />,
	},
]

interface IOSInstallGuideProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	/** Start on a given step (0-based). Handy for previews. */
	initialStep?: number
}

export function IOSInstallGuide({
	open,
	onOpenChange,
	initialStep = 0,
}: IOSInstallGuideProps) {
	const [step, setStep] = useState(initialStep)

	useEffect(() => {
		if (open) setStep(initialStep)
	}, [open, initialStep])

	const current = STEPS[step]
	const isLast = step === STEPS.length - 1

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Instalar no iPhone</DialogTitle>
					<DialogDescription>
						Use o <strong>Safari</strong> — o iOS só instala apps por ele. Leva uns 10
						segundos.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<p className="notice-label">
						Passo {step + 1} de {STEPS.length}
					</p>

					{current.illustration}

					<div className="space-y-1">
						<h3 className="text-base font-bold tracking-tight text-foreground">
							{current.title}
						</h3>
						<p className="text-sm leading-relaxed text-foreground/80">{current.body}</p>
					</div>

					<div className="flex items-center justify-between gap-3">
						<div className="flex gap-1.5" role="tablist" aria-label="Passos">
							{STEPS.map((s, i) => (
								<button
									key={s.title}
									type="button"
									role="tab"
									tabIndex={-1}
									aria-selected={i === step}
									aria-label={`Ir para o passo ${i + 1}`}
									onClick={() => setStep(i)}
									className={`h-2 transition-all ${i === step ? 'w-6 bg-accent' : 'w-2 bg-border'}`}
								/>
							))}
						</div>
						<div className="flex gap-2">
							{step > 0 && (
								<button
									type="button"
									onClick={() => setStep(step - 1)}
									className="border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
								>
									Voltar
								</button>
							)}
							<button
								type="button"
								onClick={() => (isLast ? onOpenChange(false) : setStep(step + 1))}
								className="bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
							>
								{isLast ? 'Entendi' : 'Próximo'}
							</button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
