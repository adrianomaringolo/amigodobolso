'use client'

import { useEffect } from 'react'

/**
 * Hides the `.reveal` / `.stagger` blocks that are still below the fold and lifts each one in
 * once it is well inside the viewport, so the entrance is seen instead of happening at the edge.
 */
export function RevelarNoScroll() {
	useEffect(() => {
		const limite = () => window.innerHeight * 0.82
		let pendentes: HTMLElement[] = []
		for (const el of document.querySelectorAll<HTMLElement>('.reveal, .stagger > *')) {
			if (el.getBoundingClientRect().top < limite()) continue
			el.classList.add('reveal-pending')
			pendentes.push(el)
		}

		// anything above the line is shown, so jumps (anchor links, fast flings) leave nothing hidden behind
		let frame = 0
		const checar = () => {
			frame = 0
			const y = limite()
			pendentes = pendentes.filter((el) => {
				if (el.getBoundingClientRect().top >= y) return true
				el.classList.add('is-visible')
				return false
			})
			if (!pendentes.length) window.removeEventListener('scroll', aoRolar)
		}
		const aoRolar = () => {
			if (!frame) frame = requestAnimationFrame(checar)
		}
		window.addEventListener('scroll', aoRolar, { passive: true })
		return () => {
			window.removeEventListener('scroll', aoRolar)
			cancelAnimationFrame(frame)
		}
	}, [])

	return null
}
