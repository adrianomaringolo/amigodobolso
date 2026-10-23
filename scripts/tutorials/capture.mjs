/**
 * Captures the screenshots used by the "Tutoriais" articles (Como usar → Tutoriais).
 *
 * Runs against a dev server that is already up (default http://localhost:3000) with an
 * iPhone-sized viewport. Every browser call to Supabase is intercepted and answered from
 * an in-memory, fictional account — no real data ever shows up in the images.
 *
 *   node scripts/tutorials/capture.mjs            # all tutorials
 *   node scripts/tutorials/capture.mjs relatorios # only slugs containing "relatorios"
 *
 * Output: public/tutoriais/<slug>/<nn>-<name>.png
 */
import { chromium, devices } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const BASE_URL = process.env.TUTORIAL_BASE_URL ?? 'http://localhost:3000'
const OUT_DIR = path.join(ROOT, 'public/tutoriais')
const only = process.argv[2]

// The page talks to whatever Supabase URL the dev server was started with — read it so we
// can intercept that host and name the auth cookie the way @supabase/ssr expects.
const env = Object.fromEntries(
	fs
		.readFileSync(path.join(ROOT, '.env'), 'utf8')
		.split('\n')
		.filter((l) => l.includes('=') && !l.trim().startsWith('#'))
		.map((l) => [
			l.slice(0, l.indexOf('=')).trim(),
			l
				.slice(l.indexOf('=') + 1)
				.trim()
				.replace(/^["']|["']$/g, ''),
		]),
)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL
const COOKIE_NAME = `sb-${new URL(SUPABASE_URL).hostname.split('.')[0]}-auth-token`

// ---------------------------------------------------------------- fictional account

const USER_ID = '00000000-0000-4000-8000-0000000000aa'
const b64url = (v) => Buffer.from(JSON.stringify(v)).toString('base64url')

function buildSession() {
	const exp = Math.floor(Date.now() / 1000) + 86_400
	return {
		access_token: [
			b64url({ alg: 'HS256', typ: 'JWT' }),
			b64url({
				sub: USER_ID,
				aud: 'authenticated',
				role: 'authenticated',
				exp,
				app_metadata: { role: 'user' },
			}),
			'tutorial-signature',
		].join('.'),
		refresh_token: 'tutorial-refresh',
		token_type: 'bearer',
		expires_in: 86_400,
		expires_at: exp,
		user: {
			id: USER_ID,
			aud: 'authenticated',
			role: 'authenticated',
			email: 'ana@exemplo.com',
			app_metadata: { role: 'user' },
			user_metadata: { full_name: 'Ana Souza' },
			created_at: '2026-01-01T00:00:00.000Z',
		},
	}
}

const today = new Date()
const ym = (offset) => {
	const d = new Date(today.getFullYear(), today.getMonth() + offset, 1)
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
const day = (offset, d) => `${ym(offset)}-${String(d).padStart(2, '0')}`

let seq = 0
const entry = (date, amount, description, category, extra = {}) => ({
	id: `e${++seq}`,
	user_id: USER_ID,
	date,
	amount,
	description,
	category,
	is_completed: true,
	notes: null,
	times: '1',
	tags: [],
	created_at: `${date}T12:00:${String(seq % 60).padStart(2, '0')}.000Z`,
	...extra,
})

function seedEntries() {
	const rows = [
		// current month — income R$ 5.400 → targets: NE 2.970 · TF/DIV/CLP/DP 540 · FPO 270
		entry(day(0, 1), 4800, 'Salário', 'income'),
		entry(day(0, 6), 600, 'Freela de design', 'income', { tags: ['extra'] }),
		entry(day(0, 2), -1500, 'Aluguel', 'essential', { tags: ['casa'] }),
		entry(day(0, 5), -620, 'Mercado do mês', 'essential', { tags: ['mercado'] }),
		entry(day(0, 20), -180, 'Conta de luz', 'essential', {
			tags: ['casa'],
			is_completed: false,
		}),
		entry(day(0, 3), -300, 'Tesouro Direto', 'financial-security'),
		entry(day(0, 8), -120, 'Doação para o abrigo', 'charity'),
		entry(day(0, 9), -210, 'Cinema e pizza', 'leisure', { tags: ['família'] }),
		entry(day(0, 12), -260, 'Show no sábado', 'leisure'),
		entry(day(0, 10), -350, 'Notebook (2/6)', 'long-term', {
			times: '6',
			installment_group: '00000000-0000-4000-8000-0000000000b1',
			installment_number: 2,
		}),
		entry(day(0, 11), -300, 'Passagens de fim de ano', 'long-term', { tags: ['viagem'] }),
		entry(day(0, 25), -150, 'Curso de inglês (3/10)', 'personal-growth', {
			times: '10',
			is_completed: false,
			installment_group: '00000000-0000-4000-8000-0000000000b2',
			installment_number: 3,
		}),
	]
	// five previous months, for the category history and the annual chart
	const history = [
		[5200, 2600, 400, 150, 380, 300, 200],
		[5200, 2750, 450, 200, 520, 0, 250],
		[5400, 2900, 500, 270, 610, 450, 300],
		[5400, 2800, 540, 200, 430, 650, 150],
		[5400, 2650, 540, 250, 500, 350, 400],
	]
	history.forEach(([inc, ne, tf, fpo, div, clp, dp], i) => {
		const o = i - 5
		rows.push(
			entry(day(o, 1), inc, 'Salário', 'income'),
			entry(day(o, 3), -ne, 'Contas da casa', 'essential'),
			entry(day(o, 4), -tf, 'Tesouro Direto', 'financial-security'),
			entry(day(o, 8), -fpo, 'Doação', 'charity'),
			entry(day(o, 12), -div, 'Passeios', 'leisure'),
			entry(day(o, 16), -dp, 'Curso', 'personal-growth'),
		)
		if (clp) rows.push(entry(day(o, 20), -clp, 'Compra planejada', 'long-term'))
	})
	return rows
}

// ---------------------------------------------------------------- Supabase stand-in

const json = (body, status = 200) => ({
	status,
	contentType: 'application/json',
	headers: { 'access-control-allow-origin': '*' },
	body: JSON.stringify(body),
})

async function installSupabase(page, db) {
	await page.route(`${SUPABASE_URL}/**`, async (route) => {
		const req = route.request()
		const url = new URL(req.url())
		const method = req.method()
		const table = url.pathname.replace('/rest/v1/', '')

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
		if (url.pathname === '/auth/v1/user') return route.fulfill(json(buildSession().user))

		if (table === 'entries') {
			if (method === 'GET') {
				const like = (url.searchParams.get('date') ?? '')
					.replace(/^like\./, '')
					.replace(/[*%]+$/, '')
				const rows = db.entries
					.filter((e) => e.date.startsWith(like))
					.sort((a, b) => a.created_at.localeCompare(b.created_at))
				return route.fulfill(json(rows))
			}
			if (method === 'POST') {
				const body = req.postDataJSON()
				const created = (Array.isArray(body) ? body : [body]).map((b) =>
					entry(b.date, Number(b.amount), b.description, b.category, {
						...b,
						id: `n${++seq}`,
						created_at: new Date().toISOString(),
					}),
				)
				db.entries.push(...created)
				return route.fulfill(json(created, 201))
			}
			if (method === 'PATCH') {
				const id = (url.searchParams.get('id') ?? '').replace(/^eq\./, '')
				const body = req.postDataJSON()
				db.entries = db.entries.map((e) => (e.id === id ? { ...e, ...body } : e))
				return route.fulfill({
					status: 204,
					headers: { 'access-control-allow-origin': '*' },
				})
			}
		}

		if (table === 'user_tags') {
			const uses = {}
			for (const e of db.entries)
				for (const t of e.tags ?? []) uses[t] = (uses[t] ?? 0) + 1
			return route.fulfill(
				json(Object.entries(uses).map(([tag, n]) => ({ tag, uses: n }))),
			)
		}

		if (table === 'monthly_income_expense_summary') {
			const byMonth = {}
			for (const e of db.entries) {
				const k = e.date.slice(0, 7)
				byMonth[k] ??= {
					year: +k.slice(0, 4),
					month: +k.slice(5, 7),
					total_income: 0,
					total_expense: 0,
				}
				if (e.amount > 0) byMonth[k].total_income += e.amount
				else byMonth[k].total_expense += -e.amount
			}
			return route.fulfill(json(Object.values(byMonth)))
		}

		return route.fulfill(json([]))
	})
}

// ---------------------------------------------------------------- capture helpers

async function newPage(browser) {
	const context = await browser.newContext({
		...devices['iPhone 14'],
		viewport: { width: 390, height: 844 },
		deviceScaleFactor: 2, // sharp enough for the article column, half the bytes of 3×
		locale: 'pt-BR',
		serviceWorkers: 'block',
	})
	// Dev-only overlays (Next indicator, React Query devtools) are not part of the product.
	await context.addInitScript(() => {
		const hide = () => {
			const style = document.createElement('style')
			style.textContent =
				'.tsqd-parent-container, nextjs-portal { display: none !important; } * { caret-color: transparent !important; }'
			document.head.appendChild(style)
		}
		if (document.head) hide()
		else document.addEventListener('DOMContentLoaded', hide)
	})
	await context.addCookies([
		{
			name: COOKIE_NAME,
			value: `base64-${Buffer.from(JSON.stringify(buildSession())).toString('base64url')}`,
			url: BASE_URL,
		},
	])
	const page = await context.newPage()
	const db = { entries: seedEntries() }
	await installSupabase(page, db)
	return { page, context, db }
}

function shooter(page, slug) {
	const dir = path.join(OUT_DIR, slug)
	fs.mkdirSync(dir, { recursive: true })
	let n = 0
	return async (name, target) => {
		await page.waitForTimeout(450) // let animations settle
		const file = path.join(dir, `${String(++n).padStart(2, '0')}-${name}.png`)
		await (target ?? page).screenshot({ path: file, animations: 'disabled' })
		console.log('  ✓', path.relative(ROOT, file))
	}
}

const go = async (page, route) => {
	await page.goto(new URL(route, BASE_URL).toString())
	await page.waitForLoadState('networkidle')
}

/** Scroll so an element sits just under the sticky header. */
const scrollTo = async (page, locator, offset = 72) => {
	await locator.first().evaluate((el, off) => {
		window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off })
	}, offset)
}

const dialog = (page) => page.getByRole('dialog')

/** Drop focus rings (e.g. the auto-focused date button) before a shot. */
const blur = (page) => page.evaluate(() => document.activeElement?.blur())

/** Close any open toast so it does not leak into the next shot. */
const dismissToasts = async (page) => {
	for (const close of await page.getByRole('button', { name: /fechar|close/i }).all()) {
		await close.click().catch(() => {})
	}
	await page.waitForTimeout(400)
}

// ---------------------------------------------------------------- tutorials

const TUTORIALS = {
	async 'lancar-receita-ou-despesa'(page, shot) {
		await go(page, '/lancamentos')
		await shot('lista-do-mes')

		await page.getByRole('button', { name: 'Lançar receita ou despesa' }).click()
		await dialog(page).waitFor()
		await blur(page)
		await shot('formulario-despesa')

		const d = dialog(page)
		await d.locator('input').first().click()
		await page.keyboard.type('8990')
		await d.getByPlaceholder('Descrição').fill('Farmácia')
		await d.getByRole('combobox').filter({ hasText: 'Selecione' }).click()
		await page.getByRole('option', { name: 'Necessidades Essenciais' }).waitFor()
		await shot('escolher-categoria')
		await page.getByRole('option', { name: 'Necessidades Essenciais' }).click()

		await d.getByRole('button', { name: /\d{2}\/\d{2}\/\d{4}/ }).click()
		await page.waitForTimeout(300)
		await shot('escolher-data')
		await page.keyboard.press('Escape')
		await page.waitForTimeout(200)
		if (!(await d.isVisible())) {
			// Escape closed the whole dialog on this build — reopen and refill
			throw new Error('Escape closed the dialog')
		}
		await blur(page)
		await shot('formulario-preenchido')

		await d.getByRole('button', { name: 'Salvar' }).click()
		await d.waitFor({ state: 'hidden' })
		await page.getByText('Farmácia').first().waitFor()
		await scrollTo(page, page.getByText('Farmácia'), 360)
		await shot('lancamento-na-lista')
		await dismissToasts(page)

		await page.getByRole('button', { name: 'Lançar receita ou despesa' }).click()
		await dialog(page).waitFor()
		await dialog(page).getByRole('radio', { name: 'Receita' }).click()
		await shot('formulario-receita')
	},

	async 'pago-pendente-e-parcelas'(page, shot) {
		await go(page, '/lancamentos')
		await scrollTo(page, page.getByText('Conta de luz'), 260)
		await shot('pago-e-pendente')

		const row = page.locator('div.border-b', { hasText: 'Conta de luz' }).first()
		await row.getByRole('button', { name: 'Marcar como pago' }).click()
		await page.getByText('Despesa marcada como paga').waitFor()
		await shot('aviso-marcada-como-paga')
		await page.getByRole('button', { name: 'Desfazer' }).click()
		await page.waitForTimeout(600)

		await page.getByRole('button', { name: 'Lançar receita ou despesa' }).click()
		const d = dialog(page)
		await d.waitFor()
		await d.locator('input').first().click()
		await page.keyboard.type('120000')
		await d.getByPlaceholder('Descrição').fill('Geladeira nova')
		await d.getByRole('combobox').filter({ hasText: 'Selecione' }).click()
		await page.getByRole('option', { name: 'Compras de Longo Prazo' }).click()
		await d.getByRole('combobox').filter({ hasText: 'À vista' }).click()
		await page.getByRole('option', { name: '10 vezes' }).scrollIntoViewIfNeeded()
		await shot('escolher-parcelas')
		await page.getByRole('option', { name: '10 vezes' }).click()
		await d.getByText('Já foi pago').scrollIntoViewIfNeeded()
		await shot('parcelas-e-ja-foi-pago')
		await page.keyboard.press('Escape')
		await d.waitFor({ state: 'hidden' })

		await page.getByText('Curso de inglês (3/10)').click()
		await dialog(page).waitFor()
		await shot('detalhe-parcela')

		await dialog(page).getByRole('button', { name: 'Editar' }).click()
		await page.getByRole('button', { name: 'Salvar' }).click()
		const scope = page.getByRole('alertdialog')
		await scope.getByText('Alterar quais parcelas?').waitFor()
		await shot('editar-quais-parcelas')
	},

	async 'etiquetas-e-filtros'(page, shot) {
		await go(page, '/lancamentos')
		await scrollTo(page, page.getByText('Aluguel'), 200)
		await shot('etiquetas-na-lista')

		await page.getByRole('button', { name: 'Lançar receita ou despesa' }).click()
		const d = dialog(page)
		await d.waitFor()
		await d.getByPlaceholder('Descrição').fill('Gás de cozinha')
		const tags = d.getByPlaceholder('Adicionar tag…')
		await tags.click()
		await tags.pressSequentially('ca')
		await page.waitForTimeout(300)
		await shot('sugestao-de-etiqueta')
		await page.keyboard.press('Enter')
		await d.getByText('Adicionar tag', { exact: false }).count()
		await shot('etiqueta-adicionada')
		await page.keyboard.press('Escape')
		await page.keyboard.press('Escape')
		await d.waitFor({ state: 'hidden' })

		await page.getByRole('button', { name: /Filtrar/ }).click()
		await scrollTo(page, page.getByRole('button', { name: /Filtrar/ }), 80)
		await shot('painel-de-filtros')

		await page.getByPlaceholder('Buscar por descrição, observação ou tag…').fill('casa')
		await page.waitForTimeout(300)
		await shot('filtro-por-etiqueta')

		await page.getByPlaceholder('Buscar por descrição, observação ou tag…').fill('')
		await page.getByRole('button', { name: 'Só pendentes' }).click()
		await page.waitForTimeout(300)
		await shot('so-pendentes')
	},

	async 'entender-os-relatorios'(page, shot) {
		await go(page, '/relatorios?t=despesas')
		await page.getByText('Gasto por categoria').waitFor()
		await shot('resumo-do-mes')

		await scrollTo(page, page.getByText('Gasto por categoria'), 80)
		await shot('gasto-por-categoria')

		await scrollTo(page, page.getByText('Distribuição de despesas'), -60)
		await scrollTo(page, page.locator('li', { hasText: 'R$ 2.300,00 de' }), 110)
		await shot('medidores')

		await scrollTo(page, page.getByText('Real / ideal'), 90)
		await shot('quanto-falta')

		await go(page, '/relatorios?t=mapa')
		await page.getByText('Mapa de categorias').waitFor()
		await shot('mapa-de-categorias')

		await go(page, '/relatorios?t=anual')
		const months = page.getByRole('button', { name: /receitas R\$/ })
		await months.first().waitFor()
		const current = today.getMonth()
		await months.nth(current).click()
		await shot('anual-detalhe-do-mes')
	},
}

// ---------------------------------------------------------------- run

// Playwright's bundled Chromium if it is installed, otherwise the local Google Chrome.
const browser = await chromium
	.launch()
	.catch(() => chromium.launch({ channel: 'chrome' }))
let failed = false
try {
	for (const [slug, run] of Object.entries(TUTORIALS)) {
		if (only && !slug.includes(only)) continue
		console.log(`\n${slug}`)
		fs.rmSync(path.join(OUT_DIR, slug), { recursive: true, force: true })
		const { page, context } = await newPage(browser)
		try {
			await run(page, shooter(page, slug))
		} catch (err) {
			failed = true
			console.error(`  ✗ ${slug}: ${err.message.split('\n')[0]}`)
			await page.screenshot({ path: path.join(OUT_DIR, `_erro-${slug}.png`) })
		} finally {
			await context.close()
		}
	}
} finally {
	await browser.close()
}
process.exit(failed ? 1 : 0)
