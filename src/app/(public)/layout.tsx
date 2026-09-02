import { FooterComponent } from '@/components/navigation/footer'
import Image from 'next/image'
import Link from 'next/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-gray-100 min-h-dvh flex flex-col">
			<header className="mx-auto w-full max-w-4xl px-5 pt-6">
				<Link href="/login" className="inline-flex items-center gap-2">
					<Image src="/logo.png" alt="Logo Amigo do Bolso" width={40} height={40} />
					<span className="font-semibold text-gray-800">Amigo do Bolso</span>
				</Link>
			</header>
			<main className="m-5 rounded-xl max-w-4xl mx-auto bg-white p-4 md:p-6 flex-1 w-full">
				{children}
				<Link
					href="/login"
					className="mt-8 block text-sm font-semibold text-blue-600 hover:underline"
				>
					Voltar para login
				</Link>
			</main>
			<FooterComponent />
		</div>
	)
}
