'use client'

import { FinancialEntry } from '@/lib/types/Entry.type'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'buildgrid-ui'
import { Pie, PieChart } from 'recharts'
import { AmountTypes, TransactionTypes } from '../financial/financial.types'
import { ChartConfig, ChartContainer } from '../ui/chart'

import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { formatCurrency } from '@/lib/utils'
import { Label } from 'recharts'

type CategoryChartProps = {
	entries: FinancialEntry[]
}

const chartConfig = {
	total: {
		label: 'Total',
	},
	essential: {
		label: 'Necessidades essenciais',
		color: 'hsl(var(--chart-1))',
	},
	leisure: {
		label: 'Lazer',
		color: 'hsl(var(--chart-2))',
	},
	charity: {
		label: 'Fazer pelo outro',
		color: 'hsl(var(--chart-3))',
	},
	'financial-security': {
		label: 'Tranquilidade financeira',
		color: 'hsl(var(--chart-4))',
	},
	'long-term': {
		label: 'Compras de longo prazo',
		color: 'hsl(var(--chart-5))',
	},
	'personal-growth': {
		label: 'Compras de longo prazo',
		color: 'hsl(var(--chart-5))',
	},
} satisfies ChartConfig

export const CategoryChart = (props: CategoryChartProps) => {
	//sum expenses
	const totalExpenses = props.entries
		.filter((entry) => entry.amount < 0)
		.reduce((acc, entry) => acc + entry.amount, 0)

	// for each categories, sum the total amount
	const groupedEntries = props.entries.reduce(
		(acc, entry) => {
			const category = entry.category
			const amount = entry.amount

			if (!acc[category]) {
				acc[category] = 0
			}

			acc[category] += amount

			return acc
		},
		{} as Record<string, number>,
	)

	const chartData = Object.entries(TransactionTypes)
		.map(([key, value]) => {
			if (value.type !== AmountTypes.expanses) return null
			return {
				category: key,
				total: Math.abs(groupedEntries[key] ?? 0),
				fill: value.color,
			}
		})
		.filter(Boolean)

	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>Distribuição de despesas</CardTitle>
				<CardDescription className="sr-only">Gráfico de despesas do mês</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<PieChart>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Pie
							data={chartData}
							dataKey="total"
							nameKey="category"
							innerRadius={60}
							strokeWidth={10}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-xl font-bold"
												>
													{formatCurrency(Math.abs(totalExpenses))}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													Total
												</tspan>
											</text>
										)
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
