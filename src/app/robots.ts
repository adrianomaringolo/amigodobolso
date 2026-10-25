import { SITE_URL } from '@/lib/site'
import type { MetadataRoute } from 'next'

// Crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended...) seguem a regra geral:
// as páginas públicas estão liberadas de propósito para que o app possa ser citado.
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: ['/produto', '/termos-de-uso', '/politica-de-privacidade'],
			disallow: [
				'/inicio',
				'/lancamentos',
				'/relatorios',
				'/educacao',
				'/perfil',
				'/ajuda',
				'/admin',
				'/login',
				'/register',
				'/recover',
				'/reset-password',
				'/auth',
			],
		},
		sitemap: `${SITE_URL}/sitemap.xml`,
	}
}
