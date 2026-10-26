'use client'

import { PasswordInput } from 'buildgrid-ui'
import { ComponentProps, useEffect, useRef } from 'react'

type PasswordFieldProps = ComponentProps<typeof PasswordInput>

const ptBrLabels = {
	veryWeak: 'Muito fraca',
	weak: 'Fraca',
	medium: 'Mediana',
	strong: 'Forte',
	veryStrong: 'Muito forte',
}

const STRENGTH_TITLE = 'Força da senha'

/**
 * `PasswordInput` do buildgrid-ui com os textos em pt-BR.
 * A barra de força da lib não tem nome acessível; aqui ela ganha um `aria-label`.
 */
export const PasswordField = (props: PasswordFieldProps) => {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		ref.current?.querySelector('[role="progressbar"]')?.setAttribute('aria-label', STRENGTH_TITLE)
	})

	return (
		<div ref={ref}>
			<PasswordInput
				strengthTitle={STRENGTH_TITLE}
				strengthLabels={ptBrLabels}
				showPasswordLabel="Mostrar senha"
				hidePasswordLabel="Esconder senha"
				{...props}
			/>
		</div>
	)
}
