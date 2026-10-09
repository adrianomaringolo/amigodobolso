import { expect, test } from './fixtures'

const IOS_SAFARI_UA =
	'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
const IOS_CHROME_UA =
	'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1'

// The masthead only shows the install button from the `sm` breakpoint (640px) up,
// so these flows run on a wider (iPad-like) viewport.
const WIDE = { width: 820, height: 1180 }

test.describe('Guia de instalação no iOS — Safari', () => {
	test.use({ userAgent: IOS_SAFARI_UA, viewport: WIDE })

	test('abre o guia e percorre os 3 passos', async ({ page }) => {
		await page.goto('/inicio')
		await page.getByRole('button', { name: 'Instalar app' }).click()

		const dialog = page.getByRole('dialog')
		await expect(
			dialog.getByRole('heading', { name: 'Instalar no iPhone' }),
		).toBeVisible()

		// passo 1 — variante Safari (barra inferior)
		await expect(dialog.getByText('Passo 1 de 3')).toBeVisible()
		await expect(
			dialog.getByRole('heading', { name: 'Toque em Compartilhar' }),
		).toBeVisible()
		await expect(dialog.getByText('Na barra inferior do Safari')).toBeVisible()
		await expect(dialog.getByRole('button', { name: 'Voltar' })).toHaveCount(0)

		// passo 2
		await dialog.getByRole('button', { name: 'Próximo' }).click()
		await expect(dialog.getByText('Passo 2 de 3')).toBeVisible()
		await expect(
			dialog.getByRole('heading', { name: 'Adicionar à Tela de Início' }),
		).toBeVisible()

		// passo 3 — último passo troca "Próximo" por "Entendi"
		await dialog.getByRole('button', { name: 'Próximo' }).click()
		await expect(dialog.getByText('Passo 3 de 3')).toBeVisible()
		await expect(
			dialog.getByRole('heading', { name: 'Confirme em Adicionar' }),
		).toBeVisible()
		await expect(dialog.getByRole('button', { name: 'Próximo' })).toHaveCount(0)

		await dialog.getByRole('button', { name: 'Entendi' }).click()
		await expect(dialog).toBeHidden()
	})

	test('Voltar e os pontos de navegação trocam de passo', async ({ page }) => {
		await page.goto('/inicio')
		await page.getByRole('button', { name: 'Instalar app' }).click()
		const dialog = page.getByRole('dialog')

		await dialog.getByRole('tab', { name: 'Ir para o passo 3' }).click()
		await expect(dialog.getByText('Passo 3 de 3')).toBeVisible()

		await dialog.getByRole('button', { name: 'Voltar' }).click()
		await expect(dialog.getByText('Passo 2 de 3')).toBeVisible()
	})

	test('reabre sempre a partir do passo 1', async ({ page }) => {
		await page.goto('/inicio')
		const trigger = page.getByRole('button', { name: 'Instalar app' })

		await trigger.click()
		await page.getByRole('dialog').getByRole('button', { name: 'Próximo' }).click()
		await page.keyboard.press('Escape')
		await expect(page.getByRole('dialog')).toBeHidden()

		await trigger.click()
		await expect(page.getByRole('dialog').getByText('Passo 1 de 3')).toBeVisible()
	})
})

test.describe('Guia de instalação no iOS — Chrome', () => {
	test.use({ userAgent: IOS_CHROME_UA, viewport: WIDE })

	test('mostra o botão Compartilhar no topo, ao lado do endereço', async ({ page }) => {
		await page.goto('/inicio')
		await page.getByRole('button', { name: 'Instalar app' }).click()

		const dialog = page.getByRole('dialog')
		await expect(dialog.getByText('No topo, ao lado do endereço')).toBeVisible()
		await expect(dialog.getByText('Na barra inferior do Safari')).toHaveCount(0)
	})
})

test.describe('Botão "Instalar app" fora do iOS', () => {
	test('não aparece no desktop sem prompt de instalação do navegador', async ({
		page,
		isMobile,
	}) => {
		test.skip(!!isMobile, 'cenário desktop')
		await page.goto('/inicio')
		await expect(page.getByRole('link', { name: 'Início' }).first()).toBeVisible()
		await expect(page.getByRole('button', { name: 'Instalar app' })).toHaveCount(0)
	})
})

test.describe('Botão "Instalar app" em iPhone (tela estreita)', () => {
	test.use({ userAgent: IOS_SAFARI_UA, viewport: { width: 390, height: 844 } })

	test('fica visível no iPhone em pé', async ({ page }) => {
		await page.goto('/inicio')
		await expect(page.getByRole('button', { name: 'Instalar app' })).toBeVisible()
	})
})
