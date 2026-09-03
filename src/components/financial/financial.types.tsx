import { cn } from '@/lib/utils'
import {
	CalendarArrowUp,
	CircleDollarSign,
	GraduationCap,
	Heart,
	PiggyBank,
	ShoppingCart,
	Smile,
} from 'lucide-react'

export const AmountTypes = {
	income: 'income',
	expanses: 'expanses',
} as const

export type AmountType = (typeof AmountTypes)[keyof typeof AmountTypes]

// Icons are drawn in one weight and inherit `currentColor` from context —
// the "A Bandeira" world colours by flag state, not by a fixed per-category hue.
const iconClass = (className?: string) => cn('w-6 h-6 stroke-[1.75]', className)

export const TransactionTypes = {
	income: {
		type: 'income',
		label: 'Receita',
		max: 100,
		color: 'hsl(209 54% 30%)',
		icon: (className?: string) => <CircleDollarSign className={iconClass(className)} />,
		help: 'Todo o dinheiro que entra no mês: salário, extras, vendas. É sobre esta soma que o plano divide as outras categorias.',
	},
	essential: {
		type: 'expanses',
		label: 'Necessidades essenciais',
		max: 55,
		color: 'hsl(209 54% 30%)',
		icon: (className?: string) => <ShoppingCart className={iconClass(className)} />,
		help: 'Nesta categoria entram os gastos ESSENCIAIS para nossa vida, aqueles que realmente são básicos e suficientes para sobrevivermos. Ex.: contas de água, luz, telefone, impostos, aluguel, alimentação.',
	},
	'financial-security': {
		type: 'expanses',
		label: 'Tranquilidade financeira',
		max: 10,
		color: 'hsl(152 46% 33%)',
		icon: (className?: string) => <PiggyBank className={iconClass(className)} />,
		help: 'Nesta categoria o propósito é garantir a Tranquilidade Financeira no futuro. É como investir em si próprio. Dica da No Final das Contas: encare esta categoria como sendo uma OBRIGAÇÃO MENSAL.',
	},

	charity: {
		type: 'expanses',
		label: 'Fazer pelo outro',
		max: 5,
		color: 'hsl(4 62% 47%)',
		icon: (className?: string) => <Heart className={iconClass(className)} />,
		help: 'Exercitar a gratidão e o compartilhar!<br/>Cientificamente, quem exercita a gratidão tem uma atividade cerebral acima da média. Além disso, pesquisadores da Universidade de Indiana, nos EUA, afirmam que quem exercita a gratidão diminui consideravelmente a chance de desenvolver quadros de depressão.',
	},
	leisure: {
		type: 'expanses',
		label: 'Lazer',
		max: 10,
		color: 'hsl(38 82% 45%)',
		icon: (className?: string) => <Smile className={iconClass(className)} />,
		help: 'Se divertir também faz parte da vida, afinal!<br/>Uma boa celebração é fundamental para alimentarmos aquele sorriso no rosto e viver com mais leveza.',
	},
	'long-term': {
		type: 'expanses',
		label: 'Compras de longo prazo',
		max: 10,
		color: 'hsl(22 86% 48%)',
		icon: (className?: string) => <CalendarArrowUp className={iconClass(className)} />,
		help: 'Compras de Longo Prazo são aquelas que exigem planejamento.<br/>Troca de carro, compra de um imóvel, uma grande viagem. Aqui entram estes tipos de gastos que exigem um comprometimento considerável de nossas finanças.',
	},
	'personal-growth': {
		type: 'expanses',
		label: 'Desenvolvimento pessoal',
		max: 10,
		color: 'hsl(209 22% 45%)',
		icon: (className?: string) => <GraduationCap className={iconClass(className)} />,
		help: '“Corpo são, mente sã”<br/>Academia, livros, cursos, MBA, pós-graduação. O propósito de todos estes gastos é seu Desenvolvimento Pessoal. Reservar uma parte de seu orçamento para destinar a este intuito não é apenas justo, como aconselhável.',
	},
}
