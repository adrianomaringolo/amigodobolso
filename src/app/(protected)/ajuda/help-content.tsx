'use client'

import { BandeiraTag } from '@/components/bandeira/bandeira-tag'
import { billTabsList, billTabsTrigger } from '@/components/bandeira/bill-tabs'
import { Painel } from '@/components/bandeira/painel'
import { AmountTypes, TransactionTypes } from '@/components/financial/financial.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'buildgrid-ui'
import { ChevronRight, Flag, HelpCircle, MonitorPlay, ScrollText } from 'lucide-react'
import Link from 'next/link'

const categories = Object.entries(TransactionTypes).filter(
	([, v]) => v.type === AmountTypes.expanses,
)

const flagSamples = [
	{ used: 40, target: 100, note: 'até 84% do alvo' },
	{ used: 92, target: 100, note: 'entre 85% e 100%' },
	{ used: 130, target: 100, note: 'acima de 100%' },
]

export type TutorialSummary = { slug: string; title: string; description: string }

export function HelpContent({
	tutorials,
	defaultTab = 'bandeira',
}: {
	tutorials: TutorialSummary[]
	defaultTab?: string
}) {
	return (
		<div className="space-y-5">
			<header className="border-b border-border pb-3">
				<h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
					<HelpCircle className="h-5 w-5 text-primary" />
					Como usar
				</h1>
				<p className="notice-label mt-0.5 !normal-case !tracking-normal">
					o método por trás do Amigo do Bolso
				</p>
			</header>

			<Tabs defaultValue={defaultTab}>
				<TabsList className={billTabsList}>
					{[
						{ v: 'bandeira', label: 'A bandeira', icon: Flag },
						{ v: 'categorias', label: 'As categorias', icon: ScrollText },
						{ v: 'tutoriais', label: 'Tutoriais', icon: MonitorPlay },
					].map(({ v, label, icon: Icon }) => (
						<TabsTrigger key={v} value={v} className={billTabsTrigger}>
							<Icon className="h-4 w-4" />
							{label}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="bandeira" className="mt-5 space-y-5">
					<Painel title="Como ler a bandeira">
						<p className="text-sm text-muted-foreground">
							Cada categoria tem um <strong className="text-foreground">alvo</strong>: uma
							fatia da sua renda do mês. Conforme você lança despesas, a categoria hasteia
							uma bandeira que diz o quão perto do alvo você está.
						</p>
						<ul className="mt-4 space-y-3">
							{flagSamples.map((s) => {
								const flag =
									s.used <= 84
										? { level: 'azul' as const, pct: s.used, label: '', chip: 'no azul' }
										: s.used <= 100
											? {
													level: 'amarela' as const,
													pct: s.used,
													label: '',
													chip: 'no amarelo',
												}
											: {
													level: 'vermelha' as const,
													pct: s.used,
													label: '',
													chip: 'no vermelho',
												}
								return (
									<li
										key={s.note}
										className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-b-0"
									>
										<BandeiraTag flag={flag} showPct={false} />
										<span className="text-sm text-muted-foreground">{s.note}</span>
									</li>
								)
							})}
						</ul>
					</Painel>
					<Painel title="Por que percentuais da renda?">
						<p className="text-sm text-muted-foreground">
							O método <strong className="text-foreground">Dolfyn</strong> divide toda a
							sua renda em seis categorias com um alvo em porcentagem. Assim o plano se
							ajusta sozinho quando sua renda muda — você acompanha proporções, não
							valores fixos.
						</p>
					</Painel>
				</TabsContent>

				<TabsContent value="categorias" className="mt-5">
					<Painel title="As seis categorias" bodyClassName="px-0 py-0">
						<p className="border-b border-border bg-secondary/40 px-4 py-3 text-sm font-medium text-foreground">
							O que vale aqui não é o tipo de gasto, mas o seu propósito. Defina a
							categoria da despesa pelo propósito!
						</p>
						<ul className="divide-y divide-border">
							{categories.map(([key, value]) => (
								<li key={key} className="flex gap-3 px-4 py-4">
									<span className="flex h-10 w-10 shrink-0 items-center justify-center border border-border text-muted-foreground">
										{value.icon('w-5 h-5')}
									</span>
									<div className="min-w-0 flex-1">
										<div className="flex items-baseline justify-between gap-2">
											<h3 className="text-sm font-semibold text-foreground">
												{value.label}
											</h3>
											<span className="notice-label shrink-0 !normal-case !tracking-normal">
												alvo {value.max}%
											</span>
										</div>
										<p
											className="mt-1 text-sm leading-relaxed text-muted-foreground [&_br]:hidden"
											dangerouslySetInnerHTML={{ __html: value.help }}
										/>
									</div>
								</li>
							))}
						</ul>
					</Painel>
				</TabsContent>

				<TabsContent value="tutoriais" className="mt-5">
					<Painel title="Passo a passo, com imagens" bodyClassName="px-0 py-0">
						<ol className="divide-y divide-border">
							{tutorials.map((t, i) => (
								<li key={t.slug}>
									<Link
										href={`/ajuda/tutoriais/${t.slug}`}
										className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-secondary/40"
									>
										<span className="tabular flex h-8 w-8 shrink-0 items-center justify-center border border-border text-sm font-semibold text-foreground">
											{i + 1}
										</span>
										<span className="min-w-0 flex-1">
											<span className="block text-sm font-semibold text-foreground">
												{t.title}
											</span>
											<span className="block text-xs text-muted-foreground">
												{t.description}
											</span>
										</span>
										<ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
									</Link>
								</li>
							))}
						</ol>
					</Painel>
				</TabsContent>
			</Tabs>
		</div>
	)
}
