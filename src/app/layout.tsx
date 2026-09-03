import { PageContentArea } from '@/components/navigation/page-content-area'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/site'
import type { Metadata, Viewport } from 'next'
import { Archivo, Spline_Sans_Mono } from 'next/font/google'
import './globals.css'

const sans = Archivo({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-archivo',
})

const mono = Spline_Sans_Mono({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-spline',
	weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: `${SITE_NAME} — ${SITE_TAGLINE}`,
		template: `%s · ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	keywords: [
		'finanças pessoais',
		'orçamento',
		'controle de gastos',
		'No Final das Contas',
		'planejamento financeiro',
		'app de finanças',
	],
	authors: [{ name: SITE_NAME }],
	creator: SITE_NAME,
	manifest: '/manifest.webmanifest',
	icons: {
		icon: '/favicon.png',
		apple: '/web-app-manifest-192x192.png',
	},
	formatDetection: { telephone: false },
	appleWebApp: {
		capable: true,
		title: SITE_NAME,
		statusBarStyle: 'default',
	},
	openGraph: {
		type: 'website',
		locale: 'pt_BR',
		url: SITE_URL,
		siteName: SITE_NAME,
		title: `${SITE_NAME} — ${SITE_TAGLINE}`,
		description: SITE_DESCRIPTION,
	},
	twitter: {
		card: 'summary_large_image',
		title: `${SITE_NAME} — ${SITE_TAGLINE}`,
		description: SITE_DESCRIPTION,
	},
	other: {
		'msapplication-TileColor': '#16324f',
	},
}

export const viewport: Viewport = {
	themeColor: '#16324f',
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
			<body>
				{/*
				  Direction contract — kept as a real emitted node (JSX comments are compiled
				  away) so the seed key survives the production build and the build is auditable.
				*/}
				<script
					type="application/impeccable+contract"
					data-seed="74b9605f"
					dangerouslySetInnerHTML={{
						__html: `
DIRECTION CONTRACT · seed 74b9605f · direction round · mode operate · card model-pick (IMPECCABLE'S PICK)

THESIS: A conta de luz do seu mês. Every category flies a bandeira tarifária — verde,
amarela, vermelha — the escalation signal every Brazilian already reads on the electric
bill. Refuses the fintech dashboard of donut cards and the big-balance hero-metric; the
reading is the health, not the number.

OWN-WORLD: Warm bill-paper ground (#f7f5ef), institutional deep-blue ink (#16324f), Amigo
do Bolso orange (#ef7d24) reserved for the one primary action. Bandeira green / amber / red
are strictly semantic, one per category, never decorative. Archivo for official-notice
labels and headings; Spline Sans Mono for every reading — R$ values, meter counts, the
consumption histogram. Square corners (radius .25rem), ruled hairlines, tabular figures,
meter-dial and boleto detailing.

STORY: The user opens the month, reads the bandeira geral at the top ("dentro do plano" or
not), scans six category medidores each showing gasto / alvo and its flag, taps one to see
its lançamentos, adds an entry from the fixed orange action.

FIRST VIEWPORT (mobile): blue masthead with the mark; a bill header with greeting + selected
month; the bandeira geral as a full-width panel with the month's flag at display scale and
one plain-language line; below it the six medidores as a single column of meter rows — flag
chip, category name in caps, mono gasto/alvo, a filled bar against the shared target tick,
and the last-6-months micro-histogram. Fixed bottom bar carries "+ Lançar" in orange.

FORM: "A Bandeira" — bandeira tarifária / conta de serviço público. Ranked #1 of 7 grounded
directions; taken as IMPECCABLE'S PICK over the roll's "A Feira". Seed 74b9605f.
RAISE · RIGOR TABULAR (from declined "Campo de Dados"): every value is mono, aligned,
tabular, and every flag doubles its colour with a word + %.
RAISE · ESCALA ÚNICA (from competitive "O Traçado do Mês"): all six categories read against
one shared %-of-income scale, never six private scales.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
`,
					}}
				/>
				<PageContentArea>{children}</PageContentArea>
			</body>
		</html>
	)
}
