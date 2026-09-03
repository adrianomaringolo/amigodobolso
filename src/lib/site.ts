/** Canonical site info for metadata and social share. */

export const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
	'https://amigodobolso.vercel.app'

export const SITE_NAME = 'Amigo do Bolso'

export const SITE_DESCRIPTION =
	'A conta do seu mês. Cada categoria de gasto hasteia uma bandeira — verde, amarela ou vermelha — e você vê na hora se passou do plano. Sem planilha.'

export const SITE_TAGLINE = 'A conta do seu mês, em bandeiras'
