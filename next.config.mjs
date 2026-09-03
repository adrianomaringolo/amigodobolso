import withPWAInit from '@ducanh2912/next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {}

const withPWA = withPWAInit({
	dest: 'public',
	// Maintained fork — App Router + Next 15 safe, so it can stay on in dev too.
	// Flip this to `process.env.NODE_ENV === 'development'` if the SW cache ever
	// gets in the way while developing.
	disable: false,
	register: true,
	workboxOptions: {
		// The app is data-heavy and auth-gated: never serve a stale page/API from
		// cache. The SW is for offline shell + static assets, not content.
		navigationPreload: true,
		runtimeCaching: [
			{
				urlPattern: ({ request }) => request.mode === 'navigate',
				handler: 'NetworkFirst',
				options: {
					cacheName: 'pages',
					networkTimeoutSeconds: 5,
					expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
				},
			},
			{
				urlPattern: /\/_next\/static\/.*/i,
				handler: 'CacheFirst',
				options: {
					cacheName: 'next-static',
					expiration: { maxEntries: 128, maxAgeSeconds: 7 * 24 * 60 * 60 },
				},
			},
			{
				urlPattern: /\.(?:png|jpg|jpeg|svg|webp|ico|woff2?)$/i,
				handler: 'StaleWhileRevalidate',
				options: {
					cacheName: 'assets',
					expiration: { maxEntries: 96, maxAgeSeconds: 30 * 24 * 60 * 60 },
				},
			},
			{
				// Supabase auth/rest — always the network, never the cache.
				urlPattern: /supabase\.co\/.*/i,
				handler: 'NetworkOnly',
			},
		],
	},
})

export default withPWA(nextConfig)
