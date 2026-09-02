import {
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from 'buildgrid-ui'

interface SkeletonTableProps {
	rows: number
	columns: number
}

export function SkeletonTable({ rows, columns }: SkeletonTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					{Array.from({ length: columns }).map((_, index) => (
						<TableHead key={index}>
							<Skeleton className="h-6 w-full" />
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: rows }).map((_, rowIndex) => (
					<TableRow key={rowIndex}>
						{Array.from({ length: columns }).map((_, colIndex) => (
							<TableCell key={colIndex}>
								<Skeleton className="h-6 w-full" />
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

// Example usage
export default function SkeletonTableExample() {
	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Skeleton Table Example</h2>
			<SkeletonTable rows={5} columns={4} />
		</div>
	)
}
