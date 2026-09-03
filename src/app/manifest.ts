import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Amigo do Bolso',
		short_name: 'Amigo do Bolso',
		description:
			'A conta do seu mês: cada categoria hasteia uma bandeira e você vê na hora se passou do plano.',
		start_url: '/',
		display: 'standalone',
		background_color: '#f7f5ef',
		theme_color: '#16324f',
		icons: [
			{
				src: '/web-app-manifest-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/web-app-manifest-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	}
}
