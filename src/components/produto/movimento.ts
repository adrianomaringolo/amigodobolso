'use client'

import { useEffect, useRef, useState } from 'react'

export function prefersReducedMotion() {
	return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/** Tweens a number toward `value` so readings tick like a meter instead of jumping. */
export function useTween(value: number, duration = 380) {
	const [shown, setShown] = useState(value)
	const from = useRef(value)

	useEffect(() => {
		if (prefersReducedMotion()) {
			from.current = value
			setShown(value)
			return
		}
		const start = performance.now()
		const origin = from.current
		let frame = 0
		const step = (now: number) => {
			const t = Math.min((now - start) / duration, 1)
			const v = origin + (value - origin) * easeOut(t)
			from.current = v
			setShown(v)
			if (t < 1) frame = requestAnimationFrame(step)
		}
		frame = requestAnimationFrame(step)
		return () => cancelAnimationFrame(frame)
	}, [value, duration])

	return shown
}

/** Runs `onEnter` once, the first time the element is at least `threshold` visible. */
export function useOnceInView<T extends Element>(onEnter: () => void, threshold = 0.55) {
	const ref = useRef<T>(null)
	const cb = useRef(onEnter)
	cb.current = onEnter

	useEffect(() => {
		const el = ref.current
		if (!el || typeof IntersectionObserver === 'undefined') return
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					io.disconnect()
					cb.current()
				}
			},
			{ threshold },
		)
		io.observe(el)
		return () => io.disconnect()
	}, [threshold])

	return ref
}
