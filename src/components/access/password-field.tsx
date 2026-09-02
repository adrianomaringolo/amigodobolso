'use client'

import { PasswordInput } from 'buildgrid-ui'
import { ComponentProps } from 'react'

type PasswordFieldProps = ComponentProps<typeof PasswordInput>

const ptBrLabels = {
	veryWeak: 'Muito fraca',
	weak: 'Fraca',
	medium: 'Mediana',
	strong: 'Forte',
	veryStrong: 'Muito forte',
}

/** `PasswordInput` do buildgrid-ui com os textos em pt-BR. */
export const PasswordField = (props: PasswordFieldProps) => (
	<PasswordInput
		strengthTitle="Força da senha"
		strengthLabels={ptBrLabels}
		showPasswordLabel="Mostrar senha"
		hidePasswordLabel="Esconder senha"
		{...props}
	/>
)
