import type { FullConfig } from '@playwright/test'

/**
 * `next dev` compiles each route on first request, which can take many seconds and make
 * navigation assertions flaky. Visit the routes once up front so the tests measure behaviour,
 * not compile time. (No-op cost against a production build.)
 */
const ROUTES = [
	'/login',
	'/inicio',
	'/ajuda',
	'/perfil',
	'/educacao',
	'/educacao/financas-101',
	'/educacao/financas-101/01-para-onde-vai-o-dinheiro',
	'/educacao/financas-101/03-um-plano-por-categorias',
	'/educacao/financas-101/05-juros-e-dividas',
]

export default async function globalSetup(config: FullConfig) {
	const baseURL = config.projects[0].use.baseURL
	if (!baseURL) return

	for (const route of ROUTES) {
		try {
			await fetch(new URL(route, baseURL), { signal: AbortSignal.timeout(120_000) })
		} catch {
			// warm-up only; a real failure will surface in the tests themselves
		}
	}
}
