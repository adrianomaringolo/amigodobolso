/**
 * Telas do vídeo do produto: capturas do app de verdade, numa conta fictícia.
 *
 * Mesmo esquema do scripts/tutorials/capture.mjs (o Supabase é respondido em
 * memória com a conta de exemplo da Ana Souza, nenhum dado real aparece), com
 * celular e computador e páginas inteiras, para o vídeo poder rolar a tela.
 *
 *   pnpm dev   (noutro terminal)
 *   node video/scripts/telas.mjs
 *
 * Saída: video/build/telas/<nome>.png
 */
import { chromium, devices } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const BASE_URL = process.env.TUTORIAL_BASE_URL ?? 'http://localhost:3000'
const OUT_DIR = path.join(ROOT, 'video/build/telas')

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

async function newPage(browser, desktop = false) {
	const context = await browser.newContext({
		...(desktop ? { viewport: { width: 1440, height: 900 } } : { ...devices['iPhone 14'], viewport: { width: 390, height: 844 } }),
		deviceScaleFactor: 2,
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

/** Uma tela: a janela (full=false) ou a página inteira, para rolar no vídeo. */
const shooter = (page) => async (name, { full = false, target } = {}) => {
	await page.waitForTimeout(600) // deixa as animações assentarem
	const file = path.join(OUT_DIR, `${name}.png`)
	await (target ?? page).screenshot({ path: file, animations: 'disabled', fullPage: full && !target })
	console.log('  ✓', path.relative(ROOT, file))
}

const go = async (page, route) => {
	await page.goto(new URL(route, BASE_URL).toString())
	await page.waitForLoadState('networkidle').catch(() => {})
	await page.waitForTimeout(800)
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


// ---------------------------------------------------------------- telas

/** Caixas (px CSS da página) dos elementos que o vídeo destaca → build/telas/caixas.json */
const caixas = {}
async function caixa(page, tela, nome, locator) {
	const b = await locator
		.first()
		.evaluate(
			(el) => {
				const r = el.getBoundingClientRect()
				return [r.left, r.top + window.scrollY, r.width, r.height].map(Math.round)
			},
			null,
			{ timeout: 3000 },
		)
		.catch(() => (console.warn(`  ⚠️  ${tela}.${nome} não encontrado`), null))
	;(caixas[tela] ??= {})[nome] = b
}

/** A barra de navegação fixa sai da página inteira; vai num arquivo à parte. */
const semNav = (page, esconder) =>
	page.evaluate((h) => {
		for (const el of document.querySelectorAll('nav, [class*="fixed"][class*="bottom-0"]')) {
			if (getComputedStyle(el).position === 'fixed') el.style.visibility = h ? 'hidden' : ''
		}
	}, esconder)

async function celular(page, shot) {
	await go(page, '/inicio')
	await shot('m-inicio')
	await caixa(page, 'm-inicio', 'bandeira', page.getByText('Bandeira do mês').locator('xpath=ancestor::*[contains(@class,"border")][1]'))
	await caixa(page, 'm-inicio', 'azul', page.getByText(/no azul/i))
	await caixa(page, 'm-inicio', 'amarelo', page.getByText(/no amarelo/i))
	await caixa(page, 'm-inicio', 'medidores', page.getByText(/os seis medidores/i))
	await caixa(page, 'm-inicio', 'diversao', page.getByText(/^diversão$/i))
	await semNav(page, true)
	await shot('m-inicio-full', { full: true })
	await semNav(page, false)

	await go(page, '/lancamentos')
	await shot('m-lancamentos')
	await caixa(page, 'm-lancamentos', 'lancar', page.getByRole('button', { name: 'Lançar receita ou despesa' }))

	await page.getByRole('button', { name: 'Lançar receita ou despesa' }).click()
	const d = dialog(page)
	await d.waitFor()
	await blur(page)
	await shot('m-form-vazio')
	await caixa(page, 'm-form', 'valor', d.locator('input').first())
	await caixa(page, 'm-form', 'descricao', d.getByPlaceholder('Descrição'))
	await caixa(page, 'm-form', 'categoria', d.getByRole('combobox').filter({ hasText: 'Selecione' }))
	await caixa(page, 'm-form', 'salvar', d.getByRole('button', { name: 'Salvar' }))
	await d.locator('input').first().click()
	await page.keyboard.type('8990')
	await d.getByPlaceholder('Descrição').fill('Farmácia')
	await d.getByRole('combobox').filter({ hasText: 'Selecione' }).click()
	await page.getByRole('option', { name: 'Necessidades Essenciais' }).waitFor()
	await shot('m-categorias')
	await caixa(page, 'm-form', 'opcao', page.getByRole('option', { name: 'Necessidades Essenciais' }))
	await page.getByRole('option', { name: 'Necessidades Essenciais' }).click()
	await blur(page)
	await shot('m-form-preenchido')
	await d.getByRole('button', { name: 'Salvar' }).click()
	await d.waitFor({ state: 'hidden' })
	await page.getByText('Farmácia').first().waitFor()
	await page.waitForTimeout(300)
	await shot('m-salvo')
	await dismissToasts(page)

	await go(page, '/relatorios?t=despesas')
	await page.getByText('Gasto por categoria').waitFor()
	await shot('m-relatorios')
	await caixa(page, 'm-relatorios', 'resumo', page.getByText(/^receitas$/i).locator('xpath=ancestor::*[contains(@class,"grid")][1]'))
	await caixa(page, 'm-relatorios', 'categorias', page.getByText('Gasto por categoria').locator('xpath=ancestor::*[contains(@class,"border")][1]'))
	await semNav(page, true)
	await shot('m-relatorios-full', { full: true })
	await semNav(page, false)

	await go(page, '/relatorios?t=mapa')
	await page.getByText('Mapa de categorias').waitFor()
	await shot('m-mapa')
	await caixa(page, 'm-mapa', 'primeira', page.getByText(/^necessidades essenciais$/i))
}

async function computador(page, shot) {
	await go(page, '/inicio')
	await shot('d-inicio')
	await go(page, '/relatorios?t=despesas')
	await page.getByText('Gasto por categoria').waitFor()
	await shot('d-relatorios')
	await shot('d-relatorios-full', { full: true })
	await caixa(page, 'd-relatorios', 'resumo', page.getByText(/^receitas$/i).locator('xpath=ancestor::*[contains(@class,"grid")][1]'))
	await caixa(page, 'd-relatorios', 'categorias', page.getByText('Gasto por categoria').locator('xpath=ancestor::*[contains(@class,"border")][1]'))
	await caixa(page, 'd-relatorios', 'distribuicao', page.getByText('Distribuição de despesas'))
	await caixa(page, 'd-relatorios', 'abas', page.getByRole('tablist'))
	await go(page, '/lancamentos')
	await shot('d-lancamentos')
}

// ---------------------------------------------------------------- run

fs.mkdirSync(OUT_DIR, { recursive: true })
const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }))
let failed = false
try {
	for (const [desktop, run] of [[false, celular], [true, computador]]) {
		const { page, context } = await newPage(browser, desktop)
		try {
			await run(page, shooter(page))
		} catch (err) {
			failed = true
			console.error(`  ✗ ${run.name}: ${err.message.split('\n')[0]}`)
			await page.screenshot({ path: path.join(OUT_DIR, `_erro-${run.name}.png`) })
		} finally {
			await context.close()
		}
	}
} finally {
	await browser.close()
}
fs.writeFileSync(path.join(OUT_DIR, 'caixas.json'), JSON.stringify(caixas, null, 2))
process.exit(failed ? 1 : 0)
