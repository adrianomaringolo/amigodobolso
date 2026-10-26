// Exporta os slides de um post para PNG (1080×1350) com o Playwright do repo,
// e gera output/post-NN/caption.md a partir do meta.json.
//
//   node instagram-posts/scripts/export.mjs post-01
//   node instagram-posts/scripts/export.mjs post-01 --slides 1,3
//
// Slides em imagem (posts importados: "file": "slide-01.png" no meta.json) são
// copiados para o output em vez de renderizados.
import { chromium } from '@playwright/test'
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [post, flag, list] = process.argv.slice(2)
if (!post) {
	console.error('Uso: node instagram-posts/scripts/export.mjs post-NN [--slides 1,3]')
	process.exit(1)
}
const only = flag === '--slides' ? new Set(list.split(',').map(Number)) : null
const src = join(root, 'html', post)
const out = join(root, 'output', post)
mkdirSync(out, { recursive: true })

const meta = JSON.parse(readFileSync(join(src, 'meta.json'), 'utf8'))
const slides = meta.slides
	.map((s, i) => ({ ...s, n: i + 1 }))
	.filter((s) => !only || only.has(s.n))

// Chromium do Playwright se estiver instalado; senão o Google Chrome local.
const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }))
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
for (const slide of slides) {
	const file = join(src, slide.file)
	const png = join(out, `slide-${String(slide.n).padStart(2, '0')}.png`)
	if (!existsSync(file)) throw new Error(`Slide não encontrado: ${slide.file}`)
	if (extname(file) === '.html') {
		await page.goto(pathToFileURL(file).href, { waitUntil: 'networkidle' })
		await page.evaluate(() => document.fonts.ready)
		const broken = await page.evaluate(() =>
			[...document.images].filter((img) => !img.naturalWidth).map((img) => img.src),
		)
		if (broken.length) console.warn(`  ⚠ imagem não carregou em ${slide.file}:`, broken)
		await page.screenshot({ path: png, clip: { x: 0, y: 0, width: 1080, height: 1350 } })
	} else if (extname(file) === '.png') {
		copyFileSync(file, png)
	} else {
		// jpg/webp: abre a imagem e salva como PNG no tamanho do slide
		await page.setContent(
			`<body style="margin:0"><img src="${pathToFileURL(file).href}" style="width:1080px;height:1350px;object-fit:cover"></body>`,
		)
		await page.screenshot({ path: png })
	}
	console.log('✔', png.slice(root.length + 1))
}
await browser.close()

// caption.md ao lado dos PNGs: o texto para colar na hora de publicar.
const tags = (meta.hashtags ?? []).map((t) => `#${t}`).join(' ')
writeFileSync(
	join(out, 'caption.md'),
	`# ${meta.title}

> Post gerado em ${meta.date} · ${meta.type} · ${meta.format}

---

## Legenda

${meta.caption}

${tags}

---

## Hashtags

${tags}
`,
)
console.log('✔', join(out, 'caption.md').slice(root.length + 1))
