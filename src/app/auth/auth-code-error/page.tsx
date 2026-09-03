import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Erro de autenticação | Amigo do Bolso',
	description: 'Não foi possível concluir o acesso à sua conta.',
}

export default function AuthCodeErrorPage() {
	return (
		<div className="min-h-dvh bg-gray-100 flex flex-col items-center justify-center p-8">
			<div className="mx-auto w-full max-w-sm rounded-xl bg-white p-6 text-center">
				<Image
					src="/logo.png"
					alt="Logo Amigo do Bolso"
					width={72}
					height={72}
					className="mx-auto mb-4"
				/>
				<h1 className="text-base font-semibold text-gray-800">
					Não foi possível concluir o acesso
				</h1>
				<p className="mt-2 text-sm text-gray-600">
					O link de autenticação é inválido ou já expirou. Tente entrar novamente ou
					solicitar um novo e-mail.
				</p>
				<Link
					href="/login"
					className="mt-6 inline-block text-sm font-semibold text-blue-600 hover:underline"
				>
					Voltar para login
				</Link>
			</div>
		</div>
	)
}
