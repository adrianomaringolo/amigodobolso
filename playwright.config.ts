import { defineConfig, devices } from '@playwright/test'

const PORT = 3111
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`

/**
 * Dummy Supabase endpoint. The app never reaches it: the tests intercept every
 * browser request to it (see e2e/fixtures.ts), so no real backend is needed.
 */
export const SUPABASE_URL = 'http://127.0.0.1:54321'

// Optional: point Chromium at an existing binary (useful in sandboxes without `playwright install`).
const chromiumLaunch = process.env.PW_CHROMIUM_EXECUTABLE
	? { launchOptions: { executablePath: process.env.PW_CHROMIUM_EXECUTABLE } }
	: {}

export default defineConfig({
	testDir: './e2e',
	globalSetup: './e2e/global-setup.ts',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
	timeout: 60_000,
	expect: { timeout: 10_000 },
	use: {
		baseURL,
		locale: 'pt-BR',
		// The PWA service worker would bypass page.route() and hit the (dummy) Supabase URL.
		serviceWorkers: 'block',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'desktop-chromium',
			use: { ...devices['Desktop Chrome'], ...chromiumLaunch },
		},
		{
			// iPhone-sized viewport, touch and UA — rendered by Chromium.
			name: 'mobile-chromium',
			use: { ...devices['iPhone 14'], defaultBrowserType: 'chromium', ...chromiumLaunch },
		},
		// Real WebKit (the Safari engine). Needs `npx playwright install webkit`, so it is
		// opt-in: `pnpm test:e2e:ios` (macOS recommended).
		...(process.env.E2E_WEBKIT
			? [{ name: 'mobile-safari', use: { ...devices['iPhone 14'] } }]
			: []),
	],
	webServer: process.env.E2E_BASE_URL
		? undefined
		: {
				command: process.env.CI
					? `pnpm build && pnpm start -p ${PORT}`
					: `pnpm dev -p ${PORT}`,
				url: baseURL,
				reuseExistingServer: !process.env.CI,
				timeout: 300_000,
				env: {
					NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
					NEXT_PUBLIC_SUPABASE_ANON_KEY: 'e2e-anon-key',
					SUPABASE_JWT_SECRET: 'e2e-jwt-secret',
				},
			},
})
