import { FooterComponent } from '@/components/navigation/footer'
import { ContaExemplo } from '@/components/produto/conta-exemplo'
import { ComoFunciona, Faq, PERGUNTAS } from '@/components/produto/faq'
import { Experimente } from '@/components/produto/experimente'
import { Metodo } from '@/components/produto/metodo'
import { DOLFYN_INSTAGRAM, DOLFYN_LINKEDIN, DOLFYN_URL, SITE_NAME, SITE_URL } from '@/lib/site'
import { cn } from '@/lib/utils'
import {
	ArrowRight,
	CalendarClock,
	ChartColumn,
	Globe,
	GraduationCap,
	Instagram,
	Linkedin,
	Scissors,
	Smartphone,
	Tags,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const TITLE = `${SITE_NAME} — para onde vai seu dinheiro todo mês?`
const DESCRIPTION =
	'Controle de gastos pelo celular: lance o que entra e o que sai e veja, em bandeiras azul, amarela ou vermelha, se cada categoria do mês está dentro do plano. Método Dolfyn, grátis.'

export const metadata: Metadata = {
	title: { absolute: TITLE },
	description: DESCRIPTION,
	alternates: { canonical: '/produto' },
	openGraph: {
		type: 'website',
		locale: 'pt_BR',
		url: '/produto',
		siteName: SITE_NAME,
		title: TITLE,
		description: DESCRIPTION,
	},
	twitter: {
		card: 'summary_large_image',
		title: TITLE,
		description: DESCRIPTION,
	},
}

const JSON_LD = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'WebApplication',
			'@id': `${SITE_URL}/#app`,
			name: SITE_NAME,
			url: `${SITE_URL}/produto`,
			description: DESCRIPTION,
			applicationCategory: 'FinanceApplication',
			operatingSystem: 'Web, Android, iOS',
			inLanguage: 'pt-BR',
			offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
			publisher: { '@id': `${DOLFYN_URL}#organization` },
		},
		{
			'@type': 'Organization',
			'@id': `${DOLFYN_URL}#organization`,
			name: 'Dolfyn',
			legalName: 'Adriano Maríngolo Gomes Desenvolvimento de Software Ltda.',
			url: DOLFYN_URL,
			sameAs: [DOLFYN_URL, DOLFYN_INSTAGRAM, DOLFYN_LINKEDIN],
			contactPoint: {
				'@type': 'ContactPoint',
				email: 'contato@dolfyn.com.br',
				contactType: 'customer support',
				availableLanguage: 'pt-BR',
			},
		},
		{
			'@type': 'FAQPage',
			mainEntity: PERGUNTAS.map(({ pergunta, resposta }) => ({
				'@type': 'Question',
				name: pergunta,
				acceptedAnswer: { '@type': 'Answer', text: resposta },
			})),
		},
	],
}

const DOLFYN = DOLFYN_URL

function CtaPrincipal({ className, children }: { className?: string; children: React.ReactNode }) {
	return (
		<Link
			href="/register"
			className={cn(
				'group inline-flex items-center justify-center gap-2.5 rounded-lg bg-accent px-6 py-4 text-sm font-extrabold uppercase tracking-wide text-foreground transition-colors hover:bg-accent/90',
				className,
			)}
		>
			{children}
			<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
		</Link>
	)
}

const LANCAMENTOS = [
	{ desc: 'Mercado do mês', cat: 'Necessidades Essenciais', valor: '− R$ 612,40', status: 'pago' },
	{ desc: 'Salário', cat: 'Receita', valor: '+ R$ 4.800,00', status: 'pago', entrada: true },
	{ desc: 'Show no sábado', cat: 'Diversão', valor: '− R$ 180,00', status: 'pago' },
	{ desc: 'Curso de inglês · 3/10', cat: 'Desenvolvimento Pessoal', valor: '− R$ 150,00', status: 'pendente' },
]

const REDES_DOLFYN = [
	{ icon: Globe, label: 'Site', handle: 'dolfyn.com.br', href: DOLFYN_URL },
	{ icon: Instagram, label: 'Instagram', handle: '@dolfynoficial', href: DOLFYN_INSTAGRAM },
	{ icon: Linkedin, label: 'LinkedIn', handle: 'Dolfyn', href: DOLFYN_LINKEDIN },
]

const RECURSOS = [
	{ icon: CalendarClock, texto: 'Pago ou pendente, parcelas e etiquetas em cada lançamento.' },
	{ icon: ChartColumn, texto: 'Relatórios do mês e do ano, por categoria.' },
	{ icon: GraduationCap, texto: 'Dica do Amigo: seu espaço para educação financeira.' },
	{ icon: Smartphone, texto: 'Instala na tela do celular. Entre com e-mail ou Google.' },
]

export default function ProdutoPage() {
	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, '\\u003c') }}
			/>
			{/* masthead + hero share the brand-blue field */}
			<div className="bg-primary text-primary-foreground">
				<header className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
					<Link href="/produto" aria-label={SITE_NAME}>
						<Image
							src="/logo-letter-white.png"
							alt={SITE_NAME}
							width={529}
							height={128}
							className="h-12 w-auto md:h-14"
							priority
						/>
					</Link>
					<nav className="flex items-center gap-1 sm:gap-3">
						<Link
							href="/login"
							className="px-3 py-2.5 text-sm font-semibold text-primary-foreground/85 md:text-base underline-offset-4 hover:text-primary-foreground hover:underline"
						>
							Entrar
						</Link>
						<Link
							href="/register"
							className="rounded-lg bg-accent px-4 py-2.5 text-sm font-bold md:text-base text-foreground transition-colors hover:bg-accent/90"
						>
							Criar conta
						</Link>
					</nav>
				</header>
				<div className="edge-perf edge-perf-bottom h-px w-full opacity-40" aria-hidden />

				<section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-10 md:px-6 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-20">
					<div className="lg:pb-24">
						<h1 className="max-w-[13ch] text-[2.75rem] font-extrabold leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-[4.75rem]">
							Para onde vai seu dinheiro todo mês?
						</h1>
						<p className="mt-6 max-w-[34rem] text-lg font-semibold leading-relaxed text-primary-foreground">
							O Amigo do Bolso é um aplicativo gratuito de controle de gastos pessoais, para o
							celular, que mostra com bandeiras se você está dentro do plano do mês.
						</p>
						<p className="mt-4 max-w-[34rem] text-lg leading-relaxed text-primary-foreground/85">
							O Amigo do Bolso responde como na conta de luz: cada categoria tem uma bandeira:{' '}
							<strong className="text-primary-foreground">azul</strong>,{' '}
							<strong className="text-primary-foreground">amarela</strong> ou{' '}
							<strong className="text-primary-foreground">vermelha</strong>. Assim, você vê de
							forma simples e na hora se está gastando mais do que pode. Sem planilha, sem
							complicação.
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
							<CtaPrincipal>Criar minha conta grátis</CtaPrincipal>
							<Link
								href="/login"
								className="self-center px-1 py-2 text-sm font-semibold text-primary-foreground/85 underline underline-offset-4 hover:text-primary-foreground sm:self-auto"
							>
								Já tenho conta
							</Link>
						</div>
						<p className="mt-6 text-sm text-primary-foreground/70">
							Grátis · feito para o celular · plano pelo{' '}
							<a
								href={DOLFYN}
								target="_blank"
								rel="noopener noreferrer"
								className="font-semibold text-primary-foreground underline underline-offset-4"
							>
								método Dolfyn
							</a>
						</p>
					</div>

					{/* the bill hangs out of the blue field onto the paper */}
					<div className="relative -mb-40 sm:-mb-48 lg:-mb-36 lg:self-end">
						<ContaExemplo className="mx-auto max-w-md lg:max-w-none" />
					</div>
				</section>
			</div>

			<main className="flex-1">
				{/* how to read the flags — with the slider */}
				<section className="mx-auto w-full max-w-6xl px-4 pt-52 sm:pt-60 md:px-6 lg:pt-48">
					<div className="reveal max-w-2xl">
						<h2 className="text-3xl font-extrabold leading-tight tracking-[-0.025em] md:text-[2.5rem]">
							Três bandeiras. Simples e direto.
						</h2>
						<p className="mt-3 text-base leading-relaxed text-muted-foreground">
							Cada categoria, uma bandeira, que vai mudando conforme você gasta. Assim, fica fácil
							ver onde precisa ajustar, para seguir com tranquilidade financeira.
						</p>
					</div>
					<div className="reveal mt-8">
						<Experimente />
					</div>
				</section>

				{/* the Dolfyn method */}
				<section className="mx-auto w-full max-w-6xl px-4 pt-24 md:px-6 md:pt-32">
					<div className="grid gap-6 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
						<div className="reveal">
							<h2 className="text-3xl font-extrabold leading-tight tracking-[-0.025em] md:text-[2.5rem]">
								Um plano pronto, não uma planilha.
							</h2>
							<p className="mt-4 text-base leading-relaxed text-muted-foreground">
								O Amigo do Bolso segue a{' '}
								<a
									href={DOLFYN}
									target="_blank"
									rel="noopener noreferrer"
									className="font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-4 hover:decoration-foreground"
								>
									metodologia Dolfyn
								</a>
								: a sua renda é dividida em seis categorias, cada uma com um alvo em porcentagem.
								Quando a renda muda, o plano se ajusta sozinho.
							</p>
							<p className="mt-4 text-base leading-relaxed text-muted-foreground">
								Você não precisa inventar categorias nem decidir valores. Apenas lançar e o seu Amigo do
								Bolso faz o resto.
							</p>
						</div>
						<div className="reveal">
							<Metodo />
						</div>
					</div>
				</section>

				{/* the loop: you log, it reads */}
				<section className="mx-auto w-full max-w-6xl px-4 pt-24 md:px-6 md:pt-32">
					<div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
						<div className="reveal order-2 self-start border border-border bg-card shadow-bill lg:order-1">
							<header className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-2.5">
								<span className="notice-label !text-xs text-foreground">Lançamentos</span>
								<span className="notice-label tabular !tracking-[0.06em]">agosto · exemplo</span>
							</header>
							<ul className="stagger">
								{LANCAMENTOS.map((l, i) => (
									<li
										key={l.desc}
										style={{ ['--i' as string]: i }}
										className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0"
									>
										<div className="min-w-0">
											<p className="truncate text-sm font-semibold text-foreground">{l.desc}</p>
											<p className="truncate text-xs text-muted-foreground">{l.cat}</p>
										</div>
										<div className="flex shrink-0 flex-col items-end gap-1">
											<span
												className={cn(
													'tabular text-sm font-semibold',
													l.entrada ? 'text-flag-blue' : 'text-foreground',
												)}
											>
												{l.valor}
											</span>
											<span
												className={cn(
													'border px-1.5 py-px text-[0.625rem] font-semibold uppercase tracking-wide',
													l.status === 'pago'
														? 'border-border text-muted-foreground'
														: 'border-flag-amber-fill bg-flag-amber-soft text-flag-amber',
												)}
											>
												{l.status}
											</span>
										</div>
									</li>
								))}
							</ul>
						</div>

						<div className="reveal order-1 lg:order-2">
							<h2 className="text-3xl font-extrabold leading-tight tracking-[-0.025em] md:text-[2.5rem]">
								Você lança. O Amigo faz o resto.
							</h2>
							<p className="mt-4 text-base leading-relaxed text-muted-foreground">
								Anote o que entra e o que sai, na categoria certa. O Amigo do Bolso soma, compara com
								o plano e ergue a bandeira de cada categoria.
							</p>
							<ul className="stagger mt-6 border-t border-border">
								{RECURSOS.map(({ icon: Icon, texto }, i) => (
									<li key={texto} style={{ ['--i' as string]: i }} className="flex items-start gap-3 border-b border-border py-3">
										<Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-primary" strokeWidth={1.75} />
										<span className="text-sm text-foreground">{texto}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>

				{/* how it works + FAQ: plain text answers for readers and answer engines */}
				<section className="mx-auto w-full max-w-6xl px-4 pt-24 md:px-6 md:pt-32">
					<div className="reveal grid gap-10 lg:grid-cols-2 lg:gap-14">
						<ComoFunciona />
						<Faq />
					</div>
				</section>

				{/* the tear-off stub */}
				<section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-24 md:px-6 md:pt-32">
					<div className="scissors-track relative">
						<div className="edge-perf edge-perf-top h-px w-full" aria-hidden />
						<Scissors
							className="scissors-cut absolute -top-[9px] left-6 h-[18px] w-[18px] bg-background px-0.5 text-muted-foreground"
							strokeWidth={1.75}
							aria-hidden
						/>
					</div>
					<div className="reveal mt-8 grid gap-8 border border-border bg-card px-5 py-7 shadow-bill md:px-8 md:py-9 lg:grid-cols-[1.4fr_1fr] lg:items-center">
						<div>
							<h2 className="max-w-[18ch] text-3xl font-extrabold leading-tight tracking-[-0.025em] md:text-[2.75rem]">
								Descubra pra onde vai o seu dinheiro.
							</h2>
							<div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
								<CtaPrincipal>Criar minha conta grátis</CtaPrincipal>
								<Link
									href="/login"
									className="self-center px-1 py-2 text-sm font-semibold text-foreground underline underline-offset-4 sm:self-auto"
								>
									Já tenho conta
								</Link>
							</div>
						</div>
						<dl className="grid grid-cols-3 border border-border lg:grid-cols-1">
							{[
								['Para', 'você'],
								['Valor', 'R$ 0,00'],
								['Vencimento', 'quando quiser'],
							].map(([k, v]) => (
								<div
									key={k}
									className="border-r border-border px-3 py-2.5 last:border-r-0 lg:border-b lg:border-r-0 lg:last:border-b-0"
								>
									<dt className="notice-label !text-[0.625rem]">{k}</dt>
									<dd className="tabular mt-0.5 text-sm font-semibold text-foreground">{v}</dd>
								</div>
							))}
						</dl>
					</div>
				</section>

				{/* who is behind the method */}
				<section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
					<div className="reveal flex flex-col gap-4 border border-border bg-card px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
						<p className="text-sm text-muted-foreground">
							<strong className="text-foreground">Conheça a Dolfyn</strong>, criadora do método por
							trás do Amigo do Bolso.
						</p>
						<ul className="flex flex-wrap gap-x-6 gap-y-2">
							{REDES_DOLFYN.map(({ icon: Icon, label, handle, href }) => (
								<li key={label}>
									<a
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={`${label} da Dolfyn`}
										className="inline-flex items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
									>
										<Icon className="h-[18px] w-[18px] text-primary" strokeWidth={1.75} aria-hidden />
										{handle}
									</a>
								</li>
							))}
						</ul>
					</div>
				</section>
			</main>

			<FooterComponent />
		</div>
	)
}
