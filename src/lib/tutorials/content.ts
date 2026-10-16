import 'server-only'

import fs from 'fs'
import path from 'path'
import { parseFrontmatter } from '../education/content'

const CONTENT_DIR = path.join(process.cwd(), 'src/content/tutoriais')

/** A step-by-step guide to one feature, with screenshots (Como usar → Tutoriais). */
export interface Tutorial {
	/** file name without `NN-` and `.md`, used in the URL */
	slug: string
	title: string
	description: string
	order: number
	content: string
}

/** Files are named `NN-slug.md`; NN sets the order, screenshots live in public/tutoriais/<slug>/. */
export function getTutorials(): Tutorial[] {
	if (!fs.existsSync(CONTENT_DIR)) return []
	return fs
		.readdirSync(CONTENT_DIR)
		.filter((f) => f.endsWith('.md') && !f.startsWith('_'))
		.map((file) => {
			const { data, content } = parseFrontmatter(
				fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8'),
			)
			const [, num, slug] = file.replace(/\.md$/, '').match(/^(\d+)-(.+)$/) ?? []
			return {
				slug: slug ?? file.replace(/\.md$/, ''),
				title: data.title || file,
				description: data.description || '',
				order: Number(num) || 0,
				content,
			}
		})
		.sort((a, b) => a.order - b.order)
}

export function getTutorial(slug: string) {
	const all = getTutorials()
	const index = all.findIndex((t) => t.slug === slug)
	if (index === -1) return null
	return {
		tutorial: all[index],
		previous: all[index - 1] ?? null,
		next: all[index + 1] ?? null,
	}
}
