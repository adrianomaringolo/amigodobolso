import { test as base, expect, type Page } from '@playwright/test'

const SUPABASE_URL = 'http://127.0.0.1:54321'
// Same derivation @supabase/ssr uses for the auth cookie name.
const COOKIE_NAME = `sb-${new URL(SUPABASE_URL).hostname.split('.')[0]}-auth-token`

const USER_ID = '00000000-0000-4000-8000-000000000001'

const b64url = (v: unknown) => Buffer.from(JSON.stringify(v)).toString('base64url')

function buildSession() {
	const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24
	// Only decoded by the client (never verified), so the signature can be fake.
	const accessToken = [
		b64url({ alg: 'HS256', typ: 'JWT' }),
		b64url({
			sub: USER_ID,
			aud: 'authenticated',
			role: 'authenticated',
			exp,
			app_metadata: { role: 'user' },
		}),
		'e2e-signature',
	].join('.')

	return {
		access_token: accessToken,
		refresh_token: 'e2e-refresh-token',
		token_type: 'bearer',
		expires_in: 60 * 60 * 24,
		expires_at: exp,
		user: {
			id: USER_ID,
			aud: 'authenticated',
			role: 'authenticated',
			email: 'e2e@amigodobolso.test',
			app_metadata: { role: 'user' },
			user_metadata: { name: 'Pessoa E2E' },
			created_at: '2026-01-01T00:00:00.000Z',
		},
	}
}

export interface ReadRow {
	article_slug: string
	read_at: string
}

/** In-memory stand-in for the `article_reads` table, with request bookkeeping. */
export class SupabaseMock {
	reads: ReadRow[] = []
	/** Make the next reads of article_reads fail (to test the error state). */
	failReads = false
	writes: { method: string; body?: unknown }[] = []

	seedRead(slug: string, daysAgo = 0) {
		this.reads.push({
			article_slug: slug,
			read_at: new Date(Date.now() - daysAgo * 86_400_000).toISOString(),
		})
	}

	get readSlugs() {
		return this.reads.map((r) => r.article_slug)
	}
}

const json = (body: unknown, status = 200) => ({
	status,
	contentType: 'application/json',
	headers: { 'access-control-allow-origin': '*' },
	body: JSON.stringify(body),
})

async function installSupabaseRoutes(page: Page, mock: SupabaseMock) {
	// CORS preflights for the Supabase origin
	await page.route(`${SUPABASE_URL}/**`, async (route) => {
		const request = route.request()
		const url = new URL(request.url())
		const method = request.method()

		if (method === 'OPTIONS') {
			return route.fulfill({
				status: 204,
				headers: {
					'access-control-allow-origin': '*',
					'access-control-allow-methods': '*',
					'access-control-allow-headers': '*',
				},
			})
		}

		if (url.pathname === '/auth/v1/user') {
			return route.fulfill(json(buildSession().user))
		}

		if (url.pathname === '/rest/v1/article_reads') {
			if (method === 'GET') {
				return mock.failReads
					? route.fulfill(json({ message: 'boom' }, 500))
					: route.fulfill(
							json([...mock.reads].sort((a, b) => b.read_at.localeCompare(a.read_at))),
						)
			}

			if (method === 'POST') {
				const body = request.postDataJSON() as {
					article_slug: string
					read_at: string
				}
				mock.writes.push({ method, body })
				mock.reads = mock.reads.filter((r) => r.article_slug !== body.article_slug)
				mock.reads.push({ article_slug: body.article_slug, read_at: body.read_at })
				return route.fulfill({
					status: 201,
					headers: { 'access-control-allow-origin': '*' },
				})
			}

			if (method === 'DELETE') {
				const slug = (url.searchParams.get('article_slug') ?? '').replace(/^eq\./, '')
				mock.writes.push({ method, body: { article_slug: slug } })
				mock.reads = mock.reads.filter((r) => r.article_slug !== slug)
				return route.fulfill({
					status: 204,
					headers: { 'access-control-allow-origin': '*' },
				})
			}
		}

		// Any other table/view (entries, summaries…) is simply empty.
		return route.fulfill(json([]))
	})
}

interface Fixtures {
	/** Sign the test user in (default). Set `false` to test the logged-out experience. */
	authenticated: boolean
	supabase: SupabaseMock
}

export const test = base.extend<Fixtures>({
	authenticated: [true, { option: true }],

	supabase: [
		async ({ page, context, authenticated, baseURL }, use) => {
			const mock = new SupabaseMock()
			await installSupabaseRoutes(page, mock)

			// Dev-only floating overlays (React Query Devtools, Next indicator) sit on top of the
			// bottom bar and swallow taps; they do not exist in a production build.
			await context.addInitScript(() => {
				const hide = () => {
					const style = document.createElement('style')
					style.textContent =
						'.tsqd-parent-container, nextjs-portal { display: none !important; }'
					document.head.appendChild(style)
				}
				if (document.head) hide()
				else document.addEventListener('DOMContentLoaded', hide)
			})

			if (authenticated) {
				await context.addCookies([
					{
						name: COOKIE_NAME,
						value: `base64-${Buffer.from(JSON.stringify(buildSession())).toString('base64url')}`,
						url: baseURL!,
					},
				])
			}

			await use(mock)
		},
		{ auto: true },
	],
})

export { expect }
