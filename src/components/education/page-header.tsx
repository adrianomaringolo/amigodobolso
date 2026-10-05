import { GraduationCap } from 'lucide-react'

export function EducationHeader({ subtitle }: { subtitle: string }) {
	return (
		<header className="border-b border-border pb-3">
			<h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
				<GraduationCap className="h-5 w-5 text-primary" />
				Dica de Amigo
			</h1>
			<p className="notice-label mt-0.5 !normal-case !tracking-normal">{subtitle}</p>
		</header>
	)
}
