import type { Config } from 'tailwindcss'

const config: Config = {
	darkMode: ['class'],
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/buildgrid-ui/dist/**/*.{js,mjs}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-sans)'],
				mono: ['var(--font-mono)'],
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				tooltip: {
					DEFAULT: 'hsl(var(--tooltip))',
					foreground: 'hsl(var(--tooltip-foreground))',
				},
				flag: {
					green: 'hsl(var(--flag-green))',
					'green-soft': 'hsl(var(--flag-green-soft))',
					amber: 'hsl(var(--flag-amber))',
					'amber-fill': 'hsl(var(--flag-amber-fill))',
					'amber-soft': 'hsl(var(--flag-amber-soft))',
					red: 'hsl(var(--flag-red))',
					'red-soft': 'hsl(var(--flag-red-soft))',
				},
				expense: {
					DEFAULT: 'hsl(var(--expense))',
					foreground: 'hsl(var(--flag-red-soft))',
				},
				income: {
					DEFAULT: 'hsl(var(--income))',
					foreground: 'hsl(210 40% 92%)',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 1px)',
				sm: 'calc(var(--radius) - 2px)',
			},
			boxShadow: {
				bill: '0 1px 0 0 hsl(var(--border)), 0 8px 24px -16px hsl(209 40% 20% / 0.28)',
				'bill-raised':
					'0 1px 0 0 hsl(var(--border)), 0 18px 40px -20px hsl(209 40% 20% / 0.35)',
			},
			keyframes: {
				'flag-raise': {
					'0%': { transform: 'translateY(35%) scaleY(0.7)', opacity: '0' },
					'100%': { transform: 'translateY(0) scaleY(1)', opacity: '1' },
				},
			},
			animation: {
				'flag-raise': 'flag-raise 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
export default config
