import { SITE_NAME } from '@/lib/site'
import { ImageResponse } from 'next/og'

export const alt = 'Amigo do Bolso — a conta do seu mês, em bandeiras'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const FLAGS: { label: string; fill: string; text: string; soft: string }[] = [
	{ label: 'NO VERDE', fill: '#29704f', text: '#29704f', soft: '#dcefe6' },
	{ label: 'NO AMARELO', fill: '#f0a017', text: '#9a5f13', soft: '#f6ead4' },
	{ label: 'NO VERMELHO', fill: '#be2f26', text: '#be2f26', soft: '#f6e2e0' },
]

function Pennant({ fill }: { fill: string }) {
	return (
		<svg width="44" height="46" viewBox="0 0 46 48" style={{ display: 'flex' }}>
			<rect x="3" y="0" width="3.2" height="48" rx="1" fill={fill} fillOpacity="0.45" />
			<path
				d="M6.2 3H44l-9.5 10.5L44 24H6.2z"
				fill={fill}
				stroke={fill}
				strokeWidth="1"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

export default function OpengraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					background: '#f7f5ef',
					backgroundImage:
						'repeating-linear-gradient(135deg, rgba(22,50,79,0.04) 0px, rgba(22,50,79,0.04) 1px, transparent 1px, transparent 14px)',
					color: '#16324f',
					fontFamily: 'sans-serif',
				}}
			>
				{/* masthead bar */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						height: 96,
						padding: '0 64px',
						background: '#16324f',
						color: '#f7f5ef',
					}}
				>
					<div style={{ display: 'flex' }}>
						<Pennant fill="#ef7d24" />
					</div>
					<div
						style={{
							marginLeft: 18,
							fontSize: 32,
							fontWeight: 700,
							letterSpacing: '-0.02em',
						}}
					>
						{SITE_NAME}
					</div>
					<div
						style={{
							marginLeft: 'auto',
							fontSize: 15,
							letterSpacing: '0.12em',
							textTransform: 'uppercase',
							color: 'rgba(247,245,239,0.6)',
						}}
					>
						Mês de referência
					</div>
				</div>

				{/* body */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						flex: 1,
						padding: '56px 64px',
						justifyContent: 'center',
					}}
				>
					<div
						style={{
							fontSize: 68,
							fontWeight: 700,
							lineHeight: 1.08,
							letterSpacing: '-0.03em',
							maxWidth: 900,
						}}
					>
						A conta do seu mês, em bandeiras.
					</div>
					<div
						style={{
							marginTop: 22,
							fontSize: 27,
							lineHeight: 1.4,
							color: '#4d5f70',
							maxWidth: 860,
						}}
					>
						Cada categoria de gasto hasteia uma bandeira — verde, amarela ou vermelha.
						Você vê na hora se passou do plano.
					</div>

					<div style={{ display: 'flex', gap: 16, marginTop: 44 }}>
						{FLAGS.map((f) => (
							<div
								key={f.label}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 10,
									padding: '10px 16px',
									background: f.soft,
									border: `1px solid ${f.text}`,
									color: f.text,
									fontSize: 20,
									fontWeight: 700,
									letterSpacing: '0.04em',
								}}
							>
								<Pennant fill={f.fill} />
								{f.label}
							</div>
						))}
					</div>
				</div>

				{/* footer */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						borderTop: '1px solid #d0ccc2',
						padding: '20px 64px',
						fontSize: 17,
						letterSpacing: '0.08em',
						textTransform: 'uppercase',
						color: '#6a7683',
					}}
				>
					método em parceria com{' '}
					<span style={{ color: '#16324f', fontWeight: 700, marginLeft: 8 }}>
						No Final das Contas
					</span>
				</div>
			</div>
		),
		{ ...size },
	)
}
