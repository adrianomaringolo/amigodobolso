import { expect, test } from './fixtures'

test.describe('Navegação até "Dica de Amigo"', () => {
	test('mobile: aparece na barra inferior e leva para a página', async ({
		page,
		isMobile,
	}) => {
		test.skip(!isMobile, 'barra inferior só existe no mobile')
		await page.goto('/ajuda')

		const bar = page.getByRole('navigation', { name: 'Navegação' })
		await expect(bar.getByRole('link', { name: 'Dica de Amigo' })).toBeVisible()
		// Perfil saiu da barra (continua no menu do avatar)
		await expect(bar.getByRole('link', { name: 'Perfil' })).toHaveCount(0)

		await bar.getByRole('link', { name: 'Dica de Amigo' }).click()
		await expect(page).toHaveURL(/\/educacao$/)
		await expect(bar.getByRole('link', { name: 'Dica de Amigo' })).toHaveAttribute(
			'aria-current',
			'page',
		)
	})

	test('mobile: a barra inferior cabe na tela sem rolagem horizontal', async ({
		page,
		isMobile,
	}) => {
		test.skip(!isMobile, 'barra inferior só existe no mobile')
		await page.goto('/educacao')

		const bar = page.getByRole('navigation', { name: 'Navegação' })
		await expect(bar).toBeVisible()
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth > document.documentElement.clientWidth,
		)
		expect(overflow).toBe(false)

		// todas as abas dentro da largura da tela
		const viewport = page.viewportSize()!
		for (const link of await bar.getByRole('link').all()) {
			const box = (await link.boundingBox())!
			expect(box.x).toBeGreaterThanOrEqual(0)
			expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
		}
	})

	test('mobile: o perfil continua acessível pelo menu do avatar', async ({
		page,
		isMobile,
	}) => {
		test.skip(!isMobile, 'fluxo mobile')
		await page.goto('/educacao')

		await page.getByRole('button', { name: 'Sua conta' }).click()
		await page.getByRole('menuitem', { name: /Meu perfil/ }).click()
		await expect(page).toHaveURL(/\/perfil$/)
	})

	test('desktop: aparece no menu do topo', async ({ page, isMobile }) => {
		test.skip(!!isMobile, 'menu do topo só aparece no desktop')
		await page.goto('/inicio')

		await page.getByRole('link', { name: 'Dica de Amigo' }).click()
		await expect(page).toHaveURL(/\/educacao$/)
		await expect(
			page.getByRole('heading', { name: 'Dica de Amigo', level: 1 }),
		).toBeVisible()
	})
})

test.describe('Acesso sem login', () => {
	test.use({ authenticated: false })

	test('redireciona /educacao para o login', async ({ page }) => {
		await page.goto('/educacao')
		await expect(page).toHaveURL(/\/login/)
	})
})
