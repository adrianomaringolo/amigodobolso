import { expect, test } from './fixtures'

const SERIES = 'financas-101'
const FIRST = `${SERIES}/01-para-onde-vai-o-dinheiro`
const LAST = `${SERIES}/05-juros-e-dividas`

/** Value cell (<dd>) that belongs to a stat label (<dt>) on the overview. */
const stat = (page: import('@playwright/test').Page, label: string) =>
	page.locator('dt', { hasText: label }).locator('xpath=following-sibling::dd[1]')

test.describe('Dica de Amigo — visão geral', () => {
	test('lista a série com os 5 artigos e estatísticas zeradas', async ({ page }) => {
		await page.goto('/educacao')

		await expect(
			page.getByRole('heading', { name: 'Dica de Amigo', level: 1 }),
		).toBeVisible()
		await expect(
			page.getByRole('heading', { name: 'Educação Financeira 101' }),
		).toBeVisible()
		await expect(page.getByText('0 de 5 artigos lidos · 0%')).toBeVisible()
		await expect(page.locator('ol a[href^="/educacao/financas-101/"]')).toHaveCount(5)

		await expect(stat(page, 'Artigos lidos')).toHaveText('0')
		await expect(stat(page, 'Séries completas')).toHaveText('0')
		await expect(stat(page, 'Sequência')).toHaveText('0')
	})

	test('reflete o progresso já salvo (artigos, tempo e sequência)', async ({
		page,
		supabase,
	}) => {
		supabase.seedRead(FIRST, 0)
		supabase.seedRead(`${SERIES}/02-fixo-variavel-e-escolha`, 1)

		await page.goto('/educacao')

		await expect(page.getByText('2 de 5 artigos lidos · 40%')).toBeVisible()
		await expect(stat(page, 'Artigos lidos')).toHaveText('2')
		await expect(stat(page, 'Sequência')).toHaveText('2')
		await expect(stat(page, 'Tempo de estudo')).toContainText('min')
	})

	test('mostra aviso quando o progresso não carrega, mas mantém os artigos', async ({
		page,
		supabase,
	}) => {
		supabase.failReads = true
		await page.goto('/educacao')

		// react-query retries failed reads (1s + 2s + 4s) before surfacing the error
		await expect(
			page.getByText('Não foi possível carregar seu progresso agora'),
		).toBeVisible({
			timeout: 20_000,
		})
		await expect(page.locator('ol a[href^="/educacao/financas-101/"]')).toHaveCount(5)
	})

	test('conclui a série quando todos os artigos estão lidos', async ({
		page,
		supabase,
	}) => {
		for (const slug of [
			'01-para-onde-vai-o-dinheiro',
			'02-fixo-variavel-e-escolha',
			'03-um-plano-por-categorias',
			'04-reserva-de-emergencia',
			'05-juros-e-dividas',
		]) {
			supabase.seedRead(`${SERIES}/${slug}`)
		}

		await page.goto('/educacao')

		await expect(page.getByText('5 de 5 artigos lidos · 100%')).toBeVisible()
		await expect(stat(page, 'Séries completas')).toHaveText('1')
	})
})

test.describe('Dica de Amigo — série e artigo', () => {
	test('abre a série pelo card e depois um artigo', async ({ page }) => {
		await page.goto('/educacao')
		await page
			.getByRole('link', { name: /Educação Financeira 101/ })
			.first()
			.click()

		await expect(page).toHaveURL(new RegExp(`/educacao/${SERIES}$`))
		await expect(page.getByRole('link', { name: 'Todas as séries' })).toBeVisible()

		await page.getByRole('link', { name: /Para onde vai o seu dinheiro\?/ }).click()
		await expect(page).toHaveURL(new RegExp(`/educacao/${FIRST}$`))
		await expect(
			page.getByRole('heading', { name: 'Para onde vai o seu dinheiro?', level: 1 }),
		).toBeVisible()
		await expect(page.getByText('Artigo 1 de 5')).toBeVisible()
		await expect(page.getByText(/min de leitura/)).toBeVisible()
	})

	test('renderiza tabela e bloco "Na prática" do markdown', async ({ page }) => {
		await page.goto(`/educacao/${SERIES}/03-um-plano-por-categorias`)

		await expect(page.getByRole('table')).toBeVisible()
		await expect(
			page.getByRole('cell', { name: 'Necessidades essenciais' }),
		).toBeVisible()
		await expect(page.getByRole('cell', { name: '55%' })).toBeVisible()
		await expect(page.locator('blockquote')).toContainText('Na prática')
	})

	test('navega entre artigos com Anterior e Próximo, respeitando as pontas', async ({
		page,
	}) => {
		await page.goto(`/educacao/${FIRST}`)
		const nav = page.getByRole('navigation', { name: 'Navegação entre artigos' })

		await expect(nav.getByText('Anterior')).toHaveCount(0)
		await nav.getByRole('link', { name: /Próximo/ }).click()
		await expect(page).toHaveURL(/02-fixo-variavel-e-escolha$/)
		await expect(nav.getByText('Anterior')).toBeVisible()

		await page.goto(`/educacao/${LAST}`)
		await expect(nav.getByText('Próximo')).toHaveCount(0)
		await expect(nav.getByRole('link', { name: /Anterior/ })).toBeVisible()
	})

	test('série ou artigo inexistente retorna 404', async ({ page }) => {
		// Streamed responses keep HTTP 200 in dev, so assert on the rendered not-found page.
		const notFound = page.getByText(/could not be found|não encontrad/i)

		await page.goto('/educacao/serie-que-nao-existe')
		await expect(notFound).toBeVisible()
		await expect(page.getByRole('heading', { name: 'Dica de Amigo' })).toHaveCount(0)

		await page.goto(`/educacao/${SERIES}/artigo-que-nao-existe`)
		await expect(notFound).toBeVisible()
		await expect(page.getByRole('button', { name: /Marcar como lido/ })).toHaveCount(0)
	})
})

test.describe('Dica de Amigo — marcar como lido', () => {
	test('marca, persiste, aparece na visão geral e pode ser desmarcado', async ({
		page,
		supabase,
	}) => {
		await page.goto(`/educacao/${FIRST}`)

		const button = page.getByRole('button', { name: 'Marcar como lido' })
		await expect(button).toBeEnabled()
		await button.click()

		await expect(page.getByRole('button', { name: 'Lido' })).toHaveAttribute(
			'aria-pressed',
			'true',
		)
		await expect(page.getByText('Leitura registrada!')).toBeVisible()
		expect(supabase.readSlugs).toEqual([FIRST])
		expect(supabase.writes[0]).toMatchObject({
			method: 'POST',
			body: { article_slug: FIRST },
		})

		// persiste após recarregar
		await page.reload()
		await expect(page.getByRole('button', { name: 'Lido' })).toBeVisible()

		// aparece na visão geral
		await page.goto('/educacao')
		await expect(page.getByText('1 de 5 artigos lidos · 20%')).toBeVisible()
		await expect(stat(page, 'Artigos lidos')).toHaveText('1')
		await expect(stat(page, 'Sequência')).toHaveText('1')

		// desmarca
		await page.goto(`/educacao/${FIRST}`)
		await page.getByRole('button', { name: 'Lido' }).click()
		await expect(page.getByRole('button', { name: 'Marcar como lido' })).toBeVisible()
		expect(supabase.readSlugs).toEqual([])
		expect(supabase.writes.at(-1)).toMatchObject({ method: 'DELETE' })
	})
})
