import { SITE_URL } from '@/lib/site'
import type { MetadataRoute } from 'next'

const LAST_MODIFIED = new Date('2026-10-25')

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: `${SITE_URL}/produto`,
			lastModified: LAST_MODIFIED,
			changeFrequency: 'monthly',
			priority: 1,
		},
		{
			url: `${SITE_URL}/termos-de-uso`,
			lastModified: LAST_MODIFIED,
			changeFrequency: 'yearly',
			priority: 0.2,
		},
		{
			url: `${SITE_URL}/politica-de-privacidade`,
			lastModified: LAST_MODIFIED,
			changeFrequency: 'yearly',
			priority: 0.2,
		},
	]
}
