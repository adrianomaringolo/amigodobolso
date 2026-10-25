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
		'método Dolfyn',
		'planejamento financeiro',
		'app de finanças',
		'controle financeiro pessoal',
		'quanto posso gastar',
	],
	authors: [{ name: SITE_NAME }],
	creator: SITE_NAME,
	manifest: '/manifest.webmanifest',
	icons: {
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
		'msapplication-TileColor': '#09659c',
	},
}

export const viewport: Viewport = {
	themeColor: '#09659c',
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
			<body>
				<PageContentArea>{children}</PageContentArea>
			</body>
		</html>
	)
}
