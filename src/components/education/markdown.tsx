import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/** Renders article markdown with the bill-paper look: square tables, ruled quotes. */
export function Markdown({ content }: { content: string }) {
	return (
		<div className="text-sm leading-7 text-foreground/90">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					h2: ({ children }) => (
						<h2 className="mb-2 mt-7 text-lg font-bold tracking-tight text-foreground">
							{children}
						</h2>
					),
					p: ({ children }) => <p className="mb-4">{children}</p>,
					ul: ({ children }) => (
						<ul className="mb-4 ml-5 list-disc space-y-1.5">{children}</ul>
					),
					ol: ({ children }) => (
						<ol className="mb-4 ml-5 list-decimal space-y-1.5">{children}</ol>
					),
					strong: ({ children }) => (
						<strong className="font-semibold text-foreground">{children}</strong>
					),
					blockquote: ({ children }) => (
						<blockquote className="my-5 border-l-4 border-accent bg-secondary/60 px-4 py-3 [&>p]:mb-0">
							<span className="notice-label mb-1 block !text-accent">Na prática</span>
							{children}
						</blockquote>
					),
					table: ({ children }) => (
						<div className="mb-4 overflow-x-auto border border-border">
							<table className="w-full text-left text-sm">{children}</table>
						</div>
					),
					th: ({ children }) => (
						<th className="notice-label border-b border-border bg-secondary/60 px-3 py-2">
							{children}
						</th>
					),
					td: ({ children }) => (
						<td className="border-b border-border/70 px-3 py-2 last:text-right last:font-mono">
							{children}
						</td>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	)
}
