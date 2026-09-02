import { Button, type ButtonProps } from 'buildgrid-ui'
import React from 'react'

export interface LoadButtonProps extends ButtonProps {
	isLoading: boolean
}

const LoadButton = React.forwardRef<HTMLButtonElement, LoadButtonProps>((props, ref) => {
	return <Button ref={ref} {...props} />
})
LoadButton.displayName = 'LoadButton'

export { LoadButton }
