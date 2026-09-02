import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

type AuthShellProps = PropsWithChildren<{
	title: string
	description?: string
	showBackToLogin?: boolean
}>

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'Amigo do Bolso'

export const AuthShell = ({
	title,
	description,
	showBackToLogin = true,
	children,
}: AuthShellProps) => (
	<main className="flex min-h-screen flex-col items-center justify-center p-8">
		<div className="mx-auto w-full max-w-sm p-6">
			<div className="mb-8 flex flex-col items-center text-center">
				<Image
					src="/logo.png"
					alt={`Logo ${appName}`}
					width={100}
					height={100}
					className="mb-4"
				/>
				<h1 className="text-base font-semibold text-gray-800">{title}</h1>
				{description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
			</div>

			{children}

			{showBackToLogin && (
				<Link
					href="/login"
					className="mt-6 block text-center text-sm font-semibold text-blue-600 hover:underline"
				>
					Voltar para login
				</Link>
			)}
		</div>
	</main>
)
